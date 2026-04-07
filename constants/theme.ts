/**
 * AlgaEye Design System - Nature-inspired color palette for environmental tracking
 */

import { Platform } from 'react-native';

// Primary colors - Nature inspired
const primaryGreen = '#2E7D6E';
const primaryBlue = '#0D7BA8';
const lightAqua = '#E8F4F8';
const lightGreen = '#E8F5E9';
const earthTone = '#D4A574';
const white = '#FFFFFF';
const darkText = '#1A1A1A';
const lightText = '#666666';

export const Colors = {
  light: {
    text: darkText,
    background: '#F9FAFB',
    tint: primaryGreen,
    icon: lightText,
    tabIconDefault: lightText,
    tabIconSelected: primaryGreen,
    // Extended palette
    primary: primaryGreen,
    secondary: primaryBlue,
    accent: earthTone,
    success: '#27AE60',
    warning: '#F39C12',
    danger: '#E74C3C',
    lightAqua,
    lightGreen,
    cardBackground: white,
    border: '#E0E0E0',
    shadow: '#00000015',
  },
  dark: {
    text: '#ECEDEE',
    background: '#0F1419',
    tint: primaryGreen,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: primaryGreen,
    // Extended palette
    primary: primaryGreen,
    secondary: primaryBlue,
    accent: earthTone,
    success: '#27AE60',
    warning: '#F39C12',
    danger: '#E74C3C',
    lightAqua: '#1A3A3F',
    lightGreen: '#1A2E2A',
    cardBackground: '#1A1F26',
    border: '#2A3035',
    shadow: '#00000030',
  },
};

export const Gradients = {
  primaryToSecondary: [primaryGreen, primaryBlue],
  greenToAqua: [primaryGreen, lightAqua],
  blueToWhite: [primaryBlue, lightAqua],
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
