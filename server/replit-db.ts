// Database abstraction layer for Replit Database integration
// This replaces the PostgreSQL implementation for Replit deployment

export class ReplitDatabaseManager {
    private db: any;

    constructor() {
        // For Replit deployment - Replit Database is enabled by default
        try {
            this.db = require("@replit/database")();
            console.log('✅ Using Replit Database for persistence');
        } catch (error) {
            console.log('⚠️  Replit Database not available, using in-memory fallback');
            // For local development, use in-memory fallback
            this.db = {
                _data: new Map(),
                async set(key: string, value: any) {
                    this._data.set(key, JSON.stringify(value));
                    return true;
                },
                async get(key: string) {
                    const value = this._data.get(key);
                    return value ? JSON.parse(value) : null;
                },
                async list(prefix = '') {
                    const results = [];
                    for (const [key, value] of this._data.entries()) {
                        if (key.startsWith(prefix)) {
                            results.push([key, JSON.parse(value)]);
                        }
                    }
                    return results;
                },
                async delete(key: string) {
                    return this._data.delete(key);
                }
            };
        }
    }

    // User Management
    async createUser(email: string, userData: any) {
        const key = `user:${email}`;
        return await this.db.set(key, {
            ...userData,
            created: new Date().toISOString(),
            lastActive: new Date().toISOString()
        });
    }

    async getUser(email: string) {
        const key = `user:${email}`;
        return await this.db.get(key);
    }

    async getUserById(userId: string) {
        const users = await this.db.list('user:');
        for (const [key, user] of users) {
            if (user.id === userId) {
                return user;
            }
        }
        return null;
    }

    async updateUser(email: string, updates: any) {
        const user = await this.getUser(email);
        if (!user) return null;
        
        const updatedUser = { ...user, ...updates, lastActive: new Date().toISOString() };
        await this.db.set(`user:${email}`, updatedUser);
        return updatedUser;
    }

    // Session Management
    async createSession(token: string, sessionData: any) {
        const key = `session:${token}`;
        return await this.db.set(key, {
            ...sessionData,
            created: new Date().toISOString(),
            expires: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
        });
    }

    async getSession(token: string) {
        const key = `session:${token}`;
        const session = await this.db.get(key);
        
        if (!session) return null;
        
        // Check if expired
        if (session.expires < Date.now()) {
            await this.db.delete(key);
            return null;
        }
        
        return session;
    }

    async deleteSession(token: string) {
        const key = `session:${token}`;
        return await this.db.delete(key);
    }

    // Progress Tracking
    async saveProgress(userId: string, progressData: any) {
        const key = `progress:${userId}`;
        return await this.db.set(key, {
            ...progressData,
            lastUpdated: new Date().toISOString()
        });
    }

    async getProgress(userId: string) {
        const key = `progress:${userId}`;
        return await this.db.get(key);
    }

    async updateTopicProgress(userId: string, topic: string, results: any[]) {
        const progress = await this.getProgress(userId) || {
            'Time Value of Money': { completed: [], accuracy: 0 },
            'Portfolio Theory': { completed: [], accuracy: 0 },
            'Bond Valuation': { completed: [], accuracy: 0 },
            'Financial Statements': { completed: [], accuracy: 0 },
            'Derivatives': { completed: [], accuracy: 0 }
        };

        if (!progress[topic]) {
            progress[topic] = { completed: [], accuracy: 0 };
        }

        // Update completed problems
        results.forEach(result => {
            if (result.correct && !progress[topic].completed.includes(result.problemId)) {
                progress[topic].completed.push(result.problemId);
            }
        });

        // Calculate accuracy
        const totalAttempts = results.length;
        const correctAttempts = results.filter((r: any) => r.correct).length;
        progress[topic].accuracy = correctAttempts / totalAttempts;

        await this.saveProgress(userId, progress);
        return progress[topic];
    }

    // Analytics Tracking
    async trackEvent(userId: string, eventType: string, eventData: any) {
        const key = `analytics:${userId}:${Date.now()}`;
        return await this.db.set(key, {
            type: eventType,
            timestamp: new Date().toISOString(),
            userId,
            ...eventData
        });
    }

