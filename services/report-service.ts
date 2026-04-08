import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface SubmitReportParams {
  latitude: number;
  longitude: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  photoUrl?: string;
  userId: string;
  userName: string;
  algaeType?: string;
  waterBody?: string;
}

/**
 * Submit a new bloom report to Firestore
 * @param params Report data to submit
 * @returns Promise with the document ID
 */
export async function submitBloomReport(
  params: SubmitReportParams
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'bloomReports'), {
      latitude: params.latitude,
      longitude: params.longitude,
      severity: params.severity,
      description: params.description,
      photoUrl: params.photoUrl || '',
      timestamp: Timestamp.now(),
      userId: params.userId,
      userName: params.userName,
      verified: false, // Admins verify later
      algaeType: params.algaeType || '',
      waterBody: params.waterBody || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log('Report submitted with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting report:', error);
    throw error;
  }
}

/**
 * Example usage in CaptureScreen
 */
export async function handleCaptureSubmit(data: {
  photo: string;
  latitude: number;
  longitude: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  waterBody?: string;
}) {
  try {
    // In real app, upload photo to Firebase Storage first
    // const photoUrl = await uploadPhotoToStorage(data.photo);

    const reportId = await submitBloomReport({
      latitude: data.latitude,
      longitude: data.longitude,
      severity: data.severity,
      description: data.description,
      photoUrl: data.photo, // In real app: photoUrl
      userId: 'current-user-id', // Get from auth
      userName: 'Current User', // Get from auth
      waterBody: data.waterBody,
      algaeType: 'Cyanobacteria', // Could be selection
    });

    console.log('✅ Report submitted:', reportId);
    return reportId;
  } catch (error) {
    console.error('❌ Failed to submit:', error);
    throw error;
  }
}

/**
 * Upload photo to Firebase Storage
 * (Optional - for real implementation)
 */
export async function uploadPhotoToStorage(
  photoUri: string,
  userId: string
): Promise<string> {
  try {
    // Import getStorage, ref, uploadBytes from 'firebase/storage'
    // const storage = getStorage();
    // const photoRef = ref(storage, `bloom-reports/${userId}/${Date.now()}.jpg`);
    // const response = await fetch(photoUri);
    // const blob = await response.blob();
    // await uploadBytes(photoRef, blob);
    // const url = await getDownloadURL(photoRef);
    // return url;
    
    return ''; // Placeholder
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
}

/**
 * Update an existing report
 */
export async function updateBloomReport(
  reportId: string,
  updates: Partial<SubmitReportParams>
) {
  try {
    // Import doc, updateDoc from 'firebase/firestore'
    // const reportRef = doc(db, 'bloomReports', reportId);
    // await updateDoc(reportRef, {
    //   ...updates,
    //   updatedAt: Timestamp.now(),
    // });
    
    console.log('Report updated:', reportId);
  } catch (error) {
    console.error('Error updating report:', error);
    throw error;
  }
}

/**
 * Delete a report (admin only)
 */
export async function deleteBloomReport(reportId: string) {
  try {
    // Import deleteDoc, doc from 'firebase/firestore'
    // await deleteDoc(doc(db, 'bloomReports', reportId));
    
    console.log('Report deleted:', reportId);
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
}

/**
 * Get report statistics
 */
export async function getReportStats() {
  try {
    // For production, use Cloud Functions or query aggregation
    // This is a placeholder for basic stats calculation
    return {
      totalReports: 0,
      highSeverity: 0,
      verifiedReports: 0,
      lastUpdate: new Date(),
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    throw error;
  }
}
