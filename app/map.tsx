import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card, Badge } from '@/components/ui/card';
import { ThemedText } from '@/components/themed-text';

const { width, height } = Dimensions.get('window');

interface WaterBody {
  id: string;
  name: string;
  location: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  reports: number;
  coordinates: { x: number; y: number };
}

const WATER_BODIES: WaterBody[] = [
  {
    id: '1',
    name: 'Lake San Francisco',
    location: '37.7749° N, 122.4194° W',
    severity: 'high',
    confidence: 92,
    reports: 12,
    coordinates: { x: 120, y: 150 },
  },
  {
    id: '2',
    name: 'Bay Area Waters',
    location: '37.5585° N, 122.2711° W',
    severity: 'medium',
    confidence: 78,
    reports: 7,
    coordinates: { x: 280, y: 220 },
  },
  {
    id: '3',
    name: 'Coastal Reserve',
    location: '37.4419° N, 122.1430° W',
    severity: 'low',
    confidence: 65,
    reports: 3,
    coordinates: { x: 320, y: 280 },
  },
];

export function MapScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedBody, setSelectedBody] = useState<WaterBody | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return colors.danger;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.icon;
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Map Area */}
      <View
        style={[
          styles.mapContainer,
          { backgroundColor: colors.secondary + '15' },
        ]}
      >
        <View
          style={[
            styles.mapBackground,
            { backgroundColor: colors.lightAqua },
          ]}
        >
          {/* Water bodies dots */}
          {WATER_BODIES.map((body) => (
            <TouchableOpacity
              key={body.id}
              style={[
                styles.mapDot,
                {
                  left: body.coordinates.x,
                  top: body.coordinates.y,
                  backgroundColor: getSeverityColor(body.severity),
                },
              ]}
              onPress={() => setSelectedBody(body)}
            />
          ))}

          {/* Map info header */}
          <View style={styles.mapHeader}>
            <Text style={styles.mapIcon}>🗺️</Text>
            <ThemedText type="subtitle">Active Blooms</ThemedText>
          </View>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: colors.success },
            ]}
          />
          <ThemedText style={styles.legendText}>Low</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: colors.warning },
            ]}
          />
          <ThemedText style={styles.legendText}>Medium</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: colors.danger },
            ]}
          />
          <ThemedText style={styles.legendText}>High</ThemedText>
        </View>
      </View>

      {/* Details Panel */}
      <ScrollView
        style={[
          styles.detailsPanel,
          { backgroundColor: colors.cardBackground },
        ]}
        contentContainerStyle={styles.detailsPanelContent}
        showsVerticalScrollIndicator={false}
      >
        {selectedBody ? (
          <>
            <View style={styles.detailHeader}>
              <View>
                <ThemedText type="subtitle" style={styles.detailName}>
                  {selectedBody.name}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.detailLocation,
                    { color: colors.icon },
                  ]}
                >
                  📍 {selectedBody.location}
                </ThemedText>
              </View>
              <Badge
                label={selectedBody.severity.toUpperCase()}
                variant={
                  selectedBody.severity === 'high'
                    ? 'danger'
                    : selectedBody.severity === 'medium'
                    ? 'warning'
                    : 'success'
                }
              />
            </View>

            <Card elevation="low" style={styles.statsCard}>
              <View style={styles.statRow}>
                <View style={styles.stat}>
                  <Text style={styles.statIcon}>🎯</Text>
                  <ThemedText style={styles.statLabel}>
                    Confidence
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.statValue,
                      { color: colors.primary },
                    ]}
                  >
                    {selectedBody.confidence}%
                  </ThemedText>
                </View>
                <View style={styles.divider} />
                <View style={styles.stat}>
                  <Text style={styles.statIcon}>📋</Text>
                  <ThemedText style={styles.statLabel}>
                    Reports
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.statValue,
                      { color: colors.primary },
                    ]}
                  >
                    {selectedBody.reports}
                  </ThemedText>
                </View>
              </View>
            </Card>

            <Card elevation="low" style={styles.recentCard}>
              <ThemedText type="subtitle" style={styles.recentTitle}>
                Recent Reports
              </ThemedText>
              {[1, 2].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.reportItem,
                    {
                      borderBottomColor: colors.border,
                      borderBottomWidth: i === 1 ? 1 : 0,
                    },
                  ]}
                >
                  <Text style={styles.reportIcon}>📸</Text>
                  <View style={styles.reportInfo}>
                    <ThemedText style={styles.reportTime}>
                      2 hours ago
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.reportUser,
                        { color: colors.icon },
                      ]}
                    >
                      User {i} reported activity
                    </ThemedText>
                  </View>
                  <View
                    style={[
                      styles.reportSeverity,
                      {
                        backgroundColor:
                          i === 1 ? colors.danger : colors.warning,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.reportSeverityText,
                        { color: colors.cardBackground },
                      ]}
                    >
                      {i === 1 ? 'High' : 'Med'}
                    </Text>
                  </View>
                </View>
              ))}
            </Card>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👆</Text>
            <ThemedText style={styles.emptyText}>
              Select a water body to view details
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    height: height * 0.4,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapBackground: {
    flex: 1,
    position: 'relative',
  },
  mapHeader: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mapIcon: {
    fontSize: 20,
  },
  mapDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailsPanel: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  detailsPanelContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  detailHeader: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  detailLocation: {
    fontSize: 12,
  },
  statsCard: {
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: '#E0E0E0',
  },
  recentCard: {
    marginBottom: 20,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  reportIcon: {
    fontSize: 24,
  },
  reportInfo: {
    flex: 1,
  },
  reportTime: {
    fontSize: 12,
    fontWeight: '600',
  },
  reportUser: {
    fontSize: 11,
    marginTop: 2,
  },
  reportSeverity: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  reportSeverityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default MapScreen;
