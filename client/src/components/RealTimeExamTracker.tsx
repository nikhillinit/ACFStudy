import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  XCircle,
  BarChart3,
  Brain,
  Zap,
  Award
} from 'lucide-react';

interface ExamQuestion {
  id: number;
  type: "calculation" | "multiple_choice";
  competency: string;
  difficulty: number;
  question: string;
  answer?: number;
  tolerance?: number;
  solution?: string;
  options?: string[];
  correct?: number;
  explanation?: string;
}

interface RealTimeExamTrackerProps {
  onComplete?: () => void;
}

interface QuestionTiming {
  startTime: number;
  endTime?: number;
  duration?: number;
}

interface PerformanceData {
  accuracy: number;
  pace: 'ahead' | 'ontrack' | 'behind';
  momentum: 'gaining' | 'steady' | 'losing';
  competencyScores: Record<string, { correct: number; total: number; accuracy: number }>;
  strengthAreas: string[];
  weaknessAreas: string[];
  avgTimePerQuestion: number;
  predictedScore: number;
}

export function RealTimeExamTracker({ onComplete }: RealTimeExamTrackerProps) {
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds
  const [examCompleted, setExamCompleted] = useState(false);
  const [showResults, setShowResults] = useState<any>(false);
  const [questionTimings, setQuestionTimings] = useState<Record<number, QuestionTiming>>({});
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState<number>(0);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);

  const examQuestions: ExamQuestion[] = [
    {
      id: 1,
      type: "calculation",
      competency: "Present Value",
      difficulty: 2,
      question: "What is the present value of receiving $5,000 in 3 years at a 8% discount rate?",
      answer: 3969,
      tolerance: 50,
      solution: "PV = $5,000 / (1.08)³ = $5,000 / 1.2597 = $3,969"
    },
    {
      id: 2,
      type: "calculation", 
      competency: "Amortization",
      difficulty: 3,
      question: "What is the monthly payment on a $200,000 loan for 30 years at 6% APR?",
      answer: 1199,
      tolerance: 10,
      solution: "PMT = $200,000 × [0.005/(1-(1.005)^-360)] = $1,199"
    },
    {
      id: 3,
      type: "calculation",
      competency: "Present Value",
      difficulty: 2,
      question: "Present value of $1,000 annually for 5 years at 7% discount rate?",
      answer: 4100,
      tolerance: 50,
      solution: "PV = $1,000 × [(1-(1.07)^-5)/0.07] = $1,000 × 4.1002 = $4,100"
    },
    {
      id: 4,
      type: "calculation",
      competency: "Future Value",
      difficulty: 2,
      question: "Future value of $10,000 invested for 8 years at 9% annual rate?",
      answer: 19926,
      tolerance: 100,
      solution: "FV = $10,000 × (1.09)^8 = $10,000 × 1.9926 = $19,926"
    },
    {
      id: 5,
      type: "calculation",
      competency: "Portfolio Theory",
      difficulty: 2,
      question: "Portfolio: 40% Asset A (12% return), 60% Asset B (8% return). Expected return (in %)?",
      answer: 9.6,
      tolerance: 0.2,
      solution: "E(R) = 0.40×12% + 0.60×8% = 4.8% + 4.8% = 9.6%"
    },
    {
      id: 6,
      type: "calculation",
      competency: "Bond Valuation",
      difficulty: 3,
      question: "Bond: $980 price, 6% coupon, $1000 face, 3 years. YTM (approximate %)?",
      answer: 6.8,
      tolerance: 0.3,
      solution: "YTM ≈ [60 + (1000-980)/3] / [(1000+980)/2] = 66.67/990 = 6.73%"
    },
    {
      id: 7,
      type: "multiple_choice",
      competency: "Financial Statements",
      difficulty: 1,
      question: "Accounts Receivable is classified as:",
      options: ["Current Asset", "Long-term Asset", "Current Liability", "Long-term Liability"],
      correct: 0,
      explanation: "A/R represents money owed by customers, typically collected within one year"
    },
    {
      id: 8,
      type: "multiple_choice",
      competency: "Financial Statements",
      difficulty: 2,
      question: "Patents are classified as:",
      options: ["Current Asset", "Long-term Asset", "Current Liability", "Equity"],
      correct: 1,
      explanation: "Patents are intangible assets with value extending beyond one year"
    },
    {
      id: 9,
      type: "multiple_choice",
      competency: "Financial Statements",
      difficulty: 1,
      question: "Retained Earnings is classified as:",
      options: ["Current Asset", "Long-term Liability", "Equity", "Current Liability"],
      correct: 2,
      explanation: "Retained earnings represents accumulated profits belonging to shareholders"
    },
    {
      id: 10,
      type: "multiple_choice",
      competency: "Financial Statements",
      difficulty: 2,
      question: "Mortgage Payable (15-year term) is classified as:",
      options: ["Current Asset", "Current Liability", "Long-term Liability", "Equity"],
      correct: 2,
      explanation: "Mortgage payable extends beyond one year, making it a long-term liability"
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examStarted && timeLeft > 0 && !examCompleted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      completeExam();
    }
    return () => clearTimeout(timer);
  }, [examStarted, timeLeft, examCompleted]);

  useEffect(() => {
    if (examStarted) {
      setCurrentQuestionStartTime(Date.now());
    }
  }, [currentQuestion, examStarted]);

  useEffect(() => {
    if (examStarted) {
      updatePerformanceData();
    }
  }, [currentQuestion, answers, timeLeft]);

  const startExam = () => {
    setExamStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(7200);
    setExamCompleted(false);
    setShowResults(false);
    setQuestionTimings({});
    setCurrentQuestionStartTime(Date.now());
  };

  const updatePerformanceData = () => {
    const answeredQuestions = examQuestions.slice(0, currentQuestion + 1);
    const correctAnswers = answeredQuestions.filter((q, index) => {
      const userAnswer = answers[q.id];
      if (!userAnswer) return false;
      
      if (q.type === 'calculation') {
        return Math.abs(parseFloat(userAnswer) - (q.answer || 0)) <= (q.tolerance || 0);
      } else {
        return parseInt(userAnswer) === (q.correct || 0);
      }
    }).length;

    const accuracy = answeredQuestions.length > 0 ? (correctAnswers / answeredQuestions.length) * 100 : 0;
    const timeElapsed = 7200 - timeLeft;
    const avgTimePerQuestion = answeredQuestions.length > 0 ? timeElapsed / answeredQuestions.length : 0;
    const expectedTimePerQuestion = 7200 / examQuestions.length;
    
    let pace: 'ahead' | 'ontrack' | 'behind' = 'ontrack';
    if (avgTimePerQuestion < expectedTimePerQuestion * 0.8) pace = 'ahead';
    else if (avgTimePerQuestion > expectedTimePerQuestion * 1.2) pace = 'behind';

    // Competency analysis
    const competencyScores: Record<string, { correct: number; total: number; accuracy: number }> = {};

    answeredQuestions.forEach((q, index) => {
      const isCorrect = answers[q.id] && (
        q.type === 'calculation' 
          ? Math.abs(parseFloat(answers[q.id]) - (q.answer || 0)) <= (q.tolerance || 0)
          : parseInt(answers[q.id]) === (q.correct || 0)
      );

      if (!competencyScores[q.competency]) {
        competencyScores[q.competency] = { correct: 0, total: 0, accuracy: 0 };
      }
      competencyScores[q.competency].total++;
      if (isCorrect) competencyScores[q.competency].correct++;
      competencyScores[q.competency].accuracy = 
        (competencyScores[q.competency].correct / competencyScores[q.competency].total) * 100;
    });

    const strengthAreas = Object.entries(competencyScores)
      .filter(([_, scores]) => scores.total > 0 && scores.accuracy >= 80)
      .map(([competency]) => competency);

    const weaknessAreas = Object.entries(competencyScores)
      .filter(([_, scores]) => scores.total > 0 && scores.accuracy < 60)
      .map(([competency]) => competency);

    let momentum: 'gaining' | 'steady' | 'losing' = 'steady';
    if (answeredQuestions.length >= 3) {
      const recent3 = answeredQuestions.slice(-3);
      const recent3Correct = recent3.filter((q) => {
        const userAnswer = answers[q.id];
        if (!userAnswer) return false;
        
        if (q.type === 'calculation') {
          return Math.abs(parseFloat(userAnswer) - (q.answer || 0)) <= (q.tolerance || 0);
        } else {
          return parseInt(userAnswer) === (q.correct || 0);
        }
      }).length;

      if (recent3Correct >= 2) momentum = 'gaining';
      else if (recent3Correct === 0) momentum = 'losing';
    }

    const predictedScore = Math.round(accuracy * 0.7 + (pace === 'ahead' ? 5 : pace === 'behind' ? -5 : 0));

    setPerformanceData({
      accuracy,
      pace,
      momentum,
      competencyScores,
      strengthAreas,
      weaknessAreas,
      avgTimePerQuestion,
      predictedScore: Math.max(0, Math.min(100, predictedScore))
    });
  };

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });

    // Record timing for this question
    const now = Date.now();
    setQuestionTimings({
      ...questionTimings,
      [questionId]: {
        startTime: currentQuestionStartTime,
        endTime: now,
        duration: now - currentQuestionStartTime
      }
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < examQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const completeExam = () => {
    setExamCompleted(true);
    setExamStarted(false);
    calculateResults();
  };

  const calculateResults = () => {
    let totalScore = 0;
    const competencyScores: Record<string, number> = {};

    examQuestions.forEach(question => {
      const userAnswer = answers[question.id];
      let isCorrect = false;

      if (question.type === 'calculation' && question.answer && question.tolerance) {
        const numericAnswer = parseFloat(userAnswer);
        isCorrect = Math.abs(numericAnswer - question.answer) <= question.tolerance;
      } else if (question.type === 'multiple_choice' && question.correct !== undefined) {
        isCorrect = parseInt(userAnswer) === question.correct;
      }

      if (isCorrect) {
        totalScore++;
        competencyScores[question.competency] = (competencyScores[question.competency] || 0) + 1;
      }
    });

    setShowResults({ totalScore, competencyScores });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMomentumIcon = (momentum: string) => {
    switch (momentum) {
      case 'gaining': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'losing': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Target className="h-4 w-4 text-blue-600" />;
    }
  };

  if (!examStarted && !examCompleted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-purple-600" />
            <span>Real-Time ACF Exam Simulator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>Enhanced Features:</strong></p>
                <ul className="text-sm space-y-1">
                  <li>• Real-time performance analytics and insights</li>
                  <li>• Live competency tracking and momentum analysis</li>
                  <li>• Question-by-question timing and navigation</li>
                  <li>• Predictive scoring based on current performance</li>
                  <li>• Instant feedback on strengths and weaknesses</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
          
          <div className="text-center">
            <Button onClick={startExam} className="px-8 py-3" data-testid="start-realtime-exam">
              Start Real-Time Exam Tracking
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (examCompleted && showResults) {
    const percentage = Math.round((showResults.totalScore / examQuestions.length) * 100);
    const passed = percentage >= 70;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Final Exam Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                {showResults.totalScore}/{examQuestions.length} ({percentage}%)
              </div>
              <Badge variant={passed ? "default" : "destructive"} className="text-lg px-4 py-2">
                {passed ? "PASSED" : "NOT PASSED"}
              </Badge>
            </div>
            
            {performanceData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(performanceData.avgTimePerQuestion)}s</div>
                  <div className="text-sm text-muted-foreground">Avg Time/Question</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{performanceData.strengthAreas.length}</div>
                  <div className="text-sm text-muted-foreground">Strength Areas</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{performanceData.predictedScore}%</div>
                  <div className="text-sm text-muted-foreground">Predicted Score</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button onClick={startExam} variant="outline" data-testid="retake-realtime-exam">
            Retake Exam
          </Button>
          <Button onClick={onComplete} data-testid="complete-realtime-exam">
            Complete Exam Module
          </Button>
        </div>
      </div>
    );
  }

  // Exam in progress with real-time tracking
  const currentQ = examQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / examQuestions.length) * 100;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="exam" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exam">Exam Interface</TabsTrigger>
          <TabsTrigger value="analytics">Real-Time Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="exam" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>ACF Placement Exam</span>
                <div className="flex items-center space-x-4 text-sm">
                  <span>Question {currentQuestion + 1}/{examQuestions.length}</span>
                  <span>Time: {formatTime(timeLeft)}</span>
                  {performanceData && (
                    <div className="flex items-center space-x-2">
                      {getMomentumIcon(performanceData.momentum)}
                      <span className="font-medium">{Math.round(performanceData.accuracy)}%</span>
                    </div>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress value={progress} className="w-full" />
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{currentQ.competency}</Badge>
                  <Badge variant={currentQ.difficulty === 1 ? "secondary" : currentQ.difficulty === 2 ? "default" : "destructive"}>
                    Level {currentQ.difficulty}
                  </Badge>
                </div>
                <h3 className="text-lg font-medium">{currentQ.question}</h3>
                
                {currentQ.type === 'calculation' ? (
                  <div className="space-y-2">
                    <Label>Your Answer:</Label>
                    <Input
                      type="number"
                      step="any"
                      value={answers[currentQ.id] || ''}
                      onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                      placeholder="Enter your calculation result"
                      data-testid="calculation-input"
                    />
                  </div>
                ) : (
                  <RadioGroup
                    value={answers[currentQ.id] || ''}
                    onValueChange={(value) => handleAnswer(currentQ.id, value)}
                  >
                    {currentQ.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>

              <div className="flex justify-between">
                <Button 
                  onClick={prevQuestion} 
                  disabled={currentQuestion === 0}
                  variant="outline"
                  data-testid="prev-question"
                >
                  Previous
                </Button>
                
                {currentQuestion === examQuestions.length - 1 ? (
                  <Button onClick={completeExam} data-testid="finish-exam">
                    Finish Exam
                  </Button>
                ) : (
                  <Button onClick={nextQuestion} data-testid="next-question">
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            {/* Real-time Performance Dashboard */}
            {performanceData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span>Live Performance Metrics</span>
                    </span>
                    <div className="flex items-center space-x-2">
                      {getMomentumIcon(performanceData.momentum)}
                      <span className="text-sm font-medium capitalize">{performanceData.momentum}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {Math.round(performanceData.accuracy)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Current Accuracy</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {performanceData.predictedScore}%
                        </div>
                        <div className="text-sm text-muted-foreground">Predicted Final Score</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Competency Performance</h4>
                      {Object.entries(performanceData.competencyScores).map(([competency, scores]) => (
                        <div key={competency} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="truncate">{competency}</span>
                            <span>{scores.correct}/{scores.total} ({Math.round(scores.accuracy)}%)</span>
                          </div>
                          <Progress value={scores.accuracy} className="h-2" />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      {performanceData.strengthAreas.length > 0 && (
                        <Alert>
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertDescription>
                            <div className="text-sm">
                              <div className="font-medium text-green-800 mb-1">Strengths</div>
                              {performanceData.strengthAreas.map(area => (
                                <div key={area}>• {area}</div>
                              ))}
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}

                      {performanceData.weaknessAreas.length > 0 && (
                        <Alert>
                          <Brain className="h-4 w-4 text-orange-600" />
                          <AlertDescription>
                            <div className="text-sm">
                              <div className="font-medium text-orange-800 mb-1">Focus Areas</div>
                              {performanceData.weaknessAreas.map(area => (
                                <div key={area}>• {area}</div>
                              ))}
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Question Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {examQuestions.map((question, index) => {
                    const isAnswered = answers[question.id] !== undefined;
                    const isCurrent = index === currentQuestion;
                    const isCorrect = isAnswered && (
                      question.type === 'calculation' 
                        ? Math.abs(parseFloat(answers[question.id]) - (question.answer || 0)) <= (question.tolerance || 0)
                        : parseInt(answers[question.id]) === (question.correct || 0)
                    );

                    return (
                      <button
                        key={question.id}
                        onClick={() => jumpToQuestion(index)}
                        className={`
                          relative w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all
                          ${isCurrent 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : isAnswered 
                              ? isCorrect 
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-red-500 bg-red-50 text-red-700'
                              : 'border-gray-300 bg-gray-50 text-gray-500 hover:border-gray-400'
                          }
                        `}
                        data-testid={`question-nav-${index + 1}`}
                      >
                        {index + 1}
                        {isAnswered && (
                          <div className="absolute -top-1 -right-1">
                            {isCorrect ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}