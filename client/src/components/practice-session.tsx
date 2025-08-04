import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  Target,
  ArrowRight,
  RotateCcw
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

interface PracticeSessionProps {
  topic: string;
  problems: ACFProblem[];
  onComplete: (results: any) => void;
  onExit: () => void;
}

export function PracticeSession({ topic, problems, onComplete, onExit }: PracticeSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [sessionResults, setSessionResults] = useState<any[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [problemStartTime, setProblemStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hintsShown, setHintsShown] = useState(0);

  const currentProblem = problems[currentIndex];
  const isLastProblem = currentIndex === problems.length - 1;

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - problemStartTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [problemStartTime]);

  // Reset timer when problem changes
  useEffect(() => {
    setProblemStartTime(Date.now());
    setElapsedTime(0);
    setHintsShown(0);
  }, [currentIndex]);

  const validateAnswer = (userInput: string, correctAnswer: string | number): boolean => {
    // Handle numeric answers with tolerance
    if (typeof correctAnswer === 'number') {
      const userNum = parseFloat(userInput.replace(/[,$%]/g, ''));
      if (isNaN(userNum)) return false;
      const tolerance = Math.abs(correctAnswer) * 0.02; // 2% tolerance
      return Math.abs(userNum - correctAnswer) <= tolerance;
    }
    
    // Handle text answers (case insensitive)
    return userInput.toLowerCase().includes(correctAnswer.toLowerCase()) ||
           correctAnswer.toLowerCase().includes(userInput.toLowerCase());
  };

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      alert('Please enter an answer');
      return;
    }

    const correct = validateAnswer(userAnswer, currentProblem.answer);
    setIsCorrect(correct);
    setShowFeedback(true);

    // Record result
    const result = {
      problemId: currentProblem.id,
      topic: currentProblem.topic,
      correct,
      userAnswer,
      correctAnswer: currentProblem.answer,
      timeSpent: Math.floor((Date.now() - problemStartTime) / 1000),
      hintsUsed: hintsShown,
      difficulty: currentProblem.difficulty
    };

    setSessionResults(prev => [...prev, result]);
  };

  const handleNext = () => {
    if (isLastProblem) {
      // Complete session
      const finalResults = {
        topic,
        totalProblems: problems.length,
        correctAnswers: sessionResults.filter(r => r.correct).length + (isCorrect ? 1 : 0),
        totalTime: Math.floor((Date.now() - startTime) / 1000),
        averageTime: Math.floor((Date.now() - startTime) / 1000 / problems.length),
        results: sessionResults
      };
      onComplete(finalResults);
    } else {
      // Next problem
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setShowFeedback(false);
      setIsCorrect(false);
    }
  };

  const showHint = () => {
    if (currentProblem.hints && hintsShown < currentProblem.hints.length) {
      setHintsShown(prev => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 0: return 'bg-green-100 text-green-800';
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 0: return 'Beginner';
      case 1: return 'Intermediate'; 
      case 2: return 'Advanced';
      default: return 'Unknown';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6" data-testid="practice-session">
      {/* Session Header */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <div>
              <CardTitle className="text-lg sm:text-xl flex items-center space-x-2">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                <span>{topic} Practice</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Problem {currentIndex + 1} of {problems.length}
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm sm:text-base font-mono">{formatTime(elapsedTime)}</span>
              </div>
              <Button variant="outline" size="sm" onClick={onExit} data-testid="button-exit-session">
                Exit Session
              </Button>
            </div>
          </div>
          <Progress 
            value={(currentIndex / problems.length) * 100} 
            className="mt-3 h-1.5 sm:h-2" 
          />
        </CardHeader>
      </Card>

      {/* Problem Card */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
            <Badge variant="outline" className={getDifficultyColor(currentProblem.difficulty)}>
              {getDifficultyLabel(currentProblem.difficulty)}
            </Badge>
            {currentProblem.timeEstimate && (
              <Badge variant="secondary" className="text-xs">
                Est. {Math.floor(currentProblem.timeEstimate / 60)}min
              </Badge>
            )}
            <div className="flex flex-wrap gap-1">
              {currentProblem.concepts.slice(0, 3).map((concept, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {concept}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 sm:p-6 rounded-lg border-l-4 border-blue-600">
            <p className="text-base sm:text-lg leading-relaxed">
              {currentProblem.question}
            </p>
          </div>

          {currentProblem.realWorldContext && (
            <div className="bg-green-50 dark:bg-green-950/20 p-3 sm:p-4 rounded-lg mt-3 sm:mt-4">
              <p className="text-xs sm:text-sm text-green-800 dark:text-green-200">
                <strong>Real-world context:</strong> {currentProblem.realWorldContext}
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-4 sm:p-6 pt-0">
          {!showFeedback ? (
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Enter your answer..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  className="text-base sm:text-lg p-3 sm:p-4"
                  data-testid="input-answer"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Button 
                  onClick={handleSubmit}
                  className="flex-1 sm:flex-none text-sm sm:text-base"
                  data-testid="button-submit-answer"
                >
                  Submit Answer
                </Button>
                
                {currentProblem.hints && hintsShown < currentProblem.hints.length && (
                  <Button 
                    variant="outline" 
                    onClick={showHint}
                    className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
                    data-testid="button-show-hint"
                  >
                    <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Show Hint ({hintsShown}/{currentProblem.hints.length})</span>
                  </Button>
                )}
              </div>

              {/* Hints Display */}
              {currentProblem.hints && hintsShown > 0 && (
                <div className="space-y-2">
                  {currentProblem.hints.slice(0, hintsShown).map((hint, index) => (
                    <div key={index} className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border-l-2 border-yellow-400">
                      <p className="text-sm"><strong>Hint {index + 1}:</strong> {hint}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Feedback Display
            <div className="space-y-4">
              <div className={`p-4 sm:p-6 rounded-lg border-l-4 ${
                isCorrect 
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-600' 
                  : 'bg-red-50 dark:bg-red-950/20 border-red-600'
              }`}>
                <div className="flex items-center space-x-2 mb-3">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <h3 className="text-lg font-semibold">
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </h3>
                </div>
                
                {!isCorrect && (
                  <p className="mb-3">
                    <strong>Correct answer:</strong> {currentProblem.answer}
                  </p>
                )}
                
                <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded border">
                  <h4 className="font-medium mb-2">Solution:</h4>
                  <div className="text-sm leading-relaxed whitespace-pre-line">
                    {currentProblem.solution}
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={handleNext}
                  className="flex items-center space-x-2 text-sm sm:text-base"
                  data-testid="button-next-problem"
                >
                  <span>{isLastProblem ? 'Complete Session' : 'Next Problem'}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}