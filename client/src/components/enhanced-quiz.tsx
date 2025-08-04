import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, RotateCcw, Brain, Clock } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correct: string;
  explanation: string;
  difficulty?: number;
  topic?: string;
}

interface QuizProps {
  title: string;
  description: string;
  questions: QuizQuestion[];
  onComplete?: (score: number, results: any) => void;
  timeLimit?: number; // in minutes
}

export function EnhancedQuiz({ title, description, questions, onComplete, timeLimit }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit ? timeLimit * 60 : null);
  const [startTime] = useState(Date.now());

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const completeQuiz = () => {
    const score = calculateScore();
    const endTime = Date.now();
    const timeSpent = Math.round((endTime - startTime) / 1000); // in seconds
    
    const results = {
      score,
      timeSpent,
      totalQuestions: questions.length,
      correctAnswers: questions.filter(q => answers[q.id] === q.correct).length,
      answers,
      detailedResults: questions.map(question => ({
        questionId: question.id,
        question: question.question,
        userAnswer: answers[question.id],
        correctAnswer: question.correct,
        isCorrect: answers[question.id] === question.correct,
        explanation: question.explanation,
        topic: question.topic,
        difficulty: question.difficulty
      }))
    };

    setShowResults(true);
    if (onComplete) {
      onComplete(score, results);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const getPerformanceFeedback = (score: number) => {
    if (score >= 90) return { message: "Excellent! You've mastered this topic.", color: "text-green-600", icon: <CheckCircle className="w-5 h-5" /> };
    if (score >= 80) return { message: "Great work! You have a strong understanding.", color: "text-blue-600", icon: <CheckCircle className="w-5 h-5" /> };
    if (score >= 70) return { message: "Good job! Review the explanations to improve.", color: "text-yellow-600", icon: <Brain className="w-5 h-5" /> };
    return { message: "Keep studying! Focus on the topics you missed.", color: "text-red-600", icon: <XCircle className="w-5 h-5" /> };
  };

  const currentQ = questions[currentQuestion];
  const isAnswered = answers[currentQ?.id];
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    const score = calculateScore();
    const feedback = getPerformanceFeedback(score);
    const correctCount = questions.filter(q => answers[q.id] === q.correct).length;

    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2 text-xl">
              {feedback.icon}
              <span>Quiz Results</span>
            </CardTitle>
            <div className="space-y-2">
              <div className="text-3xl font-bold">{score}%</div>
              <CardDescription className={feedback.color}>
                {feedback.message}
              </CardDescription>
              <div className="text-sm text-muted-foreground">
                {correctCount} out of {questions.length} questions correct
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Review</CardTitle>
            <CardDescription>Review your answers and learn from explanations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correct;
                const userOption = question.options.find(opt => opt.id === userAnswer);
                const correctOption = question.options.find(opt => opt.id === question.correct);

                return (
                  <div key={question.id} className={`p-4 border rounded-lg ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex items-start space-x-3 mb-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium mb-2">
                          Question {index + 1}: {question.question}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                            Your answer: {userOption?.text || 'Not answered'}
                          </div>
                          {!isCorrect && (
                            <div className="text-green-700">
                              Correct answer: {correctOption?.text}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                      <div className="text-sm font-medium text-blue-900 mb-1">Explanation:</div>
                      <div className="text-sm text-blue-800">{question.explanation}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center mt-6">
              <Button onClick={resetQuiz} variant="outline" className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span>{title}</span>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          {timeRemaining && (
            <div className="flex items-center space-x-2 text-sm text-orange-600">
              <Clock className="w-4 h-4" />
              <span>Time remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
              
              <RadioGroup 
                value={answers[currentQ.id] || ''} 
                onValueChange={(value) => handleAnswerSelect(currentQ.id, value)}
                className="space-y-3"
              >
                {currentQ.options.map((option) => (
                  <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value={option.id} id={option.id} className="mt-0.5" />
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer leading-relaxed">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                onClick={handlePrevious} 
                disabled={currentQuestion === 0}
                variant="outline"
                data-testid="button-quiz-previous"
              >
                Previous
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={!isAnswered}
                data-testid="button-quiz-next"
              >
                {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EnhancedQuiz;