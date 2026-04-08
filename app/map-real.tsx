import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MapMarker } from '@/components/ui/map-marker';
import { MarkerDetailsModal } from '@/components/marker-details-modal';
import { ThemedText } from '@/components/themed-text';
import { useBloomReports, type BloomReport } from '@/hooks/use-bloom-reports';

interface UserLocation {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export function MapScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // State
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedReport, setSelectedReport] = useState<BloomReport | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(
    null
  );

  // Firestore data
  const { reports, loading } = useBloomReports();

  // Map reference
  const mapRef = React.useRef<MapView>(null);

  // Get user location on mount
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status === 'granted');

        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          const initialRegion: UserLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          };

          setUserLocation(initialRegion);

          // Animate to user location
          if (mapRef.current) {
            mapRef.current.animateToRegion(initialRegion, 1000);
          }
        } else {
          // Use default location (San Francisco) if permission denied
          const defaultRegion: UserLocation = {
            latitude: 37.7749,
            longitude: -122.4194,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          };
          setUserLocation(defaultRegion);
        }
      } catch (error) {
        console.error('Error getting location:', error);
        // Fallback location
        const fallbackRegion: UserLocation = {
          latitude: 37.7749,
          longitude: -122.4194,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setUserLocation(fallbackRegion);
      }
    })();
  }, []);

  // Handle marker press
  const handleMarkerPress = (report: BloomReport) => {
    setSelectedReport(report);
    setShowDetails(true);
  };

  // Handle zoom to marker
  const zoomToMarker = (report: BloomReport) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: report.coordinates.lat,
          longitude: report.coordinates.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        800
      );
    }
    handleMarkerPress(report);
  };

  // Center map on user
  const handleCenterMap = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(userLocation, 800);
    }
  };

  if (!userLocation) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText style={styles.loadingText}>Loading map...</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={userLocation}
        showsUserLocation={locationPermission !== false}
        showsMyLocationButton={false}
        showsCompass
        zoomEnabled
        scrollEnabled
        rotateEnabled
        pitchEnabled
      >
        {/* User Location Marker */}
        {locationPermission && userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
            pinColor={colors.primary}
          />
        )}

        {/* Bloom Report Markers */}
        {reports.map((report) => (
          <Marker
            key={report.id}
            coordinate={{
              latitude: report.coordinates.lat,
              longitude: report.coordinates.lng,
            }}
            onPress={() => handleMarkerPress(report)}
            title={report.locationName || 'Bloom Report'}
            description={`Severity: ${report.severity}`}
          >
            <MapMarker
              severity={report.severity === 'Severe' ? 'high' : report.severity === 'Moderate' || report.severity === 'Mild' ? 'medium' : 'low'}
              size="medium"
              isSelected={selectedReport?.id === report.id}
            />
          </Marker>
        ))}
      </MapView>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={colors.primary} />
          <ThemedText style={styles.loadingLabel}>Updating...</ThemedText>
        </View>
      )}

      {/* Center Map Button */}
      <TouchableOpacity
        style={[
          styles.centerButton,
          { backgroundColor: colors.primary, shadowColor: colors.primary },
        ]}
        onPress={handleCenterMap}
      >
        <ThemedText style={styles.centerButtonText}>🎯</ThemedText>
      </TouchableOpacity>

      {/* Legend */}
      <View
        style={[
          styles.legend,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}
      >
        <ThemedText style={styles.legendTitle}>Severity Levels</ThemedText>

        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: colors.success },
            ]}
          />
          <ThemedText style={styles.legendLabel}>Low</ThemedText>
        </View>

        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: colors.warning },
            ]}
          />
          <ThemedText style={styles.legendLabel}>Medium</ThemedText>
        </View>

        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: colors.danger },
            ]}
          />
          <ThemedText style={styles.legendLabel}>High</ThemedText>
        </View>

        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: colors.primary },
            ]}
          />
          <ThemedText style={styles.legendLabel}>Your Location</ThemedText>
        </View>
      </View>

      {/* Report Count */}
      <View
        style={[
          styles.reportCount,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}
      >
        <ThemedText style={styles.reportCountText}>
          {reports.length}
        </ThemedText>
        <ThemedText style={styles.reportCountLabel}>Reports</ThemedText>
      </View>

      {/* Details Modal */}
      <MarkerDetailsModal
        visible={showDetails}
        report={selectedReport}
        onClose={() => {
          setShowDetails(false);
          setSelectedReport(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  centerButton: {
    position: 'absolute',
    bottom: 120,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
  centerButtonText: {
    fontSize: 24,
  },
  legend: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  reportCount: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  reportCountText: {
    fontSize: 24,
    fontWeight: '700',
  },
  reportCountLabel: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.7,
  },
});

export default MapScreen;
