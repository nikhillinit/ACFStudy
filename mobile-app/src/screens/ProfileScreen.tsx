import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  Avatar,
  List,
  Switch,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { commonStyles, theme } from '../theme/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboard().then(res => res.data),
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const achievements = [
    { title: 'First Steps', description: 'Completed your first problem', icon: 'star', earned: true },
    { title: 'Problem Solver', description: 'Solved 10 problems', icon: 'trophy', earned: true },
    { title: 'Video Learner', description: 'Watched 5 video lectures', icon: 'play-circle', earned: false },
    { title: 'Streak Master', description: 'Maintained a 7-day streak', icon: 'flame', earned: false },
  ];

  const stats = [
    { label: 'Problems Solved', value: dashboardData?.completedProblems || 0, icon: 'checkmark-circle' },
    { label: 'Average Score', value: `${Math.round(dashboardData?.overallAccuracy || 0)}%`, icon: 'trending-up' },
    { label: 'Study Streak', value: '3 days', icon: 'calendar' },
    { label: 'Time Studied', value: '12.5 hours', icon: 'time' },
  ];

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text
              size={80}
              label={user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text variant="headlineSmall" style={styles.userName}>
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email}
              </Text>
              <Text variant="bodyMedium" style={styles.userEmail}>
                {user?.email}
              </Text>
              <Text variant="bodySmall" style={styles.joinDate}>
                Member since December 2024
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Learning Statistics */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Learning Statistics
            </Text>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Ionicons
                      name={stat.icon as any}
                      size={20}
                      color={theme.colors.primary}
                    />
                  </View>
                  <Text variant="titleMedium" style={styles.statValue}>
                    {stat.value}
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Achievements */}
        <Card style={styles.achievementsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Achievements
            </Text>
            {achievements.map((achievement, index) => (
              <View key={index}>
                <List.Item
                  title={achievement.title}
                  description={achievement.description}
                  left={() => (
                    <View style={[
                      styles.achievementIcon,
                      { backgroundColor: achievement.earned ? theme.colors.primaryContainer : theme.colors.surfaceVariant }
                    ]}>
                      <Ionicons
                        name={achievement.icon as any}
                        size={24}
                        color={achievement.earned ? theme.colors.primary : theme.colors.onSurfaceVariant}
                      />
                    </View>
                  )}
                  right={() => achievement.earned && (
                    <Ionicons name="checkmark-circle" size={24} color={theme.colors.tertiary} />
                  )}
                  titleStyle={[
                    styles.achievementTitle,
                    { opacity: achievement.earned ? 1 : 0.6 }
                  ]}
                  descriptionStyle={[
                    styles.achievementDescription,
                    { opacity: achievement.earned ? 1 : 0.6 }
                  ]}
                />
                {index < achievements.length - 1 && <Divider />}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Settings */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Settings
            </Text>
            
            <List.Item
              title="Push Notifications"
              description="Receive study reminders and updates"
              left={() => (
                <View style={styles.settingIcon}>
                  <Ionicons name="notifications-outline" size={24} color={theme.colors.primary} />
                </View>
              )}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Dark Mode"
              description="Switch to dark theme"
              left={() => (
                <View style={styles.settingIcon}>
                  <Ionicons name="moon-outline" size={24} color={theme.colors.primary} />
                </View>
              )}
              right={() => (
                <Switch
                  value={darkModeEnabled}
                  onValueChange={setDarkModeEnabled}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Study Reminders"
              description="Set daily study time reminders"
              left={() => (
                <View style={styles.settingIcon}>
                  <Ionicons name="alarm-outline" size={24} color={theme.colors.primary} />
                </View>
              )}
              right={() => (
                <Ionicons name="chevron-forward" size={24} color={theme.colors.onSurfaceVariant} />
              )}
              onPress={() => Alert.alert('Coming Soon', 'Study reminders feature will be available soon!')}
            />
            
            <Divider />
            
            <List.Item
              title="Download Content"
              description="Download videos for offline viewing"
              left={() => (
                <View style={styles.settingIcon}>
                  <Ionicons name="download-outline" size={24} color={theme.colors.primary} />
                </View>
              )}
              right={() => (
                <Ionicons name="chevron-forward" size={24} color={theme.colors.onSurfaceVariant} />
              )}
              onPress={() => Alert.alert('Coming Soon', 'Offline content feature will be available soon!')}
            />
          </Card.Content>
        </Card>

        {/* Account Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Account
            </Text>
            
            <Button
              mode="outlined"
              icon="account-edit"
              onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available soon!')}
              style={styles.actionButton}
            >
              Edit Profile
            </Button>
            
            <Button
              mode="outlined"
              icon="help-circle"
              onPress={() => Alert.alert('Help & Support', 'Contact us at support@acfmastery.com')}
              style={styles.actionButton}
            >
              Help & Support
            </Button>
            
            <Button
              mode="outlined"
              icon="information"
              onPress={() => Alert.alert('About', 'ACF Mastery v1.0.0\nBuilt for advanced corporate finance learning')}
              style={styles.actionButton}
            >
              About
            </Button>
            
            <Button
              mode="contained"
              icon="logout"
              onPress={handleLogout}
              style={[styles.actionButton, styles.logoutButton]}
              buttonColor={theme.colors.error}
            >
              Logout
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileCard: {
    margin: 16,
    marginBottom: 12,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
    marginBottom: 16,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    color: theme.colors.onSurface,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  joinDate: {
    color: theme.colors.onSurfaceVariant,
  },
  statsCard: {
    margin: 16,
    marginTop: 4,
    marginBottom: 12,
  },
  sectionTitle: {
    color: theme.colors.onSurface,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    color: theme.colors.onSurface,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  achievementsCard: {
    margin: 16,
    marginTop: 4,
    marginBottom: 12,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  achievementTitle: {
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
  achievementDescription: {
    color: theme.colors.onSurfaceVariant,
  },
  settingsCard: {
    margin: 16,
    marginTop: 4,
    marginBottom: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  actionsCard: {
    margin: 16,
    marginTop: 4,
    marginBottom: 32,
  },
  actionButton: {
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 8,
  },
});