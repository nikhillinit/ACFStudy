import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  LogOut,
  User as UserIcon,
  BarChart3,
  Target
} from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  // Type guard for user data
  const typedUser = user as User | undefined;

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

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Modules Completed</p>
                  <p className="text-3xl font-bold text-gray-900" data-testid="text-modules-completed">0</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-3xl font-bold text-gray-900" data-testid="text-average-score">--%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Study Time</p>
                  <p className="text-3xl font-bold text-gray-900" data-testid="text-study-time">0h</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                  <p className="text-3xl font-bold text-gray-900" data-testid="text-overall-progress">0%</p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Learning Progress
              </CardTitle>
              <CardDescription>
                Your current progress across all modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Time Value of Money</span>
                    <span className="text-sm text-gray-500">0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Portfolio Theory</span>
                    <span className="text-sm text-gray-500">0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Bond Valuation</span>
                    <span className="text-sm text-gray-500">0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Financial Statements</span>
                    <span className="text-sm text-gray-500">0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest learning sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No recent activity</p>
                <Button variant="outline" data-testid="button-start-learning">
                  Start Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Modules */}
        <Card>
          <CardHeader>
            <CardTitle>Available Learning Modules</CardTitle>
            <CardDescription>
              Begin your journey with these comprehensive ACF modules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Module 1 */}
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Time Value of Money</h3>
                  <Badge variant="secondary">Not Started</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Master present value, future value, and annuity calculations
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">~90 minutes</span>
                  <Button size="sm" data-testid="button-module-tvm">
                    Start Module
                  </Button>
                </div>
              </div>

              {/* Module 2 */}
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Portfolio Theory</h3>
                  <Badge variant="secondary">Not Started</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Learn risk, return, and diversification principles
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">~75 minutes</span>
                  <Button size="sm" data-testid="button-module-portfolio">
                    Start Module
                  </Button>
                </div>
              </div>

              {/* Module 3 */}
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Bond Valuation</h3>
                  <Badge variant="secondary">Not Started</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Understand bond pricing and yield calculations
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">~85 minutes</span>
                  <Button size="sm" data-testid="button-module-bonds">
                    Start Module
                  </Button>
                </div>
              </div>

              {/* Module 4 */}
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Financial Statements</h3>
                  <Badge variant="secondary">Not Started</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Analyze balance sheets and income statements
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">~95 minutes</span>
                  <Button size="sm" data-testid="button-module-statements">
                    Start Module
                  </Button>
                </div>
              </div>

              {/* Module 5 */}
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Capital Budgeting</h3>
                  <Badge variant="secondary">Not Started</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Master NPV, IRR, and investment decisions
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">~100 minutes</span>
                  <Button size="sm" data-testid="button-module-budgeting">
                    Start Module
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
