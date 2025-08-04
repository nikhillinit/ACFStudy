// Enhanced Express server for Phase 2 - Production Ready
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

// Import Phase 2 components
const DatabaseManager = require('./db');
const { 
    AuthManager, 
    authLimiter, 
    generalLimiter, 
    apiLimiter,
    requireAuth,
    optionalAuth,
    securityHeaders,
    sanitizeInput
} = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize managers
const dbManager = new DatabaseManager();
const authManager = new AuthManager(dbManager);

// Security middleware
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
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-domain.com'] 
        : true,
    credentials: true
}));

// Rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);
app.use(generalLimiter);

// Body parsing with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeInput);

// Static files
app.use(express.static('public'));

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} ${req.method} ${req.url} - ${req.ip}`);
    next();
});

// ========================================
// AUTHENTICATION ROUTES
// ========================================

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        const user = await authManager.register(email, password, name);
        
        // Track registration event
        await dbManager.trackEvent(user.id, 'user_registered', {
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
            error: error.message
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const ipAddress = req.ip;
        
        const result = await authManager.login(email, password, ipAddress);
        
        // Track login event
        await dbManager.trackEvent(result.user.id, 'user_login', {
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
            error: error.message
        });
    }
});

app.post('/api/auth/logout', requireAuth(authManager), async (req, res) => {
    try {
        const token = req.headers.authorization;
        await authManager.logout(token);
        
        // Track logout event
        await dbManager.trackEvent(req.user.id, 'user_logout', {});
        
        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            error: 'Logout failed'
        });
    }
});

app.get('/api/auth/me', requireAuth(authManager), async (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

// ========================================
// PROGRESS & LEARNING ROUTES
// ========================================

app.post('/api/progress/save', requireAuth(authManager), async (req, res) => {
    try {
        const { topic, results } = req.body;
        const userId = req.user.id;
        
        if (!topic || !results || !Array.isArray(results)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid progress data'
            });
        }
        
        const updatedProgress = await dbManager.updateTopicProgress(userId, topic, results);
        
        // Track learning session
        await dbManager.trackEvent(userId, 'learning_session_completed', {
            topic,
            problemsAttempted: results.length,
            correctAnswers: results.filter(r => r.correct).length,
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

app.get('/api/progress', requireAuth(authManager), async (req, res) => {
    try {
        const userId = req.user.id;
        const progress = await dbManager.getProgress(userId);
        
        res.json({
            success: true,
            progress: progress || {}
        });
    } catch (error) {
        console.error('Progress fetch error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch progress'
        });
    }
});

// ========================================
// ANALYTICS ROUTES
// ========================================

app.get('/api/analytics/dashboard', requireAuth(authManager), async (req, res) => {
    try {
        const userId = req.user.id;
        const progress = await dbManager.getProgress(userId) || {};
        
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
        
        const topicStats = {};
        
        Object.entries(problemCounts).forEach(([topic, count]) => {
            const topicProgress = progress[topic] || { completed: [], accuracy: 0 };
            const completed = topicProgress.completed.length;
            
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
        const recentEvents = await dbManager.getAnalytics(userId);
        const lastWeekEvents = recentEvents.filter(event => {
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

app.get('/api/analytics/performance', requireAuth(authManager), async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;
        
        const events = await dbManager.getAnalytics(userId, startDate, endDate);
        const learningEvents = events.filter(e => e.type === 'learning_session_completed');
        
        // Calculate performance trends
        const performanceData = learningEvents.map(event => ({
            date: event.timestamp.split('T')[0],
            topic: event.topic,
            accuracy: Math.round(event.accuracy * 100),
            problemsAttempted: event.problemsAttempted,
            correctAnswers: event.correctAnswers
        }));
        
        res.json({
            success: true,
            performance: performanceData
        });
    } catch (error) {
        console.error('Performance analytics error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load performance data'
        });
    }
});

// ========================================
// CONTENT MANAGEMENT ROUTES
// ========================================

app.get('/api/modules', optionalAuth(authManager), async (req, res) => {
    const modules = [
        {
            id: 'tvm',
            name: 'Time Value of Money',
            description: 'Master present value, future value, and annuity calculations',
            problemCount: 25,
            difficulty: 'Beginner',
            concepts: ['Present Value', 'Future Value', 'Annuities', 'NPV', 'IRR']
        },
        {
            id: 'portfolio',
            name: 'Portfolio Theory',
            description: 'Learn CAPM, risk, return, and diversification concepts',
            problemCount: 25,
            difficulty: 'Intermediate',
            concepts: ['CAPM', 'Beta', 'Diversification', 'Efficient Frontier', 'Sharpe Ratio']
        },
        {
            id: 'bonds',
            name: 'Bond Valuation',
            description: 'Understand bond pricing, yields, and duration',
            problemCount: 25,
            difficulty: 'Intermediate',
            concepts: ['Bond Pricing', 'YTM', 'Duration', 'Convexity', 'Credit Risk']
        },
        {
            id: 'financial',
            name: 'Financial Statements',
            description: 'Analyze balance sheets and income statements',
            problemCount: 15,
            difficulty: 'Beginner',
            concepts: ['Balance Sheet', 'Income Statement', 'Cash Flow', 'Ratios']
        },
        {
            id: 'derivatives',
            name: 'Derivatives',
            description: 'Options, futures, and forward contracts',
            problemCount: 25,
            difficulty: 'Advanced',
            concepts: ['Options', 'Futures', 'Forwards', 'Black-Scholes', 'Greeks']
        }
    ];
    
    // Add user progress if authenticated
    if (req.user) {
        const progress = await dbManager.getProgress(req.user.id) || {};
        modules.forEach(module => {
            const topicName = getTopicName(module.id);
            const topicProgress = progress[topicName] || { completed: [], accuracy: 0 };
            module.userProgress = {
                completed: topicProgress.completed.length,
                accuracy: Math.round(topicProgress.accuracy * 100)
            };
        });
    }
    
    res.json({
        success: true,
        modules
    });
});

// ========================================
// ADMIN ROUTES
// ========================================

app.get('/api/admin/backup', async (req, res) => {
    // In production, add admin auth check
    try {
        const backup = await dbManager.createBackup();
        res.json({
            success: true,
            backup: {
                timestamp: backup.timestamp,
                recordCount: Object.keys(backup.data).length
            }
        });
    } catch (error) {
        console.error('Backup error:', error);
        res.status(500).json({
            success: false,
            error: 'Backup failed'
        });
    }
});

app.get('/api/admin/stats', async (req, res) => {
    try {
        const health = await dbManager.healthCheck();
        res.json({
            success: true,
            ...health
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get stats'
        });
    }
});

// ========================================
// HEALTH & MONITORING
// ========================================

app.get('/api/health', async (req, res) => {
    try {
        const health = await dbManager.healthCheck();
        const status = health.status === 'healthy' ? 200 : 503;
        
        res.status(status).json({
            success: health.status === 'healthy',
            ...health,
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            version: process.env.npm_package_version || '1.0.0'
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            status: 'unhealthy',
            error: error.message
        });
    }
});

// ========================================
// SERVE FRONTEND
// ========================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// ========================================
// ERROR HANDLING
// ========================================

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    
    // Track error
    if (req.user) {
        dbManager.trackEvent(req.user.id, 'server_error', {
            error: err.message,
            stack: err.stack,
            url: req.url,
            method: req.method
        }).catch(console.error);
    }
    
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

function getTopicName(moduleId) {
    const mapping = {
        'tvm': 'Time Value of Money',
        'portfolio': 'Portfolio Theory',
        'bonds': 'Bond Valuation',
        'financial': 'Financial Statements',
        'derivatives': 'Derivatives'
    };
    return mapping[moduleId] || moduleId;
}

function calculateStudyStreak(events) {
    // Simplified streak calculation
    const learningDays = new Set();
    events.forEach(event => {
        if (event.type === 'learning_session_completed') {
            learningDays.add(event.timestamp.split('T')[0]);
        }
    });
    
    // Calculate consecutive days (simplified)
    return Math.min(learningDays.size, 7); // Cap at 7 for now
}

// ========================================
// SERVER STARTUP
// ========================================

app.listen(PORT, async () => {
    console.log(`🚀 ACF Mastery Platform (Enhanced) running on port ${PORT}`);
    console.log(`📚 Visit http://localhost:${PORT} to start learning!`);
    console.log(`🔧 API Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📊 Admin Stats: http://localhost:${PORT}/api/admin/stats`);
    
    // Perform health check on startup
    try {
        const health = await dbManager.healthCheck();
        console.log(`💾 Database: ${health.status} (${health.totalRecords} records)`);
    } catch (error) {
        console.error('❌ Database health check failed:', error.message);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully');
    process.exit(0);
});

module.exports = app;
