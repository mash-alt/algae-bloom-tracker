import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';

import { auth } from '@/services/firebase';

export interface SignUpInput {
  email: string;
  password: string;
  displayName?: string;
}

export async function signUpWithEmail(input: SignUpInput) {
  const normalizedEmail = input.email.trim().toLowerCase();
  const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, input.password);

  const safeName = input.displayName?.trim();
  if (safeName) {
    await updateProfile(credential.user, { displayName: safeName });
  }

  return credential.user;
}

export async function signInWithEmail(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
  return credential.user;
}

export async function logout() {
  await signOut(auth);
}

export function watchAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
