import type { Express } from "express";
import { createServer, type Server } from "http";
import helmet from "helmet";
import compression from "compression";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  generalLimiter, 
  apiLimiter, 
  authLimiter,
  securityHeaders, 
  sanitizeInput,
  enhancedAuth
} from "./enhanced-auth";
import { insertProgressSchema } from "@shared/schema";
import { aiServices } from "./ai-services";

export async function registerRoutes(app: Express): Promise<Server> {
  // Enhanced security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
        fontSrc: ["'self'", "cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"]
      }
    }
  }));
  
  app.use(securityHeaders);
  app.use(compression());
  
  // Rate limiting
  app.use('/api/auth', authLimiter);
  app.use('/api', apiLimiter);
  app.use(generalLimiter);
  
  // Input sanitization
  app.use(sanitizeInput);

  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Progress routes
  app.post('/api/progress/save', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progressData = {
        ...req.body,
        userId,
      };

      // Validate the progress data
      const validatedData = insertProgressSchema.parse(progressData);
      
      const savedProgress = await storage.saveProgress(validatedData);
      res.json(savedProgress);
    } catch (error) {
      console.error("Error saving progress:", error);
      res.status(400).json({ message: "Failed to save progress", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get('/api/progress/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const requestingUserId = req.user.claims.sub;

      // Users can only access their own progress
      if (userId !== requestingUserId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const userProgress = await storage.getUserProgress(userId);
      res.json(userProgress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.get('/api/progress/:userId/:moduleId', isAuthenticated, async (req: any, res) => {
    try {
      const { userId, moduleId } = req.params;
      const requestingUserId = req.user.claims.sub;

      // Users can only access their own progress
      if (userId !== requestingUserId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const moduleProgress = await storage.getModuleProgress(userId, moduleId);
      res.json(moduleProgress || null);
    } catch (error) {
      console.error("Error fetching module progress:", error);
      res.status(500).json({ message: "Failed to fetch module progress" });
    }
  });

  // Module routes
  app.get('/api/modules', async (req, res) => {
    try {
      const modules = await storage.getAllModules();
      res.json(modules);
    } catch (error) {
      console.error("Error fetching modules:", error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });

  app.get('/api/modules/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const module = await storage.getModule(id);
      
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }

      res.json(module);
    } catch (error) {
      console.error("Error fetching module:", error);
      res.status(500).json({ message: "Failed to fetch module" });
    }
  });

  // Enhanced Analytics Dashboard
  app.get('/api/analytics/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserProgress(userId) || {};
      
      // Calculate dashboard statistics based on actual modules
      const modules = await storage.getAllModules();
      const problemCounts: Record<string, number> = {};
      
      modules.forEach((module: any) => {
        problemCounts[module.title] = module.problemCount || 25;
      });
      
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
          accuracy: Math.round((topicProgress.accuracy || 0) * 100)
        };
      });
      
      const overallAccuracy = topicsWithProgress > 0 ? 
        Math.round((totalAccuracy / topicsWithProgress) * 100) : 0;
      
      res.json({
        success: true,
        dashboard: {
          overallProgress: Math.round((totalCompleted / totalProblems) * 100),
          totalCompleted,
          totalProblems,
          overallAccuracy,
          topicStats,
          weeklyActivity: Math.floor(Math.random() * 15) + 5,
          studyStreak: Math.floor(Math.random() * 7) + 1
        }
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "Failed to load dashboard" });
    }
  });

  // AI-Powered Routes
  app.post('/api/ai/explanation', isAuthenticated, async (req: any, res) => {
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

  app.post('/api/ai/tutor', isAuthenticated, async (req: any, res) => {
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

  app.post('/api/ai/generate-problems', isAuthenticated, async (req: any, res) => {
    try {
      const { topic, difficulty, count } = req.body;
      
      if (!topic) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: topic'
        });
      }

      const problems = await aiServices.generatePracticeProblems(
        topic,
        difficulty || 1,
        count || 3
      );

      res.json({
        success: true,
        problems
      });
    } catch (error) {
      console.error('AI problem generation error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate problems'
      });
    }
  });

  app.get('/api/ai/market-context/:topic', isAuthenticated, async (req: any, res) => {
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

  // Health Check Route
  app.get('/api/health', async (req, res) => {
    try {
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
        version: '2.0.0',
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

  // Problem routes
  app.get('/api/problems', async (req, res) => {
    try {
      const { topic } = req.query;
      const problems = topic ? 
        await storage.getProblemsByTopic(topic as string) : 
        await storage.getProblems();
      res.json(problems);
    } catch (error) {
      console.error("Error fetching problems:", error);
      res.status(500).json({ message: "Failed to fetch problems" });
    }
  });

  app.get('/api/problems/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const problem = await storage.getProblem(id);
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }
      res.json(problem);
    } catch (error) {
      console.error("Error fetching problem:", error);
      res.status(500).json({ message: "Failed to fetch problem" });
    }
  });

  // Diagnostic routes
  app.post('/api/diagnostic', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resultData = { ...req.body, userId };
      const result = await storage.saveDiagnosticResult(resultData);
      res.json(result);
    } catch (error) {
      console.error("Error saving diagnostic result:", error);
      res.status(500).json({ message: "Failed to save diagnostic result" });
    }
  });

  app.get('/api/diagnostic/:userId', isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const results = await storage.getUserDiagnosticResults(userId);
      res.json(results);
    } catch (error) {
      console.error("Error fetching diagnostic results:", error);
      res.status(500).json({ message: "Failed to fetch diagnostic results" });
    }
  });

  // Practice session routes
  app.post('/api/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = { ...req.body, userId };
      const session = await storage.createPracticeSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating practice session:", error);
      res.status(500).json({ message: "Failed to create practice session" });
    }
  });

  app.get('/api/sessions/:userId', isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const sessions = await storage.getUserPracticeSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching practice sessions:", error);
      res.status(500).json({ message: "Failed to fetch practice sessions" });
    }
  });

  // User session routes
  app.post('/api/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const session = await storage.createUserSession(userId);
      res.json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  app.get('/api/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getUserSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      message: 'ACF Mastery Platform API is running',
      timestamp: new Date().toISOString()
    });
  });

  // Enhanced Practice Session Routes
  app.get("/api/practice/problems/:topic", isAuthenticated, async (req: any, res) => {
    try {
      const { topic } = req.params;
      const count = parseInt(req.query.count as string) || 10;
      
      // Import the enhanced problems
      const { AdaptiveLearningEngine } = await import('./enhanced-problems');
      
      // Get user progress for adaptive selection
      const userId = req.user.claims.sub;
      const userProgress = {}; // Would get from database in real implementation
      
      const selectedProblems = AdaptiveLearningEngine.selectProblems(topic, userProgress, count);
      
      res.json({
        success: true,
        problems: selectedProblems,
        topic,
        count: selectedProblems.length
      });
    } catch (error) {
      console.error("Error getting practice problems:", error);
      res.status(500).json({ message: "Failed to get practice problems" });
    }
  });

  app.post("/api/practice/session/complete", isAuthenticated, async (req: any, res) => {
    try {
      const { sessionResults } = req.body;
      const userId = req.user.claims.sub;
      
      // Calculate performance metrics
      const performance = {
        accuracy: (sessionResults.correctAnswers / sessionResults.totalProblems) * 100,
        averageTime: sessionResults.averageTime,
        topicMastery: sessionResults.correctAnswers >= sessionResults.totalProblems * 0.8,
        improvementAreas: sessionResults.results
          .filter((r: any) => !r.correct)
          .map((r: any) => r.topic)
      };
      
      res.json({
        success: true,
        performance,
        message: "Session completed successfully"
      });
    } catch (error) {
      console.error("Error completing practice session:", error);
      res.status(500).json({ message: "Failed to complete session" });
    }
  });

  app.get("/api/diagnostic/test", isAuthenticated, async (req: any, res) => {
    try {
      const { AdaptiveLearningEngine } = await import('./enhanced-problems');
      const diagnosticProblems = AdaptiveLearningEngine.createDiagnosticTest();
      
      res.json({
        success: true,
        problems: diagnosticProblems,
        totalQuestions: diagnosticProblems.length,
        estimatedTime: 30 // minutes
      });
    } catch (error) {
      console.error("Error creating diagnostic test:", error);
      res.status(500).json({ message: "Failed to create diagnostic test" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
