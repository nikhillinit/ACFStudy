import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { User, Module, Problem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  LogOut,
  User as UserIcon,
  BarChart3,
  Target,
  Calculator,
  PieChart,
  Building,
  FileText,
  PlayCircle
} from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  // Type guard for user data
  const typedUser = user as User | undefined;

  // Fetch learning data
  const { data: modules = [] } = useQuery<Module[]>({
    queryKey: ["/api/modules"],
    enabled: !!user,
  });

  const { data: problems = [] } = useQuery<Problem[]>({
    queryKey: ["/api/problems"],
    enabled: !!user,
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ["/api/progress", typedUser?.id],
    enabled: !!typedUser?.id,
  });

  // Calculate learning statistics
  const learningStats = {
    totalProblems: problems.length,
    completedProblems: userProgress.reduce((sum: number, progress: any) => sum + (progress.score || 0), 0),
    totalModules: modules.length,
    completedModules: userProgress.filter((p: any) => p.completed).length,
    averageScore: userProgress.length > 0 ? 
      userProgress.reduce((sum: any, progress: any) => sum + (progress.score || 0), 0) / userProgress.length : 0
  };

  const overallProgress = learningStats.totalProblems > 0 ? 
    (learningStats.completedProblems / learningStats.totalProblems) * 100 : 0;

  // Topic icons mapping
  const topicIcons: Record<string, React.ComponentType<any>> = {
    "Time Value of Money": Calculator,
    "Portfolio Theory": PieChart,
    "Bond Valuation": Building,
    "Financial Statements": FileText,
    "Derivatives": TrendingUp
  };

  const startPractice = (moduleTitle: string) => {
    // Navigate to practice page with the module topic
    const encodedTopic = encodeURIComponent(moduleTitle);
    window.location.href = `/practice/${encodedTopic}`;
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !typedUser) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [typedUser, isLoading, toast]);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!typedUser) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ACF Mastery Platform</h1>
                <p className="text-sm text-gray-500">Welcome back, {typedUser.firstName || typedUser.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {typedUser.profileImageUrl ? (
                  <img 
                    src={typedUser.profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-gray-600" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">
                  {typedUser.firstName || typedUser.email}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your Learning Dashboard
          </h2>
          <p className="text-gray-600">
            Track your progress and continue your Advanced Corporate Finance journey.
          </p>
        </div>

        {/* Learning Statistics Overview */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Your ACF Mastery Journey</h3>
            <Target className="h-6 w-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{Math.round(overallProgress)}%</div>
              <div className="text-sm opacity-90">Overall Mastery</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{learningStats.completedProblems}</div>
              <div className="text-sm opacity-90">Problems Solved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{learningStats.completedModules}</div>
              <div className="text-sm opacity-90">Modules Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">1</div>
              <div className="text-sm opacity-90">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Learning Platform Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
            <TabsTrigger value="diagnostic">Diagnostic</TabsTrigger>
            <TabsTrigger value="drills">Morning Drills</TabsTrigger>
            <TabsTrigger value="formulas">Formulas</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Module Progress Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => {
                const IconComponent = topicIcons[module.title] || BookOpen;
                const moduleProblems = problems.filter(p => p.topic === module.title);
                const completedCount = userProgress.filter((p: any) => p.moduleId === module.id && p.completed).length;
                const progressPercent = moduleProblems.length > 0 ? (completedCount / moduleProblems.length) * 100 : 0;
                
                return (
                  <Card key={module.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <CardDescription className="text-sm">{module.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            {completedCount}/{moduleProblems.length} problems
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant="secondary">{module.category}</Badge>
                            <Badge variant={module.difficulty === 1 ? "default" : module.difficulty === 2 ? "secondary" : "destructive"}>
                              {module.difficulty === 1 ? "Beginner" : module.difficulty === 2 ? "Intermediate" : "Advanced"}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          onClick={() => startPractice(module.title)} 
                          className="w-full"
                          data-testid={`button-start-${module.id}`}
                        >
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Start Practice
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Practice Tab */}
          <TabsContent value="practice" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Practice Mode</span>
                </CardTitle>
                <CardDescription>
                  Choose a topic to practice. Problems are selected based on your performance and areas that need improvement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modules.map((module) => {
                    const IconComponent = topicIcons[module.title] || BookOpen;
                    return (
                      <Button
                        key={module.id}
                        variant="outline"
                        className="h-auto p-4 justify-start"
                        onClick={() => startPractice(module.title)}
                        data-testid={`button-practice-${module.id}`}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-6 w-6" />
                          <div className="text-left">
                            <div className="font-medium">{module.title}</div>
                            <div className="text-sm text-gray-500">{module.problemCount} Problems</div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Diagnostic Tab */}
          <TabsContent value="diagnostic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Diagnostic Assessment</span>
                </CardTitle>
                <CardDescription>
                  Take this 25-question diagnostic test to identify your strengths and areas for improvement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium mb-2">Test Format:</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• 25 questions (5 from each topic)</li>
                    <li>• 30 minutes total (recommended)</li>
                    <li>• Results automatically saved</li>
                    <li>• Immediate feedback and study recommendations</li>
                  </ul>
                </div>
                <Button className="w-full" data-testid="button-start-diagnostic">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Start Diagnostic Test
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Morning Drills Tab */}
          <TabsContent value="drills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>🌅 Morning Drills</span>
                </CardTitle>
                <CardDescription>
                  Daily practice sessions to keep your skills sharp.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    Complete your first practice session to unlock daily drills!
                  </p>
                  <Button variant="outline" disabled>
                    <Clock className="h-4 w-4 mr-2" />
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Formulas Tab */}
          <TabsContent value="formulas" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>📖 Formula Reference</CardTitle>
                  <CardDescription>Quick reference for key ACF formulas and concepts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Time Value of Money</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Present Value:</strong> PV = FV / (1+r)^n</div>
                      <div><strong>Future Value:</strong> FV = PV × (1+r)^n</div>
                      <div><strong>Annuity PV:</strong> PV = PMT × [1 - (1+r)^-n] / r</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Portfolio Theory</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>CAPM:</strong> E(R) = Rf + β(Rm - Rf)</div>
                      <div><strong>Portfolio Variance:</strong> σp² = w1²σ1² + w2²σ2² + 2w1w2ρ12σ1σ2</div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Bond Valuation</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Bond Price:</strong> P = Σ[C/(1+y)^t] + F/(1+y)^n</div>
                      <div><strong>Current Yield:</strong> Annual Coupon / Current Price</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
