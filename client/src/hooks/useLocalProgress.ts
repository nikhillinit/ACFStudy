import { useState, useEffect } from 'react';

interface ProgressData {
  totalProblems: number;
  studyStreak: number;
  overallAccuracy: number;
  lastActivity: string;
  topicsProgress: {
    [topic: string]: {
      completed: string[];
      accuracy: number;
      attempts: number;
    };
  };
  analytics: {
    dailyStudyTime: number;
    weeklyGoal: number;
    streak: number;
    totalStudyDays: number;
  };
}

interface CompanionSettings {
  frequency: 'minimal' | 'moderate' | 'frequent';
  encouragementStyle: 'supportive' | 'motivational' | 'analytical' | 'friendly';
  showCelebrations: boolean;
  showTips: boolean;
  showProgress: boolean;
  personalizedName: string;
}

const DEFAULT_PROGRESS: ProgressData = {
  totalProblems: 0,
  studyStreak: 0,
  overallAccuracy: 0,
  lastActivity: new Date().toISOString(),
  topicsProgress: {},
  analytics: {
    dailyStudyTime: 0,
    weeklyGoal: 300, // 5 hours per week
    streak: 0,
    totalStudyDays: 0,
  }
};

const DEFAULT_COMPANION_SETTINGS: CompanionSettings = {
  frequency: 'moderate',
  encouragementStyle: 'supportive',
  showCelebrations: true,
  showTips: true,
  showProgress: true,
  personalizedName: 'Student'
};

export function useLocalProgress() {
  const [progress, setProgress] = useState<ProgressData>(DEFAULT_PROGRESS);
  const [companionSettings, setCompanionSettings] = useState<CompanionSettings>(DEFAULT_COMPANION_SETTINGS);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('acf-learning-progress');
    const savedSettings = localStorage.getItem('acf-companion-settings');
    
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (error) {
        console.error('Failed to parse saved progress:', error);
      }
    }
    
    if (savedSettings) {
      try {
        setCompanionSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // Save to localStorage when progress changes
  const updateProgress = (newProgress: Partial<ProgressData>) => {
    const updatedProgress = { ...progress, ...newProgress };
    setProgress(updatedProgress);
    localStorage.setItem('acf-learning-progress', JSON.stringify(updatedProgress));
  };

  // Save companion settings
  const updateCompanionSettings = (newSettings: Partial<CompanionSettings>) => {
    const updatedSettings = { ...companionSettings, ...newSettings };
    setCompanionSettings(updatedSettings);
    localStorage.setItem('acf-companion-settings', JSON.stringify(updatedSettings));
  };

  // Track problem completion
  const trackProblemCompleted = (topic: string, problemId: string, isCorrect: boolean) => {
    const topicProgress = progress.topicsProgress[topic] || { completed: [], accuracy: 0, attempts: 0 };
    
    if (!topicProgress.completed.includes(problemId)) {
      topicProgress.completed.push(problemId);
    }
    
    topicProgress.attempts += 1;
    const totalCorrect = topicProgress.accuracy * (topicProgress.attempts - 1) + (isCorrect ? 1 : 0);
    topicProgress.accuracy = totalCorrect / topicProgress.attempts;

    updateProgress({
      totalProblems: progress.totalProblems + 1,
      lastActivity: new Date().toISOString(),
      topicsProgress: {
        ...progress.topicsProgress,
        [topic]: topicProgress
      },
      overallAccuracy: calculateOverallAccuracy({
        ...progress.topicsProgress,
        [topic]: topicProgress
      })
    });
  };

  // Calculate overall accuracy across all topics
  const calculateOverallAccuracy = (topicsProgress: ProgressData['topicsProgress']) => {
    const topics = Object.values(topicsProgress);
    if (topics.length === 0) return 0;
    
    const totalAccuracy = topics.reduce((sum, topic) => sum + topic.accuracy, 0);
    return totalAccuracy / topics.length;
  };

  // Track study session
  const trackStudySession = (duration: number) => {
    const today = new Date().toDateString();
    const lastActivityDate = new Date(progress.lastActivity).toDateString();
    
    let newStreak = progress.studyStreak;
    if (today !== lastActivityDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActivityDate === yesterday.toDateString()) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }

    updateProgress({
      lastActivity: new Date().toISOString(),
      studyStreak: newStreak,
      analytics: {
        ...progress.analytics,
        dailyStudyTime: progress.analytics.dailyStudyTime + duration,
        streak: newStreak
      }
    });
  };

  // Get study analytics
  const getAnalytics = () => {
    return {
      totalProblems: progress.totalProblems,
      studyStreak: progress.studyStreak,
      overallAccuracy: progress.overallAccuracy,
      lastActivity: progress.lastActivity,
      topicsProgress: progress.topicsProgress,
      ...progress.analytics
    };
  };

  // Get recent activity (mock for companion)
  const getRecentActivity = () => {
    return {
      lastActivity: progress.lastActivity,
      recentProblems: progress.totalProblems,
      recentAccuracy: progress.overallAccuracy
    };
  };

  return {
    progress,
    companionSettings,
    updateProgress,
    updateCompanionSettings,
    trackProblemCompleted,
    trackStudySession,
    getAnalytics,
    getRecentActivity
  };
}