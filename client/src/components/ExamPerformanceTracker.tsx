import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  XCircle,
  BarChart3,
  Brain,
  Zap
} from 'lucide-react';

interface ExamQuestion {
  id: number;
  competency: string;
  type: 'calculation' | 'multiple_choice';
  difficulty: number;
  timeSpent?: number;
  answered?: boolean;
  correct?: boolean;
  attempts?: number;
}

interface PerformanceMetrics {
  currentQuestion: number;
  totalQuestions: number;
  timeElapsed: number;
  totalTime: number;
  correctAnswers: number;
  accuracy: number;
  pace: 'ahead' | 'ontrack' | 'behind';
  strengthAreas: string[];
  weaknessAreas: string[];
  avgTimePerQuestion: number;
  competencyScores: Record<string, { correct: number; total: number }>;
  difficultyProgress: Record<number, { correct: number; total: number }>;
  momentum: 'gaining' | 'steady' | 'losing';
}

interface ExamPerformanceTrackerProps {
  questions: ExamQuestion[];
  currentQuestionIndex: number;
  timeElapsed: number;
  totalTime: number;
  answers: Record<number, any>;
  onQuestionChange?: (index: number) => void;
}

export function ExamPerformanceTracker({
  questions,
  currentQuestionIndex,
  timeElapsed,
  totalTime,
  answers,
  onQuestionChange
}: ExamPerformanceTrackerProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);

  useEffect(() => {
    calculateMetrics();
  }, [currentQuestionIndex, timeElapsed, answers]);

  const calculateMetrics = () => {
    const answeredQuestions = questions.slice(0, currentQuestionIndex + 1);
    const correctAnswers = answeredQuestions.filter((q, index) => {
      const userAnswer = answers[q.id];
      if (!userAnswer) return false;
      
      if (q.type === 'calculation') {
        return Math.abs(parseFloat(userAnswer) - (q as any).answer) <= (q as any).tolerance;
      } else {
        return parseInt(userAnswer) === (q as any).correct;
      }
    }).length;

    const accuracy = answeredQuestions.length > 0 ? (correctAnswers / answeredQuestions.length) * 100 : 0;
    const avgTimePerQuestion = answeredQuestions.length > 0 ? timeElapsed / answeredQuestions.length : 0;
    const expectedTimePerQuestion = totalTime / questions.length;
    
    let pace: 'ahead' | 'ontrack' | 'behind' = 'ontrack';
    if (avgTimePerQuestion < expectedTimePerQuestion * 0.8) pace = 'ahead';
    else if (avgTimePerQuestion > expectedTimePerQuestion * 1.2) pace = 'behind';

    // Competency analysis
    const competencyScores: Record<string, { correct: number; total: number }> = {};
    const difficultyProgress: Record<number, { correct: number; total: number }> = {};

    answeredQuestions.forEach((q, index) => {
      const isCorrect = answers[q.id] && (
        q.type === 'calculation' 
          ? Math.abs(parseFloat(answers[q.id]) - (q as any).answer) <= (q as any).tolerance
          : parseInt(answers[q.id]) === (q as any).correct
      );

      // Competency tracking
      if (!competencyScores[q.competency]) {
        competencyScores[q.competency] = { correct: 0, total: 0 };
      }
      competencyScores[q.competency].total++;
      if (isCorrect) competencyScores[q.competency].correct++;

      // Difficulty tracking
      if (!difficultyProgress[q.difficulty]) {
        difficultyProgress[q.difficulty] = { correct: 0, total: 0 };
      }
      difficultyProgress[q.difficulty].total++;
      if (isCorrect) difficultyProgress[q.difficulty].correct++;
    });

    // Identify strengths and weaknesses
    const strengthAreas = Object.entries(competencyScores)
      .filter(([_, scores]) => scores.total > 0 && (scores.correct / scores.total) >= 0.8)
      .map(([competency]) => competency);

    const weaknessAreas = Object.entries(competencyScores)
      .filter(([_, scores]) => scores.total > 0 && (scores.correct / scores.total) < 0.6)
      .map(([competency]) => competency);

    // Calculate momentum (last 3 questions trend)
    let momentum: 'gaining' | 'steady' | 'losing' = 'steady';
    if (answeredQuestions.length >= 3) {
      const recent3 = answeredQuestions.slice(-3);
      const recent3Correct = recent3.filter((q, index) => {
        const actualIndex = answeredQuestions.length - 3 + index;
        const userAnswer = answers[q.id];
        if (!userAnswer) return false;
        
        if (q.type === 'calculation') {
          return Math.abs(parseFloat(userAnswer) - (q as any).answer) <= (q as any).tolerance;
        } else {
          return parseInt(userAnswer) === (q as any).correct;
        }
      }).length;

      if (recent3Correct >= 2) momentum = 'gaining';
      else if (recent3Correct === 0) momentum = 'losing';
    }

    setMetrics({
      currentQuestion: currentQuestionIndex + 1,
      totalQuestions: questions.length,
      timeElapsed,
      totalTime,
      correctAnswers,
      accuracy,
      pace,
      strengthAreas,
      weaknessAreas,
      avgTimePerQuestion,
      competencyScores,
      difficultyProgress,
      momentum
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPaceColor = (pace: string) => {
    switch (pace) {
      case 'ahead': return 'text-green-600';
      case 'behind': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getMomentumIcon = (momentum: string) => {
    switch (momentum) {
      case 'gaining': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'losing': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Target className="h-4 w-4 text-blue-600" />;
    }
  };

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Real-time Performance Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Real-time Performance</span>
            </span>
            <div className="flex items-center space-x-2">
              {getMomentumIcon(metrics.momentum)}
              <span className="text-sm font-medium capitalize">{metrics.momentum}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Progress Overview */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {metrics.currentQuestion}/{metrics.totalQuestions}
                  </span>
                </div>
                <Progress value={(metrics.currentQuestion / metrics.totalQuestions) * 100} />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Time Remaining</span>
                  <span className={`text-sm font-medium ${getPaceColor(metrics.pace)}`}>
                    {formatTime(metrics.totalTime - metrics.timeElapsed)}
                  </span>
                </div>
                <Progress 
                  value={(metrics.timeElapsed / metrics.totalTime) * 100} 
                  className={metrics.pace === 'behind' ? 'bg-red-100' : 'bg-green-100'}
                />
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(metrics.accuracy)}%
                </div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Correct:</span>
                <Badge variant="outline" className="text-green-600">
                  {metrics.correctAnswers}/{metrics.currentQuestion}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Pace:</span>
                <Badge variant={metrics.pace === 'ahead' ? 'default' : metrics.pace === 'behind' ? 'destructive' : 'secondary'}>
                  {metrics.pace}
                </Badge>
              </div>
            </div>

            {/* Competency Breakdown */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Competency Performance</h4>
              {Object.entries(metrics.competencyScores).map(([competency, scores]) => {
                const percentage = scores.total > 0 ? (scores.correct / scores.total) * 100 : 0;
                return (
                  <div key={competency} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="truncate">{competency}</span>
                      <span>{scores.correct}/{scores.total}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        {metrics.strengthAreas.length > 0 && (
          <Alert>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium text-green-800">Strong Performance</div>
                <ul className="text-sm space-y-1">
                  {metrics.strengthAreas.map(area => (
                    <li key={area}>• {area}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Areas for Improvement */}
        {metrics.weaknessAreas.length > 0 && (
          <Alert>
            <Brain className="h-4 w-4 text-orange-600" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium text-orange-800">Focus Areas</div>
                <ul className="text-sm space-y-1">
                  {metrics.weaknessAreas.map(area => (
                    <li key={area}>• {area}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Question Navigation Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question Navigator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {questions.map((question, index) => {
              const isAnswered = answers[question.id] !== undefined;
              const isCurrent = index === currentQuestionIndex;
              const isCorrect = isAnswered && (
                question.type === 'calculation' 
                  ? Math.abs(parseFloat(answers[question.id]) - (question as any).answer) <= (question as any).tolerance
                  : parseInt(answers[question.id]) === (question as any).correct
              );

              return (
                <button
                  key={question.id}
                  onClick={() => onQuestionChange?.(index)}
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
          
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 border-2 border-blue-500 bg-blue-50 rounded"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 border-2 border-green-500 bg-green-50 rounded"></div>
              <span>Correct</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 border-2 border-red-500 bg-red-50 rounded"></div>
              <span>Incorrect</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 border-2 border-gray-300 bg-gray-50 rounded"></div>
              <span>Unanswered</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}