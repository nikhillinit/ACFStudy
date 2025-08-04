import {
  users,
  progress,
  modules,
  userSessions,
  problems,
  diagnosticResults,
  practiceSessions,
  learningStyles,
  type User,
  type UpsertUser,
  type InsertProgress,
  type Progress,
  type Module,
  type UserSession,
  type Problem,
  type InsertProblem,
  type DiagnosticResult,
  type InsertDiagnosticResult,
  type PracticeSession,
  type InsertPracticeSession,
  type LearningStyle,
  type UpsertLearningStyle,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Progress operations
  saveProgress(progressData: InsertProgress): Promise<Progress>;
  getUserProgress(userId: string): Promise<Progress[]>;
  getModuleProgress(userId: string, moduleId: string): Promise<Progress | undefined>;
  
  // Module operations
  getAllModules(): Promise<Module[]>;
  getModule(id: string): Promise<Module | undefined>;
  
  // Problem operations
  getProblems(): Promise<Problem[]>;
  getProblemsByTopic(topic: string): Promise<Problem[]>;
  getProblem(id: string): Promise<Problem | undefined>;
  createProblem(problem: InsertProblem): Promise<Problem>;
  
  // Diagnostic operations
  saveDiagnosticResult(result: InsertDiagnosticResult): Promise<DiagnosticResult>;
  getUserDiagnosticResults(userId: string): Promise<DiagnosticResult[]>;
  
  // Practice session operations
  createPracticeSession(session: InsertPracticeSession): Promise<PracticeSession>;
  getUserPracticeSessions(userId: string): Promise<PracticeSession[]>;
  
  // Learning style operations
  saveLearningStyle(learningStyle: UpsertLearningStyle): Promise<LearningStyle>;
  getLearningStyle(userId: string): Promise<LearningStyle | undefined>;
  
  // Session operations
  createUserSession(userId: string): Promise<UserSession>;
  updateUserSession(sessionId: string, data: Partial<UserSession>): Promise<void>;
  getUserSessions(userId: string): Promise<UserSession[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Progress operations
  async saveProgress(progressData: InsertProgress): Promise<Progress> {
    const [existingProgress] = await db
      .select()
      .from(progress)
      .where(
        and(
          eq(progress.userId, progressData.userId),
          eq(progress.moduleId, progressData.moduleId)
        )
      );

    if (existingProgress) {
      const [updatedProgress] = await db
        .update(progress)
        .set({
          ...progressData,
          attempts: (existingProgress.attempts || 0) + 1,
          updatedAt: new Date(),
        })
        .where(eq(progress.id, existingProgress.id))
        .returning();
      return updatedProgress;
    } else {
      const [newProgress] = await db
        .insert(progress)
        .values({
          ...progressData,
          attempts: 1,
        })
        .returning();
      return newProgress;
    }
  }

  async getUserProgress(userId: string): Promise<Progress[]> {
    return await db
      .select()
      .from(progress)
      .where(eq(progress.userId, userId))
      .orderBy(desc(progress.updatedAt));
  }

  async getModuleProgress(userId: string, moduleId: string): Promise<Progress | undefined> {
    const [moduleProgress] = await db
      .select()
      .from(progress)
      .where(
        and(
          eq(progress.userId, userId),
          eq(progress.moduleId, moduleId)
        )
      );
    return moduleProgress;
  }

  // Module operations
  async getAllModules(): Promise<Module[]> {
    return await db
      .select()
      .from(modules)
      .where(eq(modules.isActive, "true"));
  }

  async getModule(id: string): Promise<Module | undefined> {
    const [module] = await db
      .select()
      .from(modules)
      .where(eq(modules.id, id));
    return module;
  }

  // Problem operations
  async getProblems(): Promise<Problem[]> {
    return await db.select().from(problems).where(eq(problems.isActive, "true"));
  }

  async getProblemsByTopic(topic: string): Promise<Problem[]> {
    return await db.select()
      .from(problems)
      .where(and(eq(problems.topic, topic), eq(problems.isActive, "true")));
  }

  async getProblem(id: string): Promise<Problem | undefined> {
    const [problem] = await db.select().from(problems).where(eq(problems.id, id));
    return problem;
  }

  async createProblem(problemData: InsertProblem): Promise<Problem> {
    const [problem] = await db.insert(problems).values(problemData).returning();
    return problem;
  }

  // Diagnostic operations
  async saveDiagnosticResult(resultData: InsertDiagnosticResult): Promise<DiagnosticResult> {
    const [result] = await db.insert(diagnosticResults).values(resultData).returning();
    return result;
  }

  async getUserDiagnosticResults(userId: string): Promise<DiagnosticResult[]> {
    return await db.select()
      .from(diagnosticResults)
      .where(eq(diagnosticResults.userId, userId))
      .orderBy(desc(diagnosticResults.completed));
  }

  // Practice session operations
  async createPracticeSession(sessionData: InsertPracticeSession): Promise<PracticeSession> {
    const [session] = await db.insert(practiceSessions).values(sessionData).returning();
    return session;
  }

  async getUserPracticeSessions(userId: string): Promise<PracticeSession[]> {
    return await db.select()
      .from(practiceSessions)
      .where(eq(practiceSessions.userId, userId))
      .orderBy(desc(practiceSessions.completed));
  }

  // Session operations
  async createUserSession(userId: string): Promise<UserSession> {
    const [session] = await db
      .insert(userSessions)
      .values({
        userId,
        modulesAccessed: [],
      })
      .returning();
    return session;
  }

  async updateUserSession(sessionId: string, data: Partial<UserSession>): Promise<void> {
    await db
      .update(userSessions)
      .set(data)
      .where(eq(userSessions.id, sessionId));
  }

  async getUserSessions(userId: string): Promise<UserSession[]> {
    return await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.userId, userId))
      .orderBy(desc(userSessions.sessionStart));
  }

  // Learning style operations
  async saveLearningStyle(learningStyleData: UpsertLearningStyle): Promise<LearningStyle> {
    const [existingStyle] = await db
      .select()
      .from(learningStyles)
      .where(eq(learningStyles.userId, learningStyleData.userId!));

    if (existingStyle) {
      // Update existing learning style
      const [updatedStyle] = await db
        .update(learningStyles)
        .set({
          ...learningStyleData,
          updatedAt: new Date(),
        })
        .where(eq(learningStyles.userId, learningStyleData.userId!))
        .returning();
      return updatedStyle;
    } else {
      // Create new learning style
      const [newStyle] = await db
        .insert(learningStyles)
        .values(learningStyleData)
        .returning();
      return newStyle;
    }
  }

  async getLearningStyle(userId: string): Promise<LearningStyle | undefined> {
    const [style] = await db
      .select()
      .from(learningStyles)
      .where(eq(learningStyles.userId, userId));
    return style;
  }
}

export const storage = new DatabaseStorage();
