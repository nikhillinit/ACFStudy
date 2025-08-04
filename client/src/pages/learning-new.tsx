import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedLearningModule } from '@/components/enhanced-learning-module';
import { useAuth } from '@/hooks/useAuth';
import { acfMasterContent } from '@/data/acf-master-content';
import { 
  BookOpen, 
  Clock, 
  TrendingUp,
  BarChart3,
  FileText,
  Award,
  Video,
  Users,
  Target
} from 'lucide-react';

export default function LearningNew() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId);
  };

  const handleStartPractice = (moduleId: string) => {
    // Navigate to practice page with specific module
    window.location.href = `/practice?module=${moduleId}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">
              Please log in to access the learning materials and track your progress.
            </p>
            <Button asChild>
              <a href="/api/login">Log In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Learning Center</h1>
        <p className="text-muted-foreground">
          Master Advanced Corporate Finance with ACF Master Playbook content, MIT lectures, and interactive modules
        </p>
      </div>

      {/* Main Navigation */}
      <Tabs defaultValue="acf-modules" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="acf-modules">ACF Master Modules</TabsTrigger>
          <TabsTrigger value="mit-lectures">MIT Video Lectures</TabsTrigger>
          <TabsTrigger value="interactive">Interactive Content</TabsTrigger>
        </TabsList>

        {/* ACF Master Modules Tab */}
        <TabsContent value="acf-modules" className="space-y-6">
          {selectedModule ? (
            <div className="space-y-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedModule(null)}
                className="mb-4"
                data-testid="back-to-modules"
              >
                ← Back to Module Overview
              </Button>
              <EnhancedLearningModule 
                moduleId={selectedModule} 
                onStartPractice={handleStartPractice}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    <span>ACF Master Playbook Modules</span>
                  </CardTitle>
                  <CardDescription>
                    Comprehensive learning modules based on the Accelerated Corporate Finance Master Playbook. 
                    Each module includes formulas, Excel tips, mini-models, and practice problems.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(acfMasterContent).map(([moduleId, module]) => {
                      const getModuleIcon = (id: string) => {
                        switch (id) {
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
                        <Card 
                          key={moduleId} 
                          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                          onClick={() => handleModuleSelect(moduleId)}
                          data-testid={`module-card-${moduleId.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <CardHeader>
                            <div className="flex items-start space-x-3">
                              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                                <ModuleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-lg">{module.title}</CardTitle>
                                <CardDescription className="text-sm mt-1">
                                  {module.description.substring(0, 80)}...
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{module.duration} min</span>
                              </span>
                              <Badge 
                                className={
                                  module.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                  module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                }
                              >
                                {module.difficulty}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              • {module.keyFormulas.length} Key Formulas
                              <br />
                              • {module.practiceProblems.length} Practice Problems
                              <br />
                              • {module.excelTips.length} Excel Tips
                            </div>
                            <Button 
                              className="w-full" 
                              size="sm"
                              data-testid={`start-learning-${moduleId.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              Start Learning
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* MIT Lectures Tab */}
        <TabsContent value="mit-lectures" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Video className="h-6 w-6 text-red-600" />
                <span>MIT Finance Theory Video Library</span>
              </CardTitle>
              <CardDescription>
                MIT 15.401 Finance Theory video lectures covering advanced corporate finance topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Video className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">MIT Video Library</h3>
                <p className="text-muted-foreground mb-6">
                  Access to MIT's comprehensive finance theory video lectures
                </p>
                <Button asChild>
                  <a href="/learning">View MIT Lectures</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interactive Content Tab */}
        <TabsContent value="interactive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-green-600" />
                <span>Interactive Learning Tools</span>
              </CardTitle>
              <CardDescription>
                Hands-on calculators, simulations, and interactive exercises
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Financial Calculators</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      NPV, IRR, bond pricing, and portfolio optimization tools
                    </p>
                    <Button variant="outline" className="w-full">
                      Launch Calculators
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Case Study Simulations</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Real-world scenarios and decision-making exercises
                    </p>
                    <Button variant="outline" className="w-full">
                      Start Simulations
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}