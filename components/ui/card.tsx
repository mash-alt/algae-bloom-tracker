import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  elevation?: 'low' | 'medium' | 'high';
}

export function Card({
  children,
  style,
  onPress,
  elevation = 'medium',
}: CardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getShadowElevation = () => {
    switch (elevation) {
      case 'low':
        return { shadowOpacity: 0.08, elevation: 1 };
      case 'high':
        return { shadowOpacity: 0.15, elevation: 5 };
      case 'medium':
      default:
        return { shadowOpacity: 0.1, elevation: 3 };
    }
  };

  const cardContent = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          shadowColor: colors.shadow,
          ...getShadowElevation(),
        },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
}

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'info';
  size?: 'small' | 'medium';
}

export function Badge({ label, variant = 'info', size = 'medium' }: BadgeProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getBackgroundColor = () => {
    switch (variant) {
      case 'success':
        return colors.success + '20';
      case 'warning':
        return colors.warning + '20';
      case 'danger':
        return colors.danger + '20';
      case 'info':
      default:
        return colors.primary + '20';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'danger':
        return colors.danger;
      case 'info':
      default:
        return colors.primary;
    }
  };

  const padding = size === 'small' ? 4 : 6;
  const fontSize = size === 'small' ? 10 : 12;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBackgroundColor(),
          paddingHorizontal: padding * 2,
          paddingVertical: padding,
        },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          {
            color: getTextColor(),
            fontSize,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  badge: {
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontWeight: '600',
  },
});
