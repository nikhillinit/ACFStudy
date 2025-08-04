// Personalized Learning Path Recommendation System
import { replitDbManager } from './replit-db';
import { aiServices } from './ai-services';

// Enhanced problem database from deployment package
const ENHANCED_PROBLEM_DATABASE = {
  'Time Value of Money': 25,
  'Portfolio Theory': 25, 
  'Bond Valuation': 25,
  'Financial Statements': 15,
  'Derivatives': 25
};

interface UserProfile {
  id: string;
  learningStyle: 'visual' | 'analytical' | 'practical' | 'mixed';
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  weakAreas: string[];
  strongAreas: string[];
  timeAvailable: number; // minutes per session
  goalDate?: string;
  preferredDifficulty: 1 | 2 | 3;
}

interface LearningPathStep {
  id: string;
  topic: string;
  title: string;
  description: string;
  estimatedTime: number;
  difficulty: number;
  prerequisites: string[];
  concepts: string[];
  recommendedOrder: number;
  personalizedReason: string;
  aiGeneratedTips?: string;
}

interface LearningPath {
  id: string;
  userId: string;
  title: string;
  description: string;
  estimatedTotalTime: number;
  steps: LearningPathStep[];
  adaptiveRecommendations: string[];
  createdAt: string;
  lastUpdated: string;
}

export class LearningPathEngine {
  private topicDependencies = {
    'Time Value of Money': [],
    'Financial Statements': ['Time Value of Money'],
    'Bond Valuation': ['Time Value of Money'],
    'Portfolio Theory': ['Time Value of Money', 'Financial Statements'],
    'Derivatives': ['Portfolio Theory', 'Bond Valuation']
  };

  private topicDifficulty = {
    'Time Value of Money': 1,
    'Financial Statements': 1,
    'Bond Valuation': 2,
    'Portfolio Theory': 2,
    'Derivatives': 3
  };

  private conceptMapping = {
    'Time Value of Money': ['Present Value', 'Future Value', 'Annuities', 'NPV', 'IRR'],
    'Financial Statements': ['Balance Sheet', 'Income Statement', 'Cash Flow', 'Ratios'],
    'Bond Valuation': ['Bond Pricing', 'YTM', 'Duration', 'Convexity', 'Credit Risk'],
    'Portfolio Theory': ['CAPM', 'Beta', 'Diversification', 'Efficient Frontier', 'Sharpe Ratio'],
    'Derivatives': ['Options', 'Futures', 'Forwards', 'Black-Scholes', 'Greeks']
  };

