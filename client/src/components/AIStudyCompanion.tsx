import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Heart, Star, Trophy, Target, BookOpen, Zap, Coffee, Lightbulb, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useLocalProgress } from '@/hooks/useLocalProgress';

interface CompanionMessage {
  id: string;
  type: 'encouragement' | 'milestone' | 'tip' | 'motivation' | 'celebration';
  message: string;
  icon: React.ReactNode;
  color: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  contextTrigger?: string;
}

interface StudySession {
  sessionLength: number;
  topicsStudied: string[];
  accuracy: number;
  problemsSolved: number;
  streak: number;
  lastActivity: Date;
}

interface CompanionSettings {
  frequency: 'minimal' | 'moderate' | 'frequent';
  encouragementStyle: 'supportive' | 'motivational' | 'analytical' | 'friendly';
  showCelebrations: boolean;
  showTips: boolean;
  showProgress: boolean;
  personalizedName: string;
}

const COMPANION_PERSONALITIES = {
  supportive: {
    name: "Sage",
    description: "Gentle and understanding companion",
    icon: <Heart className="w-4 h-4" />,
    color: "text-pink-500"
  },
  motivational: {
    name: "Champion", 
    description: "High-energy motivational coach",
    icon: <Trophy className="w-4 h-4" />,
    color: "text-yellow-500"
  },
  analytical: {
    name: "Professor",
    description: "Data-driven learning advisor",
    icon: <Brain className="w-4 h-4" />,
    color: "text-blue-500"
  },
  friendly: {
    name: "Buddy",
    description: "Casual and encouraging friend",
    icon: <Coffee className="w-4 h-4" />,
    color: "text-green-500"
  }
};

const ENCOURAGEMENT_MESSAGES = {
  supportive: [
    "You're making steady progress! Every step counts.",
    "Remember, learning is a journey, not a race.",
    "Take a moment to appreciate how far you've come.",
    "Your dedication is truly inspiring.",
    "It's okay to take breaks - your brain needs time to process."
  ],
  motivational: [
    "You're unstoppable! Keep pushing forward!",
    "Champions are made through consistent effort!",
    "You've got this! Show that exam who's boss!",
    "Every problem you solve makes you stronger!",
    "Time to crush those learning goals!"
  ],
  analytical: [
    "Your accuracy has improved by 15% this week.",
    "You've mastered 78% of Time Value of Money concepts.",
    "Optimal study sessions are 25-45 minutes - you're on track.",
    "Your retention rate is highest between 2-4 PM.",
    "Consider reviewing Bond Valuation - 3 more problems to mastery."
  ],
  friendly: [
    "Hey there! Ready to tackle some finance problems?",
    "You're doing awesome - grab a coffee and let's continue!",
    "Nice work today! Your future self will thank you.",
    "Finance can be tricky, but you're getting the hang of it!",
    "Remember: progress over perfection!"
  ]
};

const MILESTONE_MESSAGES = {
  first_problem: "🎉 Welcome! You've solved your first problem!",
  ten_problems: "💪 Amazing! 10 problems down - you're building momentum!",
  study_streak_3: "🔥 3-day study streak! You're developing great habits!",
  study_streak_7: "⭐ Week-long streak! You're absolutely crushing it!",
  topic_mastery: "🏆 Topic mastered! Your hard work is paying off!",
  exam_ready: "🚀 Exam-ready status achieved! You're prepared for success!"
};

