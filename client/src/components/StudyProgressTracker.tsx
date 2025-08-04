import React, { useEffect } from 'react';
import { useLocalProgress } from '@/hooks/useLocalProgress';
import { useMicroInteractions } from '@/components/MicroInteractions';

interface StudyProgressTrackerProps {
  children: React.ReactNode;
}

export function StudyProgressTracker({ children }: StudyProgressTrackerProps) {
  const { trackStudySession, trackProblemCompleted, getAnalytics } = useLocalProgress();
  const { triggerInteraction, InteractionComponent } = useMicroInteractions();
  
  // Track session start time
  useEffect(() => {
    const sessionStart = Date.now();
    
    return () => {
      // Track session when component unmounts
      const sessionDuration = Math.floor((Date.now() - sessionStart) / 1000);
      if (sessionDuration > 10) { // Only track sessions longer than 10 seconds
        trackStudySession(sessionDuration);
        
        // Trigger session complete celebration for longer sessions
        if (sessionDuration > 300) { // 5+ minutes
          triggerInteraction('session_complete', {
            pointsEarned: Math.floor(sessionDuration / 60) * 10 // 10 points per minute
          });
        }
      }
    };
  }, [trackStudySession, triggerInteraction]);

  // Provide problem tracking context to children
  const contextValue = {
    onProblemCompleted: (topic: string, problemId: string, isCorrect: boolean, timeSpent?: number) => {
      trackProblemCompleted(topic, problemId, isCorrect);
      
      // Trigger celebrations based on performance
      if (isCorrect) {
        triggerInteraction('correct_answer', {
          pointsEarned: 10
        });
        
        // Check for streaks
        const analytics = getAnalytics();
        if (analytics.studyStreak > 0 && analytics.studyStreak % 3 === 0) {
          triggerInteraction('streak_milestone', {
            streak: analytics.studyStreak,
            pointsEarned: analytics.studyStreak * 5
          });
        }
        
        // Time bonus for quick answers
        if (timeSpent && timeSpent < 30) {
          triggerInteraction('time_bonus', {
            timeBonus: 20,
            pointsEarned: 20
          });
        }
        
        // Accuracy bonus
        if (analytics.overallAccuracy > 0.9) {
          triggerInteraction('accuracy_bonus', {
            accuracy: Math.round(analytics.overallAccuracy * 100),
            pointsEarned: 15
          });
        }
      }
      
      triggerInteraction('problem_completed', {
        pointsEarned: isCorrect ? 10 : 5
      });
    },
    
    onMilestoneReached: (type: string, value: number) => {
      if (type === 'level_up') {
        triggerInteraction('level_up', {
          level: value,
          pointsEarned: value * 50
        });
      }
    }
  };

  return (
    <StudyContext.Provider value={contextValue}>
      {children}
      {InteractionComponent}
    </StudyContext.Provider>
  );
}

// Context for sharing progress tracking functions
const StudyContext = React.createContext<{
  onProblemCompleted: (topic: string, problemId: string, isCorrect: boolean, timeSpent?: number) => void;
  onMilestoneReached: (type: string, value: number) => void;
} | null>(null);

export function useStudyProgress() {
  const context = React.useContext(StudyContext);
  if (!context) {
    throw new Error('useStudyProgress must be used within StudyProgressTracker');
  }
  return context;
}