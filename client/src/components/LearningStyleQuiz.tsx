import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Brain, BookOpen, Users, Eye, Headphones, PenTool, Calculator, Clock } from "lucide-react";

export interface LearningStyleResult {
  visual: number;
  auditory: number;
  kinesthetic: number;
  reading: number;
  social: number;
  solitary: number;
  logical: number;
  sequential: number;
  primary: string;
  secondary: string;
  description: string;
  studyTips: string[];
}

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "When learning new financial concepts, I prefer to:",
    options: [
      { text: "See charts, graphs, and visual diagrams", style: "visual", weight: 3 },
      { text: "Listen to explanations and discussions", style: "auditory", weight: 3 },
      { text: "Work through practice problems hands-on", style: "kinesthetic", weight: 3 },
      { text: "Read detailed explanations and text", style: "reading", weight: 3 }
    ]
  },
  {
    id: 2,
    question: "When studying for finance exams, I work best:",
    options: [
      { text: "In a study group with classmates", style: "social", weight: 3 },
      { text: "Alone in a quiet environment", style: "solitary", weight: 3 },
      { text: "With background music or sounds", style: "auditory", weight: 2 },
      { text: "In a visually organized space", style: "visual", weight: 2 }
    ]
  },
  {
    id: 3,
    question: "To understand complex financial formulas, I need to:",
    options: [
      { text: "See the logical steps broken down", style: "logical", weight: 3 },
      { text: "Practice calculating them repeatedly", style: "kinesthetic", weight: 3 },
      { text: "Hear explanations of why they work", style: "auditory", weight: 2 },
      { text: "Read the mathematical proof", style: "reading", weight: 2 }
    ]
  },
  {
    id: 4,
    question: "When learning about financial markets, I prefer:",
    options: [
      { text: "Real-time market data and charts", style: "visual", weight: 3 },
      { text: "News podcasts and market commentary", style: "auditory", weight: 3 },
      { text: "Trading simulations and practice", style: "kinesthetic", weight: 3 },
      { text: "Research reports and analysis", style: "reading", weight: 3 }
    ]
  },
  {
    id: 5,
    question: "I learn financial concepts best when they are presented:",
    options: [
      { text: "Step-by-step in order", style: "sequential", weight: 3 },
      { text: "As part of a big picture overview", style: "visual", weight: 2 },
      { text: "Through real-world examples", style: "kinesthetic", weight: 2 },
      { text: "In discussion format", style: "social", weight: 2 }
    ]
  },
  {
    id: 6,
    question: "When preparing for case studies, I prefer to:",
    options: [
      { text: "Create visual mind maps and flowcharts", style: "visual", weight: 3 },
      { text: "Discuss scenarios with peers", style: "social", weight: 3 },
      { text: "Write detailed analysis notes", style: "reading", weight: 3 },
      { text: "Work through calculations myself", style: "kinesthetic", weight: 3 }
    ]
  },
  {
    id: 7,
    question: "I remember financial information best when I:",
    options: [
      { text: "See it in colorful charts or infographics", style: "visual", weight: 3 },
      { text: "Hear it explained multiple times", style: "auditory", weight: 3 },
      { text: "Practice applying it immediately", style: "kinesthetic", weight: 3 },
      { text: "Take detailed written notes", style: "reading", weight: 3 }
    ]
  },
  {
    id: 8,
    question: "For exam preparation, my ideal study method is:",
    options: [
      { text: "Systematic review following a schedule", style: "sequential", weight: 3 },
      { text: "Solving problems until I understand", style: "logical", weight: 3 },
      { text: "Group study sessions", style: "social", weight: 2 },
      { text: "Self-paced independent study", style: "solitary", weight: 2 }
    ]
  }
];

