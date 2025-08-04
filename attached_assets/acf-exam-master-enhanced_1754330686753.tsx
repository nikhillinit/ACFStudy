import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  ChevronRight, Check, X, Clock, Target, BookOpen, Calculator, TrendingUp, Award, 
  AlertCircle, BarChart, FileText, Play, Pause, RefreshCw, User, Calendar,
  Settings, HelpCircle, Brain, Zap, Filter, Download, ChevronDown, ChevronUp,
  Trophy, Star, Flame, Lock, Unlock, Volume2, VolumeX, Share2, Users,
  Heart, Shield, Sparkles, Gift, Rocket, Medal, Crown, Coins, 
  MessageCircle, ThumbsUp, Eye, EyeOff, Lightbulb, Coffee, Moon,
  Smartphone, TabletSmartphone, Monitor, Gamepad2, Swords, Target as TargetIcon,
  ChevronLeft, Video, Bot, Database, Wifi, WifiOff, FileDown, 
  BarChart3, TrendingDown, Info, CheckCircle, PlayCircle, PauseCircle,
  BookMarked, GraduationCap, Library, PenTool, Search, Plus, Minus,
  RotateCcw, FastForward, Rewind, Layers, Grid, List, SlidersHorizontal
} from 'lucide-react';

// Enhanced type definitions
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
  performanceData: PerformanceData;
  studyHistory: StudySession[];
}

interface PerformanceData {
  topicMastery: { [topicId: string]: TopicMastery };
  questionHistory: QuestionAttempt[];
  weakConcepts: string[];
  strongConcepts: string[];
  averageResponseTime: number;
  streakData: { date: string; completed: boolean }[];
  learningVelocity: number;
  retentionRate: number;
}

interface TopicMastery {
  topicId: string;
  masteryLevel: number; // 0-100
  questionsAttempted: number;
  correctAnswers: number;
  averageTime: number;
  lastPracticed: string;
  conceptScores: { [concept: string]: number };
  difficultyProgress: {
    easy: number;
    medium: number;
    hard: number;
    expert: number;
  };
}

interface QuestionAttempt {
  questionId: string;
  topicId: string;
  correct: boolean;
  timeSpent: number;
  hintsUsed: number;
  attemptNumber: number;
  timestamp: string;
  difficultyLevel: string;
  concepts: string[];
}

interface StudySession {
  sessionId: string;
  date: string;
  duration: number;
  topicsCovered: string[];
  questionsAttempted: number;
  correctAnswers: number;
  xpEarned: number;
  focusScore: number; // 0-100 based on consistency
}

interface VideoLesson {
  id: string;
  topicId: string;
  title: string;
  duration: number;
  thumbnailUrl: string;
  videoUrl: string;
  transcript: string;
  keyPoints: string[];
  embeddedQuizzes: EmbeddedQuiz[];
  watchedPercentage: number;
  notes: string[];
}

