import React, { useState } from 'react';
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
  Chip,
  Searchbar,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { commonStyles, theme } from '../theme/theme';

const { width } = Dimensions.get('window');

interface Module {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  estimatedTime: string;
}

interface Problem {
  id: string;
  title: string;
  topic: string;
  difficulty: number;
  type: string;
  timeLimit: number;
}

interface UserProgress {
  problemId: string;
  score: number;
  completed: boolean;
  attempts: number;
}

export default function PracticeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch data
  const { data: modules = [], isLoading: loadingModules } = useQuery<Module[]>({
    queryKey: ['modules'],
    queryFn: () => api.getModules().then(res => res.data),
  });

  const { data: problems = [], isLoading: loadingProblems } = useQuery<Problem[]>({
    queryKey: ['problems'],
    queryFn: () => api.getProblems().then(res => res.data),
  });

  const { data: userProgress = [] } = useQuery<UserProgress[]>({
    queryKey: ['userProgress', user?.id],
    queryFn: () => api.getDashboard().then(res => res.data.progress || []),
    enabled: !!user?.id,
  });

  const categories = ['all', ...new Set(modules.map(m => m.category))];
  
  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getModuleProgress = (moduleId: string) => {
    const moduleProblems = problems.filter(p => p.topic === modules.find(m => m.id === moduleId)?.title);
    const completedProblems = userProgress.filter(p => 
      moduleProblems.some(mp => mp.id === p.problemId) && p.completed
    );
    
    if (moduleProblems.length === 0) return 0;
    return Math.round((completedProblems.length / moduleProblems.length) * 100);
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return theme.colors.tertiary;
      case 2: return theme.colors.primary;
      case 3: return '#f59e0b';
      default: return theme.colors.onSurfaceVariant;
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      default: return 'Unknown';
    }
  };

  const getTopicIcon = (topic: string) => {
    switch (topic) {
      case 'Time Value of Money': return 'calculator-outline';
      case 'Portfolio Theory': return 'pie-chart-outline';
      case 'Bond Valuation': return 'business-outline';
      case 'Financial Statements': return 'document-text-outline';
      case 'Derivatives': return 'trending-up-outline';
      default: return 'book-outline';
    }
  };

  if (loadingModules || loadingProblems) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text>Loading practice modules...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Practice Problems
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Master ACF concepts with our comprehensive problem sets
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search modules..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
        </View>

        {/* Category Filter */}
        <View style={styles.filterContainer}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Categories
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipContainer}>
              {categories.map(category => (
                <Chip
                  key={category}
                  mode={selectedCategory === category ? 'flat' : 'outlined'}
                  selected={selectedCategory === category}
                  onPress={() => setSelectedCategory(category)}
                  style={styles.chip}
                >
                  {category === 'all' ? 'All Categories' : category}
                </Chip>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Practice Statistics */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.statsTitle}>
              Your Progress
            </Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={styles.statNumber}>
                  {userProgress.filter(p => p.completed).length}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Problems Solved
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={styles.statNumber}>
                  {Math.round(userProgress.reduce((sum, p) => sum + p.score, 0) / Math.max(userProgress.length, 1))}%
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Average Score
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={styles.statNumber}>
                  {modules.filter(m => getModuleProgress(m.id) > 0).length}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Modules Started
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Modules Grid */}
        <View style={styles.modulesContainer}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Practice Modules
          </Text>
          
          {filteredModules.map(module => {
            const moduleProblems = problems.filter(p => p.topic === module.title);
            const progress = getModuleProgress(module.id);
            const completedProblems = userProgress.filter(p => 
              moduleProblems.some(mp => mp.id === p.problemId) && p.completed
            ).length;

            return (
              <Card
                key={module.id}
                style={styles.moduleCard}
                onPress={() => navigation.navigate('Quiz', { module, problems: moduleProblems })}
              >
                <Card.Content>
                  <View style={styles.moduleHeader}>
                    <View style={styles.moduleIcon}>
                      <Ionicons
                        name={getTopicIcon(module.title) as any}
                        size={24}
                        color={theme.colors.primary}
                      />
                    </View>
                    <View style={styles.moduleInfo}>
                      <Text variant="titleMedium" style={styles.moduleTitle}>
                        {module.title}
                      </Text>
                      <Text variant="bodyMedium" style={styles.moduleDescription} numberOfLines={2}>
                        {module.description}
                      </Text>
                    </View>
                    <Badge
                      style={[
                        styles.difficultyBadge,
                        { backgroundColor: getDifficultyColor(module.difficulty) }
                      ]}
                    >
                      {getDifficultyText(module.difficulty)}
                    </Badge>
                  </View>

                  <View style={styles.moduleStats}>
                    <View style={styles.statRow}>
                      <Text variant="bodySmall" style={styles.statText}>
                        Progress: {progress}%
                      </Text>
                      <Text variant="bodySmall" style={styles.statText}>
                        {completedProblems}/{moduleProblems.length} problems
                      </Text>
                    </View>
                    <ProgressBar
                      progress={progress / 100}
                      color={theme.colors.primary}
                      style={styles.progressBar}
                    />
                  </View>

                  <View style={styles.moduleFooter}>
                    <View style={styles.moduleDetails}>
                      <Chip mode="outlined" compact style={styles.categoryChip}>
                        {module.category}
                      </Chip>
                      <View style={styles.timeInfo}>
                        <Ionicons name="time-outline" size={14} color={theme.colors.onSurfaceVariant} />
                        <Text variant="bodySmall" style={styles.timeText}>
                          {module.estimatedTime}
                        </Text>
                      </View>
                    </View>
                    <Button
                      mode="contained"
                      compact
                      onPress={() => navigation.navigate('Quiz', { module, problems: moduleProblems })}
                    >
                      {progress > 0 ? 'Continue' : 'Start'}
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            );
          })}
        </View>

        {filteredModules.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodyLarge" style={styles.emptyText}>
              No modules found
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Try adjusting your search or selecting a different category
            </Text>
          </View>
        )}
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
    paddingBottom: 8,
  },
  title: {
    color: theme.colors.onBackground,
    fontWeight: 'bold',
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchbar: {
    elevation: 2,
  },
  filterContainer: {
    paddingBottom: 16,
  },
  sectionTitle: {
    color: theme.colors.onBackground,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  chip: {
    marginRight: 8,
  },
  statsCard: {
    margin: 16,
    marginTop: 0,
  },
  statsTitle: {
    color: theme.colors.onSurface,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  statLabel: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  modulesContainer: {
    paddingHorizontal: 16,
  },
  moduleCard: {
    marginBottom: 12,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  moduleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
  moduleDescription: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
  },
  moduleStats: {
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statText: {
    color: theme.colors.onSurfaceVariant,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  moduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryChip: {
    marginRight: 8,
    height: 24,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 4,
    color: theme.colors.onSurfaceVariant,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});