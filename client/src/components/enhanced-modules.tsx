import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Clock, 
  Target, 
  Calculator, 
  BarChart3, 
  DollarSign, 
  PieChart,
  GraduationCap,
  Award,
  CheckCircle2,
  PlayCircle,
  TrendingUp,
  Lightbulb,
  Star
} from "lucide-react";

interface EnhancedModule {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  problemCount: number;
  estimatedTime: number;
  prerequisites: string[];
  learningObjectives: string[];
  keyFormulas: number;
  applications: number;
  userProgress?: {
    completed: number;
    accuracy: number;
    completionRate: number;
    estimatedTimeRemaining: number;
  };
}

// Module category icons mapping
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Foundation': return Calculator;
    case 'Risk Management': return BarChart3;
    case 'Fixed Income': return DollarSign;
    case 'Financial Analysis': return PieChart;
    case 'Advanced Instruments': return TrendingUp;
    default: return BookOpen;
  }
};

// Difficulty level styling
const getDifficultyColor = (difficulty: number) => {
  switch (difficulty) {
    case 1: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 2: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 3: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getDifficultyLabel = (difficulty: number) => {
  switch (difficulty) {
    case 1: return 'Beginner';
    case 2: return 'Intermediate';
    case 3: return 'Advanced';
    default: return 'Unknown';
  }
};

export function EnhancedModulesView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: modulesData, isLoading } = useQuery<{success: boolean, modules: EnhancedModule[]}>({
    queryKey: ['/api/modules'],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-muted-foreground">Loading enhanced modules...</p>
        </div>
      </div>
    );
  }

  if (!modulesData?.success || !modulesData.modules) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No modules available</p>
      </div>
    );
  }

  const modules = modulesData.modules;
  const categories = ['all', ...Array.from(new Set(modules.map(m => m.category)))];
  const filteredModules = selectedCategory === 'all' 
    ? modules 
    : modules.filter(m => m.category === selectedCategory);

  // Calculate overall statistics
  const totalProblems = modules.reduce((sum, m) => sum + m.problemCount, 0);
  const totalCompleted = modules.reduce((sum, m) => sum + (m.userProgress?.completed || 0), 0);
  const avgAccuracy = modules.filter(m => m.userProgress?.accuracy)
    .reduce((sum, m, _, arr) => sum + (m.userProgress?.accuracy || 0) / arr.length, 0);

  return (
    <div className="space-y-6" data-testid="enhanced-modules-view">
      {/* Header Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Problems</p>
                <p className="text-2xl font-bold">{totalProblems}+</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">{totalCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Avg Accuracy</p>
                <p className="text-2xl font-bold">{avgAccuracy > 0 ? Math.round(avgAccuracy) : 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Modules</p>
                <p className="text-2xl font-bold">{modules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category === 'all' ? 'All' : category.replace(/([A-Z])/g, ' $1').trim()}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Enhanced Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredModules.map((module) => {
          const IconComponent = getCategoryIcon(module.category);
          const progress = module.userProgress;
          const completionPercentage = progress 
            ? Math.round((progress.completed / module.problemCount) * 100)
            : 0;
          
          return (
            <Card key={module.id} className="hover:shadow-lg transition-shadow duration-200" data-testid={`module-card-${module.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {module.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getDifficultyColor(module.difficulty)}>
                    {getDifficultyLabel(module.difficulty)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                {progress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{completionPercentage}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>
                )}
                
                {/* Module Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{module.problemCount} Problems</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{module.estimatedTime}min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{module.keyFormulas} Formulas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{module.applications} Applications</span>
                  </div>
                </div>

                {/* Learning Objectives Preview */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center space-x-1">
                    <Target className="h-4 w-4" />
                    <span>Key Learning Objectives</span>
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {module.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle2 className="h-3 w-3 mt-1 text-green-600" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prerequisites */}
                {module.prerequisites.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Prerequisites</h4>
                    <div className="flex flex-wrap gap-1">
                      {module.prerequisites.map((prereq, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* User Progress Details */}
                {progress && (
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-green-600">{progress.accuracy}%</p>
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-blue-600">{progress.estimatedTimeRemaining}min</p>
                      <p className="text-xs text-muted-foreground">Remaining</p>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button 
                  className="w-full" 
                  variant={progress?.completed ? "secondary" : "default"}
                  data-testid={`start-module-${module.id}`}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  {progress?.completed ? 'Continue Practice' : 'Start Learning'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Deployment Package Attribution */}
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Award className="h-5 w-5 text-amber-600" />
            <span className="font-medium">Enhanced Problem Database</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Featuring 115+ comprehensive ACF practice problems with adaptive difficulty progression, 
            real-world applications, and detailed solution explanations. Optimized for Kellogg MBA placement exam preparation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}