interface EmbeddedQuiz {
  timestamp: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface AITutorResponse {
  message: string;
  hints: string[];
  relatedConcepts: string[];
  suggestedResources: Resource[];
  emotionalTone: 'encouraging' | 'neutral' | 'challenging';
}

interface Resource {
  type: 'video' | 'practice' | 'reading' | 'formula';
  title: string;
  id: string;
  estimatedTime: number;
}

interface SpacedRepetitionItem {
  conceptId: string;
  nextReview: Date;
  interval: number;
  easeFactor: number;
  repetitions: number;
  lastQuality: number; // 0-5 rating of last review
}

interface AdaptivePracticeSession {
  sessionId: string;
  targetConcepts: string[];
  difficultyProgression: ('easy' | 'medium' | 'hard' | 'expert')[];
  questionsPool: EnhancedQuestion[];
  currentIndex: number;
  adaptiveScore: number; // Used to adjust difficulty
}

interface EnhancedQuestion extends Question {
  concepts: string[];
  prerequisites: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  estimatedTime: number;
  hints: string[];
  detailedSolution: SolutionStep[];
  commonMistakes: string[];
  relatedQuestions: string[];
  visualAids?: VisualAid[];
}

interface SolutionStep {
  step: number;
  description: string;
  formula?: string;
  calculation?: string;
  explanation: string;
  tip?: string;
}

interface VisualAid {
  type: 'graph' | 'chart' | 'diagram' | 'table';
  data: any;
  caption: string;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty?: string;
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

interface FormulaReference {
  id: string;
  name: string;
  formula: string;
  variables: { symbol: string; meaning: string }[];
  usage: string;
  examples: { description: string; calculation: string }[];
  relatedFormulas: string[];
  tags: string[];
}

interface OfflineData {
  lastSync: Date;
  cachedQuestions: { [topicId: string]: EnhancedQuestion[] };
  cachedVideos: VideoLesson[];
  userProgress: UserProfile;
  pendingActions: any[];
}

// Main Enhanced ACF Exam Master Component
const ACFExamMasterEnhanced = () => {
  // Core state management
  const [activeSection, setActiveSection] = useState('home');
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number}>({});
  const [showResults, setShowResults] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<{[key: string]: boolean}>({});
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [studyTime, setStudyTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [studyMode, setStudyMode] = useState('practice');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showFormulas, setShowFormulas] = useState(false);
  const [weakAreas, setWeakAreas] = useState<string[]>([]);
  const [examDate, setExamDate] = useState('');
  const [studyPlan, setStudyPlan] = useState('standard');
  const [expandedTopics, setExpandedTopics] = useState<{[key: string]: boolean}>({});

