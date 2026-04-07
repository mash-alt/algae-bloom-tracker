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
import { Card } from '@/components/ui/card';
import { ThemedText } from '@/components/themed-text';

const { width } = Dimensions.get('window');

export function AnalyticsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [timeRange, setTimeRange] = useState('month');

  const timeRanges = ['week', 'month', 'year'];

  // Mock chart data
  const chartData = [
    { day: 'Mon', value: 45, max: 100 },
    { day: 'Tue', value: 62, max: 100 },
    { day: 'Wed', value: 38, max: 100 },
    { day: 'Thu', value: 85, max: 100 },
    { day: 'Fri', value: 72, max: 100 },
    { day: 'Sat', value: 91, max: 100 },
    { day: 'Sun', value: 58, max: 100 },
  ];

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
                156
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
                +12%
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
                23
              </ThemedText>
            </View>
          </View>
        </Card>

        {/* Chart */}
        <Card elevation="low" style={styles.chartCard}>
          <ThemedText type="subtitle" style={styles.chartTitle}>
            Weekly Activity
          </ThemedText>
          <View style={styles.chart}>
            {chartData.map((data, index) => {
              const heightPercentage = (data.value / data.max) * 100;
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

          {[
            { label: 'High Severity', value: 45, color: colors.danger },
            { label: 'Medium Severity', value: 65, color: colors.warning },
            { label: 'Low Severity', value: 46, color: colors.success },
          ].map((item, index) => (
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
                      width: `${(item.value / 100) * 100}%`,
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
            Most Active Locations
          </ThemedText>

          {[
            {
              name: 'Lake San Francisco',
              reports: 34,
              severity: 'high',
            },
            {
              name: 'Bay Area Waters',
              reports: 28,
              severity: 'medium',
            },
            {
              name: 'Coastal Reserve',
              reports: 18,
              severity: 'low',
            },
          ].map((location, index) => {
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
                key={index}
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
                    {location.name}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.locationReports,
                      { color: colors.icon },
                    ]}
                  >
                    {location.reports} reports
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
          })}
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
