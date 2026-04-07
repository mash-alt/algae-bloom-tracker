import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemedText } from '@/components/themed-text';

export function CaptureScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [photo, setPhoto] = useState(false);
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [severity, setSeverity] = useState('medium');

  const severityOptions = [
    { id: 'low', label: 'Low', color: colors.success, icon: '✓' },
    { id: 'medium', label: 'Medium', color: colors.warning, icon: '⚠' },
    { id: 'high', label: 'High', color: colors.danger, icon: '!' },
  ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" style={styles.title}>
          Report Algae Bloom
        </ThemedText>

        <Card elevation="medium" style={styles.cameraCard}>
          {photo ? (
            <View
              style={[
                styles.photoPreview,
                { backgroundColor: colors.primary + '20' },
              ]}
            >
              <Text style={styles.photoIcon}>📸</Text>
              <ThemedText style={styles.photoText}>
                Photo captured successfully
              </ThemedText>
              <Button
                title="Change Photo"
                onPress={() => setPhoto(false)}
                variant="outline"
                size="small"
                style={styles.changePhotoBtn}
              />
            </View>
          ) : (
            <View
              style={[
                styles.cameraPlaceholder,
                { backgroundColor: colors.primary + '10', borderColor: colors.primary },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.cameraButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() => setPhoto(true)}
              >
                <Text style={styles.cameraIcon}>📷</Text>
              </TouchableOpacity>
              <ThemedText style={styles.cameraText}>
                Tap to capture photo
              </ThemedText>
            </View>
          )}
        </Card>

        <Card elevation="low" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📍</Text>
            <ThemedText type="subtitle">Location</ThemedText>
            <Switch
              value={gpsEnabled}
              onValueChange={setGpsEnabled}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={gpsEnabled ? colors.primary : colors.icon}
            />
          </View>
          {gpsEnabled && (
            <View style={styles.locationInfo}>
              <View
                style={[
                  styles.locationBadge,
                  { backgroundColor: colors.secondary + '20' },
                ]}
              >
                <Text style={styles.locationIcon}>🌍</Text>
                <View>
                  <ThemedText style={styles.locationLabel}>
                    Current Location
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.locationValue,
                      { color: colors.icon },
                    ]}
                  >
                    37.7749° N, 122.4194° W
                  </ThemedText>
                </View>
              </View>
            </View>
          )}
        </Card>

        <Card elevation="low" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📊</Text>
            <ThemedText type="subtitle">Severity Level</ThemedText>
          </View>
          <View style={styles.severityOptions}>
            {severityOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.severityButton,
                  {
                    backgroundColor:
                      severity === option.id
                        ? option.color + '20'
                        : colors.background,
                    borderColor:
                      severity === option.id ? option.color : colors.border,
                    borderWidth: severity === option.id ? 2 : 1,
                  },
                ]}
                onPress={() => setSeverity(option.id)}
              >
                <Text style={styles.severityIcon}>{option.icon}</Text>
                <ThemedText
                  style={[
                    styles.severityLabel,
                    { color: option.color },
                  ]}
                >
                  {option.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Button
          title="Submit Report"
          onPress={() => {}}
          variant="primary"
          size="large"
          fullWidth
          style={styles.submitButton}
        />
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
    paddingVertical: 48,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  cameraButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cameraIcon: {
    fontSize: 40,
  },
  cameraText: {
    fontSize: 14,
    textAlign: 'center',
  },
  photoPreview: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    borderRadius: 16,
  },
  photoIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  photoText: {
    marginBottom: 12,
    fontWeight: '600',
  },
  changePhotoBtn: {
    marginTop: 8,
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
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 10,
  },
  locationIcon: {
    fontSize: 24,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationValue: {
    fontSize: 11,
    marginTop: 2,
  },
  severityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  severityIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  severityLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 32,
  },
});

export default CaptureScreen;
