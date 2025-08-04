import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Progress tracking table for ACF learning modules
export const progress = pgTable("progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  moduleId: varchar("module_id").notNull(),
  score: decimal("score", { precision: 5, scale: 2 }),
  completed: timestamp("completed"),
  attempts: integer("attempts").default(0),
  timeSpent: integer("time_spent").default(0), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Learning modules table
export const modules = pgTable("modules", {
  id: varchar("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  difficulty: integer("difficulty").default(1), // 1-3 scale
  estimatedTime: integer("estimated_time").default(0), // in minutes
  problemCount: integer("problem_count").default(0),
  isActive: varchar("is_active").default("true"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Problems table for storing practice problems
export const problems = pgTable("problems", {
  id: varchar("id").primaryKey(),
  topic: varchar("topic").notNull(),
  difficulty: integer("difficulty").default(0), // 0-2 scale
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  solution: text("solution").notNull(),
  concepts: text("concepts").array(),
  isActive: varchar("is_active").default("true"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User diagnostic results
export const diagnosticResults = pgTable("diagnostic_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  completed: timestamp("completed").defaultNow(),
  results: jsonb("results").notNull(), // Array of problem results
  recommendations: text("recommendations").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Practice session tracking
export const practiceSessions = pgTable("practice_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  topic: varchar("topic").notNull(),
  sessionType: varchar("session_type").notNull(), // 'practice', 'diagnostic', 'drill'
  problemsAttempted: integer("problems_attempted").default(0),
  problemsCorrect: integer("problems_correct").default(0),
  timeSpent: integer("time_spent").default(0), // in seconds
  completed: timestamp("completed").defaultNow(),
  results: jsonb("results"), // Detailed problem results
});

// User sessions for progress tracking
export const userSessions = pgTable("user_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionStart: timestamp("session_start").defaultNow(),
  sessionEnd: timestamp("session_end"),
  modulesAccessed: text("modules_accessed").array(),
  totalTimeSpent: integer("total_time_spent").default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertProgressSchema = createInsertSchema(progress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertProblemSchema = createInsertSchema(problems).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertDiagnosticResultSchema = createInsertSchema(diagnosticResults).omit({
  id: true,
  createdAt: true,
});

export const insertPracticeSessionSchema = createInsertSchema(practiceSessions).omit({
  id: true,
  completed: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Progress = typeof progress.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;
export type UserSession = typeof userSessions.$inferSelect;
export type Problem = typeof problems.$inferSelect;
export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type DiagnosticResult = typeof diagnosticResults.$inferSelect;
export type InsertDiagnosticResult = z.infer<typeof insertDiagnosticResultSchema>;
export type PracticeSession = typeof practiceSessions.$inferSelect;
export type InsertPracticeSession = z.infer<typeof insertPracticeSessionSchema>;
