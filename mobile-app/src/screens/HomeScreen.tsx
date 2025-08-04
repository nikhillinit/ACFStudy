import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  ProgressBar,
  Badge,
  Avatar,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { commonStyles, theme } from '../theme/theme';

const { width } = Dimensions.get('window');

interface DashboardData {
  totalProblems: number;
  completedProblems: number;
  overallProgress: number;
  topicStats: Record<string, any>;
  recentActivity: any[];
  achievements: any[];
}

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();

  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboard().then(res => res.data),
  });

  const quickActions = [
    {
      title: 'Practice Problems',
      icon: 'school-outline',
      color: theme.colors.primary,
      onPress: () => navigation.navigate('Practice'),
    },
    {
      title: 'Video Lectures',
      icon: 'play-circle-outline',
      color: theme.colors.secondary,
      onPress: () => navigation.navigate('Learning'),
    },
    {
      title: 'AI Tutor',
      icon: 'chatbubble-outline',
      color: theme.colors.tertiary,
      onPress: () => {}, // TODO: Implement AI tutor
    },
    {
      title: 'Analytics',
      icon: 'bar-chart-outline',
      color: '#f59e0b',
      onPress: () => {}, // TODO: Implement analytics
    },
  ];

  const topicStats = dashboardData?.topicStats || {};
  const topics = [
    { name: 'Time Value of Money', icon: 'calculator-outline' },
    { name: 'Portfolio Theory', icon: 'pie-chart-outline' },
    { name: 'Bond Valuation', icon: 'business-outline' },
    { name: 'Financial Statements', icon: 'document-text-outline' },
    { name: 'Derivatives', icon: 'trending-up-outline' },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar.Text
              size={48}
              label={user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              style={{ backgroundColor: theme.colors.primary }}
            />
            <View style={styles.userText}>
              <Text variant="headlineSmall" style={styles.welcomeText}>
                Welcome back!
              </Text>
              <Text variant="bodyMedium" style={styles.userName}>
                {user?.firstName || user?.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Overview */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.progressCard}
        >
          <Text variant="headlineSmall" style={styles.progressTitle}>
            Your ACF Journey
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {Math.round(dashboardData?.overallProgress || 0)}%
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Overall Progress
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {dashboardData?.completedProblems || 0}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Problems Solved
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {Object.keys(topicStats).length}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Topics Started
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                7
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Day Streak
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <Card
                key={index}
                style={styles.quickActionCard}
                onPress={action.onPress}
              >
                <Card.Content style={styles.quickActionContent}>
                  <Ionicons
                    name={action.icon as any}
                    size={24}
                    color={action.color}
                  />
                  <Text variant="bodySmall" style={styles.quickActionText}>
                    {action.title}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>

        {/* Topic Progress */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Topic Progress
          </Text>
          {topics.map((topic, index) => {
            const stats = topicStats[topic.name] || { percentage: 0, completed: 0, total: 0 };
            return (
              <Card key={index} style={styles.topicCard}>
                <Card.Content>
                  <View style={styles.topicHeader}>
                    <View style={styles.topicInfo}>
                      <Ionicons
                        name={topic.icon as any}
                        size={20}
                        color={theme.colors.primary}
                      />
                      <Text variant="bodyLarge" style={styles.topicName}>
                        {topic.name}
                      </Text>
                    </View>
                    <Badge size={20}>
                      {Math.round(stats.percentage || 0)}%
                    </Badge>
                  </View>
                  <ProgressBar
                    progress={(stats.percentage || 0) / 100}
                    color={theme.colors.primary}
                    style={styles.progressBar}
                  />
                  <Text variant="bodySmall" style={styles.topicStats}>
                    {stats.completed || 0} of {stats.total || 0} problems completed
                  </Text>
                </Card.Content>
              </Card>
            );
          })}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Recent Activity
          </Text>
          <Card style={styles.activityCard}>
            <Card.Content>
              <View style={styles.activityItem}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.tertiary} />
                <Text variant="bodyMedium" style={styles.activityText}>
                  Completed "Present Value Basics" problem
                </Text>
                <Text variant="bodySmall" style={styles.activityTime}>
                  2h ago
                </Text>
              </View>
              <View style={styles.activityItem}>
                <Ionicons name="play-circle" size={20} color={theme.colors.secondary} />
                <Text variant="bodyMedium" style={styles.activityText}>
                  Watched "Introduction to Finance" video
                </Text>
                <Text variant="bodySmall" style={styles.activityTime}>
                  1d ago
                </Text>
              </View>
              <View style={styles.activityItem}>
                <Ionicons name="star" size={20} color="#f59e0b" />
                <Text variant="bodyMedium" style={styles.activityText}>
                  Earned "Problem Solver" achievement
                </Text>
                <Text variant="bodySmall" style={styles.activityTime}>
                  2d ago
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 16,
    paddingTop: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    marginLeft: 12,
    flex: 1,
  },
  welcomeText: {
    color: theme.colors.onBackground,
    fontWeight: '600',
  },
  userName: {
    color: theme.colors.onSurfaceVariant,
  },
  progressCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  progressTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    color: theme.colors.onBackground,
    fontWeight: '600',
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 48) / 2,
    marginBottom: 12,
  },
  quickActionContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  quickActionText: {
    marginTop: 8,
    textAlign: 'center',
    color: theme.colors.onSurface,
  },
  topicCard: {
    marginBottom: 8,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  topicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  topicName: {
    marginLeft: 8,
    color: theme.colors.onSurface,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  topicStats: {
    color: theme.colors.onSurfaceVariant,
  },
  activityCard: {
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  activityText: {
    flex: 1,
    marginLeft: 12,
    color: theme.colors.onSurface,
  },
  activityTime: {
    color: theme.colors.onSurfaceVariant,
  },
});