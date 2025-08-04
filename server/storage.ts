import {
  users,
  progress,
  modules,
  userSessions,
  type User,
  type UpsertUser,
  type InsertProgress,
  type Progress,
  type Module,
  type UserSession,
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
}

export const storage = new DatabaseStorage();
