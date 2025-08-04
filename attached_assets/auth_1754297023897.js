// Enhanced authentication and security middleware for Phase 2
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

class AuthManager {
    constructor(dbManager) {
        this.db = dbManager;
        this.jwtSecret = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
        this.saltRounds = 12;
    }

    // Password hashing utilities
    async hashPassword(password) {
        return await bcrypt.hash(password, this.saltRounds);
    }

    async verifyPassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    // JWT utilities
    generateToken(payload) {
        return jwt.sign(payload, this.jwtSecret, {
            expiresIn: '7d',
            issuer: 'acf-mastery',
            audience: 'acf-students'
        });
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (error) {
            return null;
        }
    }

    // Enhanced user registration
    async register(email, password, name = null) {
        // Input validation
        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email format');
        }

        if (!this.isValidPassword(password)) {
            throw new Error('Password must be at least 8 characters with uppercase, lowercase, and number');
        }

        // Check if user exists
        const existingUser = await this.db.getUser(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Create user
        const userId = this.generateUserId();
        const hashedPassword = await this.hashPassword(password);
        
        const userData = {
            id: userId,
            email: email.toLowerCase(),
            name: name || email.split('@')[0],
            passwordHash: hashedPassword,
            emailVerified: false,
            loginAttempts: 0,
            lockoutUntil: null,
            lastPasswordChange: new Date().toISOString()
        };

        await this.db.createUser(email.toLowerCase(), userData);

        // Initialize progress
        const initialProgress = {
            'Time Value of Money': { completed: [], accuracy: 0, attempts: 0 },
            'Portfolio Theory': { completed: [], accuracy: 0, attempts: 0 },
            'Bond Valuation': { completed: [], accuracy: 0, attempts: 0 },
            'Financial Statements': { completed: [], accuracy: 0, attempts: 0 },
            'Derivatives': { completed: [], accuracy: 0, attempts: 0 }
        };
        await this.db.saveProgress(userId, initialProgress);

        return {
            id: userId,
            email: userData.email,
            name: userData.name
        };
    }

    // Enhanced user login
    async login(email, password, ipAddress = null) {
        const user = await this.db.getUser(email.toLowerCase());
        
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Check account lockout
        if (user.lockoutUntil && new Date() < new Date(user.lockoutUntil)) {
            const lockoutEnd = new Date(user.lockoutUntil);
            throw new Error(`Account locked until ${lockoutEnd.toLocaleString()}`);
        }

        // Verify password
        const isValidPassword = await this.verifyPassword(password, user.passwordHash);
        
        if (!isValidPassword) {
            // Increment login attempts
            const attempts = (user.loginAttempts || 0) + 1;
            const updates = { loginAttempts: attempts };
            
            // Lock account after 5 failed attempts
            if (attempts >= 5) {
                updates.lockoutUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes
            }
            
            await this.db.updateUser(email.toLowerCase(), updates);
            throw new Error('Invalid credentials');
        }

        // Reset login attempts on successful login
        await this.db.updateUser(email.toLowerCase(), {
            loginAttempts: 0,
            lockoutUntil: null,
            lastLogin: new Date().toISOString(),
            lastLoginIP: ipAddress
        });

        // Generate JWT token
        const token = this.generateToken({
            userId: user.id,
            email: user.email,
            name: user.name
        });

        // Create session
        await this.db.createSession(token, {
            userId: user.id,
            ipAddress,
            userAgent: null // Will be set by middleware
        });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        };
    }

    // Token verification middleware
    async verifyAuthToken(token) {
        if (!token) {
            return null;
        }

        // Clean Bearer prefix if present
        token = token.replace('Bearer ', '');

        // Verify JWT
        const decoded = this.verifyToken(token);
        if (!decoded) {
            return null;
        }

        // Check session exists and is valid
        const session = await this.db.getSession(token);
        if (!session) {
            return null;
        }

        // Get current user data
        const user = await this.db.getUserById(decoded.userId);
        if (!user) {
            return null;
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            session
        };
    }

    // Logout
    async logout(token) {
        if (token) {
            token = token.replace('Bearer ', '');
            await this.db.deleteSession(token);
        }
        return true;
    }

    // Input validation helpers
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPassword(password) {
        // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }

    generateUserId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Rate limiting configurations
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
        error: 'Too many authentication attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
        error: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // 30 API calls per minute
    message: {
        error: 'API rate limit exceeded, please slow down.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware functions
function requireAuth(authManager) {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization;
            const authResult = await authManager.verifyAuthToken(token);
            
            if (!authResult) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            
            req.user = authResult.user;
            req.session = authResult.session;
            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            res.status(401).json({ error: 'Invalid authentication' });
        }
    };
}

function optionalAuth(authManager) {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization;
            if (token) {
                const authResult = await authManager.verifyAuthToken(token);
                if (authResult) {
                    req.user = authResult.user;
                    req.session = authResult.session;
                }
            }
            next();
        } catch (error) {
            // Continue without auth for optional auth
            next();
        }
    };
}

// Security headers middleware
function securityHeaders(req, res, next) {
    // HTTPS redirect in production
    if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
        return res.redirect(`https://${req.header('host')}${req.url}`);
    }

    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' cdn.jsdelivr.net; " +
        "style-src 'self' 'unsafe-inline' cdn.jsdelivr.net; " +
        "font-src 'self' cdn.jsdelivr.net; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self';"
    );
    
    next();
}

// Input sanitization middleware
function sanitizeInput(req, res, next) {
    // Basic XSS protection - strip HTML tags from text inputs
    function sanitize(obj) {
        if (typeof obj === 'string') {
            return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                     .replace(/<[^>]*>/g, '')
                     .trim();
        }
        if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
                obj[key] = sanitize(obj[key]);
            }
        }
        return obj;
    }

    if (req.body) {
        req.body = sanitize(req.body);
    }
    if (req.query) {
        req.query = sanitize(req.query);
    }
    
    next();
}

module.exports = {
    AuthManager,
    authLimiter,
    generalLimiter,
    apiLimiter,
    requireAuth,
    optionalAuth,
    securityHeaders,
    sanitizeInput
};
