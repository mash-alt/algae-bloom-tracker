import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemedText } from '@/components/themed-text';
import { auth } from '@/services/firebase';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getLoginErrorMessage(code?: string) {
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email format.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection.';
    default:
      return 'Login failed. Please try again.';
  }
}

export function AuthScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [destination, setDestination] = useState<'home' | 'map'>('home');

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length > 0 && !isLoading;
  }, [email, password, isLoading]);

  const validate = () => {
    let valid = true;
    const normalizedEmail = email.trim().toLowerCase();

    setEmailError('');
    setPasswordError('');
    setAuthError('');

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setAuthError('');

    try {
      const normalizedEmail = email.trim().toLowerCase();
      await signInWithEmailAndPassword(auth, normalizedEmail, password);

      if (destination === 'map') {
        router.replace('/(tabs)/explore');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      const errorCode = (error as { code?: string })?.code;
      setAuthError(getLoginErrorMessage(errorCode));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    setAuthError('');

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setEmailError('Enter a valid email to reset password.');
      return;
    }

    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, normalizedEmail);
      setAuthError('Password reset email sent. Check your inbox.');
    } catch (error) {
      const errorCode = (error as { code?: string })?.code;
      setAuthError(getLoginErrorMessage(errorCode));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardWrap}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.logo}>🌊</Text>
            <ThemedText type="title" style={styles.title}>
              AlgaEye
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.icon }]}>Welcome back</ThemedText>
          </View>

          <View style={[styles.formCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Input
              placeholder="Email Address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              containerStyle={styles.input}
              icon={<Text>✉️</Text>}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {emailError ? <ThemedText style={[styles.errorText, { color: colors.danger }]}>{emailError}</ThemedText> : null}

            <Input
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError('');
              }}
              containerStyle={styles.input}
              icon={<Text>🔒</Text>}
              secureTextEntry
              autoCapitalize="none"
            />
            {passwordError ? (
              <ThemedText style={[styles.errorText, { color: colors.danger }]}>{passwordError}</ThemedText>
            ) : null}

            <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.8} style={styles.forgotWrap}>
              <ThemedText style={[styles.forgotText, { color: colors.primary }]}>Forgot password?</ThemedText>
            </TouchableOpacity>

            <View style={styles.destinationWrap}>
              <TouchableOpacity
                onPress={() => setDestination('home')}
                style={[
                  styles.destinationChip,
                  {
                    borderColor: destination === 'home' ? colors.primary : colors.border,
                    backgroundColor: destination === 'home' ? `${colors.primary}1A` : 'transparent',
                  },
                ]}
              >
                <ThemedText style={[styles.destinationText, { color: destination === 'home' ? colors.primary : colors.icon }]}>Go to Home</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDestination('map')}
                style={[
                  styles.destinationChip,
                  {
                    borderColor: destination === 'map' ? colors.primary : colors.border,
                    backgroundColor: destination === 'map' ? `${colors.primary}1A` : 'transparent',
                  },
                ]}
              >
                <ThemedText style={[styles.destinationText, { color: destination === 'map' ? colors.primary : colors.icon }]}>Go to Map</ThemedText>
              </TouchableOpacity>
            </View>

            {authError ? (
              <ThemedText
                style={[
                  styles.authMessage,
                  { color: authError.includes('sent') ? colors.success : colors.danger },
                ]}
              >
                {authError}
              </ThemedText>
            ) : null}

            <Button
              title="Sign In"
              onPress={handleLogin}
              variant="primary"
              size="large"
              fullWidth
              disabled={!canSubmit}
              loading={isLoading}
              style={styles.submitButton}
            />

            {isLoading && (
              <View style={styles.loadingWrap}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            )}

            <View style={styles.signUpRow}>
              <ThemedText style={{ color: colors.icon }}>New to AlgaEye?</ThemedText>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <ThemedText style={[styles.signUpLink, { color: colors.primary }]}> Create account</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardWrap: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 52,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
  },
  formCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginBottom: 14,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
  },
  destinationWrap: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  destinationChip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  destinationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  authMessage: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 2,
  },
  submitButton: {
    marginTop: 2,
  },
  loadingWrap: {
    marginTop: 10,
    alignItems: 'center',
  },
  signUpRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpLink: {
    fontWeight: '700',
  },
});

export default AuthScreen;
