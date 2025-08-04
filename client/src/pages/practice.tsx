import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Target,
  HelpCircle,
  RotateCcw
} from "lucide-react";
import type { Problem } from "@shared/schema";

interface PracticePageProps {
  moduleId?: string;
  topic?: string;
}

export default function Practice({ moduleId, topic }: PracticePageProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [userAnswers, setUserAnswers] = useState<Record<number, { answer: string; isCorrect: boolean }>>({});

  // Fetch problems for practice
  const { data: problems = [] } = useQuery<Problem[]>({
    queryKey: ["/api/problems", { topic }],
    enabled: !!user,
  });

  const currentProblem = problems[currentProblemIndex];
  const isLastProblem = currentProblemIndex === problems.length - 1;
  const isFirstProblem = currentProblemIndex === 0;

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: async (data: { problemId: string; answer: string; timeSpent: number }) => {
      return apiRequest(`/api/attempts`, "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
    },
  });

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentProblem) return;

    const isCorrect = selectedAnswer === currentProblem.answer;
    const timeSpent = Date.now() - sessionStartTime;

    // Store user's answer
    setUserAnswers(prev => ({
      ...prev,
      [currentProblemIndex]: { answer: selectedAnswer, isCorrect }
    }));

    // Submit to backend
    submitAnswerMutation.mutate({
      problemId: currentProblem.id,
      answer: selectedAnswer,
      timeSpent,
    });

    setShowExplanation(true);
  };

  const handleNextProblem = () => {
    if (isLastProblem) {
      // Show results summary
      showSessionResults();
    } else {
      setCurrentProblemIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handlePreviousProblem = () => {
    if (!isFirstProblem) {
      setCurrentProblemIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const showSessionResults = () => {
    // Calculate session statistics
    const totalAnswered = Object.keys(userAnswers).length;
    const correctAnswers = Object.values(userAnswers).filter(a => a.isCorrect).length;
    const accuracy = totalAnswered > 0 ? (correctAnswers / totalAnswered) * 100 : 0;

    console.log(`Session Complete: ${correctAnswers}/${totalAnswered} (${accuracy.toFixed(1)}%)`);
    // This would typically navigate to a results page or show a modal
  };

  if (!currentProblem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Problems Available</h3>
            <p className="text-gray-600 mb-4">
              No practice problems found for this topic.
            </p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentProblemIndex + 1) / problems.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.history.back()}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{topic} Practice</h1>
              <p className="text-sm text-gray-600">
                Question {currentProblemIndex + 1} of {problems.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-32">
              <Progress value={progress} className="h-2" />
            </div>
            <Badge variant="outline">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{currentProblem.difficulty}</Badge>
                <Badge variant="outline">{currentProblem.topic}</Badge>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>~2 min</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Problem Statement */}
            <div>
              <h3 className="text-lg font-medium mb-3">Problem</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{currentProblem.question}</p>
              </div>
            </div>

            {/* Answer Options */}
            {!showExplanation ? (
              <div>
                <h4 className="font-medium mb-3">Choose your answer:</h4>
                <div className="space-y-3">
                  {/* Since our schema has a simple answer field, we'll create mock options */}
                  {["A", "B", "C", "D"].map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                        selectedAnswer === option
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      data-testid={`option-${index}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === option
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}>
                          {selectedAnswer === option && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="flex-1">Option {option}</span>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer || submitAnswerMutation.isPending}
                    data-testid="button-submit-answer"
                  >
                    {submitAnswerMutation.isPending ? "Submitting..." : "Submit Answer"}
                  </Button>
                </div>
              </div>
            ) : (
              /* Explanation & Results */
              <div className="space-y-4">
                {/* Answer Result */}
                <div className={`p-4 rounded-lg ${
                  userAnswers[currentProblemIndex]?.isCorrect 
                    ? "bg-green-50 border border-green-200" 
                    : "bg-red-50 border border-red-200"
                }`}>
                  <div className="flex items-center space-x-2">
                    {userAnswers[currentProblemIndex]?.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="font-medium">
                      {userAnswers[currentProblemIndex]?.isCorrect ? "Correct!" : "Incorrect"}
                    </span>
                  </div>
                  {!userAnswers[currentProblemIndex]?.isCorrect && (
                    <p className="mt-2 text-sm">
                      The correct answer is: <strong>{currentProblem.answer}</strong>
                    </p>
                  )}
                </div>

                {/* Explanation */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Explanation
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{currentProblem.solution}</p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-4">
                  <Button
                    variant="outline"
                    onClick={handlePreviousProblem}
                    disabled={isFirstProblem}
                    data-testid="button-previous"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <Button
                    onClick={handleNextProblem}
                    data-testid="button-next"
                  >
                    {isLastProblem ? "Finish Session" : "Next Problem"}
                    {!isLastProblem && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}