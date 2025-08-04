import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronRight, Check, X, Clock, Target, BookOpen, Calculator, TrendingUp, Award, 
  AlertCircle, BarChart, FileText, Play, Pause, RefreshCw, User, Calendar,
  Settings, HelpCircle, Brain, Zap, Filter, Download, ChevronDown, ChevronUp,
  Trophy, Star, Flame, Lock, Unlock, Volume2, VolumeX, Share2, Users,
  Heart, Shield, Sparkles, Gift, Rocket, Medal, Crown, Coins, 
  MessageCircle, ThumbsUp, Eye, EyeOff, Lightbulb, Coffee, Moon,
  Smartphone, TabletSmartphone, Monitor, Gamepad2, Swords, Target as TargetIcon
} from 'lucide-react';

// Enhanced type definitions for gamification
interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXP: number;
  coins: number;
  streak: number;
  longestStreak: number;
  achievements: Achievement[];
  unlockedFeatures: string[];
  powerUps: PowerUp[];
  dailyGoalsCompleted: number;
  weeklyRank: number;
  globalRank: number;
  studyBuddy?: string;
  preferredStudyTime: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  coinReward: number;
}

interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: any;
  duration: number;
  effect: string;
  quantity: number;
  active: boolean;
  activatedAt?: string;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'study' | 'practice' | 'social';
  target: number;
  progress: number;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  expiresAt: string;
}

interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  rank: number;
  movement: 'up' | 'down' | 'same';
  isCurrentUser?: boolean;
}

