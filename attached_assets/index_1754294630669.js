const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Simple in-memory storage (Replit agent will replace with Replit DB)
let users = new Map();
let progress = new Map();
let sessions = new Map();

// Helper function to generate simple IDs
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Authentication endpoints
app.post('/api/auth/register', (req, res) => {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }
    
    if (users.has(email)) {
        return res.status(409).json({ error: 'User already exists' });
    }
    
    const userId = generateId();
    const user = {
        id: userId,
        email,
        name: name || email.split('@')[0],
        created: new Date().toISOString(),
        passwordHash: password // In real app, this would be hashed
    };
    
    users.set(email, user);
    
    // Initialize progress
    progress.set(userId, {
        'Time Value of Money': { completed: [], accuracy: 0 },
        'Portfolio Theory': { completed: [], accuracy: 0 },
        'Bond Valuation': { completed: [], accuracy: 0 },
        'Financial Statements': { completed: [], accuracy: 0 },
        'Derivatives': { completed: [], accuracy: 0 }
    });
    
    res.json({ 
        success: true, 
        user: { id: userId, email, name: user.name }
    });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = users.get(email);
    if (!user || user.passwordHash !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = generateId();
    sessions.set(token, {
        userId: user.id,
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    });
    
    res.json({ 
        success: true, 
        token,
        user: { id: user.id, email: user.email, name: user.name }
    });
});

app.get('/api/auth/check', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    const session = sessions.get(token);
    if (!session || session.expires < Date.now()) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    const user = Array.from(users.values()).find(u => u.id === session.userId);
    res.json({ 
        success: true, 
        user: { id: user.id, email: user.email, name: user.name }
    });
});

// Progress endpoints
app.post('/api/progress/save', (req, res) => {
    const { userId, topic, results } = req.body;
    
    if (!userId || !topic || !results) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    let userProgress = progress.get(userId) || {};
    
    if (!userProgress[topic]) {
        userProgress[topic] = { completed: [], accuracy: 0 };
    }
    
    // Update completed problems
    results.forEach(result => {
        if (result.correct && !userProgress[topic].completed.includes(result.problemId)) {
            userProgress[topic].completed.push(result.problemId);
        }
    });
    
    // Calculate accuracy
    const totalAttempts = results.length;
    const correctAttempts = results.filter(r => r.correct).length;
    userProgress[topic].accuracy = correctAttempts / totalAttempts;
    
    progress.set(userId, userProgress);
    
    res.json({ success: true, progress: userProgress[topic] });
});

app.get('/api/progress/:userId', (req, res) => {
    const { userId } = req.params;
    const userProgress = progress.get(userId) || {};
    
    res.json({ success: true, progress: userProgress });
});

// Dashboard data endpoint
app.get('/api/user/dashboard/:userId', (req, res) => {
    const { userId } = req.params;
    const userProgress = progress.get(userId) || {};
    
    let totalCompleted = 0;
    let totalProblems = 0;
    
    // Calculate totals (simplified - real app would load from problem database)
    const problemCounts = {
        'Time Value of Money': 25,
        'Portfolio Theory': 25,
        'Bond Valuation': 25,
        'Financial Statements': 15,
        'Derivatives': 25
    };
    
    Object.keys(problemCounts).forEach(topic => {
        const completed = userProgress[topic]?.completed?.length || 0;
        totalCompleted += completed;
        totalProblems += problemCounts[topic];
    });
    
    const overallPercentage = totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0;
    
    res.json({
        success: true,
        dashboard: {
            overallScore: overallPercentage,
            problemsSolved: totalCompleted,
            studyStreak: 1, // Simplified
            topicProgress: userProgress
        }
    });
});

// Content endpoints
app.get('/api/modules', (req, res) => {
    const modules = [
        {
            id: 'tvm',
            name: 'Time Value of Money',
            description: 'Master present value, future value, and annuity calculations',
            problemCount: 25,
            difficulty: 'Beginner'
        },
        {
            id: 'portfolio',
            name: 'Portfolio Theory',
            description: 'Learn CAPM, risk, return, and diversification concepts',
            problemCount: 25,
            difficulty: 'Intermediate'
        },
        {
            id: 'bonds',
            name: 'Bond Valuation',
            description: 'Understand bond pricing, yields, and duration',
            problemCount: 25,
            difficulty: 'Intermediate'
        },
        {
            id: 'financial',
            name: 'Financial Statements',
            description: 'Analyze balance sheets and income statements',
            problemCount: 15,
            difficulty: 'Beginner'
        },
        {
            id: 'derivatives',
            name: 'Derivatives',
            description: 'Options, futures, and forward contracts',
            problemCount: 25,
            difficulty: 'Advanced'
        }
    ];
    
    res.json({ success: true, modules });
});

app.get('/api/questions/:topic', (req, res) => {
    const { topic } = req.params;
    
    // This is a placeholder - real implementation would query problem database
    // For now, return success so frontend can use its local problem bank
    res.json({ 
        success: true, 
        message: 'Using frontend problem bank',
        topic: topic
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        users: users.size,
        sessions: sessions.size
    });
});

// Serve the main app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🎯 ACF Mastery Platform running on port ${PORT}`);
    console.log(`📚 Visit http://localhost:${PORT} to start learning!`);
    console.log(`🔧 API Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
