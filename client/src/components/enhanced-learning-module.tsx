import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  BookOpen, 
  Clock, 
  Target, 
  Play, 
  ChevronDown, 
  ChevronRight,
  Calculator,
  Lightbulb,
  Video,
  CheckCircle,
  Star,
  TrendingUp,
  BarChart3,
  DollarSign,
  FileText,
  Award,
  Zap,
  ExternalLink
} from 'lucide-react';
import { LearningModule, acfMasterContent } from '@/data/acf-master-content';

interface EnhancedLearningModuleProps {
  moduleId: string;
  onStartPractice?: (moduleId: string) => void;
}

export function EnhancedLearningModule({ moduleId, onStartPractice }: EnhancedLearningModuleProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const module = acfMasterContent[moduleId];

  if (!module) {
    return <div>Module not found</div>;
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getModuleIcon = (moduleId: string) => {
    switch (moduleId) {
      case 'Time Value of Money': return Clock;
      case 'Portfolio Theory': return TrendingUp;
      case 'Bond Valuation': return BarChart3;
      case 'Financial Statements': return FileText;
      case 'Derivatives': return Award;
      default: return BookOpen;
    }
  };

  const ModuleIcon = getModuleIcon(moduleId);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <ModuleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">{module.title}</CardTitle>
                <CardDescription className="text-base">{module.description}</CardDescription>
                <div className="flex items-center space-x-4">
                  <Badge className={getDifficultyColor(module.difficulty)}>
                    {module.difficulty}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{module.duration} minutes</span>
                  </div>
                </div>
              </div>
            </div>
            <Button onClick={() => onStartPractice?.(moduleId)} data-testid="button-start-practice">
              <Play className="h-4 w-4 mr-2" />
              Start Practice
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Module Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="formulas">Formulas</TabsTrigger>
          <TabsTrigger value="excel">Excel Tips</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="reference">Quick Ref</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>Learning Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Module Completion</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">12</div>
                      <div className="text-xs text-muted-foreground">Formulas</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">8</div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">4</div>
                      <div className="text-xs text-muted-foreground">Remaining</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Practice Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Score</span>
                    <span className="text-2xl font-bold text-green-600">84%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Problems Solved</span>
                    <span className="text-lg font-semibold">23/30</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Time Spent</span>
                    <span className="text-lg font-semibold">2.5 hrs</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Concept Map Section */}
          {module.conceptMap && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <span>Concept Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-6 rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-800">
                  <div className="text-center space-y-2">
                    <BookOpen className="h-12 w-12 text-blue-600 mx-auto" />
                    <p className="font-medium">{module.conceptMap}</p>
                    <p className="text-sm text-muted-foreground">
                      Visual representation of key concepts and relationships
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Formulas Tab */}
        <TabsContent value="formulas" className="space-y-4">
          <div className="space-y-4">
            {module.keyFormulas.map((formula, index) => (
              <Card key={index}>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                            <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{formula.name}</CardTitle>
                            <CardDescription>{formula.description}</CardDescription>
                          </div>
                        </div>
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="font-semibold mb-2">Mathematical Formula</h4>
                          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded font-mono text-sm">
                            {formula.formula}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Excel Function</h4>
                          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded font-mono text-sm">
                            {formula.excelFunction}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Variables</h4>
                        <div className="grid gap-2 md:grid-cols-2">
                          {Object.entries(formula.variables).map(([variable, description]) => (
                            <div key={variable} className="flex space-x-2">
                              <Badge variant="outline" className="font-mono">{variable}</Badge>
                              <span className="text-sm">{description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Excel Tips Tab */}
        <TabsContent value="excel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                <span>Excel "Stealth Mode" Tips</span>
              </CardTitle>
              <CardDescription>
                Essential Excel shortcuts and techniques for the open-book exam
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {module.excelTips.map((tip, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-shrink-0">
                      <Badge variant="secondary" className="font-mono">{tip.shortcut}</Badge>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{tip.action}</div>
                      <div className="text-sm text-muted-foreground">{tip.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Examples Tab */}
        <TabsContent value="examples" className="space-y-4">
          {module.miniModels?.map((model, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-orange-600" />
                  <span>{model.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Scenario</h4>
                  <p className="text-sm">{model.scenario}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2">Excel Formula</h4>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded font-mono text-sm">
                      {model.excelFormula}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Result</h4>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded font-semibold text-lg">
                      {model.result}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Explanation</h4>
                  <p className="text-sm text-muted-foreground">{model.explanation}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Practice Problems Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span>Practice Problems Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {module.practiceProblems.slice(0, 2).map((problem, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium">{problem.question}</h4>
                      <Badge variant="outline">
                        {problem.timeEstimate}s
                      </Badge>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      {problem.options.map((option, optIndex) => (
                        <div key={optIndex} className="p-2 bg-muted/30 rounded text-sm">
                          {String.fromCharCode(65 + optIndex)}. {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <Button 
                  onClick={() => onStartPractice?.(moduleId)} 
                  className="w-full"
                  data-testid="button-more-practice"
                >
                  Practice All {module.practiceProblems.length} Problems
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-4">
          <div className="space-y-4">
            {module.videoResources.map((video, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
                      <Video className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold">{video.title}</h3>
                        <Badge variant="outline">{video.duration}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{video.description}</p>
                      <Button variant="outline" size="sm" asChild>
                        <a href={video.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Watch Video
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Quick Reference Tab */}
        <TabsContent value="reference" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <span>Quick Reference Guide</span>
              </CardTitle>
              <CardDescription>
                Key concepts and rules for quick review during exams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {module.quickReference.map((ref, index) => (
                  <div key={index} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="p-1 rounded bg-green-100 dark:bg-green-900">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{ref.concept}</h4>
                        <p className="text-sm text-muted-foreground mb-1">{ref.rule}</p>
                        {ref.example && (
                          <div className="text-xs bg-blue-50 dark:bg-blue-950/20 p-2 rounded mt-2">
                            <strong>Example:</strong> {ref.example}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}