import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Circle, 
  Settings, 
  Lightbulb,
  BarChart3,
  ArrowRight,
  Star,
  Brain,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface LearningPathStep {
  id: string;
  topic: string;
  title: string;
  description: string;
  estimatedTime: number;
  difficulty: number;
  prerequisites: string[];
  concepts: string[];
  recommendedOrder: number;
  personalizedReason: string;
  aiGeneratedTips?: string;
  completed?: boolean;
}

interface LearningPath {
  id: string;
  userId: string;
  title: string;
  description: string;
  estimatedTotalTime: number;
  steps: LearningPathStep[];
  adaptiveRecommendations: string[];
  createdAt: string;
  lastUpdated: string;
}

interface UserPreferences {
  learningStyle: 'visual' | 'analytical' | 'practical' | 'mixed';
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  timeAvailable: number;
  goalDate?: string;
  preferredDifficulty: 1 | 2 | 3;
}

export function LearningPathDashboard() {
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    learningStyle: 'mixed',
    currentLevel: 'intermediate',
    timeAvailable: 30,
    preferredDifficulty: 2
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current learning path
  const { data: currentPath, isLoading: pathLoading } = useQuery<{success: boolean, learningPath: LearningPath}>({
    queryKey: ['/api/learning-path/current'],
    retry: false,
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    }
  });

  // Generate new learning path
  const generatePathMutation = useMutation({
    mutationFn: async (prefs: Partial<UserPreferences>) => {
      return await apiRequest('/api/learning-path/generate', {
        method: 'POST',
        body: JSON.stringify({ preferences: prefs }),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/learning-path/current']);
      toast({
        title: "Learning Path Generated",
        description: "Your personalized learning path has been created!",
      });
      setShowPreferences(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate learning path",
        variant: "destructive"
      });
    }
  });

  // Complete learning step
  const completeStepMutation = useMutation({
    mutationFn: async (stepId: string) => {
      return await apiRequest(`/api/learning-path/step/${stepId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ completed: true }),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/learning-path/current']);
      toast({
        title: "Step Completed",
        description: "Great progress! Your learning path has been updated.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Update Failed",
        description: "Failed to update step progress",
        variant: "destructive"
      });
    }
  });

  const generatePath = () => {
    generatePathMutation.mutate(preferences);
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "bg-green-100 text-green-800";
      case 2: return "bg-yellow-100 text-yellow-800";
      case 3: return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "Beginner";
      case 2: return "Intermediate";
      case 3: return "Advanced";
      default: return "Unknown";
    }
  };

  if (pathLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your learning path...</p>
        </div>
      </div>
    );
  }

  const learningPath = currentPath?.learningPath;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Target className="h-8 w-8 text-blue-600" />
            Personalized Learning Path
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered, adaptive study plan tailored to your learning style
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowPreferences(true)}
          data-testid="button-customize-path"
        >
          <Settings className="h-4 w-4 mr-2" />
          Customize Path
        </Button>
      </div>

      {/* Learning Path Content */}
      {!learningPath ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-600" />
              Create Your Personalized Learning Path
            </CardTitle>
            <CardDescription>
              Get a customized study plan based on your learning style, current level, and goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4">
                  <Brain className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">AI-Powered</h3>
                  <p className="text-sm text-muted-foreground">Intelligent recommendations based on your performance</p>
                </div>
                <div className="text-center p-4">
                  <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Adaptive</h3>
                  <p className="text-sm text-muted-foreground">Path adjusts based on your progress and strengths</p>
                </div>
                <div className="text-center p-4">
                  <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Goal-Oriented</h3>
                  <p className="text-sm text-muted-foreground">Focused on your specific learning objectives</p>
                </div>
              </div>
              <Button 
                onClick={() => setShowPreferences(true)}
                size="lg"
                data-testid="button-create-path"
              >
                <Target className="h-4 w-4 mr-2" />
                Create My Learning Path
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="steps">Learning Steps</TabsTrigger>
            <TabsTrigger value="recommendations">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Path Overview */}
            <Card>
              <CardHeader>
                <CardTitle>{learningPath.title}</CardTitle>
                <CardDescription>{learningPath.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{learningPath.estimatedTotalTime}</div>
                    <div className="text-sm text-muted-foreground">Total Minutes</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <BookOpen className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{learningPath.steps.length}</div>
                    <div className="text-sm text-muted-foreground">Learning Steps</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round((learningPath.steps.filter(s => s.completed).length / learningPath.steps.length) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {learningPath.steps.filter(s => s.completed).length} of {learningPath.steps.length} steps
                    </span>
                  </div>
                  <Progress 
                    value={(learningPath.steps.filter(s => s.completed).length / learningPath.steps.length) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="steps" className="space-y-4">
            {learningPath.steps.map((step, index) => (
              <Card key={step.id} className={`transition-all ${step.completed ? 'bg-green-50 border-green-200' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {step.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{step.title}</h3>
                          <p className="text-muted-foreground">{step.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getDifficultyColor(step.difficulty)}>
                            {getDifficultyLabel(step.difficulty)}
                          </Badge>
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {step.estimatedTime}m
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">Why this step:</span>
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">{step.personalizedReason}</p>
                      </div>

                      {step.concepts.length > 0 && (
                        <div>
                          <span className="text-sm font-medium">Key Concepts:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {step.concepts.map((concept, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {concept}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-2">
                        {!step.completed && (
                          <Button
                            onClick={() => completeStepMutation.mutate(step.id)}
                            disabled={completeStepMutation.isPending}
                            data-testid={`button-complete-step-${step.id}`}
                          >
                            Mark Complete
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Start Learning
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  AI-Powered Recommendations
                </CardTitle>
                <CardDescription>
                  Personalized insights to optimize your learning experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningPath.adaptiveRecommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Customize Your Learning Path</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPreferences(false)}
                  data-testid="button-close-preferences"
                >
                  ×
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Learning Style</label>
                  <Select 
                    value={preferences.learningStyle} 
                    onValueChange={(value: any) => setPreferences({...preferences, learningStyle: value})}
                  >
                    <SelectTrigger data-testid="select-learning-style">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visual">Visual - I learn best with diagrams and visual aids</SelectItem>
                      <SelectItem value="analytical">Analytical - I prefer step-by-step logical explanations</SelectItem>
                      <SelectItem value="practical">Practical - I learn by doing and applying concepts</SelectItem>
                      <SelectItem value="mixed">Mixed - I benefit from various learning approaches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Current Level</label>
                  <Select 
                    value={preferences.currentLevel} 
                    onValueChange={(value: any) => setPreferences({...preferences, currentLevel: value})}
                  >
                    <SelectTrigger data-testid="select-current-level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner - New to corporate finance</SelectItem>
                      <SelectItem value="intermediate">Intermediate - Some finance background</SelectItem>
                      <SelectItem value="advanced">Advanced - Strong finance foundation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Study Time Available: {preferences.timeAvailable} minutes per session
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="90"
                    step="5"
                    value={preferences.timeAvailable}
                    onChange={(e) => setPreferences({...preferences, timeAvailable: parseInt(e.target.value)})}
                    className="w-full"
                    data-testid="slider-time-available"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>15 min</span>
                    <span>45 min</span>
                    <span>90 min</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Preferred Difficulty</label>
                  <Select 
                    value={preferences.preferredDifficulty.toString()} 
                    onValueChange={(value: any) => setPreferences({...preferences, preferredDifficulty: parseInt(value)})}
                  >
                    <SelectTrigger data-testid="select-preferred-difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Focus on fundamentals</SelectItem>
                      <SelectItem value="2">2 - Balanced approach</SelectItem>
                      <SelectItem value="3">3 - Challenge me with advanced concepts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={generatePath}
                    disabled={generatePathMutation.isPending}
                    className="flex-1"
                    data-testid="button-generate-path"
                  >
                    {generatePathMutation.isPending ? "Generating..." : "Generate Learning Path"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPreferences(false)}
                    data-testid="button-cancel-preferences"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}