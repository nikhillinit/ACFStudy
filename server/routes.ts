import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProgressSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
