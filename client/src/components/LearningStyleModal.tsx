import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LearningStyleQuiz, { type LearningStyleResult } from "./LearningStyleQuiz";
import LearningStyleBadge from "./LearningStyleBadge";
import { useLearningStyle } from "@/hooks/useLearningStyle";
import { Brain, Lightbulb, TrendingUp, Star } from "lucide-react";

interface LearningStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: "onboarding" | "settings" | "retake";
}

export default function LearningStyleModal({ isOpen, onClose, trigger = "onboarding" }: LearningStyleModalProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const { learningStyle, setLearningStyle, hasCompletedQuiz, clearLearningStyle } = useLearningStyle();

  useEffect(() => {
    if (isOpen && trigger === "onboarding" && !hasCompletedQuiz) {
      setShowQuiz(true);
    } else if (isOpen && trigger === "retake") {
      setShowQuiz(true);
    }
  }, [isOpen, trigger, hasCompletedQuiz]);

  const handleQuizComplete = (result: LearningStyleResult) => {
    setLearningStyle(result);
    setShowQuiz(false);
  };

  const handleRetakeQuiz = () => {
    clearLearningStyle();
    setShowQuiz(true);
  };

  if (showQuiz) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <LearningStyleQuiz onComplete={handleQuizComplete} onClose={onClose} />
        </DialogContent>
      </Dialog>
    );
  }

  if (!hasCompletedQuiz && trigger === "onboarding") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              Discover Your Learning Style
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Welcome to ACF Mastery!</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Let's personalize your learning experience. Take our quick 2-minute assessment to discover your unique learning style and get customized study recommendations.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="text-center p-4">
                <CardContent className="pt-4">
                  <Lightbulb className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Personalized Tips</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    Get study strategies tailored to how you learn best
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center p-4">
                <CardContent className="pt-4">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Better Results</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    Study more efficiently with methods that work for you
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center p-4">
                <CardContent className="pt-4">
                  <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Smart Platform</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    Content adapts to your preferred learning style
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => setShowQuiz(true)} 
                className="flex-1"
                data-testid="button-start-assessment"
              >
                Start Assessment (2 min)
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                data-testid="button-skip-assessment"
              >
                Skip for Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show existing learning style results
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            Your Learning Style
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-4">
              <div className="text-center">
                <LearningStyleBadge style={learningStyle?.primary || ''} size="lg" />
                <Badge variant="default" className="text-xs mt-2">Primary</Badge>
              </div>
              <div className="text-2xl text-gray-400">+</div>
              <div className="text-center">
                <LearningStyleBadge style={learningStyle?.secondary || ''} size="md" />
                <Badge variant="secondary" className="text-xs mt-2">Secondary</Badge>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-center text-gray-700 dark:text-gray-300">
              {learningStyle?.description}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Your Personalized Study Tips:</h3>
            <ul className="space-y-2">
              {learningStyle?.studyTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleRetakeQuiz} 
              variant="outline" 
              className="flex-1"
              data-testid="button-retake-quiz"
            >
              Retake Assessment
            </Button>
            <Button 
              onClick={onClose} 
              className="flex-1"
              data-testid="button-close-modal"
            >
              Continue Learning
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}