    async getAnalytics(userId: string, startDate: string | null = null, endDate: string | null = null) {
        const events = await this.db.list(`analytics:${userId}:`);
        
        if (!startDate && !endDate) {
            return events.map(([key, data]: [string, any]) => data);
        }

        // Filter by date range
        return events
            .map(([key, data]: [string, any]) => data)
            .filter((event: any) => {
                const eventTime = new Date(event.timestamp).getTime();
                const start = startDate ? new Date(startDate).getTime() : 0;
                const end = endDate ? new Date(endDate).getTime() : Date.now();
                return eventTime >= start && eventTime <= end;
            });
    }

    // Health Check
    async healthCheck() {
        try {
            const testKey = `health:${Date.now()}`;
            await this.db.set(testKey, { test: true });
            const result = await this.db.get(testKey);
            await this.db.delete(testKey);
            
            const stats = await this.getStats();
            
            return {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                canWrite: !!result,
                ...stats
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    // Expose database instance for learning path engine
    getDb() {
        return this.db;
    }

    async getStats() {
        const allData = await this.db.list();
        const stats = {
            totalRecords: 0,
            users: 0,
            sessions: 0,
            progressRecords: 0,
            analyticsEvents: 0,
            backups: 0
        };

        for (const [key] of allData) {
            stats.totalRecords++;
            if (key.startsWith('user:')) stats.users++;
            else if (key.startsWith('session:')) stats.sessions++;
            else if (key.startsWith('progress:')) stats.progressRecords++;
            else if (key.startsWith('analytics:')) stats.analyticsEvents++;
            else if (key.startsWith('backup:')) stats.backups++;
        }

        return stats;
    }

    // Learning modules for Replit deployment
    async getModules() {
        return [
            {
                id: 'tvm',
                title: 'Time Value of Money',
                description: 'Master present value, future value, and annuity calculations',
                problemCount: 25,
                difficulty: 'Beginner',
                concepts: ['Present Value', 'Future Value', 'Annuities', 'NPV', 'IRR']
            },
            {
                id: 'portfolio',
                title: 'Portfolio Theory', 
                description: 'Learn CAPM, risk, return, and diversification concepts',
                problemCount: 25,
                difficulty: 'Intermediate',
                concepts: ['CAPM', 'Beta', 'Diversification', 'Efficient Frontier', 'Sharpe Ratio']
            },
            {
                id: 'bonds',
                title: 'Bond Valuation',
                description: 'Understand bond pricing, yields, and duration',
                problemCount: 25,
                difficulty: 'Intermediate',
                concepts: ['Bond Pricing', 'YTM', 'Duration', 'Convexity', 'Credit Risk']
            },
            {
                id: 'financial',
                title: 'Financial Statements',
                description: 'Analyze balance sheets and income statements',
                problemCount: 15,
                difficulty: 'Beginner',
                concepts: ['Balance Sheet', 'Income Statement', 'Cash Flow', 'Ratios']
            },
            {
                id: 'derivatives',
                title: 'Derivatives',
                description: 'Options, futures, and forward contracts',
                problemCount: 25,
                difficulty: 'Advanced',
                concepts: ['Options', 'Futures', 'Forwards', 'Black-Scholes', 'Greeks']
            }
        ];
    }

    async getProblems() {
        return [
            {
                id: 'tvm-001',
                topic: 'Time Value of Money',
                difficulty: 1,
                question: 'What is the present value of $1,000 received in 3 years at a 5% discount rate?',
                answer: 'A',
                solution: 'PV = $1,000 / (1.05)^3 = $1,000 / 1.1576 = $863.84',
                concepts: ['Present Value', 'Discounting'],
                isActive: 'Y'
            },
            {
                id: 'portfolio-001',
                topic: 'Portfolio Theory',
                difficulty: 2,
                question: 'If a stock has a beta of 1.2 and the market risk premium is 8%, what is the expected return using CAPM with a risk-free rate of 3%?',
                answer: 'B',
                solution: 'Expected Return = Rf + β(Rm - Rf) = 3% + 1.2(8%) = 3% + 9.6% = 12.6%',
                concepts: ['CAPM', 'Beta', 'Risk Premium'],
                isActive: 'Y'
            },
            // Add more problems here...
        ];
    }
}

export const replitDbManager = new ReplitDatabaseManager();