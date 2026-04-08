import React, { useState } from 'react';
import { router } from 'expo-router';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card, Badge } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';
import { logout } from '@/services/auth';

export function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [notifications, setNotifications] = useState(true);
  const [gpsTracking, setGpsTracking] = useState(true);

  const handleSignOut = async () => {
    try {
      await logout();
      router.replace('/auth');
    } catch {
      // noop - keep user on current screen if sign out fails
    }
  };

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
        {/* Profile Header */}
        <Card elevation="medium" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: colors.primary + '30' },
              ]}
            >
              <Text style={styles.avatarText}>🧑</Text>
            </View>
            <View style={styles.profileInfo}>
              <ThemedText type="subtitle" style={styles.profileName}>
                Sarah Johnson
              </ThemedText>
              <ThemedText
                style={[
                  styles.profileEmail,
                  { color: colors.icon },
                ]}
              >
                sarah.johnson@email.com
              </ThemedText>
              <View style={styles.joinDate}>
                <Text style={styles.badge}>🌟</Text>
                <ThemedText style={styles.badgeText}>
                  Member since Jan 2024
                </ThemedText>
              </View>
            </View>
          </View>
        </Card>

        {/* Stats */}
        <Card elevation="low" style={styles.statsCard}>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statBoxIcon}>📸</Text>
              <ThemedText style={styles.statBoxLabel}>Reports</ThemedText>
              <ThemedText
                style={[
                  styles.statBoxValue,
                  { color: colors.primary },
                ]}
              >
                24
              </ThemedText>
            </View>
            <View
              style={[
                styles.statBoxDivider,
                { backgroundColor: colors.border },
              ]}
            />
            <View style={styles.statBox}>
              <Text style={styles.statBoxIcon}>⭐</Text>
              <ThemedText style={styles.statBoxLabel}>Impact</ThemedText>
              <ThemedText
                style={[
                  styles.statBoxValue,
                  { color: colors.secondary },
                ]}
              >
                842
              </ThemedText>
            </View>
            <View
              style={[
                styles.statBoxDivider,
                { backgroundColor: colors.border },
              ]}
            />
            <View style={styles.statBox}>
              <Text style={styles.statBoxIcon}>🏆</Text>
              <ThemedText style={styles.statBoxLabel}>Streak</ThemedText>
              <ThemedText
                style={[
                  styles.statBoxValue,
                  { color: colors.accent },
                ]}
              >
                7 days
              </ThemedText>
            </View>
          </View>
        </Card>

        {/* Achievements */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Achievements
          </ThemedText>
          <View style={styles.achievementGrid}>
            {[
              { icon: '🌱', label: 'First Report', status: true },
              { icon: '💧', label: '10 Reports', status: true },
              { icon: '🌿', label: '50 Reports', status: false },
              { icon: '🌍', label: 'Verified User', status: true },
            ].map((achievement, index) => (
              <Card
                key={index}
                elevation="low"
                style={[
                  styles.achievementCard,
                  {
                    opacity: achievement.status ? 1 : 0.5,
                  },
                ]}
              >
                <Text style={styles.achievementIcon}>
                  {achievement.icon}
                </Text>
                <ThemedText style={styles.achievementLabel}>
                  {achievement.label}
                </ThemedText>
                {achievement.status && (
                  <Badge label="Unlocked" variant="success" size="small" />
                )}
              </Card>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Settings
          </ThemedText>

          <Card elevation="low" style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingIcon}>🔔</Text>
                <ThemedText style={styles.settingLabel}>
                  Notifications
                </ThemedText>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{
                  false: colors.border,
                  true: colors.primary + '80',
                }}
                thumbColor={
                  notifications ? colors.primary : colors.icon
                }
              />
            </View>
          </Card>

          <Card elevation="low" style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingIcon}>📍</Text>
                <ThemedText style={styles.settingLabel}>
                  GPS Tracking
                </ThemedText>
              </View>
              <Switch
                value={gpsTracking}
                onValueChange={setGpsTracking}
                trackColor={{
                  false: colors.border,
                  true: colors.primary + '80',
                }}
                thumbColor={
                  gpsTracking ? colors.primary : colors.icon
                }
              />
            </View>
          </Card>
        </View>

        {/* Buttons */}
        <Button
          title="About"
          onPress={() => {}}
          variant="ghost"
          size="large"
          fullWidth
          style={styles.button}
        />
        <Button
          title="Terms & Privacy"
          onPress={() => {}}
          variant="ghost"
          size="large"
          fullWidth
          style={styles.button}
        />
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          size="large"
          fullWidth
          style={styles.signOutButton}
        />
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
  profileCard: {
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 12,
    marginBottom: 8,
  },
  joinDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badge: {
    fontSize: 14,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  statsCard: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statBoxIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statBoxLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
  },
  statBoxValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statBoxDivider: {
    width: 1,
    height: 50,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  settingCard: {
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    marginBottom: 8,
  },
  signOutButton: {
    marginTop: 12,
    marginBottom: 20,
  },
});

export default ProfileScreen;
