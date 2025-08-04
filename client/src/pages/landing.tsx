import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Brain, 
  Target, 
  Users, 
  Trophy,
  BarChart3,
  Zap,
  Star,
  CheckCircle2,
  ArrowRight,
  Play
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-purple-400" />
            <span className="text-xl font-bold text-white">ACF Mastery</span>
          </div>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            data-testid="login-button"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <Badge className="mb-6 bg-purple-600/20 text-purple-200 border-purple-500/30" variant="outline">
            AI-Powered Learning Platform
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Master Advanced
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {" "}Corporate Finance
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your ACF exam preparation with our comprehensive platform featuring 115+ practice problems, 
            AI-powered tutoring, real-time performance tracking, and personalized learning paths.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/api/login'}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg"
              data-testid="hero-login-button"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Learning Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg"
            >
              View Demo
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">115+</div>
              <div className="text-gray-400">Practice Problems</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">5</div>
              <div className="text-gray-400">Core Topics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">AI</div>
              <div className="text-gray-400">Powered Tutor</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Complete ACF Learning Ecosystem
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to master Advanced Corporate Finance, powered by cutting-edge AI technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <Brain className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle>AI-Powered Tutoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Get personalized explanations and guidance from advanced AI models including Claude, 
                  OpenAI, and Perplexity for comprehensive learning support.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle>Real-Time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Track your performance with live analytics, competency mapping, 
                  and predictive scoring during practice sessions and exams.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <Target className="h-12 w-12 text-green-400 mb-4" />
                <CardTitle>Adaptive Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Personalized learning paths that adapt to your strengths and weaknesses, 
                  ensuring efficient and targeted exam preparation.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-yellow-400 mb-4" />
                <CardTitle>Comprehensive Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  115+ practice problems across 5 core topics including Time Value of Money, 
                  Portfolio Theory, Bond Valuation, and Financial Statements.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <Zap className="h-12 w-12 text-orange-400 mb-4" />
                <CardTitle>Interactive Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Gamified practice sessions, portfolio calculators, exam simulators, 
                  and interactive financial statement classification games.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <Trophy className="h-12 w-12 text-pink-400 mb-4" />
                <CardTitle>Exam Simulation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Full ACF placement exam simulation with timing, real-time performance tracking, 
                  and detailed competency analysis.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Topics Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Master 5 Core ACF Topics
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive coverage of all essential Advanced Corporate Finance concepts
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: "Time Value of Money", problems: "25+" },
              { name: "Portfolio Theory", problems: "23+" },
              { name: "Bond Valuation", problems: "22+" },
              { name: "Financial Statements", problems: "25+" },
              { name: "Derivatives", problems: "20+" }
            ].map((topic, index) => (
              <Card key={index} className="bg-white/5 border-white/10 text-white text-center">
                <CardHeader>
                  <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <CardTitle className="text-lg">{topic.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="border-green-500/30 text-green-400">
                    {topic.problems} Problems
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your ACF Preparation?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join students who are mastering Advanced Corporate Finance with our AI-powered learning platform
          </p>
          
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/api/login'}
            className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 text-xl"
            data-testid="cta-login-button"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
          
          <div className="mt-8 flex justify-center items-center space-x-4 text-gray-400">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span>AI-Powered</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-blue-400 mr-1" />
              <span>Personalized</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center">
              <Trophy className="h-4 w-4 text-green-400 mr-1" />
              <span>Exam Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-6 w-6 text-purple-400" />
            <span className="text-lg font-semibold text-white">ACF Mastery Platform</span>
          </div>
          <p className="text-gray-400">
            Advanced Corporate Finance • AI-Powered Learning • Exam Preparation
          </p>
        </div>
      </footer>
    </div>
  );
}