  // Enhanced state
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
    learningStyle: 'visual',
    performanceData: {
      topicMastery: {},
      questionHistory: [],
      weakConcepts: [],
      strongConcepts: [],
      averageResponseTime: 0,
      streakData: [],
      learningVelocity: 0,
      retentionRate: 0
    },
    studyHistory: []
  });

  // New enhanced state
  const [adaptiveSession, setAdaptiveSession] = useState<AdaptivePracticeSession | null>(null);
  const [videoLessons, setVideoLessons] = useState<VideoLesson[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoLesson | null>(null);
  const [aiTutorActive, setAiTutorActive] = useState(false);
  const [aiTutorHistory, setAiTutorHistory] = useState<AITutorResponse[]>([]);
  const [spacedRepetitionItems, setSpacedRepetitionItems] = useState<SpacedRepetitionItem[]>([]);
  const [offlineMode, setOfflineMode] = useState(false);
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);
  const [formulaSheet, setFormulaSheet] = useState<FormulaReference[]>([]);
  const [showSolutionSteps, setShowSolutionSteps] = useState<{[key: string]: boolean}>({});
  const [currentHints, setCurrentHints] = useState<{[key: string]: number}>({});
  const [analyticsView, setAnalyticsView] = useState<'overview' | 'detailed' | 'predictions'>('overview');

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
  const [lastCorrectTime, setLastCorrectTime] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState('');
  const [studyGoals, setStudyGoals] = useState({ daily: 30, weekly: 180 });
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // Mobile-specific state
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const [touchStart, setTouchStart] = useState<any>(null);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);

  // Refs for animations and effects
  const confettiRef = useRef(null);
  const audioRef = useRef(null);
  const vibrationRef = useRef(null);
  const studyTimerRef = useRef<any>(null);

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

  // Initialize enhanced features
  useEffect(() => {
    loadOfflineData();
    initializeSpacedRepetition();
    loadFormulas();
    checkForDueReviews();
  }, []);

  // Study timer
  useEffect(() => {
    if (isTimerRunning) {
      studyTimerRef.current = setInterval(() => {
        setStudyTime(prev => prev + 1);
        if (timerSeconds > 0) {
          setTimerSeconds(prev => prev - 1);
        }
      }, 1000);
    } else {
      if (studyTimerRef.current) {
        clearInterval(studyTimerRef.current);
      }
    }

    return () => {
      if (studyTimerRef.current) {
        clearInterval(studyTimerRef.current);
      }
    };
  }, [isTimerRunning, timerSeconds]);

  // Load offline data
  const loadOfflineData = () => {
    const saved = localStorage.getItem('acf_offline_data');
    if (saved) {
      setOfflineData(JSON.parse(saved));
    }
  };

  // Save offline data
  const saveOfflineData = useCallback(() => {
    const data: OfflineData = {
      lastSync: new Date(),
      cachedQuestions: {}, // Would be populated with questions
      cachedVideos: videoLessons,
      userProgress: userProfile,
      pendingActions: []
    };
    localStorage.setItem('acf_offline_data', JSON.stringify(data));
  }, [videoLessons, userProfile]);

  // Initialize spaced repetition
  const initializeSpacedRepetition = () => {
    const items: SpacedRepetitionItem[] = [];
    Object.keys(topics).forEach(topicId => {
      const topic = topics.find(t => t.id === topicId);
      if (topic) {
        topic.concepts?.forEach(concept => {
          items.push({
            conceptId: `${topicId}_${concept}`,
            nextReview: new Date(),
            interval: 1,
            easeFactor: 2.5,
            repetitions: 0,
            lastQuality: 0
          });
        });
      }
    });
    setSpacedRepetitionItems(items);
  };

  // Load formula reference
  const loadFormulas = () => {
    setFormulaSheet(formulaReferences);
  };

  // Check for due reviews
  const checkForDueReviews = () => {
    const now = new Date();
    const dueItems = spacedRepetitionItems.filter(item => 
      new Date(item.nextReview) <= now
    );
    
    if (dueItems.length > 0) {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'review',
        message: `You have ${dueItems.length} concepts due for review!`,
        action: () => startSpacedRepetitionSession(dueItems)
      }]);
    }
  };

  // Adaptive Learning Algorithm
  const getAdaptiveQuestions = useCallback((topicId: string, count: number = 10): EnhancedQuestion[] => {
    const mastery = userProfile.performanceData.topicMastery[topicId] || {
      masteryLevel: 0,
      difficultyProgress: { easy: 0, medium: 0, hard: 0, expert: 0 }
    };

    // Determine difficulty distribution based on mastery
    let distribution = { easy: 0.4, medium: 0.4, hard: 0.2, expert: 0 };
    
    if (mastery.masteryLevel > 70) {
      distribution = { easy: 0.1, medium: 0.3, hard: 0.4, expert: 0.2 };
    } else if (mastery.masteryLevel > 50) {
      distribution = { easy: 0.2, medium: 0.4, hard: 0.3, expert: 0.1 };
    } else if (mastery.masteryLevel > 30) {
      distribution = { easy: 0.3, medium: 0.4, hard: 0.2, expert: 0.1 };
    }

    // Get questions from expanded bank
    const topicQuestions = expandedQuestionBank[topicId] || [];
    const selectedQuestions: EnhancedQuestion[] = [];

    // Select questions based on distribution
    Object.entries(distribution).forEach(([difficulty, percentage]) => {
      const questionsNeeded = Math.floor(count * percentage);
      const difficultyQuestions = topicQuestions
        .filter(q => q.difficulty === difficulty)
        .filter(q => {
          // Prioritize questions targeting weak concepts
          const hasWeakConcept = q.concepts.some(c => 
            userProfile.performanceData.weakConcepts.includes(c)
          );
          return hasWeakConcept || Math.random() > 0.3;
        })
        .slice(0, questionsNeeded);
      
      selectedQuestions.push(...difficultyQuestions);
    });

    // Fill remaining slots if needed
    while (selectedQuestions.length < count && topicQuestions.length > selectedQuestions.length) {
      const remaining = topicQuestions.filter(q => 
        !selectedQuestions.find(sq => sq.id === q.id)
      );
      if (remaining.length > 0) {
        selectedQuestions.push(remaining[Math.floor(Math.random() * remaining.length)]);
      } else {
        break;
      }
    }

    return selectedQuestions;
  }, [userProfile.performanceData]);

  // Start adaptive practice session
  const startAdaptivePractice = (topicId?: string) => {
    const targetTopics = topicId ? [topicId] : getRecommendedTopics();
    const questions = targetTopics.flatMap(tid => getAdaptiveQuestions(tid, 5));
    
    const session: AdaptivePracticeSession = {
      sessionId: `session_${Date.now()}`,
      targetConcepts: [],
      difficultyProgression: questions.map(q => q.difficulty),
      questionsPool: questions,
      currentIndex: 0,
      adaptiveScore: 50 // Start at neutral
    };

    setAdaptiveSession(session);
    setActiveSection('adaptive-practice');
    setIsTimerRunning(true);
    playSound('start');
  };

  // Get recommended topics based on performance
  const getRecommendedTopics = (): string[] => {
    const topicScores = Object.entries(userProfile.performanceData.topicMastery)
      .map(([topicId, mastery]) => ({
        topicId,
        score: mastery.masteryLevel,
        lastPracticed: new Date(mastery.lastPracticed),
        needsReview: (Date.now() - new Date(mastery.lastPracticed).getTime()) > 3 * 24 * 60 * 60 * 1000
      }))
      .sort((a, b) => {
        // Prioritize topics that need review
        if (a.needsReview && !b.needsReview) return -1;
        if (!a.needsReview && b.needsReview) return 1;
        // Then by lowest score
        return a.score - b.score;
      });

    return topicScores.slice(0, 3).map(ts => ts.topicId);
  };

  // AI Tutor functionality
  const askAITutor = useCallback((question: string, context?: any): AITutorResponse => {
    // Simulate AI response based on context
    const response: AITutorResponse = {
      message: '',
      hints: [],
      relatedConcepts: [],
      suggestedResources: [],
      emotionalTone: 'encouraging'
    };

    // Analyze question and context
    if (context?.isStruggling) {
      response.emotionalTone = 'encouraging';
      response.message = "I see you're working hard on this! Let's break it down step by step...";
    } else {
      response.emotionalTone = 'neutral';
      response.message = "Great question! Here's how to approach this...";
    }

    // Generate contextual hints
    if (question.toLowerCase().includes('present value')) {
      response.hints = [
        "Remember: PV = FV / (1 + r)^n",
        "Think about what each variable represents",
        "Money today is worth more than money tomorrow"
      ];
      response.relatedConcepts = ['Time Value of Money', 'Discounting', 'Future Value'];
      response.suggestedResources = [
        { type: 'video', title: 'TVM Basics', id: 'video_tvm_1', estimatedTime: 5 },
        { type: 'practice', title: 'PV Calculation Practice', id: 'practice_pv_1', estimatedTime: 10 }
      ];
    }

    setAiTutorHistory(prev => [...prev, response]);
    return response;
  }, []);

  // Video lesson management
  const loadVideoLesson = (lessonId: string) => {
    const lesson = videoLessonsData.find(v => v.id === lessonId);
    if (lesson) {
      setCurrentVideo(lesson);
      setActiveSection('video-lesson');
    }
  };

  // Handle video quiz
  const handleVideoQuiz = (quizIndex: number, answer: number) => {
    if (!currentVideo) return;
    
    const quiz = currentVideo.embeddedQuizzes[quizIndex];
    const isCorrect = answer === quiz.correct;
    
    if (isCorrect) {
      addXP(10);
      playSound('correct');
    } else {
      playSound('incorrect');
    }
    
    // Show explanation
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: isCorrect ? 'success' : 'error',
      message: quiz.explanation
    }]);
  };

  // Spaced repetition session
  const startSpacedRepetitionSession = (items: SpacedRepetitionItem[]) => {
    // Create questions for due items
    const questions = items.map(item => {
      const [topicId, concept] = item.conceptId.split('_');
      return getConceptQuestion(topicId, concept);
    }).filter(q => q !== null);

    if (questions.length > 0) {
      setCurrentQuiz({
        title: 'Spaced Repetition Review',
        questions,
        mode: 'review',
        items
      });
      setActiveSection('quiz');
      setIsTimerRunning(true);
    }
  };

  // Update spaced repetition after review
  const updateSpacedRepetition = (itemId: string, quality: number) => {
    setSpacedRepetitionItems(prev => prev.map(item => {
      if (item.conceptId !== itemId) return item;
      
      // SM-2 algorithm implementation
      let { interval, easeFactor, repetitions } = item;
      
      if (quality >= 3) {
        if (repetitions === 0) {
          interval = 1;
        } else if (repetitions === 1) {
          interval = 6;
        } else {
          interval = Math.round(interval * easeFactor);
        }
        repetitions += 1;
      } else {
        repetitions = 0;
        interval = 1;
      }
      
      easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + interval);
      
      return {
        ...item,
        interval,
        easeFactor,
        repetitions,
        lastQuality: quality,
        nextReview
      };
    }));
  };

  // Export to Anki
  const exportToAnki = (topicId?: string) => {
    const questions = topicId 
      ? expandedQuestionBank[topicId] || []
      : Object.values(expandedQuestionBank).flat();

    const ankiDeck = {
      name: topicId ? `ACF ${topics.find(t => t.id === topicId)?.name}` : 'ACF Exam Master',
      cards: questions.map(q => ({
        front: q.question,
        back: `Answer: ${q.options[q.correct]}\n\nExplanation: ${q.explanation}`,
        tags: ['ACF', ...(q.concepts || [])]
      }))
    };

    const blob = new Blob([JSON.stringify(ankiDeck, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ankiDeck.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    playSound('success');
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'success',
      message: `Exported ${ankiDeck.cards.length} cards for Anki!`
    }]);
  };

  // Performance Analytics
  const calculatePerformanceMetrics = useCallback(() => {
    const { questionHistory, topicMastery } = userProfile.performanceData;
    
    // Overall accuracy
    const totalQuestions = questionHistory.length;
    const correctQuestions = questionHistory.filter(q => q.correct).length;
    const accuracy = totalQuestions > 0 ? (correctQuestions / totalQuestions) * 100 : 0;
    
    // Learning velocity (improvement rate)
    const recentHistory = questionHistory.slice(-20);
    const olderHistory = questionHistory.slice(-40, -20);
    const recentAccuracy = recentHistory.filter(q => q.correct).length / (recentHistory.length || 1);
    const olderAccuracy = olderHistory.filter(q => q.correct).length / (olderHistory.length || 1);
    const velocity = ((recentAccuracy - olderAccuracy) / (olderAccuracy || 1)) * 100;
    
    // Retention rate (based on spaced repetition performance)
    const reviewQuestions = questionHistory.filter(q => q.attemptNumber > 1);
    const retainedCorrect = reviewQuestions.filter(q => q.correct).length;
    const retention = reviewQuestions.length > 0 
      ? (retainedCorrect / reviewQuestions.length) * 100 
      : 100;
    
    // Time efficiency
    const avgTime = questionHistory.reduce((sum, q) => sum + q.timeSpent, 0) / (totalQuestions || 1);
    const targetTime = 120; // 2 minutes target
    const timeEfficiency = Math.min(100, (targetTime / avgTime) * 100);
    
    // Topic recommendations
    const weakTopics = Object.entries(topicMastery)
      .filter(([_, mastery]) => mastery.masteryLevel < 60)
      .sort((a, b) => a[1].masteryLevel - b[1].masteryLevel)
      .slice(0, 3)
      .map(([topicId]) => topics.find(t => t.id === topicId));
    
    return {
      accuracy,
      velocity,
      retention,
      timeEfficiency,
      weakTopics,
      totalStudyTime: userProfile.studyHistory.reduce((sum, s) => sum + s.duration, 0),
      averageSessionLength: userProfile.studyHistory.length > 0
        ? userProfile.studyHistory.reduce((sum, s) => sum + s.duration, 0) / userProfile.studyHistory.length
        : 0,
      predictedExamScore: Math.round(accuracy * 0.7 + retention * 0.2 + timeEfficiency * 0.1)
    };
  }, [userProfile.performanceData, userProfile.studyHistory]);

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
      click: '🔊',
      start: '🚀',
      success: '✨'
    };
    
    console.log(`Playing sound: ${sounds[soundType as keyof typeof sounds]}`);
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
  }, [comboMultiplier, userProfile.powerUps, playSound, triggerHaptic]);

  const calculateXPToNextLevel = (level: number) => {
    return 100 + (level - 1) * 50; // Progressive difficulty
  };

  const showXPGainAnimation = (xp: number) => {
    // In a real app, this would trigger a floating +XP animation
    console.log(`+${xp} XP!`);
  };

  // Get concept question
  const getConceptQuestion = (topicId: string, concept: string): EnhancedQuestion | null => {
    const topicQuestions = expandedQuestionBank[topicId] || [];
    const conceptQuestions = topicQuestions.filter(q => 
      q.concepts.includes(concept)
    );
    
    if (conceptQuestions.length === 0) return null;
    
    return conceptQuestions[Math.floor(Math.random() * conceptQuestions.length)];
  };

  // Handle adaptive answer
  const handleAdaptiveAnswer = (questionId: string, answer: number, timeSpent: number) => {
    if (!adaptiveSession) return;
    
    const question = adaptiveSession.questionsPool.find(q => q.id === questionId);
    if (!question) return;
    
    const isCorrect = answer === question.correct;
    
    // Update performance data
    const attempt: QuestionAttempt = {
      questionId,
      topicId: question.id.split('_')[0],
      correct: isCorrect,
      timeSpent,
      hintsUsed: currentHints[questionId] || 0,
      attemptNumber: 1,
      timestamp: new Date().toISOString(),
      difficultyLevel: question.difficulty,
      concepts: question.concepts
    };
    
    setUserProfile(prev => ({
      ...prev,
      performanceData: {
        ...prev.performanceData,
        questionHistory: [...prev.performanceData.questionHistory, attempt]
      }
    }));
    
    // Adjust adaptive score
    if (isCorrect) {
      setAdaptiveSession(prev => prev ? {
        ...prev,
        adaptiveScore: Math.min(100, prev.adaptiveScore + 10)
      } : null);
    } else {
      setAdaptiveSession(prev => prev ? {
        ...prev,
        adaptiveScore: Math.max(0, prev.adaptiveScore - 5)
      } : null);
    }
    
    // Move to next question or adjust difficulty
    if (adaptiveSession.currentIndex < adaptiveSession.questionsPool.length - 1) {
      setAdaptiveSession(prev => prev ? {
        ...prev,
        currentIndex: prev.currentIndex + 1
      } : null);
    } else {
      // Session complete
      completeAdaptiveSession();
    }
  };

  // Complete adaptive session
  const completeAdaptiveSession = () => {
    if (!adaptiveSession) return;
    
    const results = calculateSessionResults();
    updateTopicMastery(results);
    
    setShowResults(true);
    setIsTimerRunning(false);
    
    // Update study history
    const session: StudySession = {
      sessionId: adaptiveSession.sessionId,
      date: new Date().toISOString(),
      duration: studyTime,
      topicsCovered: [...new Set(adaptiveSession.questionsPool.map(q => q.id.split('_')[0]))],
      questionsAttempted: adaptiveSession.questionsPool.length,
      correctAnswers: results.correct,
      xpEarned: results.xpEarned,
      focusScore: calculateFocusScore()
    };
    
    setUserProfile(prev => ({
      ...prev,
      studyHistory: [...prev.studyHistory, session]
    }));
    
    // Save offline data
    saveOfflineData();
  };

  // Calculate session results
  const calculateSessionResults = () => {
    if (!adaptiveSession) return { correct: 0, total: 0, xpEarned: 0 };
    
    const history = userProfile.performanceData.questionHistory
      .filter(q => q.timestamp >= adaptiveSession.questionsPool[0].timestamp);
    
    const correct = history.filter(q => q.correct).length;
    const total = history.length;
    const accuracy = total > 0 ? correct / total : 0;
    
    let xpEarned = 10; // Base XP
    xpEarned += correct * 5; // Per correct answer
    if (accuracy >= 0.8) xpEarned += 20; // High accuracy bonus
    if (accuracy === 1) xpEarned += 30; // Perfect score bonus
    
    addXP(xpEarned);
    
    return { correct, total, xpEarned, accuracy };
  };

  // Update topic mastery
  const updateTopicMastery = (results: any) => {
    if (!adaptiveSession) return;
    
    const topicsInSession = [...new Set(adaptiveSession.questionsPool.map(q => q.id.split('_')[0]))];
    
    topicsInSession.forEach(topicId => {
      const topicQuestions = adaptiveSession.questionsPool.filter(q => q.id.startsWith(topicId));
      const topicHistory = userProfile.performanceData.questionHistory
        .filter(q => q.topicId === topicId)
        .slice(-20); // Last 20 questions
      
      const correctCount = topicHistory.filter(q => q.correct).length;
      const masteryLevel = (correctCount / topicHistory.length) * 100;
      
      setUserProfile(prev => ({
        ...prev,
        performanceData: {
          ...prev.performanceData,
          topicMastery: {
            ...prev.performanceData.topicMastery,
            [topicId]: {
              topicId,
              masteryLevel,
              questionsAttempted: (prev.performanceData.topicMastery[topicId]?.questionsAttempted || 0) + topicQuestions.length,
              correctAnswers: (prev.performanceData.topicMastery[topicId]?.correctAnswers || 0) + topicQuestions.filter(q => {
                const attempt = topicHistory.find(h => h.questionId === q.id);
                return attempt?.correct;
              }).length,
              averageTime: topicHistory.reduce((sum, q) => sum + q.timeSpent, 0) / topicHistory.length,
              lastPracticed: new Date().toISOString(),
              conceptScores: {},
              difficultyProgress: calculateDifficultyProgress(topicHistory)
            }
          }
        }
      }));
    });
  };

  // Calculate difficulty progress
  const calculateDifficultyProgress = (history: QuestionAttempt[]) => {
    const difficulties = ['easy', 'medium', 'hard', 'expert'] as const;
    const progress: any = {};
    
    difficulties.forEach(diff => {
      const questions = history.filter(q => q.difficultyLevel === diff);
      const correct = questions.filter(q => q.correct).length;
      progress[diff] = questions.length > 0 ? (correct / questions.length) * 100 : 0;
    });
    
    return progress;
  };

  // Calculate focus score
  const calculateFocusScore = (): number => {
    // Based on consistent answering speed and minimal breaks
    const avgTime = userProfile.performanceData.questionHistory
      .slice(-10)
      .reduce((sum, q) => sum + q.timeSpent, 0) / 10;
    
    const consistency = Math.min(100, (120 / avgTime) * 100); // 2 min target
    return Math.round(consistency);
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render main content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return renderEnhancedHome();
      case 'learn':
        return renderEnhancedLearn();
      case 'practice':
        return renderEnhancedPractice();
      case 'adaptive-practice':
        return renderAdaptivePractice();
      case 'video-lesson':
        return renderVideoLesson();
      case 'ai-tutor':
        return renderAITutor();
      case 'analytics':
        return renderAnalytics();
      case 'formulas':
        return renderFormulaSheet();
      case 'profile':
        return renderEnhancedProfile();
      case 'quiz':
        return renderEnhancedQuiz();
      default:
        return renderEnhancedHome();
    }
  };

  // Continue in next part...