// Main Enhanced ACF Exam App Component
const ACFGamifiedApp = () => {
  // Core state management from original
  const [activeSection, setActiveSection] = useState('home');
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [completedTopics, setCompletedTopics] = useState({});
  const [quizHistory, setQuizHistory] = useState([]);
  const [studyTime, setStudyTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [studyMode, setStudyMode] = useState('practice');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showFormulas, setShowFormulas] = useState(false);
  const [weakAreas, setWeakAreas] = useState([]);
  const [examDate, setExamDate] = useState('');
  const [studyPlan, setStudyPlan] = useState('standard');
  const [expandedTopics, setExpandedTopics] = useState({});

  // New gamification state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user-1',
    name: 'Finance Student',
    avatar: '👨‍🎓',
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalXP: 0,
    coins: 100,
    streak: 0,
    longestStreak: 0,
    achievements: [],
    unlockedFeatures: ['basic_quiz', 'formulas'],
    powerUps: [],
    dailyGoalsCompleted: 0,
    weeklyRank: 0,
    globalRank: 0,
    preferredStudyTime: 'morning',
    learningStyle: 'visual'
  });

  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState('');
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [lastCorrectTime, setLastCorrectTime] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState('');
  const [studyGoals, setStudyGoals] = useState({ daily: 30, weekly: 180 });
  const [notifications, setNotifications] = useState([]);
  const [battleMode, setBattleMode] = useState(false);
  const [opponent, setOpponent] = useState(null);

  // Mobile-specific state
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const [touchStart, setTouchStart] = useState(null);
  const [swipeDirection, setSwipeDirection] = useState(null);

  // Refs for animations and effects
  const confettiRef = useRef(null);
  const audioRef = useRef(null);
  const vibrationRef = useRef(null);

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  // Initialize daily challenges
  useEffect(() => {
    const generateDailyChallenges = () => {
      const challenges: DailyChallenge[] = [
        {
          id: 'daily-1',
          title: '🎯 Quick Fire Round',
          description: 'Complete 3 quizzes with 80%+ accuracy',
          type: 'quiz',
          target: 3,
          progress: 0,
          xpReward: 50,
          coinReward: 20,
          completed: false,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'daily-2',
          title: '📚 Study Marathon',
          description: 'Study for 30 minutes total',
          type: 'study',
          target: 1800,
          progress: studyTime,
          xpReward: 40,
          coinReward: 15,
          completed: false,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'daily-3',
          title: '🔥 Combo Master',
          description: 'Get 5 questions correct in a row',
          type: 'practice',
          target: 5,
          progress: 0,
          xpReward: 60,
          coinReward: 25,
          completed: false,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setDailyChallenges(challenges);
    };

    generateDailyChallenges();
  }, []);

  // Achievement definitions
  const achievements: Achievement[] = [
    {
      id: 'first_quiz',
      name: 'First Steps',
      description: 'Complete your first quiz',
      icon: Trophy,
      unlocked: false,
      progress: quizHistory.length,
      maxProgress: 1,
      rarity: 'common',
      xpReward: 10,
      coinReward: 5
    },
    {
      id: 'perfect_score',
      name: 'Perfectionist',
      description: 'Get 100% on any quiz',
      icon: Star,
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      rarity: 'rare',
      xpReward: 50,
      coinReward: 20
    },
    {
      id: 'week_streak',
      name: 'Dedicated Learner',
      description: 'Maintain a 7-day study streak',
      icon: Flame,
      unlocked: false,
      progress: userProfile.streak,
      maxProgress: 7,
      rarity: 'rare',
      xpReward: 100,
      coinReward: 50
    },
    {
      id: 'all_topics',
      name: 'Master of Finance',
      description: 'Complete all 9 topics with 80%+',
      icon: Crown,
      unlocked: false,
      progress: Object.keys(completedTopics).length,
      maxProgress: 9,
      rarity: 'legendary',
      xpReward: 500,
      coinReward: 200
    },
    {
      id: 'speed_demon',
      name: 'Speed Demon',
      description: 'Complete a quiz in under 2 minutes',
      icon: Rocket,
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      rarity: 'epic',
      xpReward: 75,
      coinReward: 30
    },
    {
      id: 'night_owl',
      name: 'Night Owl',
      description: 'Study after 10 PM',
      icon: Moon,
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      rarity: 'common',
      xpReward: 20,
      coinReward: 10
    },
    {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Study before 7 AM',
      icon: Coffee,
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      rarity: 'common',
      xpReward: 20,
      coinReward: 10
    },
    {
      id: 'social_butterfly',
      name: 'Social Butterfly',
      description: 'Challenge 5 friends to quiz battles',
      icon: Users,
      unlocked: false,
      progress: 0,
      maxProgress: 5,
      rarity: 'rare',
      xpReward: 80,
      coinReward: 40
    }
  ];

  // Power-ups available in the shop
  const powerUps: PowerUp[] = [
    {
      id: 'double_xp',
      name: 'Double XP',
      description: '2x XP for 30 minutes',
      icon: Sparkles,
      duration: 1800,
      effect: 'xp_multiplier',
      quantity: 0,
      active: false
    },
    {
      id: 'hint_master',
      name: 'Hint Master',
      description: 'Get 3 free hints',
      icon: Lightbulb,
      duration: 0,
      effect: 'free_hints',
      quantity: 0,
      active: false
    },
    {
      id: 'time_freeze',
      name: 'Time Freeze',
      description: 'Pause timer for one question',
      icon: Pause,
      duration: 0,
      effect: 'pause_timer',
      quantity: 0,
      active: false
    },
    {
      id: 'second_chance',
      name: 'Second Chance',
      description: 'Retry one wrong answer',
      icon: RefreshCw,
      duration: 0,
      effect: 'retry_answer',
      quantity: 0,
      active: false
    },
    {
      id: 'combo_shield',
      name: 'Combo Shield',
      description: 'Protect combo for one mistake',
      icon: Shield,
      duration: 0,
      effect: 'protect_combo',
      quantity: 0,
      active: false
    }
  ];

  // Enhanced topic structure with visual elements
  const topics = [
    { 
      id: 'tvm', 
      name: 'Time Value of Money', 
      icon: Clock, 
      color: 'blue',
      emoji: '⏰',
      description: 'Present value, future value, and discounting',
      difficulty: 2,
      estimatedTime: 45,
      unlockLevel: 1
    },
    { 
      id: 'portfolio', 
      name: 'Portfolio Theory', 
      icon: TrendingUp, 
      color: 'green',
      emoji: '📈',
      description: 'Expected returns, risk, and diversification',
      difficulty: 3,
      estimatedTime: 60,
      unlockLevel: 2
    },
    { 
      id: 'bonds', 
      name: 'Investment Returns & Bonds', 
      icon: Calculator, 
      color: 'purple',
      emoji: '💰',
      description: 'Bond valuation, YTM, and holding period returns',
      difficulty: 3,
      estimatedTime: 55,
      unlockLevel: 3
    },
    { 
      id: 'balance', 
      name: 'Balance Sheet', 
      icon: FileText, 
      color: 'orange',
      emoji: '📊',
      description: 'Assets, liabilities, equity classification',
      difficulty: 2,
      estimatedTime: 40,
      unlockLevel: 1
    },
    { 
      id: 'statements', 
      name: 'Financial Statement Links', 
      icon: BookOpen, 
      color: 'red',
      emoji: '📚',
      description: 'Income statement to balance sheet connections',
      difficulty: 3,
      estimatedTime: 50,
      unlockLevel: 4
    },
    { 
      id: 'excel', 
      name: 'Excel for Finance', 
      icon: BarChart, 
      color: 'cyan',
      emoji: '📊',
      description: 'Financial functions and modeling',
      difficulty: 2,
      estimatedTime: 35,
      unlockLevel: 2
    },
    { 
      id: 'annuities', 
      name: 'Annuities & Perpetuities', 
      icon: RefreshCw, 
      color: 'pink',
      emoji: '🔄',
      description: 'Regular payment streams and valuation',
      difficulty: 3,
      estimatedTime: 45,
      unlockLevel: 5
    },
    { 
      id: 'ratios', 
      name: 'Ratio Analysis', 
      icon: Target, 
      color: 'yellow',
      emoji: '🎯',
      description: 'Liquidity and leverage ratios',
      difficulty: 2,
      estimatedTime: 40,
      unlockLevel: 3
    },
    { 
      id: 'capital', 
      name: 'Capital Budgeting', 
      icon: Award, 
      color: 'indigo',
      emoji: '🏆',
      description: 'NPV, IRR, and project evaluation',
      difficulty: 4,
      estimatedTime: 65,
      unlockLevel: 6
    }
  ];

  // Sound effects
  const playSound = useCallback((soundType: string) => {
    if (!soundEnabled) return;
    
    // In a real app, you'd load actual audio files
    const sounds = {
      correct: '✅',
      incorrect: '❌',
      levelUp: '🎉',
      achievement: '🏆',
      combo: '🔥',
      powerUp: '⚡',
      click: '🔊'
    };
    
    console.log(`Playing sound: ${sounds[soundType]}`);
  }, [soundEnabled]);

  // Haptic feedback
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy') => {
    if (!hapticEnabled || !isMobile) return;
    
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 30]
      };
      navigator.vibrate(patterns[type]);
    }
  }, [hapticEnabled, isMobile]);

  // XP and Level calculations
  const addXP = useCallback((amount: number) => {
    let xpToAdd = amount;
    
    // Apply power-up multipliers
    const activeDoubleXP = userProfile.powerUps.find(p => p.id === 'double_xp' && p.active);
    if (activeDoubleXP) {
      xpToAdd *= 2;
    }
    
    // Apply combo multiplier
    xpToAdd *= comboMultiplier;
    
    setUserProfile(prev => {
      const newXP = prev.xp + xpToAdd;
      const newTotalXP = prev.totalXP + xpToAdd;
      let newLevel = prev.level;
      let remainingXP = newXP;
      let xpToNext = prev.xpToNextLevel;
      
      // Level up logic
      while (remainingXP >= xpToNext) {
        remainingXP -= xpToNext;
        newLevel++;
        xpToNext = calculateXPToNextLevel(newLevel);
        
        // Trigger level up celebration
        setTimeout(() => {
          setCelebrationType('levelUp');
          setShowCelebration(true);
          playSound('levelUp');
          triggerHaptic('heavy');
        }, 100);
      }
      
      return {
        ...prev,
        xp: remainingXP,
        totalXP: newTotalXP,
        level: newLevel,
        xpToNextLevel: xpToNext
      };
    });
    
    // Show XP gain animation
    showXPGainAnimation(xpToAdd);
  }, [comboMultiplier, playSound, triggerHaptic]);

  const calculateXPToNextLevel = (level: number) => {
    return 100 + (level - 1) * 50; // Progressive difficulty
  };

  const showXPGainAnimation = (xp: number) => {
    // In a real app, this would trigger a floating +XP animation
    console.log(`+${xp} XP!`);
  };

  // Check and unlock achievements
  const checkAchievements = useCallback(() => {
    const updatedAchievements = achievements.map(achievement => {
      let shouldUnlock = false;
      
      switch (achievement.id) {
        case 'first_quiz':
          shouldUnlock = quizHistory.length >= 1;
          break;
        case 'perfect_score':
          shouldUnlock = quizHistory.some(q => q.score === q.total);
          break;
        case 'week_streak':
          shouldUnlock = userProfile.streak >= 7;
          break;
        case 'all_topics':
          shouldUnlock = Object.keys(completedTopics).length >= 9;
          break;
        case 'speed_demon':
          shouldUnlock = quizHistory.some(q => q.timeSpent < 120);
          break;
        case 'night_owl':
          shouldUnlock = new Date().getHours() >= 22;
          break;
        case 'early_bird':
          shouldUnlock = new Date().getHours() < 7;
          break;
      }
      
      if (shouldUnlock && !achievement.unlocked) {
        // Unlock achievement
        setTimeout(() => {
          setCelebrationType('achievement');
          setShowCelebration(true);
          playSound('achievement');
          triggerHaptic('medium');
          addXP(achievement.xpReward);
          setUserProfile(prev => ({
            ...prev,
            coins: prev.coins + achievement.coinReward
          }));
        }, 500);
        
        return { ...achievement, unlocked: true, unlockedDate: new Date().toISOString() };
      }
      
      return achievement;
    });
    
    setUserProfile(prev => ({
      ...prev,
      achievements: updatedAchievements
    }));
  }, [quizHistory, userProfile.streak, completedTopics, playSound, triggerHaptic, addXP]);

  // Enhanced quiz handling with gamification
  const handleQuizSubmit = () => {
    setIsTimerRunning(false);
    setShowResults(true);
    
    const score = calculateScore();
    const totalQuestions = currentQuiz.questions.length;
    const accuracy = score / totalQuestions;
    
    // Calculate XP rewards
    let xpEarned = 10; // Base XP
    xpEarned += score * 5; // 5 XP per correct answer
    
    if (accuracy >= 0.8) xpEarned += 20; // Bonus for high accuracy
    if (accuracy === 1) xpEarned += 30; // Perfect score bonus
    
    // Time bonus
    const timeBonus = Math.max(0, Math.floor((300 - (300 - timerSeconds)) / 10));
    xpEarned += timeBonus;
    
    // Add XP and coins
    addXP(xpEarned);
    const coinsEarned = Math.floor(xpEarned / 3);
    setUserProfile(prev => ({
      ...prev,
      coins: prev.coins + coinsEarned
    }));
    
    // Update quiz history
    const history = {
      topicId: currentQuiz.topicId,
      score,
      total: totalQuestions,
      date: new Date().toISOString(),
      timeSpent: (currentQuiz.mode === 'exam' ? 900 : 300) - timerSeconds,
      mode: currentQuiz.mode,
      xpEarned,
      coinsEarned,
      accuracy
    };
    
    setQuizHistory([...quizHistory, history]);
    
    // Update completed topics if passed
    if (accuracy >= 0.8) {
      setCompletedTopics(prev => ({
        ...prev,
        [currentQuiz.topicId]: true
      }));
    }
    
    // Check achievements
    checkAchievements();
    
    // Update daily challenges
    updateDailyChallenges('quiz', accuracy);
  };

  const updateDailyChallenges = (type: string, value: any) => {
    setDailyChallenges(prev => prev.map(challenge => {
      if (challenge.type === type && !challenge.completed) {
        let newProgress = challenge.progress;
        
        switch (type) {
          case 'quiz':
            if (value >= 0.8) newProgress++;
            break;
          case 'study':
            newProgress = studyTime;
            break;
          case 'practice':
            // Handle combo tracking
            break;
        }
        
        if (newProgress >= challenge.target) {
          // Challenge completed!
          setTimeout(() => {
            addXP(challenge.xpReward);
            setUserProfile(prev => ({
              ...prev,
              coins: prev.coins + challenge.coinReward,
              dailyGoalsCompleted: prev.dailyGoalsCompleted + 1
            }));
            playSound('achievement');
            triggerHaptic('medium');
          }, 300);
          
          return { ...challenge, progress: newProgress, completed: true };
        }
        
        return { ...challenge, progress: newProgress };
      }
      return challenge;
    }));
  };

  // Touch gesture handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
      time: Date.now()
    };
    
    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;
    const dt = touchEnd.time - touchStart.time;
    
    const swipeThreshold = 50;
    const swipeTimeout = 500;
    
    if (dt < swipeTimeout) {
      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > swipeThreshold) {
          setSwipeDirection(dx > 0 ? 'right' : 'left');
          handleSwipe(dx > 0 ? 'right' : 'left');
        }
      } else {
        if (Math.abs(dy) > swipeThreshold) {
          setSwipeDirection(dy > 0 ? 'down' : 'up');
          handleSwipe(dy > 0 ? 'down' : 'up');
        }
      }
    }
    
    setTouchStart(null);
  };

  const handleSwipe = (direction: string) => {
    triggerHaptic('light');
    
    // Navigate between sections with swipe
    const sections = ['home', 'learn', 'practice', 'battle', 'profile'];
    const currentIndex = sections.indexOf(activeSection);
    
    if (direction === 'left' && currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1]);
    } else if (direction === 'right' && currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1]);
    }
  };

  // Render celebration animations
  const renderCelebration = () => {
    if (!showCelebration) return null;
    
    const celebrations = {
      levelUp: {
        icon: '🎉',
        title: 'Level Up!',
        subtitle: `You're now level ${userProfile.level}!`,
        color: 'gold'
      },
      achievement: {
        icon: '🏆',
        title: 'Achievement Unlocked!',
        subtitle: 'Check your profile for details',
        color: 'purple'
      },
      perfect: {
        icon: '💯',
        title: 'Perfect Score!',
        subtitle: 'Absolutely brilliant!',
        color: 'green'
      },
      streak: {
        icon: '🔥',
        title: `${userProfile.streak} Day Streak!`,
        subtitle: 'Keep it up!',
        color: 'orange'
      }
    };
    
    const celebration = celebrations[celebrationType] || celebrations.perfect;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className={`
          transform scale-0 animate-bounce-in
          bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8
          border-4 border-${celebration.color}-400
        `}>
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">{celebration.icon}</div>
            <h2 className="text-2xl font-bold mb-2">{celebration.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{celebration.subtitle}</p>
          </div>
        </div>
      </div>
    );
  };

  // Mobile-optimized navigation
  const renderMobileNav = () => {
    const navItems = [
      { id: 'home', icon: Brain, label: 'Learn' },
      { id: 'practice', icon: Gamepad2, label: 'Practice' },
      { id: 'battle', icon: Swords, label: 'Battle' },
      { id: 'shop', icon: Gift, label: 'Shop' },
      { id: 'profile', icon: User, label: 'Profile' }
    ];
    
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
        <div className="flex justify-around items-center py-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  triggerHaptic('light');
                  playSound('click');
                }}
                className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'animate-bounce' : ''}`} />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Render main content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return renderHome();
      case 'learn':
        return renderLearn();
      case 'practice':
        return renderPractice();
      case 'battle':
        return renderBattle();
      case 'shop':
        return renderShop();
      case 'profile':
        return renderProfile();
      case 'quiz':
        return renderQuiz();
      default:
        return renderHome();
    }
  };

  const renderHome = () => {
    return (
      <div className="space-y-6 pb-20">
        {/* User Stats Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{userProfile.avatar}</div>
              <div>
                <h2 className="font-bold text-lg">{userProfile.name}</h2>
                <p className="text-sm opacity-90">Level {userProfile.level} • {userProfile.totalXP} XP</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Flame className="w-5 h-5" />
                <span className="font-bold">{userProfile.streak}</span>
              </div>
              <div className="flex items-center gap-1">
                <Coins className="w-5 h-5 text-yellow-300" />
                <span className="font-bold">{userProfile.coins}</span>
              </div>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-500 ease-out"
              style={{ width: `${(userProfile.xp / userProfile.xpToNextLevel) * 100}%` }}
            />
          </div>
          <p className="text-xs mt-1 text-right opacity-90">
            {userProfile.xp}/{userProfile.xpToNextLevel} XP to Level {userProfile.level + 1}
          </p>
        </div>

        {/* Daily Challenges */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" />
            Daily Challenges
          </h3>
          <div className="space-y-3">
            {dailyChallenges.map(challenge => (
              <div 
                key={challenge.id}
                className={`p-3 rounded-xl border-2 transition-all ${
                  challenge.completed 
                    ? 'bg-green-50 border-green-300 dark:bg-green-900/20' 
                    : 'bg-gray-50 border-gray-200 dark:bg-gray-700/50 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{challenge.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        {challenge.xpReward}
                      </span>
                      <span className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        {challenge.coinReward}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      challenge.completed ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, (challenge.progress / challenge.target) * 100)}%` }}
                  />
                </div>
                <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                  {challenge.progress}/{challenge.target} {challenge.completed && '✓'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              const recommendedTopic = getRecommendedTopic();
              startQuiz(recommendedTopic);
            }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all"
          >
            <Zap className="w-8 h-8 mb-2" />
            <p className="font-bold">Quick Practice</p>
            <p className="text-sm opacity-90">AI-recommended</p>
          </button>
          
          <button
            onClick={() => setBattleMode(true)}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all"
          >
            <Swords className="w-8 h-8 mb-2" />
            <p className="font-bold">Battle Mode</p>
            <p className="text-sm opacity-90">Challenge friends</p>
          </button>
        </div>

        {/* Study Path Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-lg mb-3">Your Learning Journey</h3>
          <div className="relative">
            {/* Progress Path */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-600" />
            
            {topics.map((topic, index) => {
              const isUnlocked = userProfile.level >= topic.unlockLevel;
              const isCompleted = completedTopics[topic.id];
              const progress = getTopicProgress(topic.id);
              
              return (
                <div key={topic.id} className="relative flex items-center mb-6 last:mb-0">
                  {/* Node */}
                  <div className={`
                    relative z-10 w-16 h-16 rounded-full flex items-center justify-center
                    ${isCompleted ? 'bg-green-500' : isUnlocked ? 'bg-blue-500' : 'bg-gray-300'}
                    shadow-lg transform transition-all
                    ${isUnlocked ? 'hover:scale-110 cursor-pointer' : ''}
                  `}
                  onClick={() => isUnlocked && handleTopicClick(topic)}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : isUnlocked ? (
                      <span className="text-2xl">{topic.emoji}</span>
                    ) : (
                      <Lock className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className={`ml-4 flex-1 p-4 rounded-xl ${
                    isUnlocked ? 'bg-gray-50 dark:bg-gray-700' : 'opacity-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{topic.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{topic.description}</p>
                        {!isUnlocked && (
                          <p className="text-xs text-gray-500 mt-1">
                            Unlocks at Level {topic.unlockLevel}
                          </p>
                        )}
                      </div>
                      {isUnlocked && (
                        <div className="text-right">
                          <p className="text-sm font-medium">{progress}%</p>
                          <div className="flex gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < Math.floor(progress / 20) 
                                    ? 'text-yellow-400 fill-yellow-400' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderLearn = () => {
    if (!selectedTopic) {
      return (
        <div className="space-y-4 pb-20">
          <h2 className="text-2xl font-bold mb-4">Choose a Topic to Learn</h2>
          <div className="grid grid-cols-1 gap-4">
            {topics.filter(topic => userProfile.level >= topic.unlockLevel).map(topic => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent hover:border-blue-500 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{topic.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{topic.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{topic.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {topic.estimatedTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart className="w-3 h-3" />
                        Difficulty: {topic.difficulty}/5
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {getTopicProgress(topic.id)}% complete
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Interactive learning content
    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSelectedTopic(null)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <h2 className="text-xl font-bold">
            {topics.find(t => t.id === selectedTopic)?.name}
          </h2>
          <button
            onClick={() => {/* Toggle study mode */}}
            className="text-gray-600 dark:text-gray-400"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive content based on topic */}
        {renderInteractiveLearningContent(selectedTopic)}
        
        {/* Practice buttons */}
        <div className="fixed bottom-20 left-4 right-4 flex gap-3">
          <button
            onClick={() => startQuiz(selectedTopic)}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium shadow-lg"
          >
            Take Quiz
          </button>
          <button
            onClick={() => {/* Open practice problems */}}
            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium shadow-lg"
          >
            Practice Problems
          </button>
        </div>
      </div>
    );
  };

  const renderInteractiveLearningContent = (topicId: string) => {
    // This would be expanded with actual interactive content
    const content = {
      tvm: (
        <div className="space-y-6">
          {/* Interactive TVM Calculator */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Interactive TVM Calculator</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Present Value</label>
                <input 
                  type="number" 
                  className="w-full p-2 rounded-lg border"
                  placeholder="Enter PV"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Interest Rate (%)</label>
                <input 
                  type="number" 
                  className="w-full p-2 rounded-lg border"
                  placeholder="Enter rate"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Time Periods</label>
                <input 
                  type="number" 
                  className="w-full p-2 rounded-lg border"
                  placeholder="Enter periods"
                />
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium">
                Calculate FV
              </button>
              <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Future Value:</p>
                <p className="text-2xl font-bold">$0.00</p>
              </div>
            </div>
          </div>

          {/* Visual Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
            <h3 className="font-semibold mb-3">Cash Flow Timeline</h3>
            <div className="relative h-32">
              {/* Animated timeline visualization would go here */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <p>Interactive timeline visualization</p>
              </div>
            </div>
          </div>

          {/* Key Concepts with Animations */}
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl">
              <h4 className="font-medium mb-2">💡 Key Insight</h4>
              <p className="text-sm">Money today is worth more than money tomorrow due to opportunity cost!</p>
            </div>
          </div>
        </div>
      ),
      // Add more interactive content for other topics...
    };

    return content[topicId] || <div>Content coming soon...</div>;
  };

  const renderPractice = () => {
    return (
      <div className="space-y-6 pb-20">
        <h2 className="text-2xl font-bold mb-4">Practice Arena</h2>
        
        {/* Practice Modes */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              const topic = getRecommendedTopic();
              startQuiz(topic);
            }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg"
          >
            <Brain className="w-8 h-8 mb-2" />
            <p className="font-bold">Smart Practice</p>
            <p className="text-xs opacity-90">AI picks topics</p>
          </button>
          
          <button
            onClick={() => startComprehensiveExam()}
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg"
          >
            <FileText className="w-8 h-8 mb-2" />
            <p className="font-bold">Mock Exam</p>
            <p className="text-xs opacity-90">Full test</p>
          </button>
          
          <button
            onClick={() => {/* Speed round */}}
            className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg"
          >
            <Zap className="w-8 h-8 mb-2" />
            <p className="font-bold">Speed Round</p>
            <p className="text-xs opacity-90">60 second blitz</p>
          </button>
          
          <button
            onClick={() => {/* Endless mode */}}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg"
          >
            <RefreshCw className="w-8 h-8 mb-2" />
            <p className="font-bold">Endless Mode</p>
            <p className="text-xs opacity-90">How far can you go?</p>
          </button>
        </div>

        {/* Topic Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-lg mb-3">Practice by Topic</h3>
          <div className="space-y-2">
            {topics.filter(t => userProfile.level >= t.unlockLevel).map(topic => {
              const progress = getTopicProgress(topic.id);
              const isCompleted = completedTopics[topic.id];
              
              return (
                <button
                  key={topic.id}
                  onClick={() => startQuiz(topic.id)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{topic.emoji}</span>
                      <div className="text-left">
                        <p className="font-medium">{topic.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {progress}% mastered
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCompleted && <Check className="w-5 h-5 text-green-500" />}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderBattle = () => {
    return (
      <div className="space-y-6 pb-20">
        <h2 className="text-2xl font-bold mb-4">Battle Arena ⚔️</h2>
        
        {/* Battle Stats */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs opacity-90">Wins</p>
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs opacity-90">Losses</p>
            </div>
            <div>
              <p className="text-2xl font-bold">0%</p>
              <p className="text-xs opacity-90">Win Rate</p>
            </div>
          </div>
        </div>

        {/* Battle Options */}
        <div className="space-y-4">
          <button className="w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border-2 border-orange-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Swords className="w-8 h-8 text-orange-500" />
                <div className="text-left">
                  <p className="font-bold">Quick Battle</p>
                  <p className="text-sm text-gray-600">Match with random opponent</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
          
          <button className="w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border-2 border-purple-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-500" />
                <div className="text-left">
                  <p className="font-bold">Challenge Friend</p>
                  <p className="text-sm text-gray-600">Send battle invite</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
          
          <button className="w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border-2 border-blue-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-blue-500" />
                <div className="text-left">
                  <p className="font-bold">Tournament</p>
                  <p className="text-sm text-gray-600">Join weekly competition</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </div>

        {/* Leaderboard Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-lg mb-3 flex items-center justify-between">
            <span>Top Players</span>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </h3>
          <div className="space-y-2">
            {[1, 2, 3].map(rank => (
              <div key={rank} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg w-6">{rank}</span>
                  <div className="w-8 h-8 bg-gray-300 rounded-full" />
                  <div>
                    <p className="font-medium">Player {rank}</p>
                    <p className="text-xs text-gray-600">Level 15</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">2,450</p>
                  <p className="text-xs text-gray-600">Rating</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderShop = () => {
    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Shop</h2>
          <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
            <Coins className="w-5 h-5 text-yellow-600" />
            <span className="font-bold">{userProfile.coins}</span>
          </div>
        </div>

        {/* Power-ups */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-lg mb-3">Power-ups</h3>
          <div className="grid grid-cols-2 gap-3">
            {powerUps.map(powerUp => {
              const Icon = powerUp.icon;
              return (
                <button
                  key={powerUp.id}
                  className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-transparent hover:border-purple-500 transition-all"
                >
                  <Icon className="w-8 h-8 mb-2 text-purple-600" />
                  <p className="font-medium text-sm">{powerUp.name}</p>
                  <p className="text-xs text-gray-600 mb-2">{powerUp.description}</p>
                  <div className="flex items-center justify-center gap-1">
                    <Coins className="w-4 h-4 text-yellow-600" />
                    <span className="font-bold">50</span>
                  </div>
                  {powerUp.quantity > 0 && (
                    <span className="text-xs text-gray-500">Owned: {powerUp.quantity}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Avatars */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-lg mb-3">Avatars</h3>
          <div className="grid grid-cols-4 gap-3">
            {['👨‍🎓', '👩‍🎓', '🧑‍💼', '👨‍💼', '👩‍💼', '🦸‍♂️', '🦸‍♀️', '🧙‍♂️'].map(avatar => (
              <button
                key={avatar}
                className={`p-4 text-3xl rounded-xl border-2 ${
                  userProfile.avatar === avatar 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        {/* Themes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-lg mb-3">Themes</h3>
          <div className="space-y-2">
            <button className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5" />
                <span>Dark Mode</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-600" />
                <span>Free</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    return (
      <div className="space-y-6 pb-20">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{userProfile.avatar}</div>
            <div>
              <h2 className="text-2xl font-bold">{userProfile.name}</h2>
              <p className="opacity-90">Level {userProfile.level} Finance Master</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 rounded-xl p-3">
              <p className="text-sm opacity-90">Total XP</p>
              <p className="text-xl font-bold">{userProfile.totalXP}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <p className="text-sm opacity-90">Best Streak</p>
              <p className="text-xl font-bold">{userProfile.longestStreak} days</p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-lg mb-3">Achievements</h3>
          <div className="grid grid-cols-3 gap-3">
            {achievements.slice(0, 6).map(achievement => {
              const Icon = achievement.icon;
              const isUnlocked = userProfile.achievements.find(a => a.id === achievement.id)?.unlocked;
              
              return (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-xl text-center ${
                    isUnlocked 
                      ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20' 
                      : 'bg-gray-100 dark:bg-gray-700 opacity-50'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-1 ${
                    isUnlocked ? 'text-yellow-600' : 'text-gray-400'
                  }`} />
                  <p className="text-xs font-medium">{achievement.name}</p>
                </div>
              );
            })}
          </div>
          <button className="w-full mt-3 text-center text-sm text-blue-600 dark:text-blue-400">
            View All Achievements →
          </button>
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-lg mb-3">Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Quizzes Completed</span>
              <span className="font-bold">{quizHistory.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Score</span>
              <span className="font-bold">
                {quizHistory.length > 0 
                  ? Math.round(quizHistory.reduce((sum, q) => sum + (q.score/q.total), 0) / quizHistory.length * 100)
                  : 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Study Time</span>
              <span className="font-bold">{Math.floor(studyTime / 60)} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Topics Mastered</span>
              <span className="font-bold">{Object.keys(completedTopics).length}/9</span>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-lg mb-3">Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Sound Effects
              </span>
              <input 
                type="checkbox" 
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="toggle"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Haptic Feedback
              </span>
              <input 
                type="checkbox" 
                checked={hapticEnabled}
                onChange={(e) => setHapticEnabled(e.target.checked)}
                className="toggle"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Moon className="w-5 h-5" />
                Dark Mode
              </span>
              <input 
                type="checkbox" 
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="toggle"
              />
            </label>
          </div>
        </div>
      </div>
    );
  };

  const renderQuiz = () => {
    // Enhanced quiz interface with hints, power-ups, and visual feedback
    if (!currentQuiz) return null;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Quiz Header */}
        <div className="bg-white dark:bg-gray-800 shadow-lg p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg">{currentQuiz.title}</h3>
            <button
              onClick={() => {
                if (confirm('Exit quiz? Progress will be lost!')) {
                  setActiveSection('practice');
                  setCurrentQuiz(null);
                }
              }}
              className="text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Timer and Progress */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className={`font-mono ${timerSeconds < 60 ? 'text-red-600' : ''}`}>
                {formatTime(timerSeconds)}
              </span>
            </div>
            
            {/* Combo Indicator */}
            {comboMultiplier > 1 && (
              <div className="flex items-center gap-1 text-orange-600 animate-pulse">
                <Flame className="w-4 h-4" />
                <span className="font-bold">{comboMultiplier}x Combo!</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {Object.keys(quizAnswers).length}/{currentQuiz.questions.length}
              </span>
            </div>
          </div>
          
          {/* Question Progress Dots */}
          <div className="flex gap-1 mt-3 overflow-x-auto">
            {currentQuiz.questions.map((q, idx) => (
              <div
                key={q.id}
                className={`w-2 h-2 rounded-full ${
                  quizAnswers[q.id] !== undefined 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quiz Content */}
        <div className="p-4 pb-24">
          {!showResults ? (
            // Questions
            <div className="space-y-6">
              {currentQuiz.questions.map((question, qIndex) => (
                <div 
                  key={question.id} 
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-fade-in"
                >
                  {/* Question */}
                  <div className="mb-4">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                        {qIndex + 1}
                      </span>
                      <p className="font-medium text-lg flex-1">{question.question}</p>
                    </div>
                    
                    {/* Difficulty Badge */}
                    {question.difficulty && (
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ml-11 ${
                        question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {question.difficulty}
                      </span>
                    )}
                  </div>
                  
                  {/* Options */}
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <button
                        key={oIndex}
                        onClick={() => {
                          handleAnswerSelect(question.id, oIndex);
                          playSound('click');
                          triggerHaptic('light');
                        }}
                        className={`w-full p-4 rounded-xl text-left transition-all transform hover:scale-[1.02] ${
                          quizAnswers[question.id] === oIndex
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            quizAnswers[question.id] === oIndex
                              ? 'border-white bg-white'
                              : 'border-gray-400'
                          }`}>
                            {quizAnswers[question.id] === oIndex && (
                              <div className="w-3 h-3 bg-blue-600 rounded-full" />
                            )}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Hint Button */}
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setShowHints(true);
                        setCurrentHint(question.explanation.substring(0, 50) + '...');
                      }}
                      className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1"
                    >
                      <Lightbulb className="w-4 h-4" />
                      Get Hint (-5 coins)
                    </button>
                    
                    {/* Power-up buttons */}
                    <div className="flex gap-2">
                      {userProfile.powerUps.filter(p => p.quantity > 0).map(powerUp => (
                        <button
                          key={powerUp.id}
                          className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg"
                          title={powerUp.name}
                        >
                          <powerUp.icon className="w-4 h-4 text-purple-600" />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Show hint if active */}
                  {showHints && currentHint && (
                    <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm">
                      <p className="text-yellow-700 dark:text-yellow-300">💡 {currentHint}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Submit Button */}
              <button
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length < currentQuiz.questions.length}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                  Object.keys(quizAnswers).length < currentQuiz.questions.length
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-[1.02]'
                }`}
              >
                Submit Quiz
              </button>
            </div>
          ) : (
            // Results with detailed feedback
            renderQuizResults()
          )}
        </div>
      </div>
    );
  };

  const renderQuizResults = () => {
    const score = calculateScore();
    const total = currentQuiz.questions.length;
    const percentage = Math.round((score / total) * 100);
    const isPerfect = score === total;
    const passed = percentage >= 80;
    
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Score Card */}
        <div className={`
          bg-gradient-to-br text-white rounded-2xl p-8 text-center shadow-2xl
          ${isPerfect ? 'from-yellow-400 to-yellow-600' :
            passed ? 'from-green-400 to-green-600' :
            'from-orange-400 to-red-600'}
        `}>
          <div className="text-6xl font-bold mb-2">{percentage}%</div>
          <div className="text-2xl mb-4">{score}/{total} Correct</div>
          <div className="text-lg">
            {isPerfect ? '🌟 PERFECT SCORE! 🌟' :
             passed ? '✅ Great job! You passed!' :
             '📚 Keep practicing!'}
          </div>
        </div>
        
        {/* XP and Rewards */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-4">Rewards Earned</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Experience Points
              </span>
              <span className="font-bold text-lg">+{quizHistory[quizHistory.length - 1]?.xpEarned || 0} XP</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-600" />
                Coins
              </span>
              <span className="font-bold text-lg">+{quizHistory[quizHistory.length - 1]?.coinsEarned || 0}</span>
            </div>
            {comboMultiplier > 1 && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-600" />
                  Combo Bonus
                </span>
                <span className="font-bold text-lg">{comboMultiplier}x</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Detailed Review */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-4">Review Answers</h3>
          <div className="space-y-4">
            {currentQuiz.questions.map((question, idx) => {
              const userAnswer = quizAnswers[question.id];
              const isCorrect = userAnswer === question.correct;
              
              return (
                <div 
                  key={question.id}
                  className={`p-4 rounded-xl border-2 ${
                    isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                    'border-red-500 bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {isCorrect ? 
                      <Check className="w-5 h-5 text-green-600 mt-1" /> :
                      <X className="w-5 h-5 text-red-600 mt-1" />
                    }
                    <div className="flex-1">
                      <p className="font-medium mb-2">{idx + 1}. {question.question}</p>
                      
                      {/* Show correct/incorrect answers */}
                      {!isCorrect && (
                        <>
                          <p className="text-sm text-red-600 dark:text-red-400 mb-1">
                            Your answer: {question.options[userAnswer]}
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                            Correct answer: {question.options[question.correct]}
                          </p>
                        </>
                      )}
                      
                      {/* Explanation */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setActiveSection('practice');
              setCurrentQuiz(null);
            }}
            className="flex-1 py-3 bg-gray-600 text-white rounded-xl font-medium"
          >
            Back to Practice
          </button>
          <button
            onClick={() => startQuiz(currentQuiz.topicId)}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  };

  // Helper functions
  const calculateScore = () => {
    if (!currentQuiz) return 0;
    return currentQuiz.questions.reduce((score, question) => {
      return score + (quizAnswers[question.id] === question.correct ? 1 : 0);
    }, 0);
  };

  const getTopicProgress = (topicId: string) => {
    const topicHistory = quizHistory.filter(h => h.topicId === topicId);
    if (topicHistory.length === 0) return 0;
    
    const avgScore = topicHistory.reduce((sum, h) => sum + (h.score / h.total), 0) / topicHistory.length;
    return Math.round(avgScore * 100);
  };

  const getRecommendedTopic = () => {
    // AI-powered recommendation logic
    const topicScores = topics.map(topic => ({
      id: topic.id,
      score: getTopicProgress(topic.id),
      attempted: quizHistory.some(h => h.topicId === topic.id),
      unlocked: userProfile.level >= topic.unlockLevel
    })).filter(t => t.unlocked);
    
    // Prioritize topics not attempted
    const notAttempted = topicScores.filter(t => !t.attempted);
    if (notAttempted.length > 0) {
      return notAttempted[0].id;
    }
    
    // Then lowest scores
    const lowestScore = topicScores.reduce((min, t) => t.score < min.score ? t : min);
    return lowestScore.id;
  };

  const handleTopicClick = (topic: any) => {
    setSelectedTopic(topic.id);
    setActiveSection('learn');
    triggerHaptic('light');
    playSound('click');
  };

  const startQuiz = (topicId: string, mode = 'practice') => {
    const quiz = quizzes[topicId];
    if (quiz) {
      setCurrentQuiz({ ...quiz, topicId, mode });
      setQuizAnswers({});
      setShowResults(false);
      setTimerSeconds(mode === 'exam' ? 900 : 300);
      setIsTimerRunning(true);
      setActiveSection('quiz');
      setComboMultiplier(1);
      playSound('click');
      triggerHaptic('medium');
    }
  };

  const startComprehensiveExam = () => {
    // Create comprehensive exam
    const examQuestions = [];
    Object.entries(quizzes).forEach(([topicId, quiz]) => {
      const selectedQs = quiz.questions.slice(0, 2).map(q => ({
        ...q,
        topicId,
        id: `${topicId}-${q.id}`
      }));
      examQuestions.push(...selectedQs);
    });
    
    const shuffled = examQuestions.sort(() => Math.random() - 0.5);
    
    setCurrentQuiz({
      title: "Comprehensive ACF Exam",
      questions: shuffled,
      topicId: 'comprehensive',
      mode: 'exam'
    });
    setQuizAnswers({});
    setShowResults(false);
    setTimerSeconds(1200);
    setIsTimerRunning(true);
    setActiveSection('quiz');
    playSound('click');
    triggerHaptic('medium');
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answerIndex });
    
    // Update combo if answering in sequence
    const now = Date.now();
    if (lastCorrectTime && now - lastCorrectTime < 10000) { // Within 10 seconds
      setComboMultiplier(prev => Math.min(prev + 0.5, 5)); // Max 5x combo
    }
    setLastCorrectTime(now);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Main render
  return (
    <div 
      className={`min-h-screen ${darkMode ? 'dark' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        {/* Header */}
        {activeSection !== 'quiz' && (
          <div className="bg-white dark:bg-gray-800 shadow-sm p-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">ACF Exam Master</h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {/* Show notifications */}}
                  className="relative p-2"
                >
                  <MessageCircle className="w-6 h-6" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2"
                >
                  {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="max-w-md mx-auto p-4">
          {renderContent()}
        </div>
        
        {/* Mobile Navigation */}
        {isMobile && activeSection !== 'quiz' && renderMobileNav()}
        
        {/* Celebrations */}
        {renderCelebration()}
        
        {/* Onboarding */}
        {showOnboarding && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm">
              <h2 className="text-2xl font-bold mb-4">Welcome to ACF Exam Master! 🎓</h2>
              <p className="mb-4">Master finance concepts through gamified learning:</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Earn XP and level up</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Complete daily challenges</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Battle friends in quiz duels</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Unlock achievements and rewards</span>
                </li>
              </ul>
              <button
                onClick={() => {
                  setShowOnboarding(false);
                  playSound('click');
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold"
              >
                Let's Get Started! 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Quiz data (reusing from original)
const quizzes = {
  tvm: {
    title: "Time Value of Money",
    questions: [
      {
        id: 1,
        question: "What is the present value of $1,500 received in 3 years at 5% annual rate?",
        options: ["$1,295.34", "$1,736.44", "$1,428.57", "$1,323.92"],
        correct: 0,
        explanation: "PV = FV/(1+r)^n = 1500/(1.05)^3 = 1500/1.191016 = $1,295.34",
        difficulty: "medium"
      },
      {
        id: 2,
        question: "If the discount rate increases, present value:",
        options: ["Increases", "Decreases", "Stays the same", "Cannot determine"],
        correct: 1,
        explanation: "Higher discount rates reduce present value because future cash flows are worth less today",
        difficulty: "easy"
      },
      {
        id: 3,
        question: "To calculate PV in Excel with annual payments, which argument represents the discount rate?",
        options: ["nper", "rate", "pmt", "type"],
        correct: 1,
        explanation: "The 'rate' argument is the discount rate in Excel's PV function: =PV(rate, nper, pmt, [fv], [type])",
        difficulty: "easy"
      },
      {
        id: 4,
        question: "You can receive $500 today or $550 in one year. If your required return is 8%, which should you choose?",
        options: ["$500 today", "$550 in one year", "They are equal", "Need more info"],
        correct: 1,
        explanation: "PV of $550 = 550/1.08 = $509.26. Since $509.26 > $500, take $550 in one year.",
        difficulty: "medium"
      },
      {
        id: 5,
        question: "A project costs $10,000 today and returns $12,000 in 2 years. What's the annual return?",
        options: ["9.54%", "10%", "20%", "8.33%"],
        correct: 0,
        explanation: "Using (FV/PV)^(1/n) - 1 = (12000/10000)^(1/2) - 1 = 1.095445 - 1 = 9.54%",
        difficulty: "hard"
      }
    ]
  },
  portfolio: {
    title: "Portfolio Theory",
    questions: [
      {
        id: 1,
        question: "Portfolio with 40% Stock A (E(R)=15%) and 60% Stock B (E(R)=10%), expected return is:",
        options: ["12.5%", "12%", "11.5%", "13%"],
        correct: 1,
        explanation: "E(Rp) = 0.4(15%) + 0.6(10%) = 6% + 6% = 12%",
        difficulty: "easy"
      },
      {
        id: 2,
        question: "Diversification reduces risk most when assets have:",
        options: ["High positive correlation", "Low or negative correlation", "No correlation exactly", "Similar returns"],
        correct: 1,
        explanation: "Lower correlation means better diversification benefits as asset movements offset each other",
        difficulty: "medium"
      },
      {
        id: 3,
        question: "The efficient frontier represents portfolios with:",
        options: ["Highest return for given risk", "Lowest risk overall", "Equal weights", "No correlation"],
        correct: 0,
        explanation: "The efficient frontier shows optimal risk-return tradeoffs - maximum return for each level of risk",
        difficulty: "medium"
      },
      {
        id: 4,
        question: "Portfolio variance formula for two assets includes all EXCEPT:",
        options: ["Individual variances", "Weights squared", "Correlation", "Simple average of variances"],
        correct: 3,
        explanation: "Portfolio variance = w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂. Simple average ignores correlation effects.",
        difficulty: "hard"
      },
      {
        id: 5,
        question: "If two assets have correlation of -1, the minimum variance portfolio has:",
        options: ["50/50 weights", "Zero risk", "Maximum return", "Depends on individual risks"],
        correct: 3,
        explanation: "With perfect negative correlation, weights depend on individual standard deviations to minimize risk",
        difficulty: "hard"
      }
    ]
  },
  bonds: {
    title: "Bonds & Investment Returns",
    questions: [
      {
        id: 1,
        question: "$1,000 face bond, 5% coupon, 3 years, YTM=6%. Price is approximately:",
        options: ["$973", "$1,000", "$1,027", "$950"],
        correct: 0,
        explanation: "Bond trades at discount when YTM > coupon. Price = PV of coupons + PV of face ≈ $973",
        difficulty: "medium"
      },
      {
        id: 2,
        question: "When market interest rates rise, bond prices:",
        options: ["Rise", "Fall", "Stay constant", "Depends on coupon"],
        correct: 1,
        explanation: "Inverse relationship between rates and bond prices - as yields rise, prices fall",
        difficulty: "easy"
      },
      {
        id: 3,
        question: "Current yield equals:",
        options: ["YTM", "Coupon rate", "Annual coupon / Current price", "Total return"],
        correct: 2,
        explanation: "Current yield = Annual coupon payment / Current market price",
        difficulty: "easy"
      },
      {
        id: 4,
        question: "Zero-coupon bond maturing in 5 years has duration of:",
        options: ["0 years", "2.5 years", "5 years", "10 years"],
        correct: 2,
        explanation: "Zero-coupon bond duration equals its maturity since all cash flow occurs at maturity",
        difficulty: "medium"
      },
      {
        id: 5,
        question: "Bond purchased at $950, sold at $980 after receiving $50 coupon. HPR is:",
        options: ["8.42%", "5.26%", "3.16%", "10.53%"],
        correct: 0,
        explanation: "HPR = (980 + 50 - 950) / 950 = 80 / 950 = 8.42%",
        difficulty: "medium"
      }
    ]
  },
  balance: {
    title: "Balance Sheet Components",
    questions: [
      {
        id: 1,
        question: "Which is NOT a current asset?",
        options: ["Cash", "Inventory", "Equipment", "Accounts Receivable"],
        correct: 2,
        explanation: "Equipment is a long-term asset (PP&E), not expected to convert to cash within one year",
        difficulty: "easy"
      },
      {
        id: 2,
        question: "The accounting equation is:",
        options: ["Assets = Liabilities - Equity", "Assets = Liabilities + Equity", "Assets + Liabilities = Equity", "Equity = Assets + Liabilities"],
        correct: 1,
        explanation: "Assets = Liabilities + Equity is the fundamental accounting equation",
        difficulty: "easy"
      },
      {
        id: 3,
        question: "Unearned revenue is classified as:",
        options: ["Current asset", "Current liability", "Revenue", "Equity"],
        correct: 1,
        explanation: "Unearned revenue is a liability - obligation to provide goods/services for payment already received",
        difficulty: "medium"
      },
      {
        id: 4,
        question: "Which increases both assets and equity?",
        options: ["Paying dividends", "Earning profit", "Taking a loan", "Buying inventory with cash"],
        correct: 1,
        explanation: "Earning profit increases assets (cash/receivables) and equity (retained earnings)",
        difficulty: "medium"
      },
      {
        id: 5,
        question: "Accumulated depreciation is:",
        options: ["An expense", "A liability", "A contra-asset", "Part of equity"],
        correct: 2,
        explanation: "Accumulated depreciation is a contra-asset that reduces the book value of PP&E",
        difficulty: "medium"
      }
    ]
  },
  statements: {
    title: "Financial Statement Interactions",
    questions: [
      {
        id: 1,
        question: "Net income flows to which balance sheet account?",
        options: ["Cash", "Common Stock", "Retained Earnings", "Accounts Payable"],
        correct: 2,
        explanation: "Net income increases retained earnings: Ending RE = Beginning RE + NI - Dividends",
        difficulty: "easy"
      },
      {
        id: 2,
        question: "Beginning RE = $100,000, Net Income = $20,000, Dividends = $5,000. Ending RE =",
        options: ["$125,000", "$115,000", "$120,000", "$95,000"],
        correct: 1,
        explanation: "Ending RE = 100,000 + 20,000 - 5,000 = $115,000",
        difficulty: "easy"
      },
      {
        id: 3,
        question: "Depreciation expense affects:",
        options: ["Only income statement", "Only balance sheet", "Both statements", "Neither statement"],
        correct: 2,
        explanation: "Depreciation is an expense (I/S) and increases accumulated depreciation (B/S)",
        difficulty: "medium"
      },
      {
        id: 4,
        question: "Which does NOT affect retained earnings?",
        options: ["Net income", "Dividends", "Stock issuance", "Net loss"],
        correct: 2,
        explanation: "Stock issuance affects paid-in capital accounts, not retained earnings",
        difficulty: "medium"
      },
      {
        id: 5,
        question: "Revenue earned on credit increases:",
        options: ["Cash and Revenue", "A/R and Revenue", "Cash and A/R", "Only Revenue"],
        correct: 1,
        explanation: "Credit sales increase Accounts Receivable (asset) and Revenue (which flows to RE via NI)",
        difficulty: "medium"
      }
    ]
  },
  excel: {
    title: "Excel for Finance",
    questions: [
      {
        id: 1,
        question: "In Excel's PV function, what does 'type' represent?",
        options: ["Interest type", "Payment timing", "Compounding frequency", "Currency type"],
        correct: 1,
        explanation: "Type: 0 = payments at end of period (ordinary), 1 = payments at beginning (annuity due)",
        difficulty: "easy"
      },
      {
        id: 2,
        question: "To find loan payment amount, use:",
        options: ["=PV()", "=FV()", "=PMT()", "=NPV()"],
        correct: 2,
        explanation: "=PMT(rate, nper, pv, [fv], [type]) calculates periodic payment for a loan",
        difficulty: "easy"
      },
      {
        id: 3,
        question: "Excel's NPV function assumes first cash flow occurs:",
        options: ["At time 0", "At time 1", "At time 2", "User specifies"],
        correct: 1,
        explanation: "NPV assumes first value is one period from now; add time 0 cash flow separately",
        difficulty: "medium"
      },
      {
        id: 4,
        question: "To calculate portfolio return with weights in A1:A3 and returns in B1:B3:",
        options: ["=SUM(A1:A3*B1:B3)", "=SUMPRODUCT(A1:A3,B1:B3)", "=AVERAGE(A1:A3,B1:B3)", "=A1:A3*B1:B3"],
        correct: 1,
        explanation: "SUMPRODUCT multiplies corresponding elements and sums them - perfect for weighted averages",
        difficulty: "medium"
      },
      {
        id: 5,
        question: "For irregular cash flow dates, use:",
        options: ["=NPV()", "=XNPV()", "=PV()", "=IRR()"],
        correct: 1,
        explanation: "XNPV handles cash flows at irregular intervals using specific dates",
        difficulty: "hard"
      }
    ]
  },
  annuities: {
    title: "Annuities & Perpetuities",
    questions: [
      {
        id: 1,
        question: "Present value of $1,000/year for 5 years at 6% is closest to:",
        options: ["$4,212", "$5,000", "$4,465", "$3,837"],
        correct: 0,
        explanation: "PV = PMT × [(1-(1+r)^-n)/r] = 1000 × 4.212 = $4,212",
        difficulty: "medium"
      },
      {
        id: 2,
        question: "A perpetuity paying $100/year at 4% discount rate is worth:",
        options: ["$400", "$2,500", "$4,000", "$1,000"],
        correct: 1,
        explanation: "PV of perpetuity = PMT / r = 100 / 0.04 = $2,500",
        difficulty: "easy"
      },
      {
        id: 3,
        question: "Annuity due differs from ordinary annuity because payments occur:",
        options: ["Less frequently", "At beginning of period", "At end of period", "Irregularly"],
        correct: 1,
        explanation: "Annuity due has payments at beginning of each period vs. end for ordinary annuity",
        difficulty: "easy"
      },
      {
        id: 4,
        question: "Growing perpetuity with first payment $100, growth 2%, discount rate 5%. Value?",
        options: ["$2,000", "$3,333", "$5,000", "$1,667"],
        correct: 1,
        explanation: "PV = PMT / (r - g) = 100 / (0.05 - 0.02) = 100 / 0.03 = $3,333",
        difficulty: "hard"
      },
      {
        id: 5,
        question: "To convert ordinary annuity PV to annuity due PV:",
        options: ["Divide by (1+r)", "Multiply by (1+r)", "Add PMT", "Subtract PMT"],
        correct: 1,
        explanation: "Annuity due PV = Ordinary annuity PV × (1+r) since payments come one period sooner",
        difficulty: "medium"
      }
    ]
  },
  ratios: {
    title: "Financial Ratios",
    questions: [
      {
        id: 1,
        question: "Current ratio = 2.0 means:",
        options: ["2× more debt than assets", "2× more current assets than current liabilities", "2× leverage", "2% liquidity"],
        correct: 1,
        explanation: "Current ratio = Current Assets / Current Liabilities. 2.0 means twice as many current assets",
        difficulty: "easy"
      },
      {
        id: 2,
        question: "Quick ratio excludes which current asset?",
        options: ["Cash", "Marketable securities", "Inventory", "Accounts receivable"],
        correct: 2,
        explanation: "Quick ratio = (Current Assets - Inventory) / Current Liabilities for more conservative liquidity measure",
        difficulty: "easy"
      },
      {
        id: 3,
        question: "Debt-to-equity of 1.5 means:",
        options: ["$1.50 debt per $1 equity", "$1.50 equity per $1 debt", "150% equity", "15% leverage"],
        correct: 0,
        explanation: "D/E = Total Debt / Total Equity. 1.5 means $1.50 of debt for each $1 of equity",
        difficulty: "medium"
      },
      {
        id: 4,
        question: "Company pays off current liability with cash. If current ratio was >1, new ratio:",
        options: ["Increases", "Decreases", "Stays same", "Cannot determine"],
        correct: 0,
        explanation: "When CR > 1, paying equal amounts from CA and CL increases the ratio",
        difficulty: "hard"
      },
      {
        id: 5,
        question: "Interest coverage ratio of 3.0 means EBIT is:",
        options: ["3× interest expense", "1/3 of interest expense", "3% of sales", "$3 million"],
        correct: 0,
        explanation: "Interest coverage = EBIT / Interest Expense. 3.0 means EBIT is 3 times interest payments",
        difficulty: "medium"
      }
    ]
  },
  capital: {
    title: "Capital Budgeting",
    questions: [
      {
        id: 1,
        question: "Project: -$10,000 initial, then $4,000/year for 3 years. NPV at 8%?",
        options: ["$309", "$2,000", "-$689", "$1,209"],
        correct: 0,
        explanation: "NPV = -10,000 + 4,000/(1.08) + 4,000/(1.08)² + 4,000/(1.08)³ = $309",
        difficulty: "medium"
      },
      {
        id: 2,
        question: "NPV > 0 means project return is:",
        options: ["Negative", "Above required return", "Below required return", "Zero"],
        correct: 1,
        explanation: "Positive NPV means project earns more than the discount rate (required return)",
        difficulty: "easy"
      },
      {
        id: 3,
        question: "IRR is the rate where:",
        options: ["NPV = Initial investment", "NPV = 0", "PV = FV", "Return = Risk"],
        correct: 1,
        explanation: "IRR is the discount rate that makes NPV equal to zero",
        difficulty: "easy"
      },
      {
        id: 4,
        question: "For mutually exclusive projects, choose based on:",
        options: ["Highest IRR", "Highest NPV", "Shortest payback", "Lowest risk"],
        correct: 1,
        explanation: "NPV is the best criterion for mutually exclusive projects as it measures value added",
        difficulty: "medium"
      },
      {
        id: 5,
        question: "Project A: NPV=$5,000, IRR=15%. Project B: NPV=$4,000, IRR=20%. If cost of capital is 10%, choose:",
        options: ["Project A", "Project B", "Both", "Neither"],
        correct: 0,
        explanation: "Choose highest NPV for mutually exclusive projects. A adds more value despite lower IRR",
        difficulty: "hard"
      }
    ]
  }
};

export default ACFGamifiedApp;