import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card, Badge } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

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

          <Card
            elevation="medium"
            style={[
              styles.alertCard,
              { backgroundColor: colors.danger + '10' },
            ]}
            onPress={() => {}}
          >
            <View style={styles.alertHeader}>
              <View>
                <ThemedText style={styles.alertTitle}>
                  High Bloom Activity
                </ThemedText>
                <ThemedText
                  style={[
                    styles.alertLocation,
                    { color: colors.icon },
                  ]}
                >
                  Lake San Francisco
                </ThemedText>
              </View>
              <Badge label="HIGH" variant="danger" />
            </View>
            <ThemedText
              style={[
                styles.alertTime,
                { color: colors.icon },
              ]}
            >
              Updated 2 hours ago • 12 recent reports
            </ThemedText>
          </Card>

          <Card
            elevation="medium"
            style={[
              styles.alertCard,
              { backgroundColor: colors.warning + '10' },
            ]}
            onPress={() => {}}
          >
            <View style={styles.alertHeader}>
              <View>
                <ThemedText style={styles.alertTitle}>
                  Medium Activity Alert
                </ThemedText>
                <ThemedText
                  style={[
                    styles.alertLocation,
                    { color: colors.icon },
                  ]}
                >
                  Bay Area Waters
                </ThemedText>
              </View>
              <Badge label="MEDIUM" variant="warning" />
            </View>
            <ThemedText
              style={[
                styles.alertTime,
                { color: colors.icon },
              ]}
            >
              Updated 4 hours ago • 7 recent reports
            </ThemedText>
          </Card>
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

          {[1, 2, 3].map((i) => (
            <Card key={i} elevation="low" style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View>
                  <ThemedText style={styles.reportTitle}>
                    Report #{24 - i}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.reportTime,
                      { color: colors.icon },
                    ]}
                  >
                    {i} day{i > 1 ? 's' : ''} ago
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.reportBadge,
                    {
                      backgroundColor:
                        i === 1
                          ? colors.danger + '20'
                          : i === 2
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
                          i === 1
                            ? colors.danger
                            : i === 2
                            ? colors.warning
                            : colors.success,
                      },
                    ]}
                  >
                    {i === 1 ? 'HIGH' : i === 2 ? 'MED' : 'LOW'}
                  </Text>
                </View>
              </View>
              <ThemedText
                style={[
                  styles.reportLocation,
                  { color: colors.icon },
                ]}
              >
                📍{' '}
                {i === 1
                  ? 'Lake San Francisco'
                  : i === 2
                  ? 'Bay Area Waters'
                  : 'Coastal Reserve'}
              </ThemedText>
            </Card>
          ))}
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