const LEARNING_STYLES = {
  visual: {
    name: "Visual Learner",
    icon: Eye,
    color: "bg-blue-500",
    description: "You learn best through visual aids like charts, graphs, and diagrams. You prefer to see information presented in organized, colorful formats.",
    tips: [
      "Use color-coded charts and graphs for financial data",
      "Create visual mind maps for complex concepts",
      "Study with infographics and diagrams",
      "Use highlighters and visual organization tools"
    ]
  },
  auditory: {
    name: "Auditory Learner",
    icon: Headphones,
    color: "bg-green-500",
    description: "You learn best through hearing information. Discussions, lectures, and verbal explanations help you understand concepts.",
    tips: [
      "Listen to finance podcasts and lectures",
      "Participate in study group discussions",
      "Read material aloud to yourself",
      "Use audio recordings for review"
    ]
  },
  kinesthetic: {
    name: "Kinesthetic Learner",
    icon: PenTool,
    color: "bg-orange-500",
    description: "You learn best through hands-on experience and practice. You need to actively engage with material to understand it.",
    tips: [
      "Practice calculations and problem-solving",
      "Use interactive simulations and tools",
      "Take frequent breaks and move around",
      "Apply concepts through real examples"
    ]
  },
  reading: {
    name: "Reading/Writing Learner",
    icon: BookOpen,
    color: "bg-purple-500",
    description: "You learn best through written words. Reading texts and taking detailed notes helps you process information.",
    tips: [
      "Take comprehensive written notes",
      "Read textbooks and detailed explanations",
      "Write summaries of key concepts",
      "Use lists and written study guides"
    ]
  },
  social: {
    name: "Social Learner",
    icon: Users,
    color: "bg-pink-500",
    description: "You learn best in group settings. Collaboration and discussion with others enhance your understanding.",
    tips: [
      "Form or join study groups",
      "Explain concepts to others",
      "Participate in discussion forums",
      "Seek feedback from peers and mentors"
    ]
  },
  solitary: {
    name: "Solitary Learner",
    icon: Brain,
    color: "bg-indigo-500",
    description: "You learn best when studying alone. You prefer quiet, independent study environments without distractions.",
    tips: [
      "Create a dedicated quiet study space",
      "Set personal study goals and schedules",
      "Use self-paced learning materials",
      "Minimize social distractions during study"
    ]
  },
  logical: {
    name: "Logical Learner",
    icon: Calculator,
    color: "bg-teal-500",
    description: "You learn best through logical reasoning and systematic approaches. You prefer to understand the 'why' behind concepts.",
    tips: [
      "Focus on understanding underlying principles",
      "Use logical frameworks and models",
      "Break complex problems into steps",
      "Seek mathematical and logical explanations"
    ]
  },
  sequential: {
    name: "Sequential Learner",
    icon: Clock,
    color: "bg-red-500",
    description: "You learn best with structured, step-by-step approaches. You prefer organized, linear presentation of material.",
    tips: [
      "Follow structured study schedules",
      "Learn concepts in logical order",
      "Use checklists and progress tracking",
      "Review material systematically"
    ]
  }
};

interface LearningStyleQuizProps {
  onComplete: (result: LearningStyleResult) => void;
  onClose: () => void;
}

