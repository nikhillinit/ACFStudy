import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
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
  PlayCircle,
  Bot,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { AITutor } from "@/components/ai-tutor";
import { LearningPathDashboard } from "@/components/learning-path";
import { EnhancedModulesView } from "@/components/enhanced-modules";
import { EnhancedProgressTracker } from "@/components/enhanced-progress-tracker";
import { AIStudyCompanion } from "@/components/ai-study-companion";
import { useStudyCompanion } from "@/hooks/useStudyCompanion";

export default function Home() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [showAITutor, setShowAITutor] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");

  // Initialize study companion
  const { companionData } = useStudyCompanion({
    userId: user?.id,
    currentContext: {
      page: 'home'
    }
  });

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

  const { data: userProgress = [] } = useQuery<any[]>({
    queryKey: ["/api/progress", typedUser?.id],
    enabled: !!typedUser?.id,
  });

  const { data: dashboardData } = useQuery<{dashboard: any}>({
    queryKey: ["/api/analytics/dashboard"],
    enabled: !!typedUser?.id,
  });

  // Use enhanced analytics data if available, fallback to calculated stats
  const dashboardStats = dashboardData?.dashboard;
  const learningStats = dashboardStats ? {
    totalProblems: dashboardStats.totalProblems,
    completedProblems: dashboardStats.totalCompleted,
    totalModules: modules.length,
    completedModules: Object.values(dashboardStats.topicStats || {}).filter((topic: any) => topic.percentage > 0).length,
    averageScore: dashboardStats.overallAccuracy
  } : {
    totalProblems: problems.length,
    completedProblems: Array.isArray(userProgress) ? userProgress.reduce((sum: number, progress: any) => sum + (progress.score || 0), 0) : 0,
    totalModules: modules.length,
    completedModules: Array.isArray(userProgress) ? userProgress.filter((p: any) => p.completed).length : 0,
    averageScore: Array.isArray(userProgress) && userProgress.length > 0 ? 
      userProgress.reduce((sum: any, progress: any) => sum + (progress.score || 0), 0) / userProgress.length : 0
  };

  const overallProgress = dashboardStats?.overallProgress || (learningStats.totalProblems > 0 ? 
    (learningStats.completedProblems / learningStats.totalProblems) * 100 : 0);

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
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white h-4 w-4 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">ACF Mastery</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Welcome back, {typedUser.firstName || typedUser.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                {typedUser.profileImageUrl ? (
                  <img 
                    src={typedUser.profileImageUrl} 
                    alt="Profile" 
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                  </div>
                )}
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  {typedUser.firstName || typedUser.email}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-3"
                data-testid="button-logout"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-4 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your Learning Dashboard
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Track your progress and continue your Advanced Corporate Finance journey.
          </p>
        </div>

        {/* Learning Statistics Overview */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-3 sm:p-6 mb-4 sm:mb-8 text-white">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl font-bold">Your ACF Mastery Journey</h3>
            <Target className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{Math.round(overallProgress)}%</div>
              <div className="text-xs sm:text-sm opacity-90">Overall</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{learningStats.completedProblems}</div>
              <div className="text-xs sm:text-sm opacity-90">Problems</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{learningStats.completedModules}</div>
              <div className="text-xs sm:text-sm opacity-90">Modules</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold">1</div>
              <div className="text-xs sm:text-sm opacity-90">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            <Link href="/practice">
              <Button className="w-full flex items-center justify-center space-x-2 py-3 sm:py-4" data-testid="button-practice-center">
                <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">Practice Center</span>
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </Link>
            <Link href="/learning">
              <Button variant="outline" className="w-full flex items-center justify-center space-x-2 py-3 sm:py-4" data-testid="button-learning-modules">
                <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">Video Lectures</span>
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </Link>
            <Button variant="outline" className="w-full flex items-center justify-center space-x-2 py-3 sm:py-4" data-testid="button-ai-tutor" onClick={() => setShowAITutor(true)}>
              <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">AI Tutor</span>
            </Button>
            <Button variant="outline" className="w-full flex items-center justify-center space-x-2 py-3 sm:py-4" data-testid="button-quick-diagnostic">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">Diagnostic</span>
            </Button>
          </div>
        </div>

        {/* Learning Platform Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-1">
            <TabsTrigger value="dashboard" className="text-xs sm:text-sm">Dashboard</TabsTrigger>
            <TabsTrigger value="modules" className="text-xs sm:text-sm">Modules</TabsTrigger>
            <TabsTrigger value="learning-path" className="text-xs sm:text-sm">Learning Path</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
            <TabsTrigger value="achievements" className="text-xs sm:text-sm">Achievements</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Module Progress Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {modules.map((module) => {
                const IconComponent = topicIcons[module.title] || BookOpen;
                const moduleProblems = problems.filter(p => p.topic === module.title);
                const completedCount = userProgress.filter((p: any) => p.moduleId === module.id && p.completed).length;
                const progressPercent = moduleProblems.length > 0 ? (completedCount / moduleProblems.length) * 100 : 0;
                
                return (
                  <Card key={module.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg shrink-0">
                          <IconComponent className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm sm:text-lg leading-tight">{module.title}</CardTitle>
                          <CardDescription className="text-xs sm:text-sm line-clamp-2">{module.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span>Progress</span>
                          <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <Progress value={progressPercent} className="h-1.5 sm:h-2" />
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                          <div className="text-xs sm:text-sm text-gray-600">
                            {completedCount}/{moduleProblems.length} problems
                          </div>
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            <Badge variant="secondary" className="text-xs">{module.category}</Badge>
                            <Badge variant={module.difficulty === 1 ? "default" : module.difficulty === 2 ? "secondary" : "destructive"} className="text-xs">
                              {module.difficulty === 1 ? "Beginner" : module.difficulty === 2 ? "Intermediate" : "Advanced"}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          onClick={() => startPractice(module.title)} 
                          className="w-full text-xs sm:text-sm py-2 sm:py-3"
                          data-testid={`button-start-${module.id}`}
                        >
                          <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Start Practice
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Enhanced Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            <EnhancedModulesView />
          </TabsContent>

          {/* Learning Path Tab */}
          <TabsContent value="learning-path" className="space-y-6">
            <LearningPathDashboard />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <EnhancedProgressTracker
              completedProblems={learningStats.completedProblems}
              totalProblems={learningStats.totalProblems}
              moduleProgress={modules.map(module => ({
                moduleId: module.id,
                moduleName: module.title,
                completed: userProgress.filter((p: any) => p.moduleId === module.id && p.completed).length,
                total: problems.filter(p => p.topic === module.title).length,
                accuracy: dashboardStats?.topicStats?.[module.title]?.accuracy || 0,
                timeSpent: Math.floor(Math.random() * 60) + 30, // Mock data - would come from real tracking
                lastActivity: new Date()
              }))}
              studyStreak={dashboardStats?.studyStreak || 1}
              totalStudyTime={dashboardStats?.weeklyActivity ? dashboardStats.weeklyActivity * 15 : 180}
              averageAccuracy={learningStats.averageScore}
              recentActivity={[]}
            />
          </TabsContent>

          {/* Practice Tab */}
          <TabsContent value="practice" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Practice Mode</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Choose a topic to practice. Problems are selected based on your performance and areas that need improvement.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  {modules.map((module) => {
                    const IconComponent = topicIcons[module.title] || BookOpen;
                    return (
                      <Button
                        key={module.id}
                        variant="outline"
                        className="h-auto p-3 sm:p-4 justify-start text-left"
                        onClick={() => startPractice(module.title)}
                        data-testid={`button-practice-${module.id}`}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3 w-full">
                          <IconComponent className="h-4 w-4 sm:h-6 sm:w-6 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-xs sm:text-sm truncate">{module.title}</div>
                            <div className="text-xs text-gray-500">{module.problemCount} Problems</div>
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
      {/* AI Tutor Modal */}
      {showAITutor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                  AI-Enhanced Learning
                </h2>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAITutor(false)}
                  data-testid="button-close-ai-modal"
                >
                  ×
                </Button>
              </div>
              <AITutor 
                topic={selectedTopic} 
                onClose={() => setShowAITutor(false)} 
              />
            </div>
          </div>
        </div>
      )}

      {/* AI Study Companion */}
      {companionData.shouldShow && (
        <AIStudyCompanion
          userProgress={companionData.userProgress}
          currentContext={companionData.currentContext}
          onDismiss={() => {
            // Companion handles hiding itself
          }}
          onInteraction={(type, data) => {
            if (type === 'start_practice') {
              // Navigate to practice page with specific topic
              window.location.href = `/practice?topic=${encodeURIComponent(data.topic)}`;
            }
          }}
        />
      )}
    </div>
  );
}
