import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        <Text style={styles.emoji}>🗺️</Text>
        <ThemedText type="subtitle" style={styles.title}>
          Web Map Fallback
        </ThemedText>
        <ThemedText style={[styles.body, { color: colors.icon }]}>
          You are on web. Native map rendering is disabled here to avoid
          loading native-only modules. Use Android/iOS device build for
          full live map markers and native map gestures.
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  title: {
    marginBottom: 8,
  },
  body: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});
