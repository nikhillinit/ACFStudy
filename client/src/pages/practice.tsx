import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PracticeSession } from '@/components/practice-session';
import { EnhancedQuiz } from '@/components/enhanced-quiz';
import { NoteTaking } from '@/components/note-taking';
import { GamifiedPractice } from '@/components/gamified-practice';
import { FinancialStatementGame } from '@/components/FinancialStatementGame';
import { ACFExamSimulator } from '@/components/ACFExamSimulator';
import { PortfolioCalculator } from '@/components/PortfolioCalculator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Target, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  PlayCircle,
  Award,
  CheckCircle2,
  BarChart3,
  Calculator,
  FileText
} from 'lucide-react';

interface ACFProblem {
  id: string;
  topic: string;
  difficulty: number;
  question: string;
  answer: string | number;
  solution: string;
  concepts: string[];
  hints?: string[];
  timeEstimate?: number;
  realWorldContext?: string;
}

const topicIcons: Record<string, any> = {
  'Time Value of Money': TrendingUp,
  'Portfolio Theory': BarChart3,
  'Bond Valuation': Award,
  'Financial Statements': BookOpen,
  'Derivatives': Target
};

const topics = [
  { 
    id: 'Time Value of Money', 
    name: 'Time Value of Money', 
    description: 'Master present value, future value, and annuity calculations',
    problemCount: 25,
    difficulty: 1,
    estimatedTime: 120
  },
  { 
    id: 'Portfolio Theory', 
    name: 'Portfolio Theory', 
    description: 'Learn CAPM, risk-return relationships, and modern portfolio optimization',
    problemCount: 25,
    difficulty: 2,
    estimatedTime: 150
  },
  { 
    id: 'Bond Valuation', 
    name: 'Bond Valuation', 
    description: 'Understand bond pricing, yield calculations, and duration concepts',
    problemCount: 25,
    difficulty: 2,
    estimatedTime: 135
  },
  { 
    id: 'Financial Statements', 
    name: 'Financial Statements', 
    description: 'Analyze financial statements and understand accounting principles',
    problemCount: 15,
    difficulty: 1,
    estimatedTime: 90
  },
  { 
    id: 'Derivatives', 
    name: 'Derivatives', 
    description: 'Options, futures, and forward contracts fundamentals',
    problemCount: 25,
    difficulty: 3,
    estimatedTime: 180
  }
];

