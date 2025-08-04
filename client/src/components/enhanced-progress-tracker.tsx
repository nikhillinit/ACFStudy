import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  Flame,
  Award,
  BookOpen,
  BarChart3,
  Star
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlockedAt?: Date;
  progress?: number;
  requirement?: number;
}

interface ModuleProgress {
  moduleId: string;
  moduleName: string;
  completed: number;
  total: number;
  accuracy: number;
  timeSpent: number;
  lastActivity?: Date;
}

interface ProgressTrackerProps {
  completedProblems: number;
  totalProblems: number;
  moduleProgress: ModuleProgress[];
  studyStreak: number;
  totalStudyTime: number; // in minutes
  averageAccuracy: number;
  recentActivity: any[];
}

export function EnhancedProgressTracker({
  completedProblems,
  totalProblems,
  moduleProgress,
  studyStreak,
  totalStudyTime,
  averageAccuracy,
  recentActivity
}: ProgressTrackerProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  const overallProgress = totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0;

  useEffect(() => {
    checkAchievements();
  }, [completedProblems, studyStreak, averageAccuracy, totalStudyTime]);

  const checkAchievements = () => {
    const newAchievements: Achievement[] = [];

    // Problem completion achievements
    const problemMilestones = [
      { count: 1, title: 'First Steps', description: 'Completed your first problem', icon: <Target className="w-4 h-4" />, color: 'bg-blue-500' },
      { count: 10, title: 'Getting Started', description: 'Completed 10 problems', icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-500' },
      { count: 25, title: 'Making Progress', description: 'Completed 25 problems', icon: <TrendingUp className="w-4 h-4" />, color: 'bg-purple-500' },
      { count: 50, title: 'Halfway Hero', description: 'Completed 50 problems', icon: <Award className="w-4 h-4" />, color: 'bg-yellow-500' },
      { count: 100, title: 'Century Club', description: 'Completed 100 problems', icon: <Trophy className="w-4 h-4" />, color: 'bg-orange-500' }
    ];

    problemMilestones.forEach(milestone => {
      if (completedProblems >= milestone.count && !achievements.find(a => a.id === `problems_${milestone.count}`)) {
        newAchievements.push({
          ...milestone,
          id: `problems_${milestone.count}`,
          unlockedAt: new Date()
        });
      }
    });

    // Study streak achievements
    const streakMilestones = [
      { days: 3, title: 'Consistent Learner', description: '3-day study streak', icon: <Flame className="w-4 h-4" />, color: 'bg-red-500' },
      { days: 7, title: 'Week Warrior', description: '7-day study streak', icon: <Calendar className="w-4 h-4" />, color: 'bg-indigo-500' },
      { days: 14, title: 'Two Week Champion', description: '14-day study streak', icon: <Star className="w-4 h-4" />, color: 'bg-pink-500' },
      { days: 30, title: 'Monthly Master', description: '30-day study streak', icon: <Trophy className="w-4 h-4" />, color: 'bg-gold-500' }
    ];

    streakMilestones.forEach(milestone => {
      if (studyStreak >= milestone.days && !achievements.find(a => a.id === `streak_${milestone.days}`)) {
        newAchievements.push({
          ...milestone,
          id: `streak_${milestone.days}`,
          unlockedAt: new Date()
        });
      }
    });

    // Accuracy achievements
    if (averageAccuracy >= 80 && !achievements.find(a => a.id === 'accuracy_80')) {
      newAchievements.push({
        id: 'accuracy_80',
        title: 'Sharp Shooter',
        description: '80% average accuracy',
        icon: <Target className="w-4 h-4" />,
        color: 'bg-emerald-500',
        unlockedAt: new Date()
      });
    }

    if (averageAccuracy >= 90 && !achievements.find(a => a.id === 'accuracy_90')) {
      newAchievements.push({
        id: 'accuracy_90',
        title: 'Precision Expert',
        description: '90% average accuracy',
        icon: <Star className="w-4 h-4" />,
        color: 'bg-violet-500',
        unlockedAt: new Date()
      });
    }

    // Study time achievements
    const studyTimeHours = Math.floor(totalStudyTime / 60);
    if (studyTimeHours >= 10 && !achievements.find(a => a.id === 'time_10h')) {
      newAchievements.push({
        id: 'time_10h',
        title: 'Dedicated Student',
        description: '10+ hours of study time',
        icon: <Clock className="w-4 h-4" />,
        color: 'bg-teal-500',
        unlockedAt: new Date()
      });
    }

    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) return `${remainingMinutes}m`;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your streak today!";
    if (streak === 1) return "Great start! Keep it up tomorrow.";
    if (streak < 7) return "Building momentum!";
    if (streak < 30) return "Excellent consistency!";
    return "You're unstoppable! 🔥";
  };

  const getNextMilestone = () => {
    const milestones = [10, 25, 50, 75, 100];
    return milestones.find(m => m > completedProblems) || null;
  };

  const nextMilestone = getNextMilestone();
  const progressToNext = nextMilestone ? ((completedProblems % nextMilestone) / nextMilestone) * 100 : 100;

  return (
    <div className="space-y-6">
      {/* Overall Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>Learning Progress</span>
          </CardTitle>
          <CardDescription>Your ACF mastery journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-2xl font-bold text-blue-600">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{completedProblems} completed</span>
                <span>{totalProblems} total problems</span>
              </div>
            </div>

            {nextMilestone && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Next Milestone</span>
                  <span className="text-sm text-muted-foreground">{nextMilestone} problems</span>
                </div>
                <Progress value={progressToNext} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {nextMilestone - completedProblems} problems remaining
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">{averageAccuracy}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{studyStreak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">{formatStudyTime(totalStudyTime)}</div>
                <div className="text-xs text-muted-foreground">Study Time</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600">{achievements.length}</div>
                <div className="text-xs text-muted-foreground">Achievements</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Streak Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span>Study Streak</span>
          </CardTitle>
          <CardDescription>Keep up the momentum</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-orange-500">{studyStreak}</div>
            <div className="text-sm text-muted-foreground">
              {studyStreak === 1 ? 'day' : 'days'} in a row
            </div>
            <Badge variant={studyStreak >= 7 ? "default" : "secondary"} className="mt-2">
              {studyStreak >= 7 ? '🔥 On Fire!' : getStreakMessage(studyStreak)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Module Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <span>Module Progress</span>
          </CardTitle>
          <CardDescription>Your progress across ACF topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moduleProgress.map((module) => (
              <div key={module.moduleId} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{module.moduleName}</span>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{module.completed}/{module.total}</span>
                    <Badge variant="outline" className="text-xs">
                      {module.accuracy}% accuracy
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={module.total > 0 ? (module.completed / module.total) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span>Achievements</span>
            </div>
            {achievements.length > 3 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAllAchievements(!showAllAchievements)}
              >
                {showAllAchievements ? 'Show Less' : 'View All'}
              </Button>
            )}
          </CardTitle>
          <CardDescription>Milestones you've unlocked</CardDescription>
        </CardHeader>
        <CardContent>
          {achievements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>Complete your first problem to unlock achievements!</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {(showAllAchievements ? achievements : achievements.slice(0, 3)).map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className={`p-2 rounded-full text-white ${achievement.color}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{achievement.title}</div>
                    <div className="text-xs text-muted-foreground">{achievement.description}</div>
                    {achievement.unlockedAt && (
                      <div className="text-xs text-muted-foreground">
                        Unlocked {achievement.unlockedAt.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default EnhancedProgressTracker;