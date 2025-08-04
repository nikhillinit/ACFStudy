import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import {
  Card,
  Text,
  Chip,
  ProgressBar,
  Badge,
  Searchbar,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { commonStyles, theme } from '../theme/theme';

const { width } = Dimensions.get('window');

interface VideoLibrary {
  library: {
    title: string;
    institution: string;
    instructor: string;
    description: string;
    totalDuration: string;
    lectures: Lecture[];
  };
  playlists: Record<string, Playlist>;
}

interface Lecture {
  id: string;
  title: string;
  duration: string;
  topics: string[];
  acfTopics: string[];
  difficulty: number;
  youtube: string;
  thumbnailUrl: string;
  transcriptUrl?: string;
}

interface Playlist {
  title: string;
  description: string;
  duration: string;
  lectures: string[];
}

interface UserProgress {
  [lectureId: string]: {
    progress: number;
    completed: boolean;
    watchTime: number;
  };
}

export default function LearningScreen({ navigation }: any) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState('acf-exam-prep');

  // Fetch video library
  const { data: videoLibrary, isLoading } = useQuery<VideoLibrary>({
    queryKey: ['videoLibrary'],
    queryFn: () => api.getVideoLibrary().then(res => res.data),
  });

  // Fetch user progress
  const { data: userProgress } = useQuery<UserProgress>({
    queryKey: ['learningProgress', user?.id],
    queryFn: () => api.getUserProgress(user!.id).then(res => res.data),
    enabled: !!user?.id,
  });

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 0: return theme.colors.tertiary;
      case 1: return theme.colors.primary;
      case 2: return '#f59e0b';
      case 3: return theme.colors.error;
      default: return theme.colors.onSurfaceVariant;
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 0: return 'Beginner';
      case 1: return 'Intermediate';
      case 2: return 'Advanced';
      case 3: return 'Expert';
      default: return 'Unknown';
    }
  };

  const formatDuration = (duration: string) => {
    return duration.replace('PT', '').replace('M', 'min').replace('S', 's');
  };

  const playlists = videoLibrary?.playlists || {};
  const playlistOptions = Object.entries(playlists).map(([id, playlist]) => ({
    id,
    title: playlist.title,
  }));

  const currentPlaylist = playlists[selectedPlaylist];
  const filteredLectures = currentPlaylist
    ? currentPlaylist.lectures
        .map(lectureId => videoLibrary?.library.lectures.find(l => l.id === lectureId))
        .filter(lecture => 
          lecture && 
          lecture.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : [];

  if (isLoading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text>Loading video library...</Text>
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
            Video Lectures
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {videoLibrary?.library.institution} - {videoLibrary?.library.totalDuration}
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search lectures..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
        </View>

        {/* Playlist Selector */}
        <View style={styles.playlistContainer}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Learning Paths
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipContainer}>
              {playlistOptions.map(playlist => (
                <Chip
                  key={playlist.id}
                  mode={selectedPlaylist === playlist.id ? 'flat' : 'outlined'}
                  selected={selectedPlaylist === playlist.id}
                  onPress={() => setSelectedPlaylist(playlist.id)}
                  style={styles.chip}
                >
                  {playlist.title}
                </Chip>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Current Playlist Info */}
        {currentPlaylist && (
          <Card style={styles.playlistCard}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.playlistTitle}>
                {currentPlaylist.title}
              </Text>
              <Text variant="bodyMedium" style={styles.playlistDescription}>
                {currentPlaylist.description}
              </Text>
              <View style={styles.playlistMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
                  <Text variant="bodySmall" style={styles.metaText}>
                    {currentPlaylist.duration}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="play-outline" size={16} color={theme.colors.primary} />
                  <Text variant="bodySmall" style={styles.metaText}>
                    {currentPlaylist.lectures.length} lectures
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Lectures List */}
        <View style={styles.lecturesContainer}>
          {filteredLectures.map((lecture, index) => {
            if (!lecture) return null;
            
            const progress = userProgress?.[lecture.id];
            const isCompleted = progress?.progress >= 0.8;
            const watchedPercent = progress ? Math.round(progress.progress * 100) : 0;

            return (
              <Card
                key={lecture.id}
                style={styles.lectureCard}
                onPress={() => navigation.navigate('VideoPlayer', { lecture, playlist: currentPlaylist })}
              >
                <View style={styles.lectureContent}>
                  <View style={styles.thumbnailContainer}>
                    <Image
                      source={{ uri: lecture.thumbnailUrl }}
                      style={styles.thumbnail}
                      resizeMode="cover"
                    />
                    <View style={styles.thumbnailOverlay}>
                      <Ionicons name="play" size={20} color="white" />
                    </View>
                    <Badge style={styles.durationBadge} size={16}>
                      {formatDuration(lecture.duration)}
                    </Badge>
                    {isCompleted && (
                      <View style={styles.completedBadge}>
                        <Ionicons name="checkmark-circle" size={20} color={theme.colors.tertiary} />
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.lectureInfo}>
                    <View style={styles.lectureHeader}>
                      <Text variant="bodyLarge" style={styles.lectureTitle} numberOfLines={2}>
                        {index + 1}. {lecture.title}
                      </Text>
                      <Badge
                        style={[
                          styles.difficultyBadge,
                          { backgroundColor: getDifficultyColor(lecture.difficulty) }
                        ]}
                      >
                        {getDifficultyText(lecture.difficulty)}
                      </Badge>
                    </View>
                    
                    <View style={styles.topicsContainer}>
                      {lecture.acfTopics.slice(0, 2).map(topic => (
                        <Chip key={topic} mode="outlined" compact style={styles.topicChip}>
                          {topic}
                        </Chip>
                      ))}
                    </View>
                    
                    {progress && (
                      <View style={styles.progressContainer}>
                        <View style={styles.progressInfo}>
                          <Text variant="bodySmall" style={styles.progressText}>
                            {watchedPercent}% watched
                          </Text>
                          {progress.watchTime > 0 && (
                            <Text variant="bodySmall" style={styles.progressText}>
                              {Math.round(progress.watchTime / 60)} min
                            </Text>
                          )}
                        </View>
                        <ProgressBar
                          progress={progress.progress}
                          color={theme.colors.primary}
                          style={styles.progressBar}
                        />
                      </View>
                    )}
                  </View>
                </View>
              </Card>
            );
          })}
        </View>

        {filteredLectures.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodyLarge" style={styles.emptyText}>
              No lectures found
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Try adjusting your search or selecting a different learning path
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
  playlistContainer: {
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
  playlistCard: {
    margin: 16,
    marginTop: 0,
  },
  playlistTitle: {
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
  playlistDescription: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  playlistMeta: {
    flexDirection: 'row',
    marginTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    marginLeft: 4,
    color: theme.colors.onSurfaceVariant,
  },
  lecturesContainer: {
    paddingHorizontal: 16,
  },
  lectureCard: {
    marginBottom: 12,
  },
  lectureContent: {
    flexDirection: 'row',
    padding: 12,
  },
  thumbnailContainer: {
    position: 'relative',
    marginRight: 12,
  },
  thumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
  },
  thumbnailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  completedBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
  },
  lectureInfo: {
    flex: 1,
  },
  lectureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  lectureTitle: {
    flex: 1,
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  difficultyBadge: {
    marginLeft: 8,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  topicChip: {
    marginRight: 4,
    marginBottom: 4,
    height: 24,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressText: {
    color: theme.colors.onSurfaceVariant,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
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