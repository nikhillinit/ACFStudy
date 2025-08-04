// Comprehensive Replit integration for ACF Learning Platform
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import helmet from "helmet";
import compression from "compression";
import { replitAuthManager, requireAuth, optionalAuth, securityHeaders, sanitizeInput } from "./replit-auth";
import { replitDbManager } from "./replit-db";
import { aiServices } from "./ai-services";
import { learningPathEngine } from "./learning-path-engine";
import { ENHANCED_MODULES, getModuleById, calculateModuleProgress } from "./enhanced-modules";

// Helper function to calculate study streak
function calculateStudyStreak(events: any[]): number {
  const learningEvents = events
    .filter(e => e.type === 'learning_session_completed')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  if (learningEvents.length === 0) return 0;
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const event of learningEvents) {
    const eventDate = new Date(event.timestamp);
    eventDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currentDate.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak) {
      streak++;
    } else if (diffDays === streak + 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

export async function registerReplitRoutes(app: Express): Promise<Server> {
  // Set trust proxy for Replit environment to fix rate limiting warnings
  app.set("trust proxy", true);
  
  // Enhanced security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
        fontSrc: ["'self'", "cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.anthropic.com", "https://api.openai.com", "https://api.perplexity.ai"]
      }
    }
  }));
  
  app.use(securityHeaders);
  app.use(compression());
  
  // Rate limiting disabled for development
  
  // Input sanitization
  app.use(sanitizeInput);

  // ========================================
  // AUTHENTICATION ROUTES
  // ========================================

  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, name } = req.body;
      
      const user = await replitAuthManager.register(email, password, name);
      
      // Track registration event
      await replitDbManager.trackEvent(user.id, 'user_registered', {
        email: user.email,
        registrationMethod: 'email'
      });
      
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        user
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const ipAddress = req.ip;
      
      const result = await replitAuthManager.login(email, password, ipAddress);
      
      // Track login event
      await replitDbManager.trackEvent(result.user.id, 'user_login', {
        ipAddress,
        userAgent: req.get('User-Agent')
      });
      
      res.json({
        success: true,
        message: 'Login successful',
        ...result
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      });
    }
  });

  app.get('/api/auth/user', requireAuth(replitAuthManager), async (req: any, res) => {
    try {
      res.json({
        success: true,
        user: req.user
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ========================================
  // LEARNING CONTENT ROUTES
  // ========================================

  app.get('/api/modules', optionalAuth(replitAuthManager), async (req: any, res) => {
    try {
      const modules = ENHANCED_MODULES.map(module => ({
        id: module.id,
        title: module.title,
        description: module.description,
        category: module.category,
        difficulty: module.difficulty,
        problemCount: module.problemCount,
        estimatedTime: module.estimatedTime,
        prerequisites: module.prerequisites,
        learningObjectives: module.learningObjectives.slice(0, 3), // Show first 3 objectives
        keyFormulas: module.keyFormulas.length,
        applications: module.realWorldApplications.length
      }));
      
      // Add user progress if authenticated
      if (req.user) {
        const progress = await replitDbManager.getProgress(req.user.id) || {};
        modules.forEach((module: any) => {
          const moduleProgress = calculateModuleProgress(module.id, progress);
          module.userProgress = {
            completed: moduleProgress.problemsCompleted,
            accuracy: moduleProgress.accuracy,
            completionRate: moduleProgress.completionRate,
            estimatedTimeRemaining: moduleProgress.estimatedTimeRemaining
          };
        });
      }
      
      res.json({ success: true, modules });
    } catch (error) {
      console.error("Error fetching modules:", error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });

  app.get('/api/problems', optionalAuth(replitAuthManager), async (req: any, res) => {
    try {
      const problems = await replitDbManager.getProblems();
      res.json(problems);
    } catch (error) {
      console.error("Error fetching problems:", error);
      res.status(500).json({ message: "Failed to fetch problems" });
    }
  });

  // ========================================
  // PROGRESS TRACKING ROUTES
  // ========================================

  app.get('/api/progress/:userId', requireAuth(replitAuthManager), async (req: any, res) => {
    try {
      const { userId } = req.params;
      
      // Ensure user can only access their own progress
      if (req.user.id !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const progress = await replitDbManager.getProgress(userId);
      res.json(progress || []);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post('/api/progress', requireAuth(replitAuthManager), async (req: any, res) => {
    try {
      const { topic, results } = req.body;
      const userId = req.user.id;
      
      if (!topic || !results || !Array.isArray(results)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid progress data'
        });
      }
      
      const updatedProgress = await replitDbManager.updateTopicProgress(userId, topic, results);
      
      // Track learning session
      await replitDbManager.trackEvent(userId, 'learning_session_completed', {
        topic,
        problemsAttempted: results.length,
        correctAnswers: results.filter((r: any) => r.correct).length,
        accuracy: updatedProgress.accuracy
      });
      
      res.json({
        success: true,
        progress: updatedProgress
      });
    } catch (error) {
      console.error('Progress save error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to save progress'
      });
    }
  });

  // ========================================
  // ANALYTICS ROUTES
  // ========================================

  app.get('/api/analytics/dashboard', requireAuth(replitAuthManager), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const progress = await replitDbManager.getProgress(userId) || {};
      
      // Calculate dashboard statistics
      const problemCounts = {
        'Time Value of Money': 25,
        'Portfolio Theory': 25,
        'Bond Valuation': 25,
        'Financial Statements': 15,
        'Derivatives': 25
      };
      
      let totalProblems = 0;
      let totalCompleted = 0;
      let totalAccuracy = 0;
      let topicsWithProgress = 0;
      
      const topicStats: Record<string, any> = {};
      
      Object.entries(problemCounts).forEach(([topic, count]: [string, number]) => {
        const topicProgress = progress[topic] || { completed: [], accuracy: 0 };
        const completed = Array.isArray(topicProgress.completed) ? topicProgress.completed.length : 0;
        
        totalProblems += count;
        totalCompleted += completed;
        
        if (topicProgress.accuracy > 0) {
          totalAccuracy += topicProgress.accuracy;
          topicsWithProgress++;
        }
        
        topicStats[topic] = {
          completed,
          total: count,
          percentage: Math.round((completed / count) * 100),
          accuracy: Math.round(topicProgress.accuracy * 100)
        };
      });
      
      const overallAccuracy = topicsWithProgress > 0 ? 
        Math.round((totalAccuracy / topicsWithProgress) * 100) : 0;
      
      // Get recent activity
      const recentEvents = await replitDbManager.getAnalytics(userId);
      const lastWeekEvents = recentEvents.filter((event: any) => {
        const eventDate = new Date(event.timestamp);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return eventDate > weekAgo;
      });
      
      res.json({
        success: true,
        dashboard: {
          overallProgress: Math.round((totalCompleted / totalProblems) * 100),
          totalCompleted,
          totalProblems,
          overallAccuracy,
          topicStats,
          weeklyActivity: lastWeekEvents.length,
          studyStreak: calculateStudyStreak(recentEvents)
        }
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to load dashboard'
      });
    }
  });

  // ========================================
  // PERSONALIZED LEARNING PATH ROUTES
  // ========================================

  app.post('/api/learning-path/generate', requireAuth(replitAuthManager), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const preferences = req.body.preferences || {};
      
      const learningPath = await learningPathEngine.generatePersonalizedPath(userId, preferences);
      
      // Track learning path generation
      await replitDbManager.trackEvent(userId, 'learning_path_generated', {
        pathId: learningPath.id,
        totalSteps: learningPath.steps.length,
        estimatedTime: learningPath.estimatedTotalTime
      });
      
      res.json({
        success: true,
        learningPath
      });
    } catch (error) {
      console.error('Learning path generation error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate learning path'
      });
    }
  });

  app.get('/api/learning-path/current', requireAuth(replitAuthManager), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const learningPath = await learningPathEngine.getLearningPath(userId);
      
      if (!learningPath) {
        return res.status(404).json({
          success: false,
          error: 'No active learning path found'
        });
      }
      
      res.json({
        success: true,
        learningPath
      });
    } catch (error) {
      console.error('Get learning path error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve learning path'
      });
    }
  });

  app.post('/api/learning-path/step/:stepId/complete', requireAuth(replitAuthManager), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { stepId } = req.params;
      const { completed = true } = req.body;
      
      await learningPathEngine.updatePathProgress(userId, stepId, completed);
      
      res.json({
        success: true,
        message: 'Step progress updated'
      });
    } catch (error) {
      console.error('Step completion error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update step progress'
      });
    }
  });

  app.post('/api/learning-path/preferences', requireAuth(replitAuthManager), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const preferences = req.body;
      
      // Regenerate path with new preferences
      const learningPath = await learningPathEngine.generatePersonalizedPath(userId, preferences);
      
      res.json({
        success: true,
        learningPath,
        message: 'Learning path updated with new preferences'
      });
    } catch (error) {
      console.error('Update preferences error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update learning path preferences'
      });
    }
  });

  // ========================================
  // AI-POWERED ROUTES
  // ========================================

  app.post('/api/ai/explanation', requireAuth(replitAuthManager), async (req: any, res) => {
    try {
      const { problem, topic, userAnswer, correctAnswer, difficulty } = req.body;
      
      if (!problem || !topic || !correctAnswer) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: problem, topic, correctAnswer'
        });
      }

      const explanation = await aiServices.getPersonalizedExplanation({
        problem,
        topic,
        userAnswer,
        correctAnswer,
        difficulty: difficulty || 1
      });

      res.json({
        success: true,
        explanation
      });
    } catch (error) {
      console.error('AI explanation error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get AI explanation'
      });
    }
  });

  app.post('/api/ai/tutor', requireAuth(replitAuthManager), async (req: any, res) => {
    try {
      const { topic, userLevel, specificQuestion } = req.body;
      
      if (!topic || !userLevel) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: topic, userLevel'
        });
      }

      const guidance = await aiServices.getPersonalizedTutoring({
        topic,
        userLevel,
        specificQuestion
      });

      res.json({
        success: true,
        guidance
      });
    } catch (error) {
      console.error('AI tutor error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get AI tutoring'
      });
    }
  });

  app.get('/api/ai/market-context/:topic', requireAuth(replitAuthManager), async (req: any, res) => {
    try {
      const { topic } = req.params;
      
      const context = await aiServices.getMarketContext(topic);

      res.json({
        success: true,
        context
      });
    } catch (error) {
      console.error('AI market context error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get market context'
      });
    }
  });

  // Health Check Route with AI services status
  app.get('/api/health', async (req, res) => {
    try {
      const dbHealth = await replitDbManager.healthCheck();
      const aiServicesStatus = {
        claude: !!process.env.CLAUDE_API_KEY,
        openai: !!process.env.OPENAI_API_KEY,
        perplexity: !!process.env.PERPLEXITY_API_KEY
      };

      res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: '3.0.0',
        database: dbHealth,
        aiServices: aiServicesStatus
      });
    } catch (error) {
      res.status(503).json({
        success: false,
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}