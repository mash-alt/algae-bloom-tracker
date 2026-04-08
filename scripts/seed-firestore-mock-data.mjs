import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  serverTimestamp,
  getFirestore,
} from 'firebase/firestore';

const requiredEnvNames = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
];

function readFirebaseConfig() {
  const missing = requiredEnvNames.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`Missing Firebase env vars: ${missing.join(', ')}`);
  }

  return {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  };
}

const mockReports = [
  { locationName: 'Seattle, USA', coordinates: { lat: 47.6062, lng: -122.3321 }, severity: 'Moderate', bloom_type: 'cyanobacteria', confidence: 0.82, notes: 'Green surface sheen near the shoreline.' },
  { locationName: 'Tokyo Bay, Japan', coordinates: { lat: 35.613, lng: 139.79 }, severity: 'Mild', bloom_type: 'green algae', confidence: 0.74, notes: 'Patchy bloom close to the marina.' },
  { locationName: 'Cape Town, South Africa', coordinates: { lat: -33.9249, lng: 18.4241 }, severity: 'Severe', bloom_type: 'red tide', confidence: 0.93, notes: 'Dense discoloration visible from the pier.' },
  { locationName: 'Rio de Janeiro, Brazil', coordinates: { lat: -22.9068, lng: -43.1729 }, severity: 'Moderate', bloom_type: 'cyanobacteria', confidence: 0.81, notes: 'Blooms gathered in a sheltered bay.' },
  { locationName: 'Barcelona, Spain', coordinates: { lat: 41.3851, lng: 2.1734 }, severity: 'Mild', bloom_type: 'green algae', confidence: 0.68, notes: 'Thin bloom drifting along the coast.' },
  { locationName: 'Sydney, Australia', coordinates: { lat: -33.8688, lng: 151.2093 }, severity: 'Severe', bloom_type: 'red tide', confidence: 0.95, notes: 'Strong bloom around harbor edges.' },
  { locationName: 'Vancouver, Canada', coordinates: { lat: 49.2827, lng: -123.1207 }, severity: 'None', bloom_type: 'unknown', confidence: 0.19, notes: 'No significant bloom detected.' },
  { locationName: 'Nairobi, Kenya', coordinates: { lat: -1.2921, lng: 36.8219 }, severity: 'Moderate', bloom_type: 'cyanobacteria', confidence: 0.79, notes: 'Lake edge bloom near the reeds.' },
  { locationName: 'Lisbon, Portugal', coordinates: { lat: 38.7223, lng: -9.1393 }, severity: 'Mild', bloom_type: 'green algae', confidence: 0.66, notes: 'Small bloom patches along the inlet.' },
  { locationName: 'Reykjavik, Iceland', coordinates: { lat: 64.1466, lng: -21.9426 }, severity: 'None', bloom_type: 'unknown', confidence: 0.22, notes: 'Cold-water sample shows minimal activity.' },
];

function normalizeSeverity(severity) {
  if (severity === 'Severe') return 'Severe';
  if (severity === 'Moderate') return 'Moderate';
  if (severity === 'Mild') return 'Mild';
  return 'None';
}

async function authenticate(auth) {
  const email = process.env.EXPO_PUBLIC_FIREBASE_SEED_EMAIL;
  const password = process.env.EXPO_PUBLIC_FIREBASE_SEED_PASSWORD;

  if (email && password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  return signInAnonymously(auth);
}

async function main() {
  const app = initializeApp(readFirebaseConfig());
  const auth = getAuth(app);
  const db = getFirestore(app);

  const userCredential = await authenticate(auth);
  const userId = userCredential.user.uid;
  const reportsRef = collection(db, 'bloomReports');

  const now = Date.now();

  for (let index = 0; index < mockReports.length; index += 1) {
    const seed = mockReports[index];
    const timestamp = new Date(now - index * 6 * 60 * 60 * 1000).toISOString();

    const payload = {
      userID: userId,
      photoURL: `https://picsum.photos/seed/algae-${index + 1}/800/600`,
      coordinates: seed.coordinates,
      latitude: seed.coordinates.lat,
      longitude: seed.coordinates.lng,
      locationName: seed.locationName,
      severity: normalizeSeverity(seed.severity),
      confidence: seed.confidence,
      bloom_type: seed.bloom_type,
      notes: seed.notes,
      timestamp,
      aiAnalysis: {
        severity: normalizeSeverity(seed.severity),
        confidence: seed.confidence,
        bloom_type: seed.bloom_type,
        notes: seed.notes,
        timestamp,
        model: 'seed-mock-data',
      },
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(reportsRef, payload);
    console.log(`Seeded ${docRef.id} -> ${seed.locationName}`);
  }

  console.log(`Done. Seeded ${mockReports.length} reports for user ${userId}.`);
}

main().catch((error) => {
  console.error('Seed failed:', error?.message ?? error);
  process.exitCode = 1;
});