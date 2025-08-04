import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

interface StudyCompanionState {
  isVisible: boolean;
  currentMessage: string | null;
  companionMood: 'excited' | 'encouraging' | 'proud' | 'focused';
  sessionData: {
    startTime: Date;
    problemsCompleted: number;
    correctAnswers: number;
    timeSpent: number;
    currentTopic?: string;
  };
  preferences: {
    enableEncouragement: boolean;
    enableCelebrations: boolean;
    enableTips: boolean;
    frequency: 'high' | 'medium' | 'low';
  };
}

interface UseStudyCompanionProps {
  userId?: string;
  currentContext?: {
    page: string;
    topic?: string;
    difficulty?: string;
  };
}

export function useStudyCompanion({ userId, currentContext }: UseStudyCompanionProps = {}) {
  const [state, setState] = useState<StudyCompanionState>({
    isVisible: true,
    currentMessage: null,
    companionMood: 'encouraging',
    sessionData: {
      startTime: new Date(),
      problemsCompleted: 0,
      correctAnswers: 0,
      timeSpent: 0
    },
    preferences: {
      enableEncouragement: true,
      enableCelebrations: true,
      enableTips: true,
      frequency: 'medium'
    }
  });

  // Fetch user progress for companion personalization
  const { data: userProgress } = useQuery({
    queryKey: ['/api/user/progress', userId],
    enabled: !!userId,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Load companion preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('study-companion-preferences');
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        setState(prev => ({ ...prev, preferences }));
      } catch (error) {
        console.warn('Failed to load study companion preferences:', error);
      }
    }
  }, []);

  // Update session data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        sessionData: {
          ...prev.sessionData,
          timeSpent: Date.now() - prev.sessionData.startTime.getTime()
        }
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Update topic when context changes
  useEffect(() => {
    if (currentContext?.topic) {
      setState(prev => ({
        ...prev,
        sessionData: {
          ...prev.sessionData,
          currentTopic: currentContext.topic
        }
      }));
    }
  }, [currentContext?.topic]);

  const updatePreferences = useCallback((newPreferences: Partial<StudyCompanionState['preferences']>) => {
    setState(prev => {
      const updatedPreferences = { ...prev.preferences, ...newPreferences };
      
      // Save to localStorage
      localStorage.setItem('study-companion-preferences', JSON.stringify(updatedPreferences));
      
      return {
        ...prev,
        preferences: updatedPreferences
      };
    });
  }, []);

  const recordProblemCompletion = useCallback((isCorrect: boolean) => {
    setState(prev => ({
      ...prev,
      sessionData: {
        ...prev.sessionData,
        problemsCompleted: prev.sessionData.problemsCompleted + 1,
        correctAnswers: prev.sessionData.correctAnswers + (isCorrect ? 1 : 0)
      }
    }));
  }, []);

  const showCompanion = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: true }));
  }, []);

  const hideCompanion = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: false }));
  }, []);

  const resetSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      sessionData: {
        startTime: new Date(),
        problemsCompleted: 0,
        correctAnswers: 0,
        timeSpent: 0,
        currentTopic: prev.sessionData.currentTopic
      }
    }));
  }, []);

  const updateCompanionMood = useCallback((mood: StudyCompanionState['companionMood']) => {
    setState(prev => ({ ...prev, companionMood: mood }));
  }, []);

  const getSessionStats = useCallback(() => {
    const { sessionData } = state;
    const sessionAccuracy = sessionData.problemsCompleted > 0 
      ? (sessionData.correctAnswers / sessionData.problemsCompleted) * 100 
      : 0;
    
    const sessionDurationMinutes = Math.floor(sessionData.timeSpent / (1000 * 60));
    
    return {
      ...sessionData,
      accuracy: sessionAccuracy,
      durationMinutes: sessionDurationMinutes,
      averageTimePerProblem: sessionData.problemsCompleted > 0 
        ? sessionData.timeSpent / sessionData.problemsCompleted 
        : 0
    };
  }, [state.sessionData]);

  const shouldShowCompanion = useCallback(() => {
    const { preferences } = state;
    
    if (!preferences.enableEncouragement && !preferences.enableCelebrations && !preferences.enableTips) {
      return false;
    }

    // Frequency-based visibility
    const now = Date.now();
    const lastShown = localStorage.getItem('companion-last-shown');
    
    if (lastShown) {
      const timeSinceLastShown = now - parseInt(lastShown);
      const minInterval = {
        high: 2 * 60 * 1000,    // 2 minutes
        medium: 5 * 60 * 1000,  // 5 minutes
        low: 10 * 60 * 1000     // 10 minutes
      }[preferences.frequency];

      if (timeSinceLastShown < minInterval) {
        return false;
      }
    }

    localStorage.setItem('companion-last-shown', now.toString());
    return true;
  }, [state.preferences]);

  const getCompanionData = useCallback(() => {
    return {
      ...state,
      userProgress: userProgress || {
        completedProblems: 0,
        totalProblems: 115,
        currentStreak: 1,
        averageAccuracy: 0,
        recentActivity: [],
        lastStudySession: null
      },
      currentContext,
      sessionStats: getSessionStats(),
      shouldShow: shouldShowCompanion()
    };
  }, [state, userProgress, currentContext, getSessionStats, shouldShowCompanion]);

  return {
    // State
    companionData: getCompanionData(),
    
    // Actions
    updatePreferences,
    recordProblemCompletion,
    showCompanion,
    hideCompanion,
    resetSession,
    updateCompanionMood,
    
    // Utilities
    getSessionStats,
    shouldShowCompanion
  };
}

export default useStudyCompanion;