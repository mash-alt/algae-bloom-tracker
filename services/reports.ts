import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

import { db, storage } from '@/services/firebase';

export type ReportSeverity = 'None' | 'Mild' | 'Moderate' | 'Severe';

export interface GeminiAnalysis {
  severity: ReportSeverity;
  confidence: number;
  bloom_type: string;
  notes: string;
  timestamp: string;
  model?: string;
}

export interface AlgaeReport {
  id: string;
  userID: string;
  photoURL: string;
  coordinates: { lat: number; lng: number };
  locationName?: string;
  severity: ReportSeverity;
  confidence: number;
  bloom_type: string;
  notes: string;
  timestamp: string;
  aiAnalysis?: GeminiAnalysis;
  createdAt?: string;
}

export interface NewReportInput {
  userID: string;
  photoURL: string;
  coordinates: { lat: number; lng: number };
  locationName?: string;
  severity: ReportSeverity;
  confidence: number;
  bloom_type: string;
  notes: string;
  timestamp: string;
  aiAnalysis?: GeminiAnalysis;
}

export async function uploadPhotoToFirebaseStorage(fileUri: string, userId: string) {
  const response = await fetch(fileUri);
  const blob = await response.blob();

  const path = `reports/${userId}/${Date.now()}.jpg`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, blob, {
    contentType: 'image/jpeg',
  });

  return await getDownloadURL(storageRef);
}

export async function saveAlgaeReport(input: NewReportInput) {
  console.log('[Reports] saveAlgaeReport:start', {
    userID: input.userID,
    photoURLPrefix: input.photoURL?.slice(0, 80),
    coordinates: input.coordinates,
    severity: input.severity,
    confidence: input.confidence,
    bloom_type: input.bloom_type,
    timestamp: input.timestamp,
  });

  const docRef = await addDoc(collection(db, 'bloomReports'), {
    userID: input.userID,
    photoURL: input.photoURL,
    coordinates: input.coordinates,
    latitude: input.coordinates.lat,
    longitude: input.coordinates.lng,
    locationName: input.locationName ?? null,
    severity: input.severity,
    confidence: input.confidence,
    bloom_type: input.bloom_type,
    notes: input.notes,
    timestamp: input.timestamp,
    aiAnalysis: input.aiAnalysis ?? null,
    createdAt: serverTimestamp(),
  });

  console.log('[Reports] saveAlgaeReport:success', {
    docId: docRef.id,
  });

  return docRef.id;
}

function parseReport(docId: string, data: Record<string, unknown>): AlgaeReport | null {
  const coordinates = data.coordinates as { lat?: unknown; lng?: unknown } | undefined;
  const lat = Number(coordinates?.lat ?? data.latitude);
  const lng = Number(coordinates?.lng ?? data.longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  const severityRaw = String(data.severity ?? 'None') as ReportSeverity;
  const allowed: ReportSeverity[] = ['None', 'Mild', 'Moderate', 'Severe'];
  const severity = allowed.includes(severityRaw) ? severityRaw : 'None';

  const createdAtRaw = data.createdAt as { toDate?: () => Date } | string | number | undefined;
  let createdAt: string | undefined;
  if (createdAtRaw && typeof createdAtRaw === 'object' && typeof createdAtRaw.toDate === 'function') {
    createdAt = createdAtRaw.toDate().toISOString();
  } else if (typeof createdAtRaw === 'string' || typeof createdAtRaw === 'number') {
    createdAt = new Date(createdAtRaw).toISOString();
  }

  const aiRaw = data.aiAnalysis as Record<string, unknown> | null | undefined;
  const aiSeverityRaw = String(aiRaw?.severity ?? 'None') as ReportSeverity;
  const aiSeverity = allowed.includes(aiSeverityRaw) ? aiSeverityRaw : 'None';

  const aiAnalysis: GeminiAnalysis | undefined = aiRaw
    ? {
        severity: aiSeverity,
        confidence: Number(aiRaw.confidence ?? 0),
        bloom_type: String(aiRaw.bloom_type ?? 'unknown'),
        notes: String(aiRaw.notes ?? ''),
        timestamp: String(aiRaw.timestamp ?? new Date().toISOString()),
        model: aiRaw.model ? String(aiRaw.model) : undefined,
      }
    : undefined;

  return {
    id: docId,
    userID: String(data.userID ?? ''),
    photoURL: String(data.photoURL ?? ''),
    coordinates: { lat, lng },
    locationName: data.locationName ? String(data.locationName) : undefined,
    severity,
    confidence: Number(data.confidence ?? 0),
    bloom_type: String(data.bloom_type ?? 'unknown'),
    notes: String(data.notes ?? ''),
    timestamp: String(data.timestamp ?? new Date().toISOString()),
    aiAnalysis,
    createdAt,
  };
}

export function subscribeToAlgaeReports(
  callback: (reports: AlgaeReport[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const reportsQuery = query(collection(db, 'bloomReports'), orderBy('createdAt', 'desc'));

  console.log('[Reports] subscribeToAlgaeReports:start');

  return onSnapshot(
    reportsQuery,
    (snapshot) => {
      console.log('[Reports] subscribeToAlgaeReports:snapshot', {
        size: snapshot.size,
        empty: snapshot.empty,
      });

      const rows = snapshot.docs
        .map((doc) => {
          const data = doc.data() as Record<string, unknown>;
          const parsed = parseReport(doc.id, data);

          if (!parsed) {
            console.warn('[Reports] parseReport:discarded', {
              docId: doc.id,
              latitude: data.latitude,
              longitude: data.longitude,
              coordinates: data.coordinates,
            });
          }

          return parsed;
        })
        .filter((r): r is AlgaeReport => Boolean(r));

      console.log('[Reports] subscribeToAlgaeReports:parsed', {
        parsedCount: rows.length,
        ids: rows.map((r) => r.id),
      });

      callback(rows);
    },
    (err) => {
      console.error('[Reports] subscribeToAlgaeReports:error', {
        code: (err as { code?: string }).code,
        message: (err as Error).message,
      });
      onError?.(err as Error);
    }
  );
}
