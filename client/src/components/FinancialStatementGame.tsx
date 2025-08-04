import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface FinancialStatementGameProps {
  onComplete?: () => void;
}

export function FinancialStatementGame({ onComplete }: FinancialStatementGameProps) {
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [answers, setAnswers] = useState<Array<{
    item: string;
    selected: string;
    correct: string;
    isCorrect: boolean;
    explanation: string;
  }>>([]);

  const accountItems = [
    { name: "Cash", correct: "Current Asset", explanation: "Cash is the most liquid current asset" },
    { name: "Accounts Receivable", correct: "Current Asset", explanation: "Money owed by customers, typically collected within a year" },
    { name: "Inventory", correct: "Current Asset", explanation: "Goods held for sale, converted to cash within operating cycle" },
    { name: "Prepaid Insurance", correct: "Current Asset", explanation: "Insurance paid in advance, benefit received within a year" },
    { name: "Land", correct: "Long-term Asset", explanation: "Real estate held for more than one year" },
    { name: "Buildings", correct: "Long-term Asset", explanation: "Property, plant & equipment with useful life > 1 year" },
    { name: "Equipment", correct: "Long-term Asset", explanation: "Machinery and equipment used in operations" },
    { name: "Patents", correct: "Long-term Asset", explanation: "Intangible assets with value beyond one year" },
    { name: "Accounts Payable", correct: "Current Liability", explanation: "Money owed to suppliers, typically paid within a year" },
    { name: "Wages Payable", correct: "Current Liability", explanation: "Accrued wages owed to employees" },
    { name: "Short-term Notes Payable", correct: "Current Liability", explanation: "Debt obligations due within one year" },
    { name: "Interest Payable", correct: "Current Liability", explanation: "Accrued interest on debt obligations" },
    { name: "Long-term Debt", correct: "Long-term Liability", explanation: "Debt obligations due after one year" },
    { name: "Mortgage Payable", correct: "Long-term Liability", explanation: "Real estate loans with terms > 1 year" },
    { name: "Bonds Payable", correct: "Long-term Liability", explanation: "Corporate bonds with maturity > 1 year" },
    { name: "Pension Obligations", correct: "Long-term Liability", explanation: "Employee retirement benefits payable over many years" },
    { name: "Common Stock", correct: "Equity", explanation: "Ownership shares issued to shareholders" },
    { name: "Retained Earnings", correct: "Equity", explanation: "Accumulated profits not distributed as dividends" },
    { name: "Additional Paid-in Capital", correct: "Equity", explanation: "Amount paid above par value for stock" },
    { name: "Treasury Stock", correct: "Equity", explanation: "Company's own shares repurchased (contra-equity)" }
  ];

  const categories = [
    "Current Asset",
    "Long-term Asset", 
    "Current Liability",
    "Long-term Liability",
    "Equity"
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0 && !gameCompleted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [gameStarted, timeLeft, gameCompleted]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentItem(0);
    setScore(0);
    setAnswers([]);
    setTimeLeft(300);
    setGameCompleted(false);
  };

  const selectAnswer = (category: string) => {
    const item = accountItems[currentItem];
    const isCorrect = category === item.correct;
    
    const newAnswer = {
      item: item.name,
      selected: category,
      correct: item.correct,
      isCorrect,
      explanation: item.explanation
    };

    setAnswers([...answers, newAnswer]);
    
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentItem + 1 < accountItems.length) {
      setCurrentItem(currentItem + 1);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameCompleted(true);
    setGameStarted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = () => {
    const percentage = (score / accountItems.length) * 100;
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  if (!gameStarted && !gameCompleted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financial Statement Classification Challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p>Test your speed and accuracy in classifying financial statement items!</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Goal:</strong> Classify 20 items correctly
              </div>
              <div>
                <strong>Time Limit:</strong> 5 minutes
              </div>
              <div>
                <strong>Target:</strong> 90% accuracy (18/20)
              </div>
              <div>
                <strong>Speed Goal:</strong> 15 seconds per item
              </div>
            </div>
            <Button onClick={startGame} className="px-8 py-3" data-testid="start-classification-game">
              Start Classification Challenge
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (gameCompleted) {
    const percentage = Math.round((score / accountItems.length) * 100);
    const avgTime = Math.round((300 - timeLeft) / accountItems.length);
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Game Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className={`text-3xl font-bold ${getScoreColor()}`}>
                {score}/{accountItems.length} ({percentage}%)
              </div>
              <div className="text-sm text-muted-foreground">
                Average time per item: {avgTime} seconds
              </div>
              <div className="text-sm">
                {percentage >= 90 ? "🎉 Excellent! ACF Exam Ready!" :
                 percentage >= 80 ? "👍 Good! Review missed items." :
                 "📚 More practice needed."}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {answers.map((answer, index) => (
                <div key={index} className={`p-3 rounded border ${answer.isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <strong>{answer.item}</strong>
                      <div className="text-sm">
                        Your answer: <Badge variant={answer.isCorrect ? "default" : "destructive"}>{answer.selected}</Badge>
                        {!answer.isCorrect && (
                          <span> | Correct: <Badge variant="outline">{answer.correct}</Badge></span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{answer.explanation}</div>
                    </div>
                    <div className="text-lg">
                      {answer.isCorrect ? "✅" : "❌"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button onClick={startGame} variant="outline" data-testid="play-again">
            Play Again
          </Button>
          <Button onClick={onComplete} className="px-8" data-testid="complete-classification">
            Complete Classification Module
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Classification Challenge</span>
          <div className="flex space-x-4 text-sm">
            <span>Score: {score}/{accountItems.length}</span>
            <span>Time: {formatTime(timeLeft)}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress value={(currentItem / accountItems.length) * 100} className="w-full" />
        
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">
            Question {currentItem + 1} of {accountItems.length}
          </div>
          <div className="text-2xl font-bold mb-6">
            {accountItems[currentItem]?.name}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => selectAnswer(category)}
              variant="outline"
              className="p-4 text-left justify-start hover:bg-blue-50 dark:hover:bg-blue-950/20"
              data-testid={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {category}
            </Button>
          ))}
        </div>

        <Alert>
          <AlertDescription>
            <strong>Tip:</strong> Current items are converted to cash or paid within one year. 
            Long-term items extend beyond one year.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}