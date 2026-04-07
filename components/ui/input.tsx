import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TextInput,
  TextInputProps,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface InputProps extends TextInputProps {
  placeholder?: string;
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  error?: string;
}

export function Input({
  placeholder,
  icon,
  containerStyle,
  error,
  ...props
}: InputProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={containerStyle}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.cardBackground,
            borderColor: error ? colors.danger : colors.border,
          },
        ]}
      >
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
            },
          ]}
          placeholderTextColor={colors.icon}
          placeholder={placeholder}
          {...props}
        />
      </View>
      {error && <View style={styles.errorText}>{error}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
});
