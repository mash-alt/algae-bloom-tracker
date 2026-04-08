import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

import { subscribeToAlgaeReports, type AlgaeReport } from '@/services/reports';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Badge, Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';

const DEFAULT_REGION = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.18,
  longitudeDelta: 0.18,
};

type Severity = 'low' | 'medium' | 'high';

interface BloomReport {
  id: string;
  userID: string;
  latitude: number;
  longitude: number;
  severity: Severity;
  severityLabel: AlgaeReport['severity'];
  confidence: number;
  bloom_type: string;
  notes: string;
  createdAt?: string;
  aiAnalysis?: AlgaeReport['aiAnalysis'];
  photoUrl?: string;
  timestamp: Date;
  title?: string;
}

function normalizeDate(value: unknown): Date {
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as { toDate: () => Date }).toDate();
  }
  if (typeof value === 'number' || typeof value === 'string') return new Date(value);
  return new Date();
}

function mapSeverityToColor(severity: Severity, colors: (typeof Colors)['light']) {
  if (severity === 'high') return colors.danger;
  if (severity === 'medium') return colors.warning;
  return colors.success;
}

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [reports, setReports] = useState<BloomReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<BloomReport | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted' || !mounted) {
          setIsLocating(false);
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!mounted) return;

        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setUserLocation(coords);
        setIsLocating(false);

        mapRef.current?.animateToRegion(
          {
            ...coords,
            latitudeDelta: 0.07,
            longitudeDelta: 0.07,
          },
          700
        );
      } catch {
        if (mounted) setIsLocating(false);
      }
    };

    loadLocation();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAlgaeReports(
      (items) => {
        const rows: BloomReport[] = items.map((item) => ({
          id: item.id,
          userID: item.userID,
          latitude: item.coordinates.lat,
          longitude: item.coordinates.lng,
          severity:
            item.severity === 'Severe'
              ? 'high'
              : item.severity === 'Moderate' || item.severity === 'Mild'
              ? 'medium'
              : 'low',
          severityLabel: item.severity,
          confidence: item.confidence,
          bloom_type: item.bloom_type,
          notes: item.notes,
          createdAt: item.createdAt,
          aiAnalysis: item.aiAnalysis,
          photoUrl: item.photoURL,
          timestamp: normalizeDate(item.timestamp),
          title: 'Algae bloom report',
        }));
        setReports(rows);
      },
      () => setReports([])
    );

    return unsubscribe;
  }, []);

  const initialRegion = useMemo(() => {
    if (!userLocation) return DEFAULT_REGION;
    return {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: 0.07,
      longitudeDelta: 0.07,
    };
  }, [userLocation]);

  const recenterMap = () => {
    if (!userLocation) return;
    mapRef.current?.animateToRegion(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.07,
        longitudeDelta: 0.07,
      },
      700
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton={false}
          followsUserLocation={false}
          mapType="standard"
          loadingEnabled
        >
          {reports.map((report) => (
            <Marker
              key={report.id}
              coordinate={{ latitude: report.latitude, longitude: report.longitude }}
              pinColor={mapSeverityToColor(report.severity, colors)}
              onPress={() => setSelectedReport(report)}
            />
          ))}
        </MapView>

        <View style={[styles.topOverlay, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <ThemedText type="subtitle">Algae Bloom Map</ThemedText>
          <ThemedText style={[styles.overlayText, { color: colors.icon }]}>
            {reports.length} live markers from Firestore
          </ThemedText>
        </View>

        <TouchableOpacity activeOpacity={0.85} onPress={recenterMap} style={[styles.recenterButton, { backgroundColor: colors.primary }]}>
          {isLocating ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.recenterIcon}>📍</Text>}
        </TouchableOpacity>

        <View style={styles.legendContainer}>
          <Card elevation="low" style={styles.legendCard}>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.success }]} /><ThemedText style={styles.legendLabel}>Low</ThemedText></View>
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.warning }]} /><ThemedText style={styles.legendLabel}>Medium</ThemedText></View>
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.danger }]} /><ThemedText style={styles.legendLabel}>High</ThemedText></View>
            </View>
          </Card>
        </View>
      </View>

      <Modal visible={Boolean(selectedReport)} transparent animationType="slide" onRequestClose={() => setSelectedReport(null)}>
        <View style={styles.modalBackdrop}>
          <TouchableOpacity style={styles.backdropTouchArea} onPress={() => setSelectedReport(null)} />
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground, borderTopColor: colors.border }]}> 
            {selectedReport && (
              <>
                <View style={styles.modalHeader}>
                  <ThemedText type="subtitle">Marker Details</ThemedText>
                  <Badge
                    label={selectedReport.severity.toUpperCase()}
                    variant={selectedReport.severity === 'high' ? 'danger' : selectedReport.severity === 'medium' ? 'warning' : 'success'}
                  />
                </View>

                <View style={[styles.photoContainer, { backgroundColor: colors.lightAqua }]}> 
                  {selectedReport.photoUrl ? (
                    <Image source={{ uri: selectedReport.photoUrl }} resizeMode="cover" style={styles.photo} />
                  ) : (
                    <Text style={styles.photoPlaceholder}>📷 No photo attached</Text>
                  )}
                </View>

                <ThemedText style={styles.modalTitle}>{selectedReport.title ?? 'Bloom report'}</ThemedText>
                <ThemedText style={[styles.modalLine, { color: colors.icon }]}>📍 {selectedReport.latitude.toFixed(5)}, {selectedReport.longitude.toFixed(5)}</ThemedText>
                <ThemedText style={[styles.modalLine, { color: colors.icon }]}>🕒 {selectedReport.timestamp.toLocaleString()}</ThemedText>
                <ThemedText style={[styles.modalLine, { color: colors.icon }]}>👤 User: {selectedReport.userID || 'unknown'}</ThemedText>
                <ThemedText style={[styles.modalLine, { color: colors.icon }]}>🧪 Severity: {selectedReport.severityLabel}</ThemedText>
                <ThemedText style={[styles.modalLine, { color: colors.icon }]}>📈 Confidence: {selectedReport.confidence}</ThemedText>
                <ThemedText style={[styles.modalLine, { color: colors.icon }]}>🌊 Bloom Type: {selectedReport.bloom_type}</ThemedText>
                <ThemedText style={[styles.modalLine, { color: colors.icon }]}>📝 Notes: {selectedReport.notes || 'N/A'}</ThemedText>
                <ThemedText style={[styles.modalLine, { color: colors.icon }]}>🆔 Report ID: {selectedReport.id}</ThemedText>
                {selectedReport.createdAt ? (
                  <ThemedText style={[styles.modalLine, { color: colors.icon }]}>📅 Created: {new Date(selectedReport.createdAt).toLocaleString()}</ThemedText>
                ) : null}

                {selectedReport.aiAnalysis ? (
                  <View style={styles.aiBox}>
                    <ThemedText style={styles.aiTitle}>Gemini Analysis</ThemedText>
                    <ThemedText style={[styles.modalLine, { color: colors.icon }]}>Model: {selectedReport.aiAnalysis.model || 'unknown'}</ThemedText>
                    <ThemedText style={[styles.modalLine, { color: colors.icon }]}>AI Severity: {selectedReport.aiAnalysis.severity}</ThemedText>
                    <ThemedText style={[styles.modalLine, { color: colors.icon }]}>AI Confidence: {selectedReport.aiAnalysis.confidence}</ThemedText>
                    <ThemedText style={[styles.modalLine, { color: colors.icon }]}>AI Bloom Type: {selectedReport.aiAnalysis.bloom_type}</ThemedText>
                    <ThemedText style={[styles.modalLine, { color: colors.icon }]}>AI Notes: {selectedReport.aiAnalysis.notes || 'N/A'}</ThemedText>
                    <ThemedText style={[styles.modalLine, { color: colors.icon }]}>AI Timestamp: {selectedReport.aiAnalysis.timestamp}</ThemedText>
                  </View>
                ) : null}

                <Button title="Close" onPress={() => setSelectedReport(null)} variant="primary" size="medium" fullWidth style={styles.closeButton} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapWrapper: { flex: 1 },
  topOverlay: { position: 'absolute', top: 14, left: 14, right: 14, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12 },
  overlayText: { fontSize: 12, marginTop: 2 },
  recenterButton: {
    position: 'absolute', right: 14, bottom: 100, width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 6,
  },
  recenterIcon: { fontSize: 20, color: '#fff' },
  legendContainer: { position: 'absolute', left: 14, right: 14, bottom: 20 },
  legendCard: { paddingVertical: 10 },
  legendRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendLabel: { fontSize: 12, fontWeight: '600' },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.38)' },
  backdropTouchArea: { flex: 1 },
  modalContent: { borderTopLeftRadius: 22, borderTopRightRadius: 22, borderTopWidth: 1, padding: 16, paddingBottom: 22, minHeight: 310 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  photoContainer: { width: '100%', height: 170, borderRadius: 12, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  photo: { width: '100%', height: '100%' },
  photoPlaceholder: { fontSize: 14, fontWeight: '600', color: '#425466' },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  modalLine: { fontSize: 13, marginBottom: 4 },
  aiBox: {
    marginTop: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#D0D8E2',
    borderRadius: 10,
    padding: 8,
  },
  aiTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  closeButton: { marginTop: 12 },
});
