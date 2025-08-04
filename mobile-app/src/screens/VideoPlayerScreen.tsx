import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  IconButton,
  Chip,
  ProgressBar,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

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

export default function VideoPlayerScreen({ route, navigation }: any) {
  const { lecture, playlist }: { lecture: Lecture; playlist: Playlist } = route.params;
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [status, setStatus] = useState<any>({});
  const [showControls, setShowControls] = useState(true);
  const [watchTime, setWatchTime] = useState(0);
  const video = useRef<Video>(null);

  const updateProgressMutation = useMutation({
    mutationFn: (data: { lectureId: string; progress: number; completed: boolean }) =>
      api.updateProgress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningProgress'] });
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (status.isLoaded && status.positionMillis) {
        const currentWatchTime = Math.floor(status.positionMillis / 1000);
        setWatchTime(currentWatchTime);
        
        // Update progress every 30 seconds
        if (currentWatchTime > 0 && currentWatchTime % 30 === 0) {
          const progress = status.positionMillis / status.durationMillis;
          const completed = progress >= 0.8;
          
          updateProgressMutation.mutate({
            lectureId: lecture.id,
            progress,
            completed,
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status, lecture.id]);

  const handlePlaybackStatusUpdate = (status: any) => {
    setStatus(status);
  };

  const togglePlayback = () => {
    if (status.isLoaded) {
      if (status.isPlaying) {
        video.current?.pauseAsync();
      } else {
        video.current?.playAsync();
      }
    }
  };

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = status.isLoaded 
    ? (status.positionMillis / status.durationMillis) || 0 
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          ref={video}
          style={styles.video}
          source={{ uri: `https://www.youtube.com/watch?v=${lecture.youtube}` }}
          useNativeControls={false}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          shouldPlay={false}
        />
        
        {/* Custom Controls Overlay */}
        {showControls && (
          <View style={styles.controlsOverlay}>
            <IconButton
              icon="arrow-left"
              iconColor="white"
              size={24}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            />
            
            <View style={styles.centerControls}>
              <IconButton
                icon={status.isPlaying ? 'pause' : 'play'}
                iconColor="white"
                size={48}
                onPress={togglePlayback}
              />
            </View>
            
            <View style={styles.bottomControls}>
              <ProgressBar
                progress={progress}
                color="white"
                style={styles.progressBar}
              />
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>
                  {formatTime(Math.floor((status.positionMillis || 0) / 1000))} / {lecture.duration}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Lecture Info */}
      <View style={styles.infoContainer}>
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.lectureTitle}>
              {lecture.title}
            </Text>
            
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
                <Text variant="bodySmall" style={styles.metaText}>
                  {lecture.duration}
                </Text>
              </View>
              <Chip
                mode="flat"
                style={[
                  styles.difficultyChip,
                  { backgroundColor: getDifficultyColor(lecture.difficulty) }
                ]}
                textStyle={{ color: 'white' }}
              >
                {getDifficultyText(lecture.difficulty)}
              </Chip>
            </View>

            <Text variant="bodyMedium" style={styles.playlistTitle}>
              From: {playlist.title}
            </Text>
          </Card.Content>
        </Card>

        {/* Topics */}
        <Card style={styles.topicsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Topics Covered
            </Text>
            <View style={styles.topicsContainer}>
              {lecture.topics.map(topic => (
                <Chip key={topic} mode="outlined" style={styles.topicChip}>
                  {topic}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* ACF Topics */}
        <Card style={styles.topicsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              ACF Exam Topics
            </Text>
            <View style={styles.topicsContainer}>
              {lecture.acfTopics.map(topic => (
                <Chip key={topic} mode="flat" style={styles.acfTopicChip}>
                  {topic}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Resources
            </Text>
            <View style={styles.actionsContainer}>
              {lecture.transcriptUrl && (
                <Button
                  mode="outlined"
                  icon="download"
                  onPress={() => Alert.alert('Download', 'Transcript download coming soon!')}
                  style={styles.actionButton}
                >
                  Download Transcript
                </Button>
              )}
              <Button
                mode="outlined"
                icon="youtube"
                onPress={() => Alert.alert('YouTube', 'Opening in YouTube app...')}
                style={styles.actionButton}
              >
                Watch on YouTube
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  videoContainer: {
    height: height * 0.3,
    backgroundColor: 'black',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  centerControls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  timeContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
  },
  infoContainer: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    marginBottom: 12,
  },
  lectureTitle: {
    color: theme.colors.onSurface,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: 4,
    color: theme.colors.onSurfaceVariant,
  },
  difficultyChip: {
    alignSelf: 'flex-start',
  },
  playlistTitle: {
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  topicsCard: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: theme.colors.onSurface,
    fontWeight: '600',
    marginBottom: 8,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topicChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  acfTopicChip: {
    marginRight: 8,
    marginBottom: 4,
    backgroundColor: theme.colors.primaryContainer,
  },
  actionsCard: {
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionButton: {
    marginRight: 8,
    marginBottom: 8,
    flex: 1,
    minWidth: 150,
  },
});