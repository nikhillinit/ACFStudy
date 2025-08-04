import React, { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Star, Flame, Coins, Clock, Target, Brain, Zap, 
  CheckCircle, X, Lightbulb, Award, TrendingUp, Heart,
  Sparkles, Medal, Crown, Rocket, Gift, Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';

interface GamifiedUser {
  id: string;
  firstName?: string;
  level: number;
  xp: number;
  totalXP: number;
  coins: number;
  streak: number;
  longestStreak: number;
  achievements: Achievement[];
  powerUps: UserPowerUp[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  coinReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

interface UserPowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  quantity: number;
  active: boolean;
  effect: string;
  duration: number;
}

interface EnhancedProblem {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  hints: string[];
  difficulty: number;
  concepts: string[];
  xpReward: number;
  coinReward: number;
  estimatedTime: number;
}

interface ChallengeSession {
  id: string;
  problems: EnhancedProblem[];
  currentProblemIndex: number;
  answers: { [key: string]: number };
  timeLeft: number;
  completed: boolean;
  score: number;
  hintsUsed: number;
  powerUpsUsed: string[];
}

export function GamifiedPractice() {
  const [currentSession, setCurrentSession] = useState<ChallengeSession | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user profile with gamification data
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  // Timer effect for challenge session
  useEffect(() => {
    if (!currentSession || currentSession.completed || currentSession.timeLeft <= 0) return;

    const timer = setInterval(() => {
      setCurrentSession(prev => {
        if (!prev) return prev;
        const newTimeLeft = prev.timeLeft - 1;
        if (newTimeLeft <= 0) {
          handleTimeUp();
          return { ...prev, timeLeft: 0, completed: true };
        }
        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSession?.timeLeft, currentSession?.completed]);

  // Mock problems for challenges
  const mockProblems: EnhancedProblem[] = [
    {
      id: '1',
      question: 'What is the present value of $1,000 received in 3 years at a 10% discount rate?',
      options: ['$751.31', '$826.45', '$900.00', '$1,100.00'],
      correct: 0,
      explanation: 'PV = FV / (1 + r)^n = $1,000 / (1.10)^3 = $751.31',
      hints: ['Use the present value formula: PV = FV / (1 + r)^n', 'Discount rate is 10% and time period is 3 years'],
      difficulty: 0,
      concepts: ['present value', 'discounting', 'time value of money'],
      xpReward: 20,
      coinReward: 10,
      estimatedTime: 90
    },
    {
      id: '2',
      question: 'If you invest $500 at 8% annual interest compounded annually, what will it be worth in 5 years?',
      options: ['$734.66', '$700.00', '$650.50', '$800.25'],
      correct: 0,
      explanation: 'FV = PV × (1 + r)^n = $500 × (1.08)^5 = $734.66',
      hints: ['Use the future value formula: FV = PV × (1 + r)^n', 'Interest rate is 8% and time period is 5 years'],
      difficulty: 0,
      concepts: ['future value', 'compound interest', 'time value of money'],
      xpReward: 20,
      coinReward: 10,
      estimatedTime: 90
    },
    {
      id: '3',
      question: 'What is the expected return of a portfolio with 60% stocks (12% return) and 40% bonds (6% return)?',
      options: ['9.6%', '10.2%', '8.8%', '11.4%'],
      correct: 0,
      explanation: 'Expected return = (0.60 × 12%) + (0.40 × 6%) = 7.2% + 2.4% = 9.6%',
      hints: ['Use weighted average: E(R) = w1×R1 + w2×R2', 'Weight of stocks is 60%, weight of bonds is 40%'],
      difficulty: 1,
      concepts: ['portfolio theory', 'expected return', 'weighted average'],
      xpReward: 30,
      coinReward: 15,
      estimatedTime: 120
    }
  ];

  // Start challenge session mutation
  const startChallengeMutation = useMutation({
    mutationFn: async ({ topic, difficulty }: { topic: string; difficulty: string }) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return { problems: mockProblems };
    },
    onSuccess: (data: any) => {
      setCurrentSession({
        id: `session-${Date.now()}`,
        problems: data.problems || mockProblems,
        currentProblemIndex: 0,
        answers: {},
        timeLeft: 300, // 5 minutes default
        completed: false,
        score: 0,
        hintsUsed: 0,
        powerUpsUsed: []
      });
      setSelectedAnswer(null);
      setShowResults(false);
      setShowHint(false);
      setCurrentHintIndex(0);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to start challenge. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: async ({ answer }: { answer: number }) => {
      // Simulate checking answer
      const currentProblem = currentSession?.problems[currentSession.currentProblemIndex];
      const isCorrect = currentProblem && answer === parseInt(currentProblem.answer.toString());
      return { correct: isCorrect, xpEarned: isCorrect ? 20 : 5, coinsEarned: isCorrect ? 10 : 2 };
    },
    onSuccess: (data: any) => {
      if (data.correct) {
        setCelebrationMessage(`Correct! +${data.xpEarned} XP, +${data.coinsEarned} coins`);
        setTimeout(() => setCelebrationMessage(null), 3000);
      }

      // Move to next problem or show results
      if (currentSession && currentSession.currentProblemIndex < currentSession.problems.length - 1) {
        setCurrentSession(prev => prev ? {
          ...prev,
          currentProblemIndex: prev.currentProblemIndex + 1,
          answers: { ...prev.answers, [`${prev.currentProblemIndex}`]: selectedAnswer || 0 },
          score: prev.score + (data.correct ? 1 : 0)
        } : null);
        setSelectedAnswer(null);
        setShowHint(false);
        setCurrentHintIndex(0);
      } else {
        setShowResults(true);
        setCurrentSession(prev => prev ? { ...prev, completed: true } : null);
      }
    }
  });

  // Use power-up mutation (simplified for demo)
  const usePowerUpMutation = useMutation({
    mutationFn: async ({ powerUpId }: { powerUpId: string }) => {
      return { effect: powerUpId, message: `${powerUpId} activated!` };
    },
    onSuccess: (data: any) => {
      toast({
        title: "Power-up Activated!",
        description: data.message,
        variant: "default"
      });
      
      if (data.effect === 'time_boost') {
        setCurrentSession(prev => prev ? { ...prev, timeLeft: prev.timeLeft + 60 } : null);
      } else if (data.effect === 'hint_reveal') {
        setShowHint(true);
      }
    }
  });

  const handleStartChallenge = (topic: string, difficulty: string) => {
    startChallengeMutation.mutate({ topic, difficulty });
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentSession) return;
    
    submitAnswerMutation.mutate({
      answer: selectedAnswer
    });
  };

  const handleUsePowerUp = (powerUpId: string) => {
    if (!currentSession) return;
    usePowerUpMutation.mutate({ powerUpId });
  };

  const handleTimeUp = () => {
    toast({
      title: "Time's Up!",
      description: "Challenge session completed. Let's see your results!",
      variant: "default"
    });
    setShowResults(true);
  };

  const handleUseHint = () => {
    setShowHint(true);
    setCurrentSession(prev => prev ? { ...prev, hintsUsed: prev.hintsUsed + 1 } : null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-500 bg-yellow-500/10';
      case 'epic': return 'text-purple-500 bg-purple-500/10';
      case 'rare': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getXPToNextLevel = (currentXP: number, level: number) => {
    return level * 100 - (currentXP % (level * 100));
  };

  if (profileLoading) {
    return <div className="flex justify-center p-8">Loading your profile...</div>;
  }

  // Create mock user profile if none exists
  const mockUserProfile: GamifiedUser = {
    id: '1',
    firstName: 'Student',
    level: 3,
    xp: 150,
    totalXP: 350,
    coins: 275,
    streak: 5,
    longestStreak: 12,
    achievements: [
      {
        id: '1',
        name: 'First Steps',
        description: 'Complete your first practice session',
        icon: 'star',
        rarity: 'common',
        xpReward: 25,
        coinReward: 10,
        unlocked: true,
        unlockedAt: '2025-01-01',
        progress: 1,
        maxProgress: 1
      },
      {
        id: '2',
        name: 'TVM Master',
        description: 'Score 90% or higher on 5 TVM problems',
        icon: 'trophy',
        rarity: 'rare',
        xpReward: 100,
        coinReward: 50,
        unlocked: false,
        progress: 3,
        maxProgress: 5
      },
      {
        id: '3',
        name: 'Speed Demon',
        description: 'Complete a challenge in under 2 minutes',
        icon: 'flame',
        rarity: 'epic',
        xpReward: 200,
        coinReward: 100,
        unlocked: true,
        unlockedAt: '2025-01-02',
        progress: 1,
        maxProgress: 1
      }
    ],
    powerUps: [
      {
        id: 'time_boost',
        name: 'Time Boost',
        description: 'Add 60 seconds to your timer',
        icon: 'clock',
        quantity: 3,
        active: false,
        effect: 'time_boost',
        duration: 0
      },
      {
        id: 'hint_reveal',
        name: 'Hint Master',
        description: 'Reveal all hints for current problem',
        icon: 'lightbulb',
        quantity: 2,
        active: false,
        effect: 'hint_reveal',
        duration: 0
      }
    ]
  };

  const profile = userProfile || mockUserProfile;

  return (
    <div className="space-y-6">
      {/* Celebration Messages */}
      {celebrationMessage && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-900/20 animate-bounce-in">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">{celebrationMessage}</span>
              <Sparkles className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Achievements */}
      {newAchievements.length > 0 && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 animate-slide-in">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-yellow-700 dark:text-yellow-300">
                <Trophy className="h-6 w-6" />
                <span className="font-bold text-lg">New Achievement{newAchievements.length > 1 ? 's' : ''} Unlocked!</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {newAchievements.map(achievement => (
                  <Badge key={achievement.id} className={getRarityColor(achievement.rarity)}>
                    {achievement.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                  {profile.firstName?.charAt(0) || 'U'}
                </div>
                <Badge className="absolute -top-1 -right-1 bg-yellow-500 text-yellow-900">
                  {profile.level}
                </Badge>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Level {profile.level} Scholar</h2>
                <p className="text-muted-foreground">
                  {profile.firstName || 'Student'} • {profile.totalXP} Total XP
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold">{profile.coins}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold">{profile.streak} day streak</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Progress to Level {profile.level + 1}
              </div>
              <Progress 
                value={(profile.xp % (profile.level * 100)) / (profile.level * 100) * 100} 
                className="w-48"
              />
              <div className="text-xs text-center text-muted-foreground">
                {profile.xp % (profile.level * 100)} / {profile.level * 100} XP
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!currentSession ? (
        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="challenges">Learning Challenges</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="powerups">Power-ups</TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Time Value of Money Challenges */}
              <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>Time Value of Money</span>
                  </CardTitle>
                  <CardDescription>Master PV, FV, and compound interest</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Difficulty:</span>
                    <Badge variant="outline">Beginner</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Reward:</span>
                    <div className="flex items-center space-x-2">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>20 XP</span>
                      <Coins className="h-3 w-3 text-yellow-500" />
                      <span>10</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleStartChallenge('Time Value of Money', 'beginner')}
                    className="w-full"
                    data-testid="button-challenge-tvm-beginner"
                  >
                    Start Challenge
                  </Button>
                </CardContent>
              </Card>

              {/* Portfolio Theory Challenges */}
              <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>Portfolio Theory</span>
                  </CardTitle>
                  <CardDescription>Expected returns, risk, and diversification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Difficulty:</span>
                    <Badge variant="outline" className="text-orange-600">Intermediate</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Reward:</span>
                    <div className="flex items-center space-x-2">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>30 XP</span>
                      <Coins className="h-3 w-3 text-yellow-500" />
                      <span>15</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleStartChallenge('Portfolio Theory', 'intermediate')}
                    className="w-full"
                    data-testid="button-challenge-portfolio-intermediate"
                  >
                    Start Challenge
                  </Button>
                </CardContent>
              </Card>

              {/* Advanced Challenge */}
              <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span>Mixed Topics</span>
                  </CardTitle>
                  <CardDescription>Ultimate challenge across all topics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Difficulty:</span>
                    <Badge variant="outline" className="text-red-600">Advanced</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Reward:</span>
                    <div className="flex items-center space-x-2">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>50 XP</span>
                      <Coins className="h-3 w-3 text-yellow-500" />
                      <span>25</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleStartChallenge('Mixed Topics', 'advanced')}
                    className="w-full"
                    data-testid="button-challenge-mixed-advanced"
                  >
                    Start Challenge
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {profile.achievements.map((achievement: Achievement) => (
                <Card key={achievement.id} className={`${achievement.unlocked ? 'border-green-500' : 'opacity-60'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${getRarityColor(achievement.rarity)}`}>
                        {achievement.unlocked ? <Trophy className="h-5 w-5" /> : <Trophy className="h-5 w-5 opacity-50" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <div className="mt-2">
                          <Progress value={achievement.progress / achievement.maxProgress * 100} className="h-2" />
                          <div className="text-xs text-muted-foreground mt-1">
                            {achievement.progress} / {achievement.maxProgress}
                          </div>
                        </div>
                        {achievement.unlocked && achievement.unlockedAt && (
                          <Badge variant="outline" className="mt-2">
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="powerups" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {profile.powerUps.map((powerUp: UserPowerUp) => (
                <Card key={powerUp.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                          <Zap className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{powerUp.name}</h3>
                          <p className="text-sm text-muted-foreground">{powerUp.description}</p>
                          <Badge variant="outline" className="mt-1">
                            Quantity: {powerUp.quantity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        /* Challenge Session Interface */
        <div className="space-y-6">
          {/* Session Header */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">
                    Problem {currentSession.currentProblemIndex + 1} of {currentSession.problems.length}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="font-mono text-lg">
                      {formatTime(currentSession.timeLeft)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUseHint}
                    disabled={showHint}
                    data-testid="button-use-hint"
                  >
                    <Lightbulb className="h-4 w-4 mr-1" />
                    Hint
                  </Button>
                  {profile.powerUps.filter((p: UserPowerUp) => p.quantity > 0).map((powerUp: UserPowerUp) => (
                    <Button
                      key={powerUp.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleUsePowerUp(powerUp.id)}
                      disabled={powerUp.quantity === 0}
                      data-testid={`button-powerup-${powerUp.id}`}
                    >
                      <Zap className="h-4 w-4 mr-1" />
                      {powerUp.name}
                    </Button>
                  ))}
                </div>
              </div>
              <Progress 
                value={(currentSession.currentProblemIndex / currentSession.problems.length) * 100} 
                className="mt-4"
              />
            </CardContent>
          </Card>

          {!showResults ? (
            /* Current Problem */
            (() => {
              const currentProblem = currentSession.problems[currentSession.currentProblemIndex];
              const mockOptions = ['Option A', 'Option B', 'Option C', 'Option D'];
              const mockHints = ['Consider the time value formula', 'Remember to compound annually', 'Use the correct discount rate'];
              
              return (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{currentProblem.question}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        Difficulty: {['Easy', 'Medium', 'Hard'][currentProblem.difficulty]}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-sm">{currentProblem.xpReward} XP</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Coins className="h-3 w-3 text-yellow-500" />
                        <span className="text-sm">{currentProblem.coinReward}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Answer Options */}
                    <div className="space-y-2">
                      {currentProblem.options.map((option, index) => (
                        <Button
                          key={index}
                          variant={selectedAnswer === index ? "default" : "outline"}
                          className="w-full text-left justify-start h-auto p-4"
                          onClick={() => setSelectedAnswer(index)}
                          data-testid={`button-answer-${index}`}
                        >
                          <span className="mr-3 font-semibold">{String.fromCharCode(65 + index)}.</span>
                          {option}
                        </Button>
                      ))}
                    </div>

                    {/* Hint Display */}
                    {showHint && (
                      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-2">
                            <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Hint:</h4>
                              <p className="text-blue-700 dark:text-blue-300">
                                {currentProblem.hints[currentHintIndex] || currentProblem.hints[0]}
                              </p>
                              {currentProblem.hints.length > 1 && (
                                <div className="flex items-center space-x-2 mt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setCurrentHintIndex(Math.max(0, currentHintIndex - 1))}
                                    disabled={currentHintIndex === 0}
                                  >
                                    Previous
                                  </Button>
                                  <span className="text-xs">
                                    {currentHintIndex + 1} of {currentProblem.hints.length}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setCurrentHintIndex(Math.min(currentProblem.hints.length - 1, currentHintIndex + 1))}
                                    disabled={currentHintIndex === currentProblem.hints.length - 1}
                                  >
                                    Next
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Submit Button */}
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null || submitAnswerMutation.isPending}
                      className="w-full"
                      size="lg"
                      data-testid="button-submit-answer"
                    >
                      {submitAnswerMutation.isPending ? "Submitting..." : "Submit Answer"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })()
          ) : (
            /* Results Screen */
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Challenge Complete!</CardTitle>
                <CardDescription>Here's how you performed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold text-blue-600">
                    {Math.round((currentSession.score / currentSession.problems.length) * 100)}%
                  </div>
                  <div className="text-lg text-muted-foreground">
                    {currentSession.score} out of {currentSession.problems.length} correct
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-green-600">
                      {currentSession.score}
                    </div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-red-600">
                      {currentSession.problems.length - currentSession.score}
                    </div>
                    <div className="text-sm text-muted-foreground">Incorrect</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-blue-600">
                      {currentSession.hintsUsed}
                    </div>
                    <div className="text-sm text-muted-foreground">Hints Used</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-purple-600">
                      {currentSession.powerUpsUsed.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Power-ups</div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => setCurrentSession(null)}
                    variant="outline"
                    data-testid="button-back-to-challenges"
                  >
                    Back to Challenges
                  </Button>
                  <Button
                    onClick={() => handleStartChallenge('Time Value of Money', 'beginner')}
                    data-testid="button-try-again"
                  >
                    Try Another Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}