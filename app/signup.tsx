import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { auth } from '@/services/firebase';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

function getSignUpErrorMessage(code?: string) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already in use.';
    case 'auth/invalid-email':
      return 'Invalid email format.';
    case 'auth/weak-password':
      return 'Weak password. Use a stronger one.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet.';
    default:
      return 'Registration failed. Please try again.';
  }
}

export function SignUpScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [destination, setDestination] = useState<'onboarding' | 'home'>('onboarding');

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length > 0 && confirmPassword.length > 0 && !isLoading;
  }, [email, password, confirmPassword, isLoading]);

  const validate = () => {
    let isValid = true;
    const normalizedEmail = email.trim().toLowerCase();

    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setSubmitError('');

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!STRONG_PASSWORD_REGEX.test(password)) {
      setPasswordError('Use 8+ chars, upper/lowercase, number, and special char.');
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    }

    return isValid;
  };

  const handleSignUp = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      setSubmitError('');

      const normalizedEmail = email.trim().toLowerCase();
      const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);

      const safeName = displayName.trim();
      if (safeName.length > 0 && credential.user) {
        await updateProfile(credential.user, { displayName: safeName });
      }

      if (destination === 'onboarding') {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      const code = (error as { code?: string })?.code;
      setSubmitError(getSignUpErrorMessage(code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (Platform.OS !== 'web') {
      setSubmitError('Firebase popup Google sign-in is available on web. Use email sign-up on mobile.');
      return;
    }

    setSubmitError('');

    try {
      setIsGoogleLoading(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const userCredential = await signInWithPopup(auth, provider);

      const safeName = displayName.trim();
      if (safeName.length > 0 && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: safeName });
      }

      if (destination === 'onboarding') {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      const code = (error as { code?: string })?.code;
      setSubmitError(getSignUpErrorMessage(code));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardWrap}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.logo}>🌿</Text>
            <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.icon }]}>Join AlgaEye community</ThemedText>
          </View>

          <View style={[styles.formCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}> 
            <Input
              placeholder="Display Name (optional)"
              value={displayName}
              onChangeText={setDisplayName}
              containerStyle={styles.input}
              icon={<Text>👤</Text>}
              autoCapitalize="words"
            />

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
            {passwordError ? <ThemedText style={[styles.errorText, { color: colors.danger }]}>{passwordError}</ThemedText> : null}

            <Input
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (confirmPasswordError) setConfirmPasswordError('');
              }}
              containerStyle={styles.input}
              icon={<Text>✅</Text>}
              secureTextEntry
              autoCapitalize="none"
            />
            {confirmPasswordError ? (
              <ThemedText style={[styles.errorText, { color: colors.danger }]}>{confirmPasswordError}</ThemedText>
            ) : null}

            <View style={styles.destinationWrap}>
              <TouchableOpacity
                onPress={() => setDestination('onboarding')}
                style={[
                  styles.destinationChip,
                  {
                    borderColor: destination === 'onboarding' ? colors.primary : colors.border,
                    backgroundColor: destination === 'onboarding' ? `${colors.primary}1A` : 'transparent',
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.destinationText,
                    { color: destination === 'onboarding' ? colors.primary : colors.icon },
                  ]}
                >
                  Go to Onboarding
                </ThemedText>
              </TouchableOpacity>

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
                <ThemedText
                  style={[
                    styles.destinationText,
                    { color: destination === 'home' ? colors.primary : colors.icon },
                  ]}
                >
                  Go to Home
                </ThemedText>
              </TouchableOpacity>
            </View>

            {submitError ? (
              <ThemedText style={[styles.errorText, styles.submitError, { color: colors.danger }]}> 
                {submitError}
              </ThemedText>
            ) : null}

            <Button
              title="Create Account"
              onPress={handleSignUp}
              variant="primary"
              size="large"
              fullWidth
              disabled={!canSubmit}
              loading={isLoading}
              style={styles.submitButton}
            />

            <Button
              title="Continue with Google"
              onPress={handleGoogleSignIn}
              variant="outline"
              size="large"
              fullWidth
              disabled={isGoogleLoading}
              loading={isGoogleLoading}
              icon={<Text>🔍</Text>}
              style={styles.googleButton}
            />

            <View style={styles.signInRow}>
              <ThemedText style={{ color: colors.icon }}>Already have an account?</ThemedText>
              <TouchableOpacity onPress={() => router.replace('/auth')}>
                <ThemedText style={[styles.signInLink, { color: colors.primary }]}> Sign In</ThemedText>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 22,
  },
  logo: {
    fontSize: 46,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
  },
  formCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    marginLeft: 4,
    marginBottom: 8,
  },
  destinationWrap: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    marginBottom: 12,
  },
  destinationChip: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  destinationText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  submitError: {
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 2,
  },
  googleButton: {
    marginTop: 10,
  },
  signInRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInLink: {
    fontWeight: '700',
  },
});

export default SignUpScreen;
