import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';
import { auth, db } from '@/services/firebase';

type Severity = 'None' | 'Mild' | 'Moderate' | 'Severe';

type GeminiResult = {
  severity: Severity;
  confidence: number;
  bloom_type: string;
  notes: string;
  timestamp: string;
};

const SEVERITY_OPTIONS: Severity[] = ['None', 'Mild', 'Moderate', 'Severe'];

export default function AlgaeAnalysisScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [imageUri, setImageUri] = useState<string>('');
  const [photoURL, setPhotoURL] = useState<string>('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [severity, setSeverity] = useState<Severity>('None');
  const [confidence, setConfidence] = useState('0');
  const [bloomType, setBloomType] = useState('unknown');
  const [notes, setNotes] = useState('');
  const [timestamp, setTimestamp] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [error, setError] = useState('');

  const canAnalyze = useMemo(() => Boolean(imageUri) && !isAnalyzing, [imageUri, isAnalyzing]);

  const getLocation = async () => {
    const perm = await Location.requestForegroundPermissionsAsync();
    if (perm.status !== 'granted') {
      throw new Error('Location permission denied.');
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  };

  const pickImage = async (source: 'camera' | 'gallery') => {
    setError('');

    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', `Please allow ${source} access.`);
      return;
    }

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.9 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9 });

    if (result.canceled || !result.assets?.length) return;

    try {
      const location = await getLocation();
      setCoords(location);
      setImageUri(result.assets[0].uri);
      setPhotoURL(result.assets[0].uri);
      setHasResult(false);
    } catch (e) {
      Alert.alert('Location error', (e as Error).message);
    }
  };

  const fileToBase64 = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const parseGeminiJson = (raw: string): GeminiResult => {
    const cleaned = raw.replace(/```json|```/gi, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start < 0 || end < 0) throw new Error('Invalid Gemini response format.');

    const data = JSON.parse(cleaned.slice(start, end + 1)) as GeminiResult;

    return {
      severity: SEVERITY_OPTIONS.includes(data.severity) ? data.severity : 'None',
      confidence: Number.isFinite(data.confidence) ? data.confidence : 0,
      bloom_type: data.bloom_type ?? 'unknown',
      notes: data.notes ?? '',
      timestamp: data.timestamp ?? new Date().toISOString(),
    };
  };

  const analyzeImage = async () => {
    if (!imageUri) {
      Alert.alert('No image', 'Capture or choose a water photo first.');
      return;
    }

    setError('');
    setIsAnalyzing(true);

    try {
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error('Missing EXPO_PUBLIC_GEMINI_API_KEY in .env');

      const base64Image = await fileToBase64(imageUri);

      const prompt =
        'Analyze this water photo for algae bloom. Return ONLY valid JSON with keys: severity (None/Mild/Moderate/Severe), confidence (0-1), bloom_type, notes, timestamp.';

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inline_data: {
                      mime_type: 'image/jpeg',
                      data: base64Image,
                    },
                  },
                ],
              },
            ],
            generationConfig: { temperature: 0.2 },
          }),
        }
      );

      if (!response.ok) throw new Error('Gemini API request failed.');

      const json = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };

      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Gemini returned empty response.');

      const result = parseGeminiJson(rawText);

      setSeverity(result.severity);
      setConfidence(String(result.confidence));
      setBloomType(result.bloom_type);
      setNotes(result.notes);
      setTimestamp(result.timestamp);
      setHasResult(true);
    } catch (e) {
      const message = (e as Error).message || 'Image analysis failed.';
      setError(message);
      Alert.alert('Analysis error', message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const submitToFirestore = async () => {
    if (!coords) {
      Alert.alert('Missing location', 'Coordinates are required.');
      return;
    }

    const confidenceNum = Number(confidence);
    if (!Number.isFinite(confidenceNum) || confidenceNum < 0 || confidenceNum > 1) {
      Alert.alert('Invalid confidence', 'Confidence must be between 0 and 1.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'bloomReports'), {
        userID: auth.currentUser?.uid ?? 'anonymous',
        photoURL: photoURL || imageUri,
        coordinates: coords,
        severity,
        confidence: confidenceNum,
        bloom_type: bloomType,
        notes,
        timestamp: timestamp || new Date().toISOString(),
        createdAt: serverTimestamp(),
      });

      Alert.alert('Saved', 'Data submitted to Firestore.');
    } catch (e) {
      const message = (e as Error).message || 'Failed to submit data.';
      setError(message);
      Alert.alert('Submission error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>
          Algae Detection
        </ThemedText>

        <Card elevation="medium" style={styles.card}>
          <View style={styles.actionRow}>
            <Button title="Take Photo" onPress={() => pickImage('camera')} variant="primary" size="medium" />
            <Button title="Choose Gallery" onPress={() => pickImage('gallery')} variant="outline" size="medium" />
          </View>

          {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : null}

          <ThemedText style={styles.metaText}>
            Coordinates: {coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'Not captured yet'}
          </ThemedText>

          <Button
            title={isAnalyzing ? 'Analyzing...' : 'Analyze with Gemini'}
            onPress={analyzeImage}
            disabled={!canAnalyze}
            loading={isAnalyzing}
            fullWidth
            style={styles.analyzeBtn}
          />
        </Card>

        {hasResult ? (
          <Card elevation="medium" style={styles.card}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Detection Result (Editable)
            </ThemedText>

            <ThemedText style={styles.label}>Severity</ThemedText>
            <View style={styles.chipRow}>
              {SEVERITY_OPTIONS.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setSeverity(item)}
                  style={[
                    styles.chip,
                    {
                      borderColor: severity === item ? colors.primary : colors.border,
                      backgroundColor: severity === item ? `${colors.primary}1A` : 'transparent',
                    },
                  ]}
                >
                  <ThemedText style={[styles.chipText, { color: severity === item ? colors.primary : colors.text }]}>
                    {item}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            <ThemedText style={styles.label}>Confidence (0-1)</ThemedText>
            <TextInput
              value={confidence}
              onChangeText={setConfidence}
              keyboardType="numeric"
              placeholder="0.0"
              placeholderTextColor={colors.icon}
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
            />

            <ThemedText style={styles.label}>Bloom Type</ThemedText>
            <TextInput
              value={bloomType}
              onChangeText={setBloomType}
              placeholder="green algae / red tide / cyanobacteria / unknown"
              placeholderTextColor={colors.icon}
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
            />

            <ThemedText style={styles.label}>Notes</ThemedText>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              multiline
              textAlignVertical="top"
              placeholder="Additional notes"
              placeholderTextColor={colors.icon}
              style={[styles.textArea, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
            />

            <ThemedText style={styles.label}>Timestamp</ThemedText>
            <TextInput
              value={timestamp}
              onChangeText={setTimestamp}
              placeholder="ISO timestamp"
              placeholderTextColor={colors.icon}
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
            />

            <Button
              title={isSubmitting ? 'Submitting...' : 'Submit to Firebase'}
              onPress={submitToFirestore}
              loading={isSubmitting}
              fullWidth
              style={styles.submitBtn}
            />
          </Card>
        ) : null}

        {(isAnalyzing || isSubmitting) && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.primary} />
            <ThemedText style={styles.loadingText}>
              {isAnalyzing ? 'Analyzing image...' : 'Saving to Firestore...'}
            </ThemedText>
          </View>
        )}

        {error ? <ThemedText style={[styles.errorText, { color: colors.danger }]}>{error}</ThemedText> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 14,
  },
  card: {
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  preview: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    marginBottom: 10,
  },
  metaText: {
    fontSize: 12,
    marginBottom: 8,
  },
  analyzeBtn: {
    marginTop: 4,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 90,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  submitBtn: {
    marginTop: 12,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 8,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },
});
