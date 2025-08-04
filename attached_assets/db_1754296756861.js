// Database abstraction layer for Replit Database integration
// This replaces the in-memory Maps used in the basic deployment

class DatabaseManager {
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
                async set(key, value) {
                    this._data.set(key, JSON.stringify(value));
                    return true;
                },
                async get(key) {
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
                async delete(key) {
                    return this._data.delete(key);
                }
            };
        }
    }

    // User Management
    async createUser(email, userData) {
        const key = `user:${email}`;
        return await this.db.set(key, {
            ...userData,
            created: new Date().toISOString(),
            lastActive: new Date().toISOString()
        });
    }

    async getUser(email) {
        const key = `user:${email}`;
        return await this.db.get(key);
    }

    async getUserById(userId) {
        const users = await this.db.list('user:');
        for (const [key, user] of users) {
            if (user.id === userId) {
                return user;
            }
        }
        return null;
    }

    async updateUser(email, updates) {
        const user = await this.getUser(email);
        if (!user) return null;
        
        const updatedUser = { ...user, ...updates, lastActive: new Date().toISOString() };
        await this.db.set(`user:${email}`, updatedUser);
        return updatedUser;
    }

    // Session Management
    async createSession(token, sessionData) {
        const key = `session:${token}`;
        return await this.db.set(key, {
            ...sessionData,
            created: new Date().toISOString(),
            expires: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
        });
    }

    async getSession(token) {
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

    async deleteSession(token) {
        const key = `session:${token}`;
        return await this.db.delete(key);
    }

    // Progress Tracking
    async saveProgress(userId, progressData) {
        const key = `progress:${userId}`;
        return await this.db.set(key, {
            ...progressData,
            lastUpdated: new Date().toISOString()
        });
    }

    async getProgress(userId) {
        const key = `progress:${userId}`;
        return await this.db.get(key);
    }

    async updateTopicProgress(userId, topic, results) {
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
        const correctAttempts = results.filter(r => r.correct).length;
        progress[topic].accuracy = correctAttempts / totalAttempts;

        await this.saveProgress(userId, progress);
        return progress[topic];
    }

    // Analytics Tracking
    async trackEvent(userId, eventType, eventData) {
        const key = `analytics:${userId}:${Date.now()}`;
        return await this.db.set(key, {
            type: eventType,
            timestamp: new Date().toISOString(),
            userId,
            ...eventData
        });
    }

    async getAnalytics(userId, startDate = null, endDate = null) {
        const events = await this.db.list(`analytics:${userId}:`);
        
        if (!startDate && !endDate) {
            return events.map(([key, data]) => data);
        }

        // Filter by date range
        return events
            .map(([key, data]) => data)
            .filter(event => {
                const eventTime = new Date(event.timestamp).getTime();
                const start = startDate ? new Date(startDate).getTime() : 0;
                const end = endDate ? new Date(endDate).getTime() : Date.now();
                return eventTime >= start && eventTime <= end;
            });
    }

    // Backup and Maintenance
    async createBackup() {
        const allData = await this.db.list();
        const backup = {
            timestamp: new Date().toISOString(),
            data: Object.fromEntries(allData)
        };
        
        const backupKey = `backup:${Date.now()}`;
        await this.db.set(backupKey, backup);
        return backup;
    }

    async getBackups() {
        const backups = await this.db.list('backup:');
        return backups.map(([key, data]) => ({
            key,
            timestamp: data.timestamp,
            size: Object.keys(data.data).length
        }));
    }

    async restoreFromBackup(backupKey) {
        const backup = await this.db.get(backupKey);
        if (!backup) throw new Error('Backup not found');

        // Clear current data (except backups)
        const currentData = await this.db.list();
        for (const [key] of currentData) {
            if (!key.startsWith('backup:')) {
                await this.db.delete(key);
            }
        }

        // Restore backup data
        for (const [key, value] of Object.entries(backup.data)) {
            if (!key.startsWith('backup:')) {
                await this.db.set(key, value);
            }
        }

        return true;
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
                error: error.message
            };
        }
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
}

module.exports = DatabaseManager;
