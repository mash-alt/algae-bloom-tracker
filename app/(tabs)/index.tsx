import React from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card, Badge } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';
import { useBloomReports } from '@/hooks/use-bloom-reports';
import {
  filterReportsByScope,
  formatRelativeTime,
  getReportDate,
  getReportLocationLabel,
  sortReportsNewestFirst,
  summarizeLocationReports,
} from '@/services/report-insights';
import { auth } from '@/services/firebase';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { reports, loading, error } = useBloomReports();

  const sortedReports = sortReportsNewestFirst(reports);
  const myReports = sortedReports.filter((report) => {
    const currentUserId = auth.currentUser?.uid;
    return currentUserId ? report.userID === currentUserId : true;
  });

  const latestReports = myReports.length > 0 ? myReports.slice(0, 3) : sortedReports.slice(0, 3);
  const alertSummaries = summarizeLocationReports(reports)
    .filter((summary) => summary.count > 0)
    .slice(0, 2)
    .map((summary) => ({
      title:
        summary.severity === 'high'
          ? 'High Bloom Activity'
          : summary.severity === 'medium'
          ? 'Medium Activity Alert'
          : 'Low Activity Watch',
      location: summary.label,
      badge: summary.severity === 'high' ? 'HIGH' : summary.severity === 'medium' ? 'MEDIUM' : 'LOW',
      timeLabel: `Updated ${formatRelativeTime(summary.latestDate)} • ${summary.count} recent reports`,
      backgroundColor:
        summary.severity === 'high'
          ? colors.danger + '10'
          : summary.severity === 'medium'
          ? colors.warning + '10'
          : colors.success + '10',
      variant: summary.severity === 'high' ? 'danger' : summary.severity === 'medium' ? 'warning' : 'success',
    }));

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText type="title" style={styles.greeting}>
              Welcome, Sarah! 👋
            </ThemedText>
            <ThemedText style={[styles.date, { color: colors.icon }]}>
              Today is a good day to track water
            </ThemedText>
          </View>
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.primary + '30' },
            ]}
          >
            <Text style={styles.avatarText}>🧑</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={() => router.push('/capture')}
          >
            <Text style={styles.actionIcon}>📸</Text>
            <ThemedText style={styles.actionLabel}>
              Report Bloom
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.secondary },
            ]}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <Text style={styles.actionIcon}>🗺️</Text>
            <ThemedText style={styles.actionLabel}>
              View Map
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.accent },
            ]}
            onPress={() => router.push('/analytics')}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <ThemedText style={styles.actionLabel}>
              Analytics
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Active Alerts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              🚨 Active Alerts
            </ThemedText>
            <TouchableOpacity>
              <ThemedText style={[styles.seeAll, { color: colors.primary }]}>
                See all
              </ThemedText>
            </TouchableOpacity>
          </View>

          {loading ? (
            <Card elevation="low" style={styles.stateCard}>
              <ActivityIndicator color={colors.primary} />
            </Card>
          ) : error ? (
            <Card elevation="low" style={styles.stateCard}>
              <ThemedText style={[styles.emptyText, { color: colors.icon }]}>Unable to load alerts right now.</ThemedText>
            </Card>
          ) : alertSummaries.length === 0 ? (
            <Card elevation="low" style={styles.stateCard}>
              <ThemedText style={[styles.emptyText, { color: colors.icon }]}>No active alerts yet. New reports will appear here automatically.</ThemedText>
            </Card>
          ) : (
            alertSummaries.map((alert) => (
              <Card
                key={`${alert.title}-${alert.location}`}
                elevation="medium"
                style={[
                  styles.alertCard,
                  { backgroundColor: alert.backgroundColor },
                ]}
                onPress={() => router.push('/analytics')}
              >
                <View style={styles.alertHeader}>
                  <View>
                    <ThemedText style={styles.alertTitle}>{alert.title}</ThemedText>
                    <ThemedText style={[styles.alertLocation, { color: colors.icon }]}>
                      {alert.location}
                    </ThemedText>
                  </View>
                  <Badge label={alert.badge} variant={alert.variant} />
                </View>
                <ThemedText style={[styles.alertTime, { color: colors.icon }]}>{alert.timeLabel}</ThemedText>
              </Card>
            ))
          )}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              📸 Your Recent Reports
            </ThemedText>
            <TouchableOpacity>
              <ThemedText style={[styles.seeAll, { color: colors.primary }]}>
                History
              </ThemedText>
            </TouchableOpacity>
          </View>

          {latestReports.length === 0 ? (
            <Card elevation="low" style={styles.stateCard}>
              <ThemedText style={[styles.emptyText, { color: colors.icon }]}>Your recent reports will show up here after you submit them.</ThemedText>
            </Card>
          ) : (
            latestReports.map((report) => (
              <Card key={report.id} elevation="low" style={styles.reportCard}>
                <View style={styles.reportHeader}>
                  <View>
                    <ThemedText style={styles.reportTitle}>
                      {report.bloom_type || 'Bloom report'}
                    </ThemedText>
                    <ThemedText style={[styles.reportTime, { color: colors.icon }]}>
                      {formatRelativeTime(getReportDate(report))}
                    </ThemedText>
                  </View>
                  <View
                    style={[
                      styles.reportBadge,
                      {
                        backgroundColor:
                          report.severity === 'Severe'
                            ? colors.danger + '20'
                            : report.severity === 'Moderate' || report.severity === 'Mild'
                            ? colors.warning + '20'
                            : colors.success + '20',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.reportBadgeText,
                        {
                          color:
                            report.severity === 'Severe'
                              ? colors.danger
                              : report.severity === 'Moderate' || report.severity === 'Mild'
                              ? colors.warning
                              : colors.success,
                        },
                      ]}
                    >
                      {report.severity === 'Severe'
                        ? 'HIGH'
                        : report.severity === 'Moderate'
                        ? 'MED'
                        : 'LOW'}
                    </Text>
                  </View>
                </View>
                <ThemedText style={[styles.reportLocation, { color: colors.icon }]}>📍 {getReportLocationLabel(report)}</ThemedText>
              </Card>
            ))
          )}
        </View>

        {/* Tips & Education */}
        <Card
          elevation="low"
          style={[
            styles.tipsCard,
            { backgroundColor: colors.primary + '10' },
          ]}
        >
          <View style={styles.tipsHeader}>
            <Text style={styles.tipsIcon}>💡</Text>
            <ThemedText type="subtitle" style={styles.tipsTitle}>
              Did you know?
            </ThemedText>
          </View>
          <ThemedText style={[styles.tipsText, { color: colors.text }]}>
            Algae blooms are often triggered by excess nutrients. Your reports help scientists understand these patterns!
          </ThemedText>
          <Button
            title="Learn More"
            onPress={() => {}}
            variant="outline"
            size="small"
            style={styles.learnMoreBtn}
          />
        </Card>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '600',
  },
  alertCard: {
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  stateCard: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  alertLocation: {
    fontSize: 12,
  },
  alertTime: {
    fontSize: 11,
  },
  reportCard: {
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  reportTime: {
    fontSize: 11,
  },
  reportBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  reportBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  reportLocation: {
    fontSize: 12,
  },
  tipsCard: {
    marginBottom: 24,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  tipsIcon: {
    fontSize: 24,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  tipsText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  learnMoreBtn: {
    alignSelf: 'flex-start',
  },
  footer: {
    height: 20,
  },
});
