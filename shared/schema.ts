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

// Enhanced User storage table with gamification features.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Gamification fields
  level: integer("level").default(1),
  xp: integer("xp").default(0),
  totalXP: integer("total_xp").default(0),
  coins: integer("coins").default(100),
  streak: integer("streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  dailyGoalsCompleted: integer("daily_goals_completed").default(0),
  weeklyRank: integer("weekly_rank").default(0),
  globalRank: integer("global_rank").default(0),
  learningStyle: varchar("learning_style").default("visual"), // visual, auditory, kinesthetic, reading
  preferredStudyTime: varchar("preferred_study_time").default("morning"),
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

// Enhanced Problems table for storing practice problems with gamification
export const problems = pgTable("problems", {
  id: varchar("id").primaryKey(),
  topic: varchar("topic").notNull(),
  difficulty: integer("difficulty").default(0), // 0-2 scale (easy, medium, hard)
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  solution: text("solution").notNull(),
  explanation: text("explanation"),
  concepts: text("concepts").array(),
  hints: text("hints").array(),
  estimatedTime: integer("estimated_time").default(90), // in seconds
  xpReward: integer("xp_reward").default(10),
  coinReward: integer("coin_reward").default(5),
  prerequisites: text("prerequisites").array(),
  relatedQuestions: text("related_questions").array(),
  commonMistakes: text("common_mistakes").array(),
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

// Achievements table for gamification
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  icon: varchar("icon").default("trophy"),
  rarity: varchar("rarity").default("common"), // common, rare, epic, legendary
  xpReward: integer("xp_reward").default(50),
  coinReward: integer("coin_reward").default(25),
  criteria: jsonb("criteria").notNull(), // Achievement unlock conditions
  isActive: varchar("is_active").default("true"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User achievements tracking
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementId: varchar("achievement_id").notNull().references(() => achievements.id),
  progress: integer("progress").default(0),
  maxProgress: integer("max_progress").default(1),
  unlocked: varchar("unlocked").default("false"),
  unlockedAt: timestamp("unlocked_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Learning challenges table
export const learningChallenges = pgTable("learning_challenges", {
  id: varchar("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(),
  difficulty: varchar("difficulty").default("beginner"), // beginner, intermediate, advanced
  timeLimit: integer("time_limit").default(300), // in seconds
  xpReward: integer("xp_reward").default(20),
  coinReward: integer("coin_reward").default(10),
  problemIds: text("problem_ids").array(),
  isActive: varchar("is_active").default("true"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User challenge attempts
export const challengeAttempts = pgTable("challenge_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  challengeId: varchar("challenge_id").notNull().references(() => learningChallenges.id),
  score: decimal("score", { precision: 5, scale: 2 }),
  timeSpent: integer("time_spent").default(0), // in seconds
  completed: varchar("completed").default("false"),
  completedAt: timestamp("completed_at"),
  results: jsonb("results"), // Detailed challenge results
  createdAt: timestamp("created_at").defaultNow(),
});

// Power-ups table for gamification
export const powerUps = pgTable("power_ups", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  icon: varchar("icon").default("zap"),
  effect: varchar("effect").notNull(), // time_boost, hint_reveal, skip_question, etc.
  duration: integer("duration").default(300), // in seconds
  cost: integer("cost").default(50), // coin cost
  isActive: varchar("is_active").default("true"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User power-ups inventory
export const userPowerUps = pgTable("user_power_ups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  powerUpId: varchar("power_up_id").notNull().references(() => powerUps.id),
  quantity: integer("quantity").default(0),
  active: varchar("active").default("false"),
  activatedAt: timestamp("activated_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAchievementSchema = createInsertSchema(achievements);
export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  createdAt: true,
});
export const insertLearningChallengeSchema = createInsertSchema(learningChallenges);
export const insertChallengeAttemptSchema = createInsertSchema(challengeAttempts).omit({
  id: true,
  createdAt: true,
});
export const insertPowerUpSchema = createInsertSchema(powerUps);
export const insertUserPowerUpSchema = createInsertSchema(userPowerUps).omit({
  id: true,
  createdAt: true,
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
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type LearningChallenge = typeof learningChallenges.$inferSelect;
export type InsertLearningChallenge = z.infer<typeof insertLearningChallengeSchema>;
export type ChallengeAttempt = typeof challengeAttempts.$inferSelect;
export type InsertChallengeAttempt = z.infer<typeof insertChallengeAttemptSchema>;
export type PowerUp = typeof powerUps.$inferSelect;
export type InsertPowerUp = z.infer<typeof insertPowerUpSchema>;
export type UserPowerUp = typeof userPowerUps.$inferSelect;
export type InsertUserPowerUp = z.infer<typeof insertUserPowerUpSchema>;
