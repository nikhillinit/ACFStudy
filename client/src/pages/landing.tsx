import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Server,
  Database,
  Plug
} from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
                <p className="text-sm text-gray-500">Advanced Corporate Finance</p>
              </div>
            </div>
            
            {/* Server Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-medium">Server Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-2">
              Infrastructure Ready
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Master Advanced 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Corporate Finance</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Comprehensive learning platform designed to help students excel in advanced corporate finance concepts through interactive learning and practice.
            </p>
            <Button 
              onClick={handleLogin}
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg"
              data-testid="button-login"
            >
              Start Learning <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Infrastructure Status */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Platform Infrastructure
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Express Server */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Server className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Express Server</h3>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-medium">Running on Port 5000</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    CORS enabled, JSON parsing, static file serving
                  </p>
                </CardContent>
              </Card>

              {/* Database */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Database</h3>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-600 font-medium">Connected</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    User management, progress tracking, sessions
                  </p>
                </CardContent>
              </Card>

              {/* API Endpoints */}
              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Plug className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">API Routes</h3>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-purple-600 font-medium">Active</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Authentication, progress, modules endpoints
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Platform Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Interactive Learning</h3>
                <p className="text-sm text-gray-600">
                  Comprehensive modules covering all ACF topics
                </p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                <p className="text-sm text-gray-600">
                  Monitor your learning progress in real-time
                </p>
              </div>
              <div className="text-center">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">User Management</h3>
                <p className="text-sm text-gray-600">
                  Secure authentication and user profiles
                </p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Achievement System</h3>
                <p className="text-sm text-gray-600">
                  Track achievements and milestones
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* API Endpoints Preview */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              API Endpoints Ready
            </h2>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6 text-sm font-mono">
                  <div className="space-y-2">
                    <div className="text-green-400">POST /api/auth/login</div>
                    <div className="text-blue-400">GET  /api/auth/user</div>
                    <div className="text-green-400">POST /api/progress/save</div>
                    <div className="text-blue-400">GET  /api/progress/:userId</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-blue-400">GET  /api/modules</div>
                    <div className="text-blue-400">GET  /api/modules/:id</div>
                    <div className="text-green-400">POST /api/sessions</div>
                    <div className="text-blue-400">GET  /api/health</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Master Corporate Finance?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join our platform and start your journey to ACF mastery today.
            </p>
            <Button 
              onClick={handleLogin}
              size="lg" 
              variant="secondary"
              className="px-8 py-4 text-lg"
              data-testid="button-cta-login"
            >
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              <span>Infrastructure ready for content integration</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>React Application Loaded</span>
              <span>•</span>
              <span>Database Schema Active</span>
              <span>•</span>
              <span>Authentication Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
