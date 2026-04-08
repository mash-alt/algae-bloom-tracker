import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { Card, Badge } from '@/components/ui/card';
import { type BloomReport } from '@/hooks/use-bloom-reports';

interface MarkerDetailsModalProps {
  visible: boolean;
  report: BloomReport | null;
  onClose: () => void;
}

export function MarkerDetailsModal({
  visible,
  report,
  onClose,
}: MarkerDetailsModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (!report) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const severityLabels = {
    low: { label: 'Low', icon: '🟢' },
    medium: { label: 'Medium', icon: '🟡' },
    high: { label: 'High', icon: '🔴' },
  };

  const severityVariants = {
    low: 'success' as const,
    medium: 'warning' as const,
    high: 'danger' as const,
  };

  const severityKey = report.severity === 'Severe' ? 'high' : report.severity === 'Moderate' || report.severity === 'Mild' ? 'medium' : 'low';

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            { borderBottomColor: colors.border },
          ]}
        >
          <ThemedText type="subtitle" style={styles.headerTitle}>
            Bloom Report
          </ThemedText>
          <TouchableOpacity
            onPress={onClose}
            style={[
              styles.closeButton,
              { backgroundColor: colors.secondary + '20' },
            ]}
          >
            <ThemedText style={styles.closeButtonText}>✕</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Photo */}
          {report.photoURL && (
            <Card elevation="medium" style={styles.photoCard}>
              <Image
                source={{ uri: report.photoURL }}
                style={styles.photo}
              />
            </Card>
          )}

          {/* Severity Badge */}
          <View style={styles.severitySection}>
            <Badge
              label={severityLabels[severityKey].label}
              variant={severityVariants[severityKey]}
              size="medium"
            />
            <ThemedText style={styles.severityIcon}>
              {severityLabels[severityKey].icon}
            </ThemedText>
          </View>

          {/* Details Card */}
          <Card elevation="low" style={styles.detailsCard}>
            {/* Location */}
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailIcon}>📍</ThemedText>
              <View style={styles.detailContent}>
                <ThemedText style={styles.detailLabel}>Location</ThemedText>
                <ThemedText style={[styles.detailValue, { color: colors.icon }]}>
                  {report.locationName || 'Unknown location'}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.detailCoordinates,
                    { color: colors.icon },
                  ]}
                >
                  {report.coordinates.lat.toFixed(4)}, {report.coordinates.lng.toFixed(4)}
                </ThemedText>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Timestamp */}
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailIcon}>🕐</ThemedText>
              <View style={styles.detailContent}>
                <ThemedText style={styles.detailLabel}>Reported</ThemedText>
                <ThemedText
                  style={[
                    styles.detailValue,
                    { color: colors.icon },
                  ]}
                >
                  {formatDate(new Date(report.createdAt ?? report.timestamp))}
                </ThemedText>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Reporter */}
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailIcon}>👤</ThemedText>
              <View style={styles.detailContent}>
                <ThemedText style={styles.detailLabel}>Reporter</ThemedText>
                <ThemedText
                  style={[
                    styles.detailValue,
                    { color: colors.icon },
                  ]}
                >
                  {report.userID}
                </ThemedText>
              </View>
            </View>

            {report.aiAnalysis && (
              <>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailIcon}>🤖</ThemedText>
                  <View style={styles.detailContent}>
                    <ThemedText style={styles.detailLabel}>Gemini Analysis</ThemedText>
                    <ThemedText style={[styles.detailValue, { color: colors.icon }]}>
                      {report.aiAnalysis.severity} • {(report.aiAnalysis.confidence * 100).toFixed(0)}% confidence
                    </ThemedText>
                    <ThemedText style={[styles.detailCoordinates, { color: colors.icon }]}>
                      {report.aiAnalysis.bloom_type}
                    </ThemedText>
                  </View>
                </View>
              </>
            )}
          </Card>

          {/* Description */}
          {report.notes && (
            <Card elevation="low" style={styles.descriptionCard}>
              <ThemedText style={styles.descriptionLabel}>
                Notes
              </ThemedText>
              <ThemedText
                style={[
                  styles.descriptionText,
                  { color: colors.icon },
                ]}
              >
                {report.notes}
              </ThemedText>
            </Card>
          )}

          {/* Bloom Type */}
          {report.bloom_type && (
            <Card elevation="low" style={styles.algaeCard}>
              <View style={styles.algaeRow}>
                <ThemedText style={styles.algaeIcon}>🌱</ThemedText>
                <View>
                  <ThemedText style={styles.algaeLabel}>Bloom Type</ThemedText>
                  <ThemedText
                    style={[
                      styles.algaeValue,
                      { color: colors.icon },
                    ]}
                  >
                    {report.bloom_type}
                  </ThemedText>
                </View>
              </View>
            </Card>
          )}

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.primary + '20' },
              ]}
            >
              <ThemedText style={{ color: colors.primary, fontWeight: '600' }}>
                📞 Report Issue
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.secondary + '20' },
              ]}
            >
              <ThemedText style={{ color: colors.secondary, fontWeight: '600' }}>
                👍 Helpful
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
  },
  photoCard: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  severitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  severityIcon: {
    fontSize: 28,
  },
  detailsCard: {
    marginBottom: 16,
    paddingVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  detailIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailCoordinates: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  verifiedBadge: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27AE60',
  },
  descriptionCard: {
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  descriptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.7,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  algaeCard: {
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  algaeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  algaeIcon: {
    fontSize: 20,
  },
  algaeLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    opacity: 0.7,
  },
  algaeValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionSection: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
