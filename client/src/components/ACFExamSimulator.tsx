import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';

interface ACFExamSimulatorProps {
  onComplete?: () => void;
}

interface ExamQuestion {
  id: number;
  type: "calculation" | "multiple_choice";
  competency: string;
  question: string;
  answer?: number;
  tolerance?: number;
  solution?: string;
  options?: string[];
  correct?: number;
  explanation?: string;
}

export function ACFExamSimulator({ onComplete }: ACFExamSimulatorProps) {
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds
  const [examCompleted, setExamCompleted] = useState(false);
  const [showResults, setShowResults] = useState<any>(false);

  const examQuestions: ExamQuestion[] = [
    // Present Value & Amortization (8 questions)
    {
      id: 1,
      type: "calculation",
      competency: "Present Value",
      question: "What is the present value of receiving $5,000 in 3 years at a 8% discount rate?",
      answer: 3969,
      tolerance: 50,
      solution: "PV = $5,000 / (1.08)³ = $5,000 / 1.2597 = $3,969"
    },
    {
      id: 2,
      type: "calculation", 
      competency: "Amortization",
      question: "What is the monthly payment on a $200,000 loan for 30 years at 6% APR?",
      answer: 1199,
      tolerance: 10,
      solution: "PMT = $200,000 × [0.005/(1-(1.005)^-360)] = $1,199"
    },
    {
      id: 3,
      type: "calculation",
      competency: "Present Value",
      question: "Present value of $1,000 annually for 5 years at 7% discount rate?",
      answer: 4100,
      tolerance: 50,
      solution: "PV = $1,000 × [(1-(1.07)^-5)/0.07] = $1,000 × 4.1002 = $4,100"
    },
    {
      id: 4,
      type: "calculation",
      competency: "Future Value",
      question: "Future value of $10,000 invested for 8 years at 9% annual rate?",
      answer: 19926,
      tolerance: 100,
      solution: "FV = $10,000 × (1.09)^8 = $10,000 × 1.9926 = $19,926"
    },
    {
      id: 5,
      type: "calculation",
      competency: "Portfolio Return",
      question: "Portfolio: 40% Asset A (12% return), 60% Asset B (8% return). Expected return (in %)?",
      answer: 9.6,
      tolerance: 0.2,
      solution: "E(R) = 0.40×12% + 0.60×8% = 4.8% + 4.8% = 9.6%"
    },
    {
      id: 6,
      type: "calculation",
      competency: "Bond YTM",
      question: "Bond: $980 price, 6% coupon, $1000 face, 3 years. YTM (approximate %)?",
      answer: 6.8,
      tolerance: 0.3,
      solution: "YTM ≈ [60 + (1000-980)/3] / [(1000+980)/2] = 66.67/990 = 6.73%"
    },
    // Financial Statement Classification (multiple choice)
    {
      id: 7,
      type: "multiple_choice",
      competency: "Classification",
      question: "Accounts Receivable is classified as:",
      options: ["Current Asset", "Long-term Asset", "Current Liability", "Long-term Liability"],
      correct: 0,
      explanation: "A/R represents money owed by customers, typically collected within one year"
    },
    {
      id: 8,
      type: "multiple_choice",
      competency: "Classification",
      question: "Patents are classified as:",
      options: ["Current Asset", "Long-term Asset", "Current Liability", "Equity"],
      correct: 1,
      explanation: "Patents are intangible assets with value extending beyond one year"
    },
    {
      id: 9,
      type: "multiple_choice",
      competency: "Classification",
      question: "Retained Earnings is classified as:",
      options: ["Current Asset", "Long-term Liability", "Equity", "Current Liability"],
      correct: 2,
      explanation: "Retained earnings represents accumulated profits belonging to shareholders"
    },
    {
      id: 10,
      type: "multiple_choice",
      competency: "Classification",
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

  const startExam = () => {
    setExamStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(7200);
    setExamCompleted(false);
    setShowResults(false);
  };

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers({
      ...answers,
      [questionId]: answer
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

  if (!examStarted && !examCompleted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ACF Placement Exam Simulator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>Exam Format:</strong> 10 questions covering all ACF competency areas</p>
                <p><strong>Time Limit:</strong> 2 hours (120 minutes)</p>
                <p><strong>Question Types:</strong> Calculations and multiple choice</p>
                <p><strong>Passing Score:</strong> 70% (7 out of 10 questions)</p>
                <p><strong>Calculator:</strong> Financial calculator recommended</p>
              </div>
            </AlertDescription>
          </Alert>
          
          <div className="text-center">
            <Button onClick={startExam} className="px-8 py-3" data-testid="start-exam">
              Start ACF Placement Exam
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
            <CardTitle>Exam Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                {showResults.totalScore}/{examQuestions.length} ({percentage}%)
              </div>
              <Badge variant={passed ? "default" : "destructive"} className="text-lg px-4 py-2">
                {passed ? "PASSED" : "NOT PASSED"}
              </Badge>
              <p className="text-muted-foreground">
                {passed ? "Congratulations! You're ready for the ACF program." : "Review your weak areas and retake when ready."}
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold">Competency Breakdown:</h3>
              {Object.entries(showResults.competencyScores).map(([competency, score]) => (
                <div key={competency} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span>{competency}</span>
                  <Badge variant="outline">{score} correct</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button onClick={startExam} variant="outline" data-testid="retake-exam">
            Retake Exam
          </Button>
          <Button onClick={onComplete} data-testid="complete-exam">
            Complete Exam Module
          </Button>
        </div>
      </div>
    );
  }

  // Exam in progress
  const currentQ = examQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / examQuestions.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>ACF Placement Exam</span>
          <div className="flex items-center space-x-4 text-sm">
            <span>Question {currentQuestion + 1}/{examQuestions.length}</span>
            <span>Time: {formatTime(timeLeft)}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress value={progress} className="w-full" />
        
        <div className="space-y-4">
          <Badge variant="outline">{currentQ.competency}</Badge>
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
  );
}