export function AIStudyCompanion() {
  const { user } = useAuth();
  const { 
    companionSettings, 
    updateCompanionSettings, 
    getAnalytics, 
    getRecentActivity 
  } = useLocalProgress();
  
  const [activeMessage, setActiveMessage] = useState<CompanionMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [messageQueue, setMessageQueue] = useState<CompanionMessage[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  // Use local storage data
  const settings = companionSettings;
  const analytics = getAnalytics();
  const recentActivity = getRecentActivity();

  // Log companion interaction (local storage)
  const logInteraction = (interaction: { type: string; messageId: string; action: string }) => {
    console.log('Companion interaction:', interaction);
    // Could save to localStorage if needed
  };

  // Generate contextual messages based on activity
  const generateMessage = (context: any): CompanionMessage | null => {
    if (!settings) return null;

    const personality = COMPANION_PERSONALITIES[settings.encouragementStyle];
    const messages = ENCOURAGEMENT_MESSAGES[settings.encouragementStyle];
    
    // Check for milestones
    if (context.problemsSolved === 1) {
      return {
        id: `milestone-${Date.now()}`,
        type: 'milestone',
        message: MILESTONE_MESSAGES.first_problem,
        icon: <Star className="w-4 h-4" />,
        color: 'text-yellow-500',
        timestamp: new Date(),
        priority: 'high',
        contextTrigger: 'first_problem'
      };
    }

    if (context.studyStreak >= 3 && context.studyStreak < 7) {
      return {
        id: `milestone-${Date.now()}`,
        type: 'milestone',
        message: MILESTONE_MESSAGES.study_streak_3,
        icon: <Zap className="w-4 h-4" />,
        color: 'text-orange-500',
        timestamp: new Date(),
        priority: 'high',
        contextTrigger: 'study_streak_3'
      };
    }

    // Random encouragement based on frequency settings
    const frequencyMap = { minimal: 0.1, moderate: 0.3, frequent: 0.6 };
    if (Math.random() < frequencyMap[settings.frequency]) {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      return {
        id: `encourage-${Date.now()}`,
        type: 'encouragement',
        message: randomMessage,
        icon: personality.icon,
        color: personality.color,
        timestamp: new Date(),
        priority: 'medium',
        contextTrigger: 'random_encouragement'
      };
    }

    return null;
  };

  // Process message queue
  useEffect(() => {
    if (messageQueue.length > 0 && !activeMessage) {
      const nextMessage = messageQueue[0];
      setActiveMessage(nextMessage);
      setMessageQueue(prev => prev.slice(1));
      setIsVisible(true);

      // Auto-hide after 5 seconds for low priority messages
      if (nextMessage.priority === 'low') {
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => setActiveMessage(null), 300);
        }, 5000);
      }
    }
  }, [messageQueue, activeMessage]);

  // Monitor for new activities to trigger messages
  useEffect(() => {
    if (recentActivity) {
      const newMessage = generateMessage({
        problemsSolved: analytics.totalProblems,
        studyStreak: analytics.studyStreak,
        accuracy: analytics.overallAccuracy,
        lastActivity: recentActivity.lastActivity
      });

      if (newMessage) {
        setMessageQueue(prev => [...prev, newMessage]);
      }
    }
  }, [recentActivity, analytics, settings]);

  const handleMessageDismiss = () => {
    if (activeMessage) {
      logInteraction({
        type: 'dismiss',
        messageId: activeMessage.id,
        action: 'manual_dismiss'
      });
    }
    setIsVisible(false);
    setTimeout(() => setActiveMessage(null), 300);
  };

  const handleMessageAction = (action: string) => {
    if (activeMessage) {
      logInteraction({
        type: 'action',
        messageId: activeMessage.id,
        action
      });
    }
    
    if (action === 'show_tips') {
      // Navigate to tips or show tips modal
      setShowSettings(true);
    }
    
    handleMessageDismiss();
  };

  const currentSettings = settings;
  const personality = COMPANION_PERSONALITIES[currentSettings.encouragementStyle];

  return (
    <>
      {/* Floating Companion Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {activeMessage && isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="mb-4"
            >
              <Card className="w-80 shadow-lg border-2 bg-white dark:bg-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 ${personality.color}`}>
                      {activeMessage.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {personality.name}
                        </Badge>
                        <Badge 
                          variant={activeMessage.priority === 'high' ? 'destructive' : 'outline'}
                          className="text-xs"
                        >
                          {activeMessage.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        {activeMessage.message}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleMessageDismiss}
                          data-testid="button-dismiss-companion"
                        >
                          Got it!
                        </Button>
                        {activeMessage.type === 'encouragement' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleMessageAction('show_tips')}
                            data-testid="button-show-tips"
                          >
                            Show Tips
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Companion Avatar Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg"
            onClick={() => setShowSettings(true)}
            data-testid="button-companion-avatar"
          >
            {personality.icon}
          </Button>
        </motion.div>
      </div>

      {/* Companion Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4">AI Study Companion Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Companion Personality</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(COMPANION_PERSONALITIES).map(([key, personality]) => (
                      <Button
                        key={key}
                        variant={currentSettings.encouragementStyle === key ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateCompanionSettings({ encouragementStyle: key as any })}
                        className="flex items-center gap-2"
                        data-testid={`button-personality-${key}`}
                      >
                        {personality.icon}
                        {personality.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Interaction Frequency</label>
                  <div className="flex gap-2">
                    {['minimal', 'moderate', 'frequent'].map((freq) => (
                      <Button
                        key={freq}
                        variant={currentSettings.frequency === freq ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateCompanionSettings({ frequency: freq as any })}
                        data-testid={`button-frequency-${freq}`}
                      >
                        {freq}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currentSettings.showCelebrations}
                      onChange={(e) => updateCompanionSettings({ showCelebrations: e.target.checked })}
                      data-testid="checkbox-celebrations"
                    />
                    <span className="text-sm">Show celebration messages</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currentSettings.showTips}
                      onChange={(e) => updateCompanionSettings({ showTips: e.target.checked })}
                      data-testid="checkbox-tips"
                    />
                    <span className="text-sm">Show study tips</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currentSettings.showProgress}
                      onChange={(e) => updateCompanionSettings({ showProgress: e.target.checked })}
                      data-testid="checkbox-progress"
                    />
                    <span className="text-sm">Show progress updates</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}