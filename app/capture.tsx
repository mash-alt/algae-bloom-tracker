import React, { useMemo, useState } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemedText } from '@/components/themed-text';
import { auth } from '@/services/firebase';
import { saveAlgaeReport } from '@/services/reports';

type SeverityLabel = 'None' | 'Mild' | 'Moderate' | 'Severe';
type BloomType = 'green algae' | 'red tide' | 'cyanobacteria' | 'unknown';

interface CapturedLocation {
  latitude: number;
  longitude: number;
}

interface DetectionResult {
  severity: SeverityLabel;
  confidence: number;
  bloom_type: BloomType | string;
  notes: string;
  timestamp: string;
}

interface DetectionWithModel {
  result: DetectionResult;
  model: string;
}

const SEVERITY_OPTIONS: SeverityLabel[] = ['None', 'Mild', 'Moderate', 'Severe'];
const BLOOM_OPTIONS: BloomType[] = ['green algae', 'red tide', 'cyanobacteria', 'unknown'];

export function CaptureScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [gpsCoords, setGpsCoords] = useState<CapturedLocation | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const [formSeverity, setFormSeverity] = useState<SeverityLabel>('None');
  const [formConfidence, setFormConfidence] = useState('0');
  const [formBloomType, setFormBloomType] = useState<string>('unknown');
  const [formNotes, setFormNotes] = useState('');
  const [formTimestamp, setFormTimestamp] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<DetectionWithModel | null>(null);

  const [hasAnalysis, setHasAnalysis] = useState(false);

  const logUpload = (message: string, extra?: Record<string, unknown>) => {
    if (extra) {
      console.log(`[Cloudinary] ${message}`, extra);
      return;
    }
    console.log(`[Cloudinary] ${message}`);
  };

  const hasPhoto = Boolean(photoUri);

  const coordsLabel = useMemo(() => {
    if (!gpsCoords) return 'No coordinates captured yet';
    return `${gpsCoords.latitude.toFixed(6)}, ${gpsCoords.longitude.toFixed(6)}`;
  }, [gpsCoords]);

  const getCurrentCoordinates = async (): Promise<CapturedLocation | null> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Location permission', 'Location access is required to attach GPS coordinates.');
      return null;
    }

    const current = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: current.coords.latitude,
      longitude: current.coords.longitude,
    };
  };

  const handlePhotoResult = async (asset: ImagePicker.ImagePickerAsset) => {
    setUploading(true);
    try {
      const coords = await getCurrentCoordinates();
      setPhotoUri(asset.uri);
      setPhotoUrl('');
      setGpsCoords(coords);
      setHasAnalysis(false);
      setAiAnalysis(null);
      setError('');
    } finally {
      setUploading(false);
      setAnalyzing(false);
      setSubmitting(false);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera permission', 'Camera access is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.9,
      allowsEditing: false,
      exif: false,
    });

    if (result.canceled || !result.assets?.length) return;
    await handlePhotoResult(result.assets[0]);
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Gallery permission', 'Media library access is required to choose photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
      allowsEditing: false,
      exif: false,
    });

    if (result.canceled || !result.assets?.length) return;
    await handlePhotoResult(result.assets[0]);
  };

  const extractJsonObject = (raw: string) => {
    const cleaned = raw.replace(/```json|```/gi, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
      throw new Error('No JSON found in Gemini response');
    }
    return JSON.parse(cleaned.slice(start, end + 1)) as DetectionResult;
  };

  const fileToBase64 = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    return await new Promise<{ base64: string; mimeType: string }>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = String(reader.result ?? '');
        const [meta, payload] = result.split(',');
        const mimeMatch = /data:(.*?);base64/.exec(meta ?? '');

        resolve({
          base64: payload ?? '',
          mimeType: mimeMatch?.[1] ?? 'image/jpeg',
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const uploadToCloudinary = async (uri: string) => {
    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudinaryFolder = process.env.EXPO_PUBLIC_CLOUDINARY_FOLDER;

    logUpload('Starting upload', {
      platform: Platform.OS,
      cloudName,
      uploadPreset,
      uriPrefix: uri.slice(0, 40),
    });

    if (!cloudName || !uploadPreset) {
      throw new Error('Missing Cloudinary env vars');
    }

    const presetsToTry = Array.from(new Set([uploadPreset, 'algaeye']));

    let lastError = 'Cloudinary upload failed';

    for (const preset of presetsToTry) {
      const form = new FormData();

      if (Platform.OS === 'web') {
        logUpload('Using web Blob upload path');
        const imgRes = await fetch(uri);
        logUpload('Fetched local image on web', {
          status: imgRes.status,
          ok: imgRes.ok,
          contentType: imgRes.headers.get('content-type') ?? 'unknown',
        });
        const blob = await imgRes.blob();
        logUpload('Created Blob from local image', { size: blob.size, type: blob.type || 'unknown' });
        form.append('file', blob, `water-${Date.now()}.jpg`);
      } else {
        logUpload('Using native file upload path');
        form.append('file', {
          uri,
          type: 'image/jpeg',
          name: `water-${Date.now()}.jpg`,
        } as unknown as Blob);
      }

      form.append('upload_preset', preset);
      if (cloudinaryFolder) {
        form.append('folder', cloudinaryFolder);
      }

      logUpload('Attempting Cloudinary upload with preset', { preset, folder: cloudinaryFolder ?? '' });

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: form,
      });

      logUpload('Cloudinary API response received', {
        preset,
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        const body = await response.text();
        logUpload('Cloudinary API error body', { preset, body });
        lastError = `Cloudinary upload failed (${response.status}): ${body}`;

        if (body.includes('Upload preset not found')) {
          continue;
        }

        throw new Error(lastError);
      }

      const json = (await response.json()) as { secure_url?: string };
      logUpload('Cloudinary API success body', {
        preset,
        hasSecureUrl: Boolean(json.secure_url),
        secureUrlPrefix: json.secure_url?.slice(0, 60) ?? '',
      });
      if (!json.secure_url) {
        throw new Error('Cloudinary returned no image URL');
      }

      return json.secure_url;
    }

    throw new Error(lastError);
  };

  const analyzeWithGemini = async (cloudinaryUrl: string, localUri: string): Promise<DetectionWithModel> => {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing Gemini API key');
    }

    const { base64, mimeType } = await fileToBase64(localUri);

    const prompt = `Analyze this water body photo for harmful algae. Photo URL (metadata only): ${cloudinaryUrl}.
  Return ONLY valid JSON with keys:
  severity (None/Mild/Moderate/Severe), confidence (0-1), bloom_type (green algae|red tide|cyanobacteria|unknown), notes, timestamp.
  Rules:
  - If visual evidence is unclear, use bloom_type="unknown" and confidence <= 0.45.
  - Do not default to cyanobacteria unless there is clear cyanobacterial evidence.
  - Keep notes short and objective.`;

    const modelsToTry = [
      'gemini-3.1-flash-lite-preview',
      'gemini-2.0-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash',
    ];
    let lastError = 'Gemini request failed';

    for (const model of modelsToTry) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
                      mime_type: mimeType,
                      data: base64,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (!response.ok) {
        const body = await response.text();
        console.error('[Gemini] Request failed', { model, status: response.status, body });
        lastError = `Gemini ${model} failed (${response.status}): ${body}`;
        if (response.status === 404) {
          continue;
        }
        throw new Error(lastError);
      }

      const json = (await response.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
        }>;
      };

      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        lastError = `Gemini ${model} returned empty response`;
        continue;
      }

      console.log('[Gemini] Request success', { model });
      return {
        result: extractJsonObject(text),
        model,
      };
    }

    throw new Error(lastError);
  };

  const handleAnalyze = async () => {
    if (!photoUri) {
      Alert.alert('No photo', 'Please take a photo or pick from gallery first.');
      return;
    }

    if (!gpsCoords) {
      Alert.alert('No GPS', 'Could not capture GPS coordinates. Please try again.');
      return;
    }

    setError('');

    try {
      setUploading(true);
      const cloudinaryUrl = await uploadToCloudinary(photoUri);
      setPhotoUrl(cloudinaryUrl);
      setUploading(false);

      setAnalyzing(true);
      const detection = await analyzeWithGemini(cloudinaryUrl, photoUri);
      const result = detection.result;
      setAiAnalysis(detection);
      setAnalyzing(false);

      setFormSeverity(SEVERITY_OPTIONS.includes(result.severity) ? result.severity : 'None');
      setFormConfidence(String(result.confidence ?? 0));
      setFormBloomType(result.bloom_type || 'unknown');
      setFormNotes(result.notes || '');
      setFormTimestamp(result.timestamp || new Date().toISOString());
      setHasAnalysis(true);
    } catch (e) {
      setUploading(false);
      setAnalyzing(false);
      const message = (e as Error)?.message ?? 'Failed to upload/analyze image.';
      const stack = (e as Error)?.stack ?? 'no stack';
      console.error('[Cloudinary] Upload/Analyze error', { message, stack });
      setError(`${message}\n\nCheck terminal/devtools logs for [Cloudinary] entries.`);
      Alert.alert('Error', message);
    }
  };

  const handleSubmit = async () => {
    if (!photoUrl || !gpsCoords) {
      Alert.alert('Missing data', 'Cloudinary photo URL or GPS is missing. Run upload/analyze first.');
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Sign in required', 'Please sign in before submitting a report.');
      return;
    }

    const confidence = Number(formConfidence);
    if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
      Alert.alert('Invalid confidence', 'Confidence must be a number between 0 and 1.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSubmitStatus('idle');
      setSubmitMessage('');

      await saveAlgaeReport({
        userID: userId,
        photoURL: photoUrl,
        coordinates: {
          lat: gpsCoords.latitude,
          lng: gpsCoords.longitude,
        },
        severity: formSeverity,
        confidence,
        bloom_type: formBloomType,
        notes: formNotes,
        timestamp: formTimestamp || new Date().toISOString(),
        aiAnalysis: aiAnalysis
          ? {
              severity: aiAnalysis.result.severity,
              confidence: aiAnalysis.result.confidence,
              bloom_type: String(aiAnalysis.result.bloom_type),
              notes: aiAnalysis.result.notes,
              timestamp: aiAnalysis.result.timestamp,
              model: aiAnalysis.model,
            }
          : undefined,
      });

      setSubmitStatus('success');
      setSubmitMessage('Report submitted successfully. Redirecting to map...');
      setTimeout(() => {
        router.replace('/(tabs)/explore');
      }, 900);
    } catch (e) {
      const message = (e as Error)?.message ?? 'Failed to submit to Firestore.';
      setError(message);
      setSubmitStatus('error');
      setSubmitMessage(message);
      Alert.alert('Submission failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" style={styles.title}>
          Report Algae Bloom
        </ThemedText>

        <Card elevation="medium" style={styles.cameraCard}>
          {hasPhoto ? (
            <View style={styles.photoPreview}>
              <Image source={{ uri: photoUri ?? '' }} style={styles.previewImage} resizeMode="cover" />
              <View style={styles.previewActions}>
                <Button title="Retake" onPress={takePhoto} variant="outline" size="small" />
                <Button title="Gallery" onPress={pickFromGallery} variant="ghost" size="small" />
              </View>
            </View>
          ) : (
            <View
              style={[
                styles.cameraPlaceholder,
                { backgroundColor: colors.primary + '10', borderColor: colors.primary },
              ]}
            >
              <Text style={styles.cameraIcon}>📷</Text>
              <ThemedText style={styles.cameraText}>
                Capture from camera or choose from gallery
              </ThemedText>
              <View style={styles.photoButtonsRow}>
                <Button title="Take Photo" onPress={takePhoto} variant="primary" size="medium" />
                <Button title="Open Gallery" onPress={pickFromGallery} variant="outline" size="medium" />
              </View>
            </View>
          )}
        </Card>

        <Card elevation="low" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📍</Text>
            <ThemedText type="subtitle">Location</ThemedText>
          </View>
          <View style={styles.locationInfo}>
            <View
              style={[
                styles.locationBadge,
                { backgroundColor: colors.secondary + '20' },
              ]}
            >
              <Text style={styles.locationIcon}>🌍</Text>
              <View style={styles.locationTextWrap}>
                <ThemedText style={styles.locationLabel}>Captured Coordinates</ThemedText>
                <ThemedText style={[styles.locationValue, { color: colors.icon }]}>{coordsLabel}</ThemedText>
              </View>
            </View>
          </View>
        </Card>

        <Button
          title={uploading ? 'Uploading to Cloudinary...' : analyzing ? 'Analyzing with Gemini...' : 'Upload & Analyze'}
          onPress={handleAnalyze}
          variant="primary"
          size="large"
          fullWidth
          loading={uploading || analyzing}
          style={styles.submitButton}
        />

        {hasAnalysis && (
          <Card elevation="low" style={styles.payloadCard}>
            <ThemedText type="subtitle" style={styles.payloadTitle}>
              Detection Result (Editable)
            </ThemedText>
            <ThemedText style={styles.label}>Severity</ThemedText>
            <View style={styles.chipWrap}>
              {SEVERITY_OPTIONS.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setFormSeverity(item)}
                  style={[
                    styles.chip,
                    {
                      borderColor: formSeverity === item ? colors.primary : colors.border,
                      backgroundColor: formSeverity === item ? `${colors.primary}1A` : 'transparent',
                    },
                  ]}
                >
                  <ThemedText style={[styles.chipText, { color: formSeverity === item ? colors.primary : colors.text }]}>
                    {item}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            <ThemedText style={styles.label}>Confidence (0-1)</ThemedText>
            <TextInput
              value={formConfidence}
              onChangeText={setFormConfidence}
              keyboardType="numeric"
              style={[styles.textInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
              placeholder="0.00"
              placeholderTextColor={colors.icon}
            />

            <ThemedText style={styles.label}>Bloom Type</ThemedText>
            <View style={styles.chipWrap}>
              {BLOOM_OPTIONS.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setFormBloomType(item)}
                  style={[
                    styles.chip,
                    {
                      borderColor: formBloomType === item ? colors.primary : colors.border,
                      backgroundColor: formBloomType === item ? `${colors.primary}1A` : 'transparent',
                    },
                  ]}
                >
                  <ThemedText style={[styles.chipText, { color: formBloomType === item ? colors.primary : colors.text }]}>
                    {item}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            <ThemedText style={styles.label}>Notes</ThemedText>
            <TextInput
              value={formNotes}
              onChangeText={setFormNotes}
              multiline
              textAlignVertical="top"
              style={[
                styles.textArea,
                { borderColor: colors.border, color: colors.text, backgroundColor: colors.background },
              ]}
              placeholder="Add observations..."
              placeholderTextColor={colors.icon}
            />

            <ThemedText style={styles.payloadLine}>Cloudinary URL: {photoUrl}</ThemedText>
            <ThemedText style={styles.payloadLine}>Timestamp: {formTimestamp}</ThemedText>

            <Button
              title={submitting ? 'Submitting...' : 'Submit to Firestore'}
              onPress={handleSubmit}
              loading={submitting}
              variant="primary"
              size="large"
              fullWidth
              style={styles.submitFirestoreButton}
            />
          </Card>
        )}

        {(uploading || analyzing || submitting) && (
          <View style={styles.busyRow}>
            <ActivityIndicator size="small" color={colors.primary} />
            <ThemedText style={styles.busyText}>
              {uploading ? 'Uploading photo...' : analyzing ? 'Analyzing with Gemini...' : 'Saving report...'}
            </ThemedText>
          </View>
        )}

        {error ? <ThemedText style={[styles.errorText, { color: colors.danger }]}>{error}</ThemedText> : null}

        {submitStatus !== 'idle' ? (
          <View
            style={[
              styles.submitStatusBox,
              {
                backgroundColor: submitStatus === 'success' ? `${colors.success}22` : `${colors.danger}22`,
                borderColor: submitStatus === 'success' ? colors.success : colors.danger,
              },
            ]}
          >
            <ThemedText
              style={{
                color: submitStatus === 'success' ? colors.success : colors.danger,
                fontWeight: '700',
              }}
            >
              {submitStatus === 'success' ? 'Success' : 'Error'}
            </ThemedText>
            <ThemedText style={[styles.submitStatusText, { color: colors.text }]}>{submitMessage}</ThemedText>

            {submitStatus === 'success' ? (
              <Button
                title="View on Map"
                onPress={() => router.replace('/(tabs)/explore')}
                variant="ghost"
                size="small"
                style={styles.viewMapBtn}
              />
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  cameraCard: {
    marginBottom: 20,
  },
  cameraPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  cameraIcon: {
    fontSize: 52,
    marginBottom: 12,
  },
  cameraText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 14,
  },
  photoButtonsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  photoPreview: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 280,
  },
  previewActions: {
    padding: 12,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionIcon: {
    fontSize: 20,
  },
  locationInfo: {
    marginTop: 8,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 10,
  },
  locationIcon: {
    fontSize: 24,
    marginTop: 2,
  },
  locationTextWrap: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationValue: {
    fontSize: 11,
    marginTop: 2,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 12,
  },
  payloadCard: {
    marginBottom: 16,
  },
  payloadTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 8,
  },
  chipWrap: {
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
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 4,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 90,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 8,
  },
  payloadLine: {
    fontSize: 12,
    marginBottom: 4,
  },
  submitFirestoreButton: {
    marginTop: 10,
  },
  busyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  busyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    marginBottom: 24,
    textAlign: 'center',
  },
  submitStatusBox: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },
  submitStatusText: {
    marginTop: 4,
    fontSize: 12,
  },
  viewMapBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
});

export default CaptureScreen;