export default function PracticePage() {
  const [activeSession, setActiveSession] = useState<{
    topic: string;
    problems: ACFProblem[];
  } | null>(null);
  const [selectedTab, setSelectedTab] = useState('topics');
  const [showInteractive, setShowInteractive] = useState<string | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch diagnostic test
  const { data: diagnosticData, isLoading: diagnosticLoading } = useQuery({
    queryKey: ['/api/diagnostic/test'],
    enabled: selectedTab === 'diagnostic'
  });

  // Start practice session mutation
  const startPracticeMutation = useMutation({
    mutationFn: async ({ topic, count }: { topic: string; count: number }) => {
      return await apiRequest(`/api/practice/problems/${topic}?count=${count}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: (data: any, variables) => {
      setActiveSession({
        topic: variables.topic,
        problems: data.problems || []
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to start practice session. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Complete session mutation
  const completeSessionMutation = useMutation({
    mutationFn: async (sessionResults: any) => {
      return await apiRequest('/api/practice/session/complete', {
        method: 'POST',
        body: JSON.stringify({ sessionResults }),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: (data: any) => {
      const performance = data.performance || {};
      toast({
        title: "Session Complete!",
        description: `Accuracy: ${Math.round(performance.accuracy || 0)}% | ${performance.topicMastery ? 'Topic Mastered!' : 'Keep practicing!'}`,
        variant: performance.topicMastery ? "default" : "destructive"
      });
      setActiveSession(null);
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to complete session. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleStartPractice = (topicName: string, count: number = 10) => {
    startPracticeMutation.mutate({ topic: topicName, count });
  };

  const handleStartDiagnostic = () => {
    const diagnosticProblems = (diagnosticData as any)?.problems || [];
    if (diagnosticProblems.length > 0) {
      setActiveSession({
        topic: 'Diagnostic Test',
        problems: diagnosticProblems
      });
    }
  };

  const handleSessionComplete = (results: any) => {
    completeSessionMutation.mutate(results);
  };

  const handleExitSession = () => {
    setActiveSession(null);
    toast({
      title: "Session Ended",
      description: "Your progress has been saved.",
      variant: "default"
    });
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 2: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 3: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      default: return 'Unknown';
    }
  };

  // Show practice session if active
  if (activeSession) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <PracticeSession
            topic={activeSession.topic}
            problems={activeSession.problems}
            onComplete={handleSessionComplete}
            onExit={handleExitSession}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Practice Center
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Master Advanced Corporate Finance through targeted practice sessions and comprehensive diagnostics.
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 sm:mb-8">
            <TabsTrigger value="topics" className="text-xs sm:text-sm">Practice Topics</TabsTrigger>
            <TabsTrigger value="challenges" className="text-xs sm:text-sm">Challenges</TabsTrigger>
            <TabsTrigger value="diagnostic" className="text-xs sm:text-sm">Diagnostic Test</TabsTrigger>
            <TabsTrigger value="adaptive" className="text-xs sm:text-sm">Adaptive Mode</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs sm:text-sm">Study Notes</TabsTrigger>
          </TabsList>

          {/* Practice Topics Tab */}
          <TabsContent value="topics" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  <span>Choose Your Practice Topic</span>
                </CardTitle>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Select a topic to practice. Problems are intelligently selected based on your performance and learning progress.
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {topics.map((topic) => {
                    const IconComponent = topicIcons[topic.name] || BookOpen;
                    return (
                      <Card key={topic.id} className="hover:shadow-lg transition-all duration-200 hover:scale-105">
                        <CardHeader className="p-3 sm:p-4">
                          <div className="flex items-start space-x-2 sm:space-x-3">
                            <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900 rounded-lg shrink-0">
                              <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm sm:text-base font-semibold leading-tight">{topic.name}</h3>
                              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                                {topic.description}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4 pt-0">
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {topic.problemCount} Problems
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${getDifficultyColor(topic.difficulty)}`}>
                                {getDifficultyLabel(topic.difficulty)}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {topic.estimatedTime}min
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStartPractice(topic.name, 5)}
                                disabled={startPracticeMutation.isPending}
                                className="text-xs sm:text-sm"
                                data-testid={`button-quick-practice-${topic.id}`}
                              >
                                Quick (5)
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleStartPractice(topic.name, 10)}
                                disabled={startPracticeMutation.isPending}
                                className="text-xs sm:text-sm"
                                data-testid={`button-full-practice-${topic.id}`}
                              >
                                <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                Full (10)
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gamified Challenges Tab */}
          <TabsContent value="challenges" className="space-y-4 sm:space-y-6">
            <GamifiedPractice />
            
            {/* Interactive Tools Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-6 w-6 text-blue-600" />
                  <span>Interactive Learning Tools</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Practice with hands-on calculators and interactive exercises
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setShowInteractive('portfolio')}
                  >
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Portfolio Calculator</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Risk-return analysis and diversification tools
                      </p>
                      <Button className="w-full" data-testid="launch-portfolio-calc">Launch Calculator</Button>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setShowInteractive('classification')}
                  >
                    <CardContent className="p-6 text-center">
                      <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Classification Game</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Financial statement item classification challenge
                      </p>
                      <Button className="w-full" data-testid="launch-classification-game">Start Game</Button>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setShowInteractive('exam')}
                  >
                    <CardContent className="p-6 text-center">
                      <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">ACF Exam Simulator</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Full placement exam simulation with timing
                      </p>
                      <Button className="w-full" data-testid="launch-exam-sim">Take Exam</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Diagnostic Test Tab */}
          <TabsContent value="diagnostic" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  <span>Comprehensive Diagnostic Assessment</span>
                </CardTitle>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Take this comprehensive assessment to identify your strengths and areas for improvement across all ACF topics.
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-4 sm:p-6 rounded-lg border border-purple-200 dark:border-purple-800 mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-purple-900 dark:text-purple-100">
                    Assessment Format
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">25</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">30</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">5</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Topics</div>
                    </div>
                    <div className="text-center">
                      <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto" />
                      <div className="text-xs sm:text-sm text-muted-foreground">Instant Results</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg mb-6">
                  <h4 className="font-medium mb-2 text-blue-900 dark:text-blue-100">What you'll get:</h4>
                  <ul className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
                    <li>• Personalized strength and weakness analysis</li>
                    <li>• Topic-specific performance breakdown</li>
                    <li>• Customized study recommendations</li>
                    <li>• Progress tracking baseline</li>
                  </ul>
                </div>

                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={handleStartDiagnostic}
                    disabled={diagnosticLoading || !((diagnosticData as any)?.problems?.length)}
                    className="text-sm sm:text-base px-6 sm:px-8 py-3"
                    data-testid="button-start-diagnostic"
                  >
                    {diagnosticLoading ? 'Loading Assessment...' : 'Start Diagnostic Test'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Adaptive Mode Tab */}
          <TabsContent value="adaptive" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  <span>AI-Powered Adaptive Learning</span>
                </CardTitle>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Let our AI create personalized practice sessions based on your performance and learning patterns.
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="text-center py-8 sm:py-12">
                  <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-950/20 dark:to-blue-950/20 p-6 sm:p-8 rounded-lg border border-green-200 dark:border-green-800">
                    <TrendingUp className="h-12 w-12 sm:h-16 sm:w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 text-green-900 dark:text-green-100">
                      Adaptive Mode Coming Soon
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-6">
                      Complete a few practice sessions to unlock AI-powered adaptive learning that personalizes your study experience.
                    </p>
                    <Button variant="outline" disabled className="text-sm sm:text-base">
                      Complete 3 Practice Sessions to Unlock
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Study Notes Tab */}
          <TabsContent value="notes" className="space-y-4 sm:space-y-6">
            <NoteTaking />
          </TabsContent>
        </Tabs>
      </div>

      {/* Interactive Component Modal */}
      {showInteractive && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {showInteractive === 'portfolio' && 'Portfolio Calculator'}
                  {showInteractive === 'classification' && 'Financial Statement Classification Game'}
                  {showInteractive === 'exam' && 'ACF Exam Simulator'}
                </h2>
                <Button 
                  variant="outline" 
                  onClick={() => setShowInteractive(null)}
                  data-testid="close-interactive"
                >
                  Close
                </Button>
              </div>
              
              {showInteractive === 'portfolio' && (
                <PortfolioCalculator onComplete={() => setShowInteractive(null)} />
              )}
              {showInteractive === 'classification' && (
                <FinancialStatementGame onComplete={() => setShowInteractive(null)} />
              )}
              {showInteractive === 'exam' && (
                <ACFExamSimulator onComplete={() => setShowInteractive(null)} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}