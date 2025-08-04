import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { 
  Play, 
  BookOpen, 
  Clock, 
  Trophy, 
  Target,
  CheckCircle,
  Star,
  Youtube,
  FileText,
  Video,
  Headphones,
  Download,
  ChevronRight,
  Users,
  TrendingUp
} from 'lucide-react';

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

interface LearningModule {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: number;
  learningObjectives: string[];
}

interface UserProgress {
  [lectureId: string]: {
    progress: number;
    completed: boolean;
    watchTime: number;
  };
}

export default function Learning() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [activePlaylist, setActivePlaylist] = useState<string>('acf-exam-prep');
  const [showPlayer, setShowPlayer] = useState(false);

  // Fetch video library
  const { data: videoLibrary, isLoading: loadingVideos } = useQuery<VideoLibrary>({
    queryKey: ['/api/learning/videos'],
    enabled: isAuthenticated
  });

  // Fetch user progress
  const { data: userProgress } = useQuery<UserProgress>({
    queryKey: ['/api/learning/progress', user?.id],
    enabled: isAuthenticated && !!user?.id
  });

  // Fetch interactive content
  const { data: tvmContent } = useQuery<LearningModule>({
    queryKey: ['/api/learning/content/time-value-money'],
    enabled: isAuthenticated
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (data: { lectureId: string; progress: number; completed: boolean }) => {
      return apiRequest('/api/learning/progress', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/learning/progress'] });
      toast({
        title: "Progress Updated",
        description: "Your learning progress has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleLectureSelect = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setShowPlayer(true);
    
    // Simulate progress update
    setTimeout(() => {
      updateProgressMutation.mutate({
        lectureId: lecture.id,
        progress: 0.1,
        completed: false
      });
    }, 5000);
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 0: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 1: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 2: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 3: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
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

  const calculatePlaylistProgress = (playlistId: string) => {
    if (!videoLibrary || !userProgress) return 0;
    
    const playlist = videoLibrary.playlists[playlistId];
    if (!playlist) return 0;
    
    const totalLectures = playlist.lectures.length;
    const completedLectures = playlist.lectures.filter(lectureId => 
      userProgress[lectureId]?.progress >= 0.8
    ).length;
    
    return totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
  };

  if (loadingVideos) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading learning modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8" data-testid="learning-page">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="page-title">Learning Modules</h1>
        <p className="text-muted-foreground mb-4" data-testid="page-description">
          Master finance concepts with MIT's world-class video lectures and interactive learning modules
        </p>
        
        {videoLibrary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Video className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{videoLibrary.library.lectures.length}</p>
                    <p className="text-xs text-muted-foreground">MIT Lectures</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{videoLibrary.library.totalDuration}</p>
                    <p className="text-xs text-muted-foreground">Total Content</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">{calculatePlaylistProgress(activePlaylist)}%</p>
                    <p className="text-xs text-muted-foreground">Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">MIT</p>
                    <p className="text-xs text-muted-foreground">Institution</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Tabs value={activePlaylist} onValueChange={setActivePlaylist} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="acf-exam-prep" data-testid="tab-acf-prep">ACF Exam Prep</TabsTrigger>
          <TabsTrigger value="time-value-money" data-testid="tab-tvm">Time Value</TabsTrigger>
          <TabsTrigger value="portfolio-management" data-testid="tab-portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="derivatives-fundamentals" data-testid="tab-derivatives">Derivatives</TabsTrigger>
        </TabsList>

        {videoLibrary && Object.entries(videoLibrary.playlists).map(([playlistId, playlist]) => (
          <TabsContent key={playlistId} value={playlistId} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>{playlist.title}</span>
                    </CardTitle>
                    <CardDescription>{playlist.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{playlist.duration}</p>
                    <Progress value={calculatePlaylistProgress(playlistId)} className="w-24 h-2 mt-1" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid gap-4">
                  {playlist.lectures.map((lectureId, index) => {
                    const lecture = videoLibrary.library.lectures.find(l => l.id === lectureId);
                    if (!lecture) return null;
                    
                    const progress = userProgress?.[lectureId];
                    const isCompleted = progress?.progress >= 0.8;
                    const watchedPercent = progress ? Math.round(progress.progress * 100) : 0;
                    
                    return (
                      <Card key={lectureId} className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedLecture?.id === lectureId ? 'ring-2 ring-primary' : ''
                      }`} onClick={() => handleLectureSelect(lecture)}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <div className="relative flex-shrink-0">
                              <img 
                                src={lecture.thumbnailUrl} 
                                alt={lecture.title}
                                className="w-20 h-15 object-cover rounded"
                                data-testid={`thumbnail-${lectureId}`}
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                                <Play className="h-6 w-6 text-white" />
                              </div>
                              <Badge className="absolute bottom-1 right-1 text-xs" variant="secondary">
                                {lecture.duration}
                              </Badge>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium text-sm leading-tight mb-2" data-testid={`title-${lectureId}`}>
                                    {index + 1}. {lecture.title}
                                  </h4>
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {lecture.acfTopics.slice(0, 2).map(topic => (
                                      <Badge key={topic} variant="outline" className="text-xs">
                                        {topic}
                                      </Badge>
                                    ))}
                                    <Badge className={`text-xs ${getDifficultyColor(lecture.difficulty)}`}>
                                      {getDifficultyText(lecture.difficulty)}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  {isCompleted && (
                                    <CheckCircle className="h-4 w-4 text-green-600" data-testid={`completed-${lectureId}`} />
                                  )}
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                              </div>
                              
                              {progress && (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                    <span>{watchedPercent}% watched</span>
                                    {progress.watchTime > 0 && (
                                      <span>{Math.round(progress.watchTime / 60)} min watched</span>
                                    )}
                                  </div>
                                  <Progress value={watchedPercent} className="h-1" />
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Video Player Modal */}
      {showPlayer && selectedLecture && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" data-testid="video-modal">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-2" data-testid="video-title">{selectedLecture.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{selectedLecture.duration}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>{getDifficultyText(selectedLecture.difficulty)}</span>
                    </span>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setShowPlayer(false)} data-testid="close-video">
                  ×
                </Button>
              </div>
              
              <div className="aspect-video mb-4">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedLecture.youtube}?autoplay=1`}
                  title={selectedLecture.title}
                  className="w-full h-full rounded"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  data-testid="video-iframe"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Topics Covered</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedLecture.topics.map(topic => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Resources</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedLecture.transcriptUrl && (
                        <Button variant="outline" size="sm" className="w-full justify-start" data-testid="download-transcript">
                          <FileText className="h-4 w-4 mr-2" />
                          Download Transcript
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Youtube className="h-4 w-4 mr-2" />
                        Watch on YouTube
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Content Section */}
      {tvmContent && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Interactive Learning Modules</span>
            </CardTitle>
            <CardDescription>
              Hands-on exercises and guided tutorials for deeper understanding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Card className="cursor-pointer hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium mb-1">{tvmContent.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{tvmContent.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{tvmContent.estimatedTime}</span>
                      </span>
                      <Badge className={`text-xs ${getDifficultyColor(tvmContent.difficulty)}`}>
                        {getDifficultyText(tvmContent.difficulty)}
                      </Badge>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  );
}