export default function LearningStyleQuiz({ onComplete, onClose }: LearningStyleQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<LearningStyleResult | null>(null);

  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = { ...answers, [currentQuestion]: optionIndex.toString() };
    setAnswers(newAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers: Record<number, string>) => {
    const scores: Record<string, number> = {
      visual: 0,
      auditory: 0,
      kinesthetic: 0,
      reading: 0,
      social: 0,
      solitary: 0,
      logical: 0,
      sequential: 0
    };

    // Calculate scores based on answers
    QUIZ_QUESTIONS.forEach((question, questionIndex) => {
      const answerIndex = parseInt(finalAnswers[questionIndex] || "0");
      const selectedOption = question.options[answerIndex];
      if (selectedOption) {
        scores[selectedOption.style] += selectedOption.weight;
      }
    });

    // Find primary and secondary learning styles
    const sortedStyles = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([style, score]) => ({ style, score }));

    const primary = sortedStyles[0].style;
    const secondary = sortedStyles[1].style;

    const primaryStyle = LEARNING_STYLES[primary as keyof typeof LEARNING_STYLES];
    const secondaryStyle = LEARNING_STYLES[secondary as keyof typeof LEARNING_STYLES];

    const result: LearningStyleResult = {
      visual: scores.visual,
      auditory: scores.auditory,
      kinesthetic: scores.kinesthetic,
      reading: scores.reading,
      social: scores.social,
      solitary: scores.solitary,
      logical: scores.logical,
      sequential: scores.sequential,
      primary,
      secondary,
      description: `Your primary learning style is ${primaryStyle.name.toLowerCase()}, with ${secondaryStyle.name.toLowerCase()} as your secondary style. ${primaryStyle.description}`,
      studyTips: [
        ...primaryStyle.tips.slice(0, 2),
        ...secondaryStyle.tips.slice(0, 2)
      ]
    };

    setResults(result);
    setShowResults(true);
  };

  const handleComplete = () => {
    if (results) {
      onComplete(results);
      onClose();
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (showResults && results) {
    const primaryStyle = LEARNING_STYLES[results.primary as keyof typeof LEARNING_STYLES];
    const secondaryStyle = LEARNING_STYLES[results.secondary as keyof typeof LEARNING_STYLES];
    const PrimaryIcon = primaryStyle.icon;
    const SecondaryIcon = secondaryStyle.icon;

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            Your Learning Style Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-4">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full ${primaryStyle.color} flex items-center justify-center mx-auto mb-2`}>
                  <PrimaryIcon className="w-8 h-8 text-white" />
                </div>
                <Badge variant="default" className="text-sm">Primary</Badge>
                <p className="font-semibold mt-1">{primaryStyle.name}</p>
              </div>
              <div className="text-2xl text-gray-400">+</div>
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full ${secondaryStyle.color} flex items-center justify-center mx-auto mb-2`}>
                  <SecondaryIcon className="w-6 h-6 text-white" />
                </div>
                <Badge variant="secondary" className="text-sm">Secondary</Badge>
                <p className="font-semibold mt-1">{secondaryStyle.name}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-center text-gray-700 dark:text-gray-300">{results.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Personalized Study Tips for You:</h3>
            <ul className="space-y-2">
              {results.studyTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Your Learning Preferences:</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Visual:</span>
                  <span className="font-medium">{results.visual}/24</span>
                </div>
                <div className="flex justify-between">
                  <span>Auditory:</span>
                  <span className="font-medium">{results.auditory}/24</span>
                </div>
                <div className="flex justify-between">
                  <span>Kinesthetic:</span>
                  <span className="font-medium">{results.kinesthetic}/24</span>
                </div>
                <div className="flex justify-between">
                  <span>Reading/Writing:</span>
                  <span className="font-medium">{results.reading}/24</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Study Environment:</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Social:</span>
                  <span className="font-medium">{results.social}/15</span>
                </div>
                <div className="flex justify-between">
                  <span>Solitary:</span>
                  <span className="font-medium">{results.solitary}/15</span>
                </div>
                <div className="flex justify-between">
                  <span>Logical:</span>
                  <span className="font-medium">{results.logical}/15</span>
                </div>
                <div className="flex justify-between">
                  <span>Sequential:</span>
                  <span className="font-medium">{results.sequential}/15</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleComplete} className="flex-1" data-testid="button-save-results">
              Save My Learning Style
            </Button>
            <Button variant="outline" onClick={onClose} data-testid="button-skip">
              Skip for Now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = QUIZ_QUESTIONS[currentQuestion];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Learning Style Assessment
          </span>
          <Badge variant="outline">{currentQuestion + 1}/{QUIZ_QUESTIONS.length}</Badge>
        </CardTitle>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
          <RadioGroup
            value={answers[currentQuestion] || ""}
            onValueChange={(value) => handleAnswer(parseInt(value))}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} data-testid={`radio-option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={goBack}
            disabled={currentQuestion === 0}
            data-testid="button-previous"
          >
            Previous
          </Button>
          <Button variant="outline" onClick={onClose} data-testid="button-close">
            Close Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}