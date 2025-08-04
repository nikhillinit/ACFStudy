import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

const ACFExamSimulator = ({ onComplete }) => {
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds
  const [examCompleted, setExamCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const examQuestions = [
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
      competency: "Amortization",
      question: "Monthly payment on $150,000 loan, 15 years, 5% APR?",
      answer: 1186,
      tolerance: 10,
      solution: "PMT = $150,000 × [0.004167/(1-(1.004167)^-180)] = $1,186"
    },
    {
      id: 6,
      type: "calculation",
      competency: "Present Value",
      question: "PV of $2,500 received in 6 years at 10% discount rate?",
      answer: 1408,
      tolerance: 25,
      solution: "PV = $2,500 / (1.10)^6 = $2,500 / 1.7716 = $1,408"
    },
    {
      id: 7,
      type: "calculation",
      competency: "Annuity",
      question: "PV of $500 quarterly for 4 years at 8% annual rate (2% quarterly)?",
      answer: 7325,
      tolerance: 50,
      solution: "PV = $500 × [(1-(1.02)^-16)/0.02] = $500 × 14.6497 = $7,325"
    },
    {
      id: 8,
      type: "calculation",
      competency: "Future Value",
      question: "FV of $25,000 invested for 12 years at 6% annual rate?",
      answer: 50362,
      tolerance: 200,
      solution: "FV = $25,000 × (1.06)^12 = $25,000 × 2.0145 = $50,362"
    },

    // Portfolio Return & Risk (6 questions)
    {
      id: 9,
      type: "calculation",
      competency: "Portfolio Return",
      question: "Portfolio: 40% Asset A (12% return), 60% Asset B (8% return). Expected return?",
      answer: 9.6,
      tolerance: 0.2,
      solution: "E(R) = 0.40×12% + 0.60×8% = 4.8% + 4.8% = 9.6%"
    },
    {
      id: 10,
      type: "calculation",
      competency: "Portfolio Risk",
      question: "Portfolio std dev: 50% in A (σ=20%), 50% in B (σ=30%), correlation=0.4. Result in %?",
      answer: 22.36,
      tolerance: 1,
      solution: "σp = √[(0.5²×0.2²) + (0.5²×0.3²) + (2×0.5×0.5×0.2×0.3×0.4)] = 22.36%"
    },
    {
      id: 11,
      type: "calculation",
      competency: "Portfolio Return",
      question: "3-asset portfolio: 30% A (15%), 50% B (10%), 20% C (5%). Expected return?",
      answer: 10.5,
      tolerance: 0.2,
      solution: "E(R) = 0.30×15% + 0.50×10% + 0.20×5% = 4.5% + 5% + 1% = 10.5%"
    },
    {
      id: 12,
      type: "calculation",
      competency: "Portfolio Risk",
      question: "Two-asset portfolio: 70% A (σ=15%), 30% B (σ=25%), correlation=0. Portfolio std dev?",
      answer: 13.45,
      tolerance: 0.5,
      solution: "σp = √[(0.7²×0.15²) + (0.3²×0.25²)] = √[0.011025 + 0.005625] = 13.45%"
    },
    {
      id: 13,
      type: "calculation",
      competency: "Portfolio Return",
      question: "Portfolio: 25% stocks (16%), 75% bonds (6%). Expected return?",
      answer: 8.5,
      tolerance: 0.2,
      solution: "E(R) = 0.25×16% + 0.75×6% = 4% + 4.5% = 8.5%"
    },
    {
      id: 14,
      type: "calculation",
      competency: "Portfolio Risk",
      question: "Equal-weighted 2-asset portfolio: σA=18%, σB=24%, correlation=0.6. Portfolio std dev?",
      answer: 19.90,
      tolerance: 0.5,
      solution: "σp = √[(0.5²×0.18²) + (0.5²×0.24²) + (2×0.5×0.5×0.18×0.24×0.6)] = 19.90%"
    },

    // Bond Valuation & Investment Returns (6 questions)
    {
      id: 15,
      type: "calculation",
      competency: "Bond YTM",
      question: "Bond: $980 price, 6% coupon, $1000 face, 3 years. YTM (approximate %)?",
      answer: 6.8,
      tolerance: 0.3,
      solution: "YTM ≈ [60 + (1000-980)/3] / [(1000+980)/2] = 66.67/990 = 6.73%"
    },
    {
      id: 16,
      type: "calculation",
      competency: "Stock Return",
      question: "Stock: Buy $45, sell $52, dividend $2. Total return (%)?",
      answer: 20,
      tolerance: 1,
      solution: "Total Return = (52-45+2)/45 = 9/45 = 20%"
    },
    {
      id: 17,
      type: "calculation",
      competency: "Bond YTM",
      question: "Bond: $1050 price, 8% coupon, $1000 face, 5 years. YTM (approximate %)?",
      answer: 7.24,
      tolerance: 0.3,
      solution: "YTM ≈ [80 + (1000-1050)/5] / [(1000+1050)/2] = 70/1025 = 6.83%"
    },
    {
      id: 18,
      type: "calculation",
      competency: "Stock Return",
      question: "Stock: Buy $30, sell $28, dividend $1.50. Total return (%)?",
      answer: -1.67,
      tolerance: 0.5,
      solution: "Total Return = (28-30+1.5)/30 = -0.5/30 = -1.67%"
    },
    {
      id: 19,
      type: "calculation",
      competency: "Current Yield",
      question: "Bond with $1000 face, 7% coupon, trading at $950. Current yield (%)?",
      answer: 7.37,
      tolerance: 0.1,
      solution: "Current Yield = Annual Coupon/Price = $70/$950 = 7.37%"
    },
    {
      id: 20,
      type: "calculation",
      competency: "Stock Return",
      question: "Stock: Buy $25, sell $30, dividend $0.75. Capital gains yield (%)?",
      answer: 20,
      tolerance: 1,
      solution: "Capital Gains Yield = (30-25)/25 = 5/25 = 20%"
    },

    // Financial Statement Classification (10 questions)
    {
      id: 21,
      type: "multiple_choice",
      competency: "Classification",
      question: "Accounts Receivable is classified as:",
      options: ["Current Asset", "Long-term Asset", "Current Liability", "Long-term Liability"],
      correct: 0,
      explanation: "A/R represents money owed by customers, typically collected within one year"
    },
    {
      id: 22,
      type: "multiple_choice",
      competency: "Classification",
      question: "Patents are classified as:",
      options: ["Current Asset", "Long-term Asset", "Current Liability", "Equity"],
      correct: 1,
      explanation: "Patents are intangible assets with value extending beyond one year"
    },
    {
      id: 23,
      type: "multiple_choice",
      competency: "Classification",
      question: "Wages Payable is classified as:",
      options: ["Current Asset", "Long-term Asset", "Current Liability", "Long-term Liability"],
      correct: 2,
      explanation: "Wages payable represents accrued wages owed to employees, paid within a year"
    },
    {
      id: 24,
      type: "multiple_choice",
      competency: "Classification",
      question: "Retained Earnings is classified as:",
      options: ["Current Asset", "Long-term Liability", "Equity", "Current Liability"],
      correct: 2,
      explanation: "Retained earnings represents accumulated profits belonging to shareholders"
    },
    {
      id: 25,
      type: "multiple_choice",
      competency: "Classification",
      question: "Inventory is classified as:",
      options: ["Current Asset", "Long-term Asset", "Current Liability", "Long-term Liability"],
      correct: 0,
      explanation: "Inventory is converted to cash through sales within the operating cycle"
    },
    {
      id: 26,
      type: "multiple_choice",
      competency: "Classification",
      question: "Mortgage Payable (15-year term) is classified as:",
      options: ["Current Asset", "Current Liability", "Long-term Liability", "Equity"],
      correct: 2,
      explanation: "Mortgage payable extends beyond one year, making it a long-term liability"
    },
    {
      id: 27,
      type: "multiple_choice",
      competency: "Classification",
      question: "Prepaid Insurance is classified as:",
      options: ["Current Asset", "Long-term Asset", "Current Liability", "Expense"],
      correct: 0,
      explanation: "Prepaid insurance provides benefit within one year, making it a current asset"
    },
    {
      id: 28,
      type: "multiple_choice",
      competency: "Classification",
      question: "Equipment is classified as:",
      options: ["Current Asset", "Long-term Asset", "Current Liability", "Long-term Liability"],
      correct: 1,
      explanation: "Equipment is property, plant & equipment with useful life exceeding one year"
    },
    {
      id: 29,
      type: "multiple_choice",
      competency: "Classification",
      question: "Accounts Payable is classified as:",
      options: ["Current Asset", "Long-term Asset", "Current Liability", "Long-term Liability"],
      correct: 2,
      explanation: "Accounts payable represents money owed to suppliers, typically paid within a year"
    },
    {
      id: 30,
      type: "multiple_choice",
      competency: "Classification",
      question: "Common Stock is classified as:",
      options: ["Current Asset", "Long-term Liability", "Equity", "Current Liability"],
      correct: 2,
      explanation: "Common stock represents ownership shares issued to shareholders"
    }
  ];

  useEffect(() => {
    let timer;
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

  const handleAnswer = (questionId, answer) => {
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
    const competencyScores = {};

    examQuestions.forEach(question => {
      const userAnswer = answers[question.id];
      let isCorrect = false;

      if (question.type === 'calculation') {
        const numericAnswer = parseFloat(userAnswer);
        isCorrect = Math.abs(numericAnswer - question.answer) <= question.tolerance;
      } else if (question.type === 'multiple_choice') {
        isCorrect = parseInt(userAnswer) === question.correct;
      }

      if (isCorrect) {
        totalScore++;
        competencyScores[question.competency] = (competencyScores[question.competency] || 0) + 1;
      }
    });

    setShowResults({ totalScore, competencyScores });
  };

  const formatTime = (seconds) => {
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
              <strong>Exam Conditions:</strong> 30 questions, 2 hours, calculator allowed, no collaboration
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Questions:</strong> 30 total</div>
            <div><strong>Time Limit:</strong> 2 hours</div>
            <div><strong>Passing Score:</strong> 80% (24/30)</div>
            <div><strong>Format:</strong> Mixed calculation & multiple choice</div>
          </div>
          <div className="text-center">
            <Button onClick={startExam} className="px-8 py-3">
              Begin ACF Exam Simulation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (examCompleted && showResults) {
    const percentage = Math.round((showResults.totalScore / examQuestions.length) * 100);
    const passed = percentage >= 80;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Exam Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                {showResults.totalScore}/30 ({percentage}%)
              </div>
              <div className="text-lg mt-2">
                {passed ? "🎉 PASSED! ACF Exam Ready" : "❌ More preparation needed"}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">Competency Breakdown:</h4>
                <ul className="text-sm space-y-1">
                  {Object.entries(showResults.competencyScores).map(([comp, score]) => (
                    <li key={comp}>{comp}: {score} correct</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Recommendations:</h4>
                <ul className="text-sm space-y-1">
                  {percentage < 80 && <li>• Review weak competency areas</li>}
                  {percentage < 70 && <li>• Practice more calculation problems</li>}
                  {percentage >= 80 && <li>• Ready for actual ACF exam!</li>}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button onClick={startExam} variant="outline">
            Retake Exam
          </Button>
          <Button onClick={onComplete} className="px-8">
            Complete ACF Preparation
          </Button>
        </div>
      </div>
    );
  }

  const question = examQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / examQuestions.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>ACF Exam Simulation</span>
          <div className="flex space-x-4 text-sm">
            <span>Question {currentQuestion + 1}/{examQuestions.length}</span>
            <span>Time: {formatTime(timeLeft)}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress value={progress} className="w-full" />
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            {question.competency} • {question.type === 'calculation' ? 'Calculation' : 'Multiple Choice'}
          </div>
          
          <div className="text-lg font-medium">
            {question.question}
          </div>

          {question.type === 'calculation' ? (
            <div>
              <Label>Your Answer:</Label>
              <Input
                type="number"
                step="0.01"
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                placeholder="Enter your numerical answer"
              />
            </div>
          ) : (
            <RadioGroup
              value={answers[question.id]?.toString()}
              onValueChange={(value) => handleAnswer(question.id, value)}
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
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
          >
            Previous
          </Button>
          
          <div className="space-x-2">
            {currentQuestion === examQuestions.length - 1 ? (
              <Button onClick={completeExam} className="bg-green-600 hover:bg-green-700">
                Submit Exam
              </Button>
            ) : (
              <Button onClick={nextQuestion}>
                Next
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ACFExamSimulator;

