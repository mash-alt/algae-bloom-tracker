import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';

const { height } = Dimensions.get('window');

export function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Welcome to AlgaEye',
      description: 'Track and monitor algae blooms in water bodies near you',
      icon: '💧',
    },
    {
      title: 'Capture & Report',
      description: 'Take photos, share locations, and help scientists understand algae patterns',
      icon: '📸',
    },
    {
      title: 'See the Impact',
      description: 'View real-time data, trends, and contribute to environmental science',
      icon: '📊',
    },
  ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <ScrollView
        scrollEventThrottle={16}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const slide = Math.round(
            e.nativeEvent.contentOffset.x / Dimensions.get('window').width
          );
          setCurrentSlide(slide);
        }}
      >
        {slides.map((slide, index) => (
          <View
            key={index}
            style={[
              styles.slide,
              {
                width: Dimensions.get('window').width,
                backgroundColor: colors.background,
              },
            ]}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{slide.icon}</Text>
            </View>
            <ThemedText
              type="title"
              style={[styles.title, { color: colors.primary }]}
            >
              {slide.title}
            </ThemedText>
            <ThemedText
              style={[styles.description, { color: colors.icon }]}
            >
              {slide.description}
            </ThemedText>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View
          style={[
            styles.dots,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    currentSlide === index ? colors.primary : colors.border,
                  width: currentSlide === index ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <Button
          title={currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={() => {
            if (currentSlide === slides.length - 1) {
              onComplete();
            }
          }}
          variant="primary"
          size="large"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 40,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});

export default OnboardingScreen;
