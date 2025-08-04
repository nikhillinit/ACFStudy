import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Target, Zap, Heart, ThumbsUp, CheckCircle, Award, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MicroInteractionProps {
  trigger: 'correct_answer' | 'problem_completed' | 'streak_milestone' | 'time_bonus' | 'accuracy_bonus' | 'session_complete' | 'level_up';
  data?: {
    streak?: number;
    accuracy?: number;
    timeBonus?: number;
    pointsEarned?: number;
    level?: number;
    achievement?: string;
  };
  onComplete?: () => void;
}

const CELEBRATION_CONFIGS = {
  correct_answer: {
    icon: <CheckCircle className="w-6 h-6" />,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    messages: ['Correct!', 'Great job!', 'Perfect!', 'Excellent!'],
    confetti: { particleCount: 50, spread: 60 }
  },
  problem_completed: {
    icon: <Target className="w-6 h-6" />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    messages: ['Problem solved!', 'Well done!', 'Moving forward!'],
    confetti: { particleCount: 75, spread: 70 }
  },
  streak_milestone: {
    icon: <Flame className="w-6 h-6" />,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    messages: ['🔥 Streak!', 'On fire!', 'Unstoppable!'],
    confetti: { particleCount: 100, spread: 80, colors: ['#ff6b35', '#f7931e', '#ffd700'] }
  },
  time_bonus: {
    icon: <Zap className="w-6 h-6" />,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    messages: ['Speed bonus!', 'Lightning fast!', 'Quick thinking!'],
    confetti: { particleCount: 60, spread: 50, colors: ['#ffd700', '#ffed4e'] }
  },
  accuracy_bonus: {
    icon: <Star className="w-6 h-6" />,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    messages: ['Accuracy bonus!', 'Precise!', 'Spot on!'],
    confetti: { particleCount: 80, spread: 60, colors: ['#8b5cf6', '#a78bfa'] }
  },
  session_complete: {
    icon: <Trophy className="w-6 h-6" />,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-200 dark:border-amber-800',
    messages: ['Session complete!', 'Great session!', 'Well done!'],
    confetti: { particleCount: 120, spread: 90, colors: ['#f59e0b', '#fbbf24', '#fde047'] }
  },
  level_up: {
    icon: <Award className="w-6 h-6" />,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    borderColor: 'border-pink-200 dark:border-pink-800',
    messages: ['Level up!', 'Achievement unlocked!', 'New milestone!'],
    confetti: { particleCount: 150, spread: 100, colors: ['#ec4899', '#f472b6', '#fbbf24'] }
  }
};

export function MicroInteractions({ trigger, data = {}, onComplete }: MicroInteractionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  
  const config = CELEBRATION_CONFIGS[trigger];

  useEffect(() => {
    if (!hasTriggered) {
      setIsVisible(true);
      setHasTriggered(true);
      
      // Trigger confetti
      if (config.confetti) {
        confetti({
          ...config.confetti,
          origin: { y: 0.7 }
        });
      }

      // Auto-hide after delay
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 2500);

      // Complete callback after animation
      const completeTimer = setTimeout(() => {
        onComplete?.();
      }, 3000);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [hasTriggered, config.confetti, onComplete]);

  const getMessage = () => {
    const baseMessage = config.messages[Math.floor(Math.random() * config.messages.length)];
    
    switch (trigger) {
      case 'streak_milestone':
        return `${baseMessage} ${data.streak} in a row!`;
      case 'time_bonus':
        return `${baseMessage} +${data.timeBonus} points!`;
      case 'accuracy_bonus':
        return `${baseMessage} ${data.accuracy}% accuracy!`;
      case 'level_up':
        return `${baseMessage} Level ${data.level}!`;
      default:
        return baseMessage;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20,
            duration: 0.6
          }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <div className={`
            ${config.bgColor} ${config.borderColor} ${config.color}
            border-2 rounded-xl p-6 shadow-2xl backdrop-blur-sm
            flex flex-col items-center gap-3 min-w-[200px]
          `}>
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -5, 5, 0],
                scale: [1, 1.2, 1, 1.1, 1]
              }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {config.icon}
            </motion.div>
            
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-bold text-center"
            >
              {getMessage()}
            </motion.h3>
            
            {data.pointsEarned && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-bold"
              >
                +{data.pointsEarned} pts
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for triggering micro-interactions
export function useMicroInteractions() {
  const [activeInteraction, setActiveInteraction] = useState<{
    trigger: MicroInteractionProps['trigger'];
    data?: MicroInteractionProps['data'];
  } | null>(null);

  const triggerInteraction = (
    trigger: MicroInteractionProps['trigger'], 
    data?: MicroInteractionProps['data']
  ) => {
    setActiveInteraction({ trigger, data });
  };

  const clearInteraction = () => {
    setActiveInteraction(null);
  };

  const InteractionComponent = activeInteraction ? (
    <MicroInteractions
      trigger={activeInteraction.trigger}
      data={activeInteraction.data}
      onComplete={clearInteraction}
    />
  ) : null;

  return {
    triggerInteraction,
    InteractionComponent
  };
}

// Progress celebration component for study milestones
export function ProgressCelebration({ 
  type, 
  value, 
  isVisible, 
  onComplete 
}: {
  type: 'streak' | 'accuracy' | 'problems_solved' | 'time_saved';
  value: number;
  isVisible: boolean;
  onComplete: () => void;
}) {
  const getConfig = () => {
    switch (type) {
      case 'streak':
        return {
          icon: <Flame className="w-8 h-8" />,
          color: 'text-orange-500',
          bgGradient: 'from-orange-400 to-red-500',
          title: 'Study Streak!',
          subtitle: `${value} days in a row!`,
          confetti: { colors: ['#ff6b35', '#f7931e', '#ffd700'] }
        };
      case 'accuracy':
        return {
          icon: <Target className="w-8 h-8" />,
          color: 'text-green-500',
          bgGradient: 'from-green-400 to-emerald-500',
          title: 'High Accuracy!',
          subtitle: `${value}% correct!`,
          confetti: { colors: ['#10b981', '#34d399', '#6ee7b7'] }
        };
      case 'problems_solved':
        return {
          icon: <Trophy className="w-8 h-8" />,
          color: 'text-yellow-500',
          bgGradient: 'from-yellow-400 to-amber-500',
          title: 'Problems Solved!',
          subtitle: `${value} completed!`,
          confetti: { colors: ['#fbbf24', '#f59e0b', '#d97706'] }
        };
      case 'time_saved':
        return {
          icon: <Zap className="w-8 h-8" />,
          color: 'text-blue-500',
          bgGradient: 'from-blue-400 to-indigo-500',
          title: 'Time Bonus!',
          subtitle: `${value} seconds saved!`,
          confetti: { colors: ['#3b82f6', '#6366f1', '#8b5cf6'] }
        };
    }
  };

  const config = getConfig();

  useEffect(() => {
    if (isVisible && config.confetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        colors: config.confetti.colors,
        origin: { y: 0.6 }
      });
      
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, config.confetti, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="bg-black/20 absolute inset-0" />
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
            className={`
              bg-gradient-to-br ${config.bgGradient} text-white
              rounded-2xl p-8 shadow-2xl backdrop-blur-sm
              flex flex-col items-center gap-4 relative
              border-4 border-white/20
            `}
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              className="text-white"
            >
              {config.icon}
            </motion.div>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{config.title}</h2>
              <p className="text-lg opacity-90">{config.subtitle}</p>
            </div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -top-2 -right-2"
            >
              <Heart className="w-6 h-6 text-pink-300 fill-current" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}