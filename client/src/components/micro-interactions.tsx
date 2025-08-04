import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  Trophy, 
  Target, 
  Star, 
  Heart, 
  Zap,
  ThumbsUp,
  CheckCircle,
  TrendingUp,
  Flame,
  Award
} from 'lucide-react';

interface MicroInteraction {
  id: string;
  type: 'achievement' | 'milestone' | 'streak' | 'accuracy' | 'encouragement';
  title: string;
  message: string;
  icon: React.ReactNode;
  color: string;
  animation?: string;
  sound?: string;
  duration?: number;
}

interface MicroInteractionsProps {
  userProgress: {
    completedProblems: number;
    totalProblems: number;
    currentStreak: number;
    averageAccuracy: number;
    sessionAccuracy?: number;
    recentAchievements?: string[];
  };
  sessionData?: {
    problemsCompleted: number;
    correctAnswers: number;
    timeSpent: number;
    difficulty: string;
  };
  onInteraction?: (interaction: MicroInteraction) => void;
}

export function useMicroInteractions({ 
  userProgress, 
  sessionData, 
  onInteraction 
}: MicroInteractionsProps) {
  const [lastProgressCheck, setLastProgressCheck] = useState(userProgress);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);

  useEffect(() => {
    if (!sessionStart) {
      setSessionStart(new Date());
    }

    checkForMicroInteractions();
    setLastProgressCheck(userProgress);
  }, [userProgress, sessionData]);

  const checkForMicroInteractions = () => {
    const interactions: MicroInteraction[] = [];

    // Problem completion celebrations
    if (userProgress.completedProblems > lastProgressCheck.completedProblems) {
      const newProblems = userProgress.completedProblems - lastProgressCheck.completedProblems;
      
      if (newProblems === 1) {
        interactions.push(createProblemCompletionInteraction());
      } else if (newProblems >= 5) {
        interactions.push(createMultipleProblemInteraction(newProblems));
      }
    }

    // Streak achievements
    if (userProgress.currentStreak > lastProgressCheck.currentStreak) {
      interactions.push(createStreakInteraction(userProgress.currentStreak));
    }

    // Accuracy improvements
    if (sessionData?.correctAnswers && sessionData.problemsCompleted > 0) {
      const sessionAccuracy = (sessionData.correctAnswers / sessionData.problemsCompleted) * 100;
      if (sessionAccuracy >= 90) {
        interactions.push(createHighAccuracyInteraction(sessionAccuracy));
      } else if (sessionAccuracy >= 80) {
        interactions.push(createGoodAccuracyInteraction(sessionAccuracy));
      }
    }

    // Milestone achievements
    checkMilestoneAchievements(interactions);

    // Time-based encouragement
    checkTimeBasedEncouragement(interactions);

    // Trigger interactions
    interactions.forEach(interaction => {
      triggerMicroInteraction(interaction);
      onInteraction?.(interaction);
    });
  };

  const createProblemCompletionInteraction = (): MicroInteraction => {
    const messages = [
      "Great work! One step closer to mastery!",
      "Nice job! Keep the momentum going!",
      "Well done! You're building strong foundations!",
      "Excellent! Your persistence is paying off!",
      "Outstanding! Another concept mastered!"
    ];

    const icons = [
      <CheckCircle className="w-5 h-5" />,
      <ThumbsUp className="w-5 h-5" />,
      <Star className="w-5 h-5" />,
      <Target className="w-5 h-5" />,
      <Sparkles className="w-5 h-5" />
    ];

    const randomIndex = Math.floor(Math.random() * messages.length);

    return {
      id: `problem-${Date.now()}`,
      type: 'encouragement',
      title: 'Problem Solved!',
      message: messages[randomIndex],
      icon: icons[randomIndex],
      color: 'text-green-600',
      animation: 'bounce',
      duration: 3000
    };
  };

  const createMultipleProblemInteraction = (count: number): MicroInteraction => ({
    id: `multiple-${Date.now()}`,
    type: 'achievement',
    title: `${count} Problems Solved!`,
    message: "You're on fire! This kind of focus leads to success!",
    icon: <Flame className="w-5 h-5" />,
    color: 'text-orange-600',
    animation: 'pulse',
    duration: 4000
  });

  const createStreakInteraction = (streak: number): MicroInteraction => {
    const getStreakMessage = (days: number) => {
      if (days === 2) return "Two days strong! Building great habits!";
      if (days === 3) return "Three-day streak! Consistency is key!";
      if (days === 7) return "One week streak! You're unstoppable!";
      if (days === 14) return "Two weeks! Your dedication is inspiring!";
      if (days === 30) return "30-day streak! You're a true champion!";
      return `${days}-day streak! Amazing dedication!`;
    };

    return {
      id: `streak-${Date.now()}`,
      type: 'streak',
      title: `${streak}-Day Streak! 🔥`,
      message: getStreakMessage(streak),
      icon: <Flame className="w-5 h-5" />,
      color: 'text-red-600',
      animation: 'shake',
      duration: 5000
    };
  };

  const createHighAccuracyInteraction = (accuracy: number): MicroInteraction => ({
    id: `accuracy-high-${Date.now()}`,
    type: 'accuracy',
    title: 'Precision Expert!',
    message: `${Math.round(accuracy)}% accuracy! Your understanding is excellent!`,
    icon: <Star className="w-5 h-5" />,
    color: 'text-yellow-600',
    animation: 'pulse',
    duration: 4000
  });

  const createGoodAccuracyInteraction = (accuracy: number): MicroInteraction => ({
    id: `accuracy-good-${Date.now()}`,
    type: 'accuracy',
    title: 'Great Accuracy!',
    message: `${Math.round(accuracy)}% correct! You're really getting the hang of this!`,
    icon: <ThumbsUp className="w-5 h-5" />,
    color: 'text-blue-600',
    animation: 'bounce',
    duration: 3000
  });

  const checkMilestoneAchievements = (interactions: MicroInteraction[]) => {
    const { completedProblems, totalProblems, averageAccuracy } = userProgress;
    const progressPercent = (completedProblems / totalProblems) * 100;

    // Progress milestones
    const milestones = [10, 25, 50, 75, 90];
    const currentMilestone = milestones.find(m => 
      progressPercent >= m && 
      (lastProgressCheck.completedProblems / lastProgressCheck.totalProblems) * 100 < m
    );

    if (currentMilestone) {
      interactions.push({
        id: `milestone-${currentMilestone}`,
        type: 'milestone',
        title: `${currentMilestone}% Complete!`,
        message: getMilestoneMessage(currentMilestone),
        icon: <Trophy className="w-5 h-5" />,
        color: 'text-purple-600',
        animation: 'bounce',
        duration: 5000
      });
    }

    // Problem count milestones
    const problemMilestones = [1, 5, 10, 25, 50, 100];
    const problemMilestone = problemMilestones.find(m => 
      completedProblems >= m && lastProgressCheck.completedProblems < m
    );

    if (problemMilestone && problemMilestone > 1) {
      interactions.push({
        id: `problems-${problemMilestone}`,
        type: 'achievement',
        title: `${problemMilestone} Problems Solved!`,
        message: getProblemMilestoneMessage(problemMilestone),
        icon: <Award className="w-5 h-5" />,
        color: 'text-indigo-600',
        animation: 'pulse',
        duration: 4000
      });
    }
  };

  const checkTimeBasedEncouragement = (interactions: MicroInteraction[]) => {
    if (!sessionStart || !sessionData) return;

    const sessionDuration = Date.now() - sessionStart.getTime();
    const minutesStudied = Math.floor(sessionDuration / (1000 * 60));

    // Study session milestones
    if (minutesStudied === 15 && sessionData.problemsCompleted >= 3) {
      interactions.push({
        id: 'session-15min',
        type: 'encouragement',
        title: '15 Minutes of Focus!',
        message: "Great study session! You're building excellent habits!",
        icon: <TrendingUp className="w-5 h-5" />,
        color: 'text-teal-600',
        animation: 'bounce',
        duration: 3000
      });
    } else if (minutesStudied === 30 && sessionData.problemsCompleted >= 5) {
      interactions.push({
        id: 'session-30min',
        type: 'encouragement',
        title: '30 Minutes of Deep Work!',
        message: "Impressive focus! This kind of dedication leads to mastery!",
        icon: <Zap className="w-5 h-5" />,
        color: 'text-purple-600',
        animation: 'pulse',
        duration: 4000
      });
    }
  };

  const getMilestoneMessage = (milestone: number): string => {
    const messages: Record<number, string> = {
      10: "Great start! You're building momentum!",
      25: "Quarter way there! Your foundation is getting stronger!",
      50: "Halfway point reached! You're doing amazing!",
      75: "Three-quarters complete! The finish line is in sight!",
      90: "Almost there! You're so close to complete mastery!"
    };
    return messages[milestone] || "Amazing progress!";
  };

  const getProblemMilestoneMessage = (count: number): string => {
    const messages: Record<number, string> = {
      5: "First 5 problems down! You're off to a great start!",
      10: "Double digits! Your problem-solving skills are improving!",
      25: "25 problems mastered! You're building real expertise!",
      50: "Half a century of problems! Your dedication is impressive!",
      100: "100 problems conquered! You're becoming an ACF expert!"
    };
    return messages[count] || `${count} problems solved! Keep up the excellent work!`;
  };

  const triggerMicroInteraction = (interaction: MicroInteraction) => {
    // Create toast notification with custom styling
    toast({
      title: interaction.title,
      description: (
        <div className="flex items-center space-x-2">
          <span className={interaction.color}>{interaction.icon}</span>
          <span>{interaction.message}</span>
        </div>
      ),
      duration: interaction.duration || 3000,
      className: `border-l-4 ${getColorClass(interaction.color)} ${getAnimationClass(interaction.animation)}`
    });

    // Optional: Play celebration sound (could be added later)
    if (interaction.sound) {
      // playSound(interaction.sound);
    }

    // Optional: Trigger confetti or particle effects for major achievements
    if (interaction.type === 'milestone' || interaction.type === 'achievement') {
      triggerCelebrationEffect(interaction);
    }
  };

  const getColorClass = (color: string): string => {
    const colorMap: Record<string, string> = {
      'text-green-600': 'border-green-500',
      'text-blue-600': 'border-blue-500',
      'text-purple-600': 'border-purple-500',
      'text-yellow-600': 'border-yellow-500',
      'text-red-600': 'border-red-500',
      'text-orange-600': 'border-orange-500',
      'text-teal-600': 'border-teal-500',
      'text-indigo-600': 'border-indigo-500'
    };
    return colorMap[color] || 'border-gray-500';
  };

  const getAnimationClass = (animation?: string): string => {
    switch (animation) {
      case 'bounce': return 'animate-bounce';
      case 'pulse': return 'animate-pulse';
      case 'shake': return 'animate-pulse'; // Could implement custom shake animation
      default: return '';
    }
  };

  const triggerCelebrationEffect = (interaction: MicroInteraction) => {
    // Could implement confetti.js or custom particle system here
    console.log(`🎉 Celebration effect triggered for: ${interaction.title}`);
  };

  return {
    checkForMicroInteractions,
    triggerMicroInteraction
  };
}

export default useMicroInteractions;