  async generatePersonalizedPath(userId: string, userPreferences?: Partial<UserProfile>): Promise<LearningPath> {
    // Get user progress and analytics
    const progress = await replitDbManager.getProgress(userId) || {};
    const analytics = await replitDbManager.getAnalytics(userId);
    
    // Build user profile
    const userProfile = await this.buildUserProfile(userId, progress, analytics, userPreferences);
    
    // Generate learning path steps
    const pathSteps = await this.generatePathSteps(userProfile, progress);
    
    // Get AI-powered recommendations
    const aiRecommendations = await this.getAIRecommendations(userProfile, pathSteps);
    
    // Create learning path
    const learningPath: LearningPath = {
      id: `path_${userId}_${Date.now()}`,
      userId,
      title: this.generatePathTitle(userProfile),
      description: this.generatePathDescription(userProfile),
      estimatedTotalTime: pathSteps.reduce((total, step) => total + step.estimatedTime, 0),
      steps: pathSteps,
      adaptiveRecommendations: aiRecommendations,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    // Save learning path
    await this.saveLearningPath(learningPath);
    
    return learningPath;
  }

  private async buildUserProfile(
    userId: string, 
    progress: any, 
    analytics: any[], 
    preferences?: Partial<UserProfile>
  ): Promise<UserProfile> {
    const recentSessions = analytics.filter((event: any) => 
      event.type === 'learning_session_completed' &&
      new Date(event.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
    );

    // Analyze performance patterns
    const topicPerformance: Record<string, { accuracy: number, attempts: number }> = {};
    
    Object.entries(progress).forEach(([topic, data]: [string, any]) => {
      topicPerformance[topic] = {
        accuracy: data.accuracy || 0,
        attempts: data.completed?.length || 0
      };
    });

    // Determine weak and strong areas
    const weakAreas = Object.entries(topicPerformance)
      .filter(([topic, perf]) => perf.accuracy < 0.7 || perf.attempts < 5)
      .map(([topic]) => topic);
    
    const strongAreas = Object.entries(topicPerformance)
      .filter(([topic, perf]) => perf.accuracy >= 0.8 && perf.attempts >= 5)
      .map(([topic]) => topic);

    // Determine current level
    const overallAccuracy = Object.values(topicPerformance)
      .reduce((sum, perf) => sum + perf.accuracy, 0) / Object.keys(topicPerformance).length;
    
    let currentLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    if (overallAccuracy > 0.75) currentLevel = 'advanced';
    else if (overallAccuracy > 0.6) currentLevel = 'intermediate';

    // Analyze learning style from session patterns
    const avgSessionTime = recentSessions.length > 0 
      ? recentSessions.reduce((sum: number, session: any) => sum + (session.problemsAttempted * 3), 0) / recentSessions.length
      : 20;

    let learningStyle: 'visual' | 'analytical' | 'practical' | 'mixed' = 'mixed';
    if (avgSessionTime > 30) learningStyle = 'analytical';
    else if (avgSessionTime < 15) learningStyle = 'practical';

    return {
      id: userId,
      learningStyle,
      currentLevel,
      weakAreas,
      strongAreas,
      timeAvailable: Math.round(avgSessionTime),
      preferredDifficulty: currentLevel === 'advanced' ? 3 : currentLevel === 'intermediate' ? 2 : 1,
      ...preferences
    };
  }

  private async generatePathSteps(userProfile: UserProfile, progress: any): Promise<LearningPathStep[]> {
    const steps: LearningPathStep[] = [];
    let orderCounter = 1;

    // Prioritize topics based on user profile
    const topicPriorities = this.calculateTopicPriorities(userProfile, progress);
    
    for (const [topic, priority] of topicPriorities) {
      const stepDetail = await this.createTopicStep(topic, userProfile, orderCounter, priority);
      steps.push(stepDetail);
      orderCounter++;
    }

    // Add focus sessions for weak areas
    if (userProfile.weakAreas.length > 0) {
      for (const weakTopic of userProfile.weakAreas.slice(0, 2)) { // Focus on top 2 weak areas
        const focusStep = await this.createFocusStep(weakTopic, userProfile, orderCounter);
        steps.push(focusStep);
        orderCounter++;
      }
    }

    return steps.sort((a, b) => a.recommendedOrder - b.recommendedOrder);
  }

  private calculateTopicPriorities(userProfile: UserProfile, progress: any): [string, number][] {
    const priorities: [string, number][] = [];
    
    Object.keys(this.topicDifficulty).forEach(topic => {
      let priority = 0;
      const topicProgress = progress[topic] || { completed: [], accuracy: 0 };
      const problemCount = ENHANCED_PROBLEM_DATABASE[topic as keyof typeof ENHANCED_PROBLEM_DATABASE] || 20;
      const completionRate = topicProgress.completed.length / problemCount;
      
      // Base priority on difficulty vs user level
      const topicDiff = this.topicDifficulty[topic as keyof typeof this.topicDifficulty];
      const levelMultiplier = userProfile.currentLevel === 'beginner' ? 1 : 
                             userProfile.currentLevel === 'intermediate' ? 1.5 : 2;
      
      if (topicDiff <= userProfile.preferredDifficulty) {
        priority += 100;
      }
      
      // Higher priority for weak areas (low accuracy or low completion)
      if (userProfile.weakAreas.includes(topic) || topicProgress.accuracy < 0.7 || completionRate < 0.3) {
        priority += 150;
      }
      
      // Moderate priority for partial completion (encourage continuation)
      if (completionRate > 0.3 && completionRate < 0.8) {
        priority += 120;
      }
      
      // Lower priority for strong areas but still include for mastery
      if (userProfile.strongAreas.includes(topic) && topicProgress.accuracy > 0.8) {
        priority += 50;
      }
      
      // Check prerequisites completion
      const prerequisites = this.topicDependencies[topic as keyof typeof this.topicDependencies];
      const prereqsMet = prerequisites.every(prereq => {
        const prereqProgress = progress[prereq];
        return prereqProgress && prereqProgress.accuracy > 0.6 && prereqProgress.completed.length > 0;
      });
      
      if (!prereqsMet) {
        priority -= 200; // Lower priority if prerequisites not met
      }
      
      // Boost priority for topics with recent activity but low performance
      if (topicProgress.completed.length > 0 && topicProgress.accuracy < 0.6) {
        priority += 100; // Needs focused attention
      }
      
      priorities.push([topic, priority * levelMultiplier]);
    });
    
    return priorities.sort((a, b) => b[1] - a[1]); // Sort by priority descending
  }

  private async createTopicStep(
    topic: string, 
    userProfile: UserProfile, 
    order: number,
    priority: number
  ): Promise<LearningPathStep> {
    const concepts = this.conceptMapping[topic as keyof typeof this.conceptMapping] || [];
    const difficulty = this.topicDifficulty[topic as keyof typeof this.topicDifficulty];
    
    let estimatedTime = 25; // Base time
    if (userProfile.learningStyle === 'analytical') estimatedTime += 10;
    if (difficulty > userProfile.preferredDifficulty) estimatedTime += 15;
    if (userProfile.weakAreas.includes(topic)) estimatedTime += 20;
    
    const personalizedReason = this.generatePersonalizedReason(topic, userProfile, priority);
    
    return {
      id: `step_${topic.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`,
      topic,
      title: `Master ${topic}`,
      description: `Comprehensive study session covering key concepts in ${topic}`,
      estimatedTime,
      difficulty,
      prerequisites: this.topicDependencies[topic as keyof typeof this.topicDependencies] || [],
      concepts,
      recommendedOrder: order,
      personalizedReason
    };
  }

  private async createFocusStep(
    topic: string, 
    userProfile: UserProfile, 
    order: number
  ): Promise<LearningPathStep> {
    return {
      id: `focus_${topic.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`,
      topic,
      title: `Focus Session: ${topic}`,
      description: `Targeted practice to strengthen understanding in ${topic}`,
      estimatedTime: Math.min(userProfile.timeAvailable, 30),
      difficulty: this.topicDifficulty[topic as keyof typeof this.topicDifficulty],
      prerequisites: [],
      concepts: this.conceptMapping[topic as keyof typeof this.conceptMapping]?.slice(0, 3) || [],
      recommendedOrder: order,
      personalizedReason: `Focused practice recommended based on your recent performance in ${topic}`
    };
  }

  private generatePersonalizedReason(topic: string, userProfile: UserProfile, priority: number): string {
    if (userProfile.weakAreas.includes(topic)) {
      return `Priority topic - strengthen your foundation in ${topic} based on recent performance`;
    }
    
    if (userProfile.strongAreas.includes(topic)) {
      return `Build on your strength in ${topic} with advanced concepts`;
    }
    
    const difficulty = this.topicDifficulty[topic as keyof typeof this.topicDifficulty];
    if (difficulty === userProfile.preferredDifficulty) {
      return `Perfect match for your current skill level in ${topic}`;
    }
    
    if (difficulty < userProfile.preferredDifficulty) {
      return `Foundation topic - essential building block for advanced concepts`;
    }
    
    return `Challenge topic - expand your knowledge in ${topic}`;
  }

  private async getAIRecommendations(userProfile: UserProfile, steps: LearningPathStep[]): Promise<string[]> {
    try {
      // Calculate completion statistics for enhanced recommendations
      const completionStats = steps.map(step => {
        const problemCount = ENHANCED_PROBLEM_DATABASE[step.topic as keyof typeof ENHANCED_PROBLEM_DATABASE] || 20;
        return `${step.topic}: ${step.difficulty}/3 difficulty, ${problemCount} problems available`;
      }).join(', ');

      const prompt = `As an expert ACF tutor for Kellogg MBA students, provide 3 highly specific study recommendations for a ${userProfile.currentLevel} student preparing for Advanced Corporate Finance placement exam.

Student Analysis:
- Current Level: ${userProfile.currentLevel}
- Learning Style: ${userProfile.learningStyle}
- Available Study Time: ${userProfile.timeAvailable} minutes per session
- Weak Areas Needing Focus: ${userProfile.weakAreas.join(', ') || 'None identified yet'}
- Strong Foundation Areas: ${userProfile.strongAreas.join(', ') || 'Building foundation'}

Learning Path Design: ${completionStats}

Problem Database Available: 115+ practice problems across 5 core ACF topics with adaptive difficulty progression.

Provide strategic recommendations focusing on:
1. Optimal study sequence and time allocation
2. Specific problem-solving strategies for weak areas
3. Advanced techniques for mastering challenging concepts

Make recommendations practical and actionable for busy MBA students.`;

      const recommendations = await aiServices.getPersonalizedTutoring({
        topic: 'ACF Study Strategy',
        userLevel: userProfile.currentLevel,
        specificQuestion: prompt
      });

      // Parse and enhance AI response
      const parsed = recommendations.split('\n')
        .filter(line => line.trim().length > 0 && !line.trim().startsWith('As an') && !line.trim().startsWith('Based on'))
        .slice(0, 3)
        .map(rec => rec.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
        .filter(rec => rec.length > 20); // Filter out very short responses

      if (parsed.length >= 3) {
        return parsed;
      }

      // Fallback to enhanced default recommendations
      const fallbackRecs = [
        `For ${userProfile.learningStyle} learners: Focus on ${userProfile.learningStyle === 'visual' ? 'diagram-based problem solving and chart analysis' : 
          userProfile.learningStyle === 'analytical' ? 'step-by-step formula derivations and logical problem breakdowns' : 
          userProfile.learningStyle === 'practical' ? 'real-world application examples and case-based learning' : 
          'multi-modal approach combining visual aids, logical reasoning, and practical applications'}`,
        
        userProfile.weakAreas.length > 0 ? 
          `Dedicate 60% of study time to weak areas: ${userProfile.weakAreas.join(' and ')}. Use spaced repetition with 3-day intervals for maximum retention` :
          `Build strong foundation by completing all fundamental problems in Time Value of Money before advancing to Portfolio Theory`,
        
        `Optimize ${userProfile.timeAvailable}-minute sessions: 5 min review, ${userProfile.timeAvailable - 15} min new problems, 10 min solution analysis. Track accuracy trends to identify improvement patterns`
      ];

      return fallbackRecs;
        
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      return [
        `Structured approach for ${userProfile.currentLevel} level: Master fundamental concepts before advancing to complex applications`,
        `${userProfile.timeAvailable}-minute sessions work best with focused practice on 1-2 concepts per session rather than broad coverage`,
        `Track progress weekly: aim for 80%+ accuracy before moving to next difficulty level in each topic area`
      ];
    }
  }

  private generatePathTitle(userProfile: UserProfile): string {
    const levelTitles = {
      beginner: 'Foundation Building Path',
      intermediate: 'Skills Enhancement Path', 
      advanced: 'Mastery Achievement Path'
    };
    
    return `${levelTitles[userProfile.currentLevel]} - Personalized ACF Study Plan`;
  }

  private generatePathDescription(userProfile: UserProfile): string {
    return `Customized learning path designed for your ${userProfile.learningStyle} learning style and ${userProfile.currentLevel} skill level. ` +
           `Estimated ${userProfile.timeAvailable} minutes per session with focus on ${userProfile.weakAreas.length > 0 ? 'strengthening weak areas and ' : ''}building comprehensive ACF knowledge.`;
  }

  private async saveLearningPath(learningPath: LearningPath): Promise<void> {
    const key = `learning_path:${learningPath.userId}:${learningPath.id}`;
    await replitDbManager.getDb().set(key, learningPath);
    
    // Also save as current active path
    const activeKey = `active_path:${learningPath.userId}`;
    await replitDbManager.getDb().set(activeKey, learningPath.id);
  }

  async getLearningPath(userId: string, pathId?: string): Promise<LearningPath | null> {
    try {
      if (!pathId) {
        // Get active path
        const activeKey = `active_path:${userId}`;
        const activePath = await replitDbManager.getDb().get(activeKey);
        if (!activePath) return null;
        pathId = activePath;
      }
      
      const key = `learning_path:${userId}:${pathId}`;
      return await replitDbManager.getDb().get(key);
    } catch (error) {
      console.error('Error getting learning path:', error);
      return null;
    }
  }

  async updatePathProgress(userId: string, stepId: string, completed: boolean): Promise<void> {
    const path = await this.getLearningPath(userId);
    if (!path) return;
    
    const step = path.steps.find(s => s.id === stepId);
    if (!step) return;
    
    // Track step completion
    await replitDbManager.trackEvent(userId, 'learning_path_step_completed', {
      pathId: path.id,
      stepId,
      topic: step.topic,
      completed
    });
    
    // Check if path needs adaptation
    if (completed) {
      await this.adaptPath(userId, path);
    }
  }

  private async adaptPath(userId: string, currentPath: LearningPath): Promise<void> {
    // Get recent performance data
    const recentAnalytics = await replitDbManager.getAnalytics(userId);
    const recentSessions = recentAnalytics.filter((event: any) => 
      event.type === 'learning_session_completed' &&
      new Date(event.timestamp) > new Date(currentPath.lastUpdated)
    );
    
    if (recentSessions.length < 3) return; // Need sufficient data for adaptation
    
    // Analyze if adaptation is needed
    const avgAccuracy = recentSessions.reduce((sum: number, session: any) => sum + session.accuracy, 0) / recentSessions.length;
    
    if (avgAccuracy > 0.9) {
      // User performing very well, can increase difficulty
      await this.adaptForHighPerformance(userId, currentPath);
    } else if (avgAccuracy < 0.5) {
      // User struggling, need more support
      await this.adaptForStruggling(userId, currentPath);
    }
  }

  private async adaptForHighPerformance(userId: string, path: LearningPath): Promise<void> {
    // Add more challenging topics or accelerate pace
    const challengeStep: LearningPathStep = {
      id: `challenge_${Date.now()}`,
      topic: 'Advanced Integration',
      title: 'Challenge: Advanced Problem Solving',
      description: 'Advanced practice problems combining multiple concepts',
      estimatedTime: 35,
      difficulty: 3,
      prerequisites: [],
      concepts: ['Integration', 'Advanced Problem Solving'],
      recommendedOrder: path.steps.length + 1,
      personalizedReason: 'Added based on your excellent performance - ready for more challenge!'
    };
    
    path.steps.push(challengeStep);
    path.lastUpdated = new Date().toISOString();
    await this.saveLearningPath(path);
  }

  private async adaptForStruggling(userId: string, path: LearningPath): Promise<void> {
    // Add more foundational practice or break down complex topics
    const supportStep: LearningPathStep = {
      id: `support_${Date.now()}`,
      topic: 'Foundation Review',
      title: 'Foundation Strengthening Session',
      description: 'Extra practice on fundamental concepts',
      estimatedTime: 20,
      difficulty: 1,
      prerequisites: [],
      concepts: ['Basic Concepts', 'Foundation Building'],
      recommendedOrder: path.steps.length + 1,
      personalizedReason: 'Added to strengthen fundamentals based on recent performance'
    };
    
    path.steps.push(supportStep);
    path.lastUpdated = new Date().toISOString();
    await this.saveLearningPath(path);
  }

  // Helper method to access database
  private getDb() {
    return replitDbManager.getDb ? replitDbManager.getDb() : (replitDbManager as any).db;
  }
}

export const learningPathEngine = new LearningPathEngine();