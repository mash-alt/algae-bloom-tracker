import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemedText } from '@/components/themed-text';

export function AuthScreen({ onSuccess }: { onSuccess: () => void }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

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
        <View style={styles.header}>
          <Text style={styles.logo}>🌊</Text>
          <ThemedText type="title" style={styles.title}>
            AlgaEye
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.icon }]}>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </ThemedText>
        </View>

        <View style={styles.form}>
          {isSignUp && (
            <Input
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              containerStyle={styles.input}
              icon={<Text>👤</Text>}
            />
          )}
          <Input
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            containerStyle={styles.input}
            icon={<Text>✉️</Text>}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            containerStyle={styles.input}
            icon={<Text>🔒</Text>}
            secureTextEntry
          />

          <Button
            title={isSignUp ? 'Create Account' : 'Sign In'}
            onPress={onSuccess}
            variant="primary"
            size="large"
            fullWidth
            style={styles.submitButton}
          />
        </View>

        <View style={styles.divider}>
          <View
            style={[
              styles.dividerLine,
              { backgroundColor: colors.border },
            ]}
          />
          <ThemedText style={{ color: colors.icon }}>or</ThemedText>
          <View
            style={[
              styles.dividerLine,
              { backgroundColor: colors.border },
            ]}
          />
        </View>

        <Button
          title="Continue with Google"
          onPress={() => {}}
          variant="outline"
          size="large"
          fullWidth
          icon={<Text>🔍</Text>}
          style={styles.socialButton}
        />

        <View style={styles.toggle}>
          <ThemedText style={{ color: colors.text }}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          </ThemedText>
          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text
              style={[
                styles.toggleText,
                { color: colors.primary },
              ]}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  form: {
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  socialButton: {
    marginBottom: 24,
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    fontWeight: '600',
  },
});

export default AuthScreen;
