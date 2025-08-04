import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Heart, 
  Trophy, 
  Target, 
  BookOpen, 
  Coffee,
  Star,
  ThumbsUp,
  Zap,
  Brain,
  MessageCircle,
  X,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle,
  Settings
} from 'lucide-react';
import { CompanionSettings } from '@/components/companion-settings';

interface StudyCompanionProps {
  userProgress: {
    completedProblems: number;
    totalProblems: number;
    currentStreak: number;
    averageAccuracy: number;
    recentActivity: any[];
    lastStudySession?: Date;
  };
  currentContext?: {
    page: string;
    topic?: string;
    difficulty?: string;
    timeSpent?: number;
  };
  onDismiss?: () => void;
  onInteraction?: (type: string, data: any) => void;
}

interface CompanionMessage {
  id: string;
  type: 'motivation' | 'celebration' | 'tip' | 'reminder' | 'encouragement';
  title: string;
  message: string;
  icon: React.ReactNode;
  color: string;
  action?: {
    label: string;
    callback: () => void;
  };
  priority: number;
}

export function AIStudyCompanion({ 
  userProgress, 
  currentContext, 
  onDismiss, 
  onInteraction 
}: StudyCompanionProps) {
  const [currentMessage, setCurrentMessage] = useState<CompanionMessage | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [companionMood, setCompanionMood] = useState<'excited' | 'encouraging' | 'proud' | 'focused'>('encouraging');
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    generatePersonalizedMessage();
    updateCompanionMood();
  }, [userProgress, currentContext]);

  const updateCompanionMood = () => {
    const { averageAccuracy, currentStreak, completedProblems } = userProgress;
    
    if (currentStreak >= 7) {
      setCompanionMood('excited');
    } else if (averageAccuracy >= 80) {
      setCompanionMood('proud');
    } else if (completedProblems === 0) {
      setCompanionMood('encouraging');
    } else {
      setCompanionMood('focused');
    }
  };

  const generatePersonalizedMessage = () => {
    const messages: CompanionMessage[] = [];
    const { completedProblems, totalProblems, currentStreak, averageAccuracy, lastStudySession } = userProgress;
    const progressPercent = totalProblems > 0 ? (completedProblems / totalProblems) * 100 : 0;

    // Welcome back messages
    if (lastStudySession && isYesterday(lastStudySession)) {
      messages.push({
        id: 'welcome-back',
        type: 'motivation',
        title: 'Welcome back!',
        message: "Great to see you continuing your ACF journey. Let's build on yesterday's progress!",
        icon: <Heart className="w-5 h-5" />,
        color: 'text-pink-600',
        priority: 8
      });
    }

    // Streak celebrations
    if (currentStreak === 3) {
      messages.push({
        id: 'streak-3',
        type: 'celebration',
        title: 'Three-day streak!',
        message: "You're building excellent study habits. Consistency is key to mastering finance!",
        icon: <Trophy className="w-5 h-5" />,
        color: 'text-yellow-600',
        priority: 9
      });
    } else if (currentStreak >= 7) {
      messages.push({
        id: 'streak-week',
        type: 'celebration',
        title: 'One week streak! 🔥',
        message: "Incredible dedication! You're truly committed to ACF mastery. Keep this momentum going!",
        icon: <Star className="w-5 h-5" />,
        color: 'text-purple-600',
        priority: 10
      });
    }

    // Progress milestones
    if (progressPercent >= 25 && progressPercent < 30) {
      messages.push({
        id: 'quarter-progress',
        type: 'celebration',
        title: '25% Complete!',
        message: "You've made solid progress! The foundation you're building will serve you well.",
        icon: <Target className="w-5 h-5" />,
        color: 'text-blue-600',
        priority: 7
      });
    } else if (progressPercent >= 50 && progressPercent < 55) {
      messages.push({
        id: 'half-progress',
        type: 'celebration',
        title: 'Halfway there!',
        message: "Amazing! You're halfway through your ACF journey. Your persistence is paying off!",
        icon: <TrendingUp className="w-5 h-5" />,
        color: 'text-green-600',
        priority: 8
      });
    }

    // Accuracy-based encouragement
    if (averageAccuracy >= 90) {
      messages.push({
        id: 'high-accuracy',
        type: 'celebration',
        title: 'Precision Expert!',
        message: "Your accuracy is outstanding! You're demonstrating true mastery of these concepts.",
        icon: <Star className="w-5 h-5" />,
        color: 'text-gold-600',
        priority: 9
      });
    } else if (averageAccuracy >= 70 && averageAccuracy < 80) {
      messages.push({
        id: 'improving-accuracy',
        type: 'encouragement',
        title: 'Steady improvement!',
        message: "Your accuracy is getting better with each session. Focus on understanding concepts deeply.",
        icon: <ThumbsUp className="w-5 h-5" />,
        color: 'text-blue-600',
        priority: 6
      });
    }

    // Context-based tips
    if (currentContext?.page === 'practice' && currentContext?.topic) {
      const topicTips = getTopicSpecificTips(currentContext.topic);
      if (topicTips) {
        messages.push({
          id: 'topic-tip',
          type: 'tip',
          title: `${currentContext.topic} Tip`,
          message: topicTips.message,
          icon: <Brain className="w-5 h-5" />,
          color: 'text-indigo-600',
          priority: 5
        });
      }
    }

    // Time-based encouragement
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 10 && currentContext?.page === 'practice') {
      messages.push({
        id: 'morning-energy',
        type: 'motivation',
        title: 'Morning momentum!',
        message: "Starting your day with finance practice? Excellent choice! Your brain is fresh and ready to learn.",
        icon: <Coffee className="w-5 h-5" />,
        color: 'text-orange-600',
        priority: 4
      });
    }

    // Study session duration encouragement
    if (currentContext?.timeSpent && currentContext.timeSpent > 1800) { // 30+ minutes
      messages.push({
        id: 'focused-session',
        type: 'encouragement',
        title: 'Deep focus session!',
        message: "You've been studying with great focus. Remember to take short breaks to help retention.",
        icon: <Clock className="w-5 h-5" />,
        color: 'text-teal-600',
        priority: 6
      });
    }

    // First-time user encouragement
    if (completedProblems === 0) {
      messages.push({
        id: 'getting-started',
        type: 'motivation',
        title: 'Ready to begin?',
        message: "Every expert was once a beginner. Take your first step towards ACF mastery!",
        icon: <Sparkles className="w-5 h-5" />,
        color: 'text-purple-600',
        action: {
          label: 'Start Practice',
          callback: () => onInteraction?.('start_practice', { topic: 'Time Value of Money' })
        },
        priority: 10
      });
    }

    // Select highest priority message
    const sortedMessages = messages.sort((a, b) => b.priority - a.priority);
    setCurrentMessage(sortedMessages[0] || getDefaultMessage());
  };

  const getTopicSpecificTips = (topic: string) => {
    const tips: Record<string, { message: string }> = {
      'Time Value of Money': {
        message: "Remember: Money today is worth more than money tomorrow. Focus on understanding the 'why' behind each formula."
      },
      'Portfolio Theory': {
        message: "Diversification is key! Think about how different investments move together (correlation) when solving problems."
      },
      'Bond Valuation': {
        message: "Bond prices and interest rates move inversely. When rates go up, bond prices go down. Visualize this relationship!"
      },
      'Financial Statements': {
        message: "The three statements are interconnected. Changes in one affect the others. Look for these connections!"
      },
      'Derivatives': {
        message: "Options and futures can seem complex, but they're tools for managing risk. Focus on their practical applications."
      }
    };
    return tips[topic];
  };

  const getDefaultMessage = (): CompanionMessage => ({
    id: 'default',
    type: 'encouragement',
    title: 'Keep going!',
    message: "Every problem you solve brings you closer to ACF mastery. You're doing great!",
    icon: <Heart className="w-5 h-5" />,
    color: 'text-pink-600',
    priority: 1
  });

  const isYesterday = (date: Date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const getCompanionEmoji = () => {
    switch (companionMood) {
      case 'excited': return '🎉';
      case 'proud': return '⭐';
      case 'encouraging': return '💪';
      case 'focused': return '🎯';
      default: return '😊';
    }
  };

  if (!isVisible || !currentMessage) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm">
      <Card className="border-2 border-blue-200 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">{getCompanionEmoji()}</div>
              <div>
                <CardTitle className="text-sm flex items-center space-x-1">
                  {currentMessage.icon}
                  <span className={currentMessage.color}>{currentMessage.title}</span>
                </CardTitle>
                <CardDescription className="text-xs">AI Study Companion</CardDescription>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="h-6 w-6 p-0"
                title="Companion Settings"
              >
                <Settings className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailedView(!showDetailedView)}
                className="h-6 w-6 p-0"
              >
                <ChevronRight className={`w-3 h-3 transition-transform ${showDetailedView ? 'rotate-90' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {currentMessage.message}
            </p>

            {showDetailedView && (
              <div className="space-y-3 border-t pt-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>{userProgress.completedProblems} problems</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span>{userProgress.currentStreak} day streak</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3 text-blue-500" />
                    <span>{Math.round(userProgress.averageAccuracy)}% accuracy</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-purple-500" />
                    <span>{Math.round((userProgress.completedProblems / userProgress.totalProblems) * 100)}% complete</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Overall Progress</span>
                    <span>{Math.round((userProgress.completedProblems / userProgress.totalProblems) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(userProgress.completedProblems / userProgress.totalProblems) * 100} 
                    className="h-1.5" 
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              {currentMessage.action && (
                <Button 
                  size="sm" 
                  onClick={currentMessage.action.callback}
                  className="text-xs"
                >
                  {currentMessage.action.label}
                </Button>
              )}
              <Badge variant="secondary" className="text-xs ml-auto">
                {currentMessage.type}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CompanionSettings
              preferences={{
                enableEncouragement: true,
                enableCelebrations: true,
                enableTips: true,
                enableSounds: false,
                frequency: 'medium',
                showProgress: true,
                enableMotivationalQuotes: true,
                smartTiming: true
              }}
              onPreferencesChange={(prefs) => {
                console.log('Companion preferences updated:', prefs);
                // Could save to localStorage or send to backend
              }}
              onClose={() => setShowSettings(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AIStudyCompanion;