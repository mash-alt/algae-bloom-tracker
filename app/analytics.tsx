import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui/card';
import { ThemedText } from '@/components/themed-text';
import { useBloomReports } from '@/hooks/use-bloom-reports';
import {
  filterReportsByScope,
  formatRelativeTime,
  getReportDate,
  REPORT_SCOPE_OPTIONS,
  summarizeLocationReports,
  type ReportScopeKey,
} from '@/services/report-insights';

export function AnalyticsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [timeRange, setTimeRange] = useState('month');
  const [scope, setScope] = useState<ReportScopeKey>('global');
  const { reports, loading, error } = useBloomReports();

  const timeRanges = ['week', 'month', 'year'];

  const filteredReports = useMemo(() => filterReportsByScope(reports, scope), [reports, scope]);

  const chartData = useMemo(() => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = weekDays.map((day) => ({ day, value: 0, max: 100 }));

    const now = new Date();
    const timeWindowDays = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    const cutoff = new Date(now.getTime() - timeWindowDays * 24 * 60 * 60 * 1000);

    filteredReports.forEach((report) => {
      const date = getReportDate(report);
      if (date < cutoff) return;
      const bucket = counts[date.getDay()];
      bucket.value += 1;
    });

    return counts;
  }, [filteredReports, timeRange]);

  const overview = useMemo(() => {
    const total = filteredReports.length;
    const areas = summarizeLocationReports(filteredReports).length;
    const now = new Date();
    const recentWindow = 7 * 24 * 60 * 60 * 1000;
    const previousWindow = 14 * 24 * 60 * 60 * 1000;
    const recent = filteredReports.filter((report) => now.getTime() - getReportDate(report).getTime() <= recentWindow).length;
    const previous = filteredReports.filter((report) => {
      const age = now.getTime() - getReportDate(report).getTime();
      return age > recentWindow && age <= previousWindow;
    }).length;
    const trend = previous === 0 ? (recent > 0 ? 100 : 0) : Math.round(((recent - previous) / previous) * 100);

    return { total, areas, trend };
  }, [filteredReports]);

  const severityStats = useMemo(() => {
    const totals = filteredReports.reduce(
      (acc, report) => {
        if (report.severity === 'Severe') acc.high += 1;
        else if (report.severity === 'Moderate' || report.severity === 'Mild') acc.medium += 1;
        else acc.low += 1;
        return acc;
      },
      { high: 0, medium: 0, low: 0 }
    );

    const max = Math.max(totals.high, totals.medium, totals.low, 1);
    return [
      { label: 'High Severity', value: totals.high, color: colors.danger, width: (totals.high / max) * 100 },
      { label: 'Medium Severity', value: totals.medium, color: colors.warning, width: (totals.medium / max) * 100 },
      { label: 'Low Severity', value: totals.low, color: colors.success, width: (totals.low / max) * 100 },
    ];
  }, [filteredReports, colors.danger, colors.warning, colors.success]);

  const topLocations = useMemo(() => summarizeLocationReports(filteredReports).slice(0, 5), [filteredReports]);

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
        <ThemedText type="title" style={styles.title}>
          Analytics & Trends
        </ThemedText>

        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          {timeRanges.map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                {
                  backgroundColor:
                    timeRange === range
                      ? colors.primary
                      : colors.cardBackground,
                  borderColor:
                    timeRange === range
                      ? colors.primary
                      : colors.border,
                  borderWidth: 1,
                },
              ]}
              onPress={() => setTimeRange(range)}
            >
              <ThemedText
                style={[
                  styles.timeRangeText,
                  {
                    color:
                      timeRange === range
                        ? colors.cardBackground
                        : colors.text,
                    fontWeight: timeRange === range ? '700' : '500',
                  },
                ]}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Location Scope Selector */}
        <View style={styles.scopeContainer}>
          <ThemedText style={styles.scopeLabel}>Scope</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scopeScroll}>
            {REPORT_SCOPE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.scopeButton,
                  {
                    backgroundColor: scope === option.key ? colors.primary : colors.cardBackground,
                    borderColor: scope === option.key ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setScope(option.key)}
              >
                <ThemedText
                  style={[
                    styles.scopeText,
                    { color: scope === option.key ? colors.cardBackground : colors.text, fontWeight: scope === option.key ? '700' : '500' },
                  ]}
                >
                  {option.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Overview Stats */}
        <Card elevation="low" style={styles.overviewCard}>
          <View style={styles.overviewRow}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewIcon}>📊</Text>
              <ThemedText style={styles.overviewLabel}>
                Total Reports
              </ThemedText>
              <ThemedText
                style={[
                  styles.overviewValue,
                  { color: colors.primary },
                ]}
              >
                {loading ? '—' : overview.total}
              </ThemedText>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewItem}>
              <Text style={styles.overviewIcon}>📈</Text>
              <ThemedText style={styles.overviewLabel}>
                Trend
              </ThemedText>
              <ThemedText
                style={[
                  styles.overviewValue,
                  { color: colors.warning },
                ]}
              >
                {loading ? '—' : `${overview.trend >= 0 ? '+' : ''}${overview.trend}%`}
              </ThemedText>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewItem}>
              <Text style={styles.overviewIcon}>🌐</Text>
              <ThemedText style={styles.overviewLabel}>
                Areas
              </ThemedText>
              <ThemedText
                style={[
                  styles.overviewValue,
                  { color: colors.secondary },
                ]}
              >
                {loading ? '—' : overview.areas}
              </ThemedText>
            </View>
          </View>
        </Card>

        {/* Chart */}
        <Card elevation="low" style={styles.chartCard}>
          <ThemedText type="subtitle" style={styles.chartTitle}>
            {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Activity
          </ThemedText>
          {loading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : error ? (
            <ThemedText style={[styles.emptyState, { color: colors.icon }]}>Analytics are temporarily unavailable.</ThemedText>
          ) : null}
          <View style={styles.chart}>
            {chartData.map((data, index) => {
              const maxValue = Math.max(...chartData.map((item) => item.value), 1);
              const heightPercentage = data.value === 0 ? 6 : (data.value / maxValue) * 100;
              return (
                <View key={index} style={styles.chartBar}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${heightPercentage}%`,
                        backgroundColor: colors.primary,
                        borderRadius: 4,
                      },
                    ]}
                  />
                  <ThemedText style={styles.chartLabel}>
                    {data.day}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.chartValue,
                      { color: colors.icon },
                    ]}
                  >
                    {data.value}
                  </ThemedText>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Severity Distribution */}
        <Card elevation="low" style={styles.distributionCard}>
          <ThemedText type="subtitle" style={styles.distributionTitle}>
            Severity Distribution
          </ThemedText>

          {severityStats.map((item, index) => (
            <View key={index} style={styles.distributionItem}>
              <View style={styles.distributionLabel}>
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: item.color },
                  ]}
                />
                <ThemedText>{item.label}</ThemedText>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${item.width}%`,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
              <ThemedText style={[styles.progressValue, { color: item.color }]}>
                {item.value}
              </ThemedText>
            </View>
          ))}
        </Card>

        {/* Top Locations */}
        <Card elevation="low" style={styles.locationsCard}>
          <ThemedText type="subtitle" style={styles.locationsTitle}>
            Most Active Locations {scope === 'global' ? '(Global)' : `(${REPORT_SCOPE_OPTIONS.find((option) => option.key === scope)?.label})`}
          </ThemedText>
          {loading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : topLocations.length === 0 ? (
            <ThemedText style={[styles.emptyState, { color: colors.icon }]}>No location data for this scope yet.</ThemedText>
          ) : (
            topLocations.map((location, index) => {
            const getSeverityBg = () => {
              switch (location.severity) {
                case 'high':
                  return colors.danger + '20';
                case 'medium':
                  return colors.warning + '20';
                case 'low':
                  return colors.success + '20';
                default:
                  return colors.primary + '20';
              }
            };

            const getSeverityColor = () => {
              switch (location.severity) {
                case 'high':
                  return colors.danger;
                case 'medium':
                  return colors.warning;
                case 'low':
                  return colors.success;
                default:
                  return colors.primary;
              }
            };

            return (
              <View
                key={location.key}
                style={[
                  styles.locationItem,
                  {
                    borderBottomColor: colors.border,
                    borderBottomWidth: index < 2 ? 1 : 0,
                  },
                ]}
              >
                <View>
                  <ThemedText style={styles.locationName}>
                    {location.label}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.locationReports,
                      { color: colors.icon },
                    ]}
                  >
                      {location.count} reports • {location.reports.length} items in cluster
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.locationBadge,
                    { backgroundColor: getSeverityBg() },
                  ]}
                >
                  <Text
                    style={[
                      styles.locationBadgeText,
                      { color: getSeverityColor() },
                    ]}
                  >
                    {location.severity.toUpperCase()}
                  </Text>
                </View>
              </View>
            );
          })
          )}
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  scopeContainer: {
    marginBottom: 20,
  },
  scopeLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  scopeScroll: {
    gap: 8,
  },
  scopeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  scopeText: {
    fontSize: 12,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeRangeText: {
    fontSize: 12,
  },
  overviewCard: {
    marginBottom: 20,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  overviewItem: {
    alignItems: 'center',
    flex: 1,
  },
  overviewIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  overviewLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  overviewDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#E0E0E0',
  },
  chartCard: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 16,
  },
  chart: {
    height: 140,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 6,
  },
  loadingState: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyState: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 2,
  },
  chartValue: {
    fontSize: 8,
  },
  distributionCard: {
    marginBottom: 20,
  },
  distributionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  distributionItem: {
    marginBottom: 16,
  },
  distributionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationsCard: {
    marginBottom: 20,
  },
  locationsTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  locationName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationReports: {
    fontSize: 11,
  },
  locationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  locationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  footer: {
    height: 20,
  },
});

export default AnalyticsScreen;
