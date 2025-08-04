// Enhanced authentication system for Replit deployment
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import rateLimit from 'express-rate-limit'; // Disabled for development
import type { Request, Response, NextFunction } from 'express';
import { replitDbManager } from './replit-db';

export class ReplitAuthManager {
    private jwtSecret: string;
    private saltRounds: number = 12;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'ACFMastery2024SecureTokenKey';
    }

    // Password hashing utilities
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }

    async verifyPassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    // JWT utilities
    generateToken(payload: any): string {
        return jwt.sign(payload, this.jwtSecret, {
            expiresIn: '7d',
            issuer: 'acf-mastery',
            audience: 'acf-students'
        });
    }

    verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (error) {
            return null;
        }
    }

    // Enhanced user registration
    async register(email: string, password: string, name: string | null = null) {
        // Input validation
        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email format');
        }

        if (!this.isValidPassword(password)) {
            throw new Error('Password must be at least 8 characters with uppercase, lowercase, and number');
        }

        // Check if user exists
        const existingUser = await replitDbManager.getUser(email);
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

        await replitDbManager.createUser(email.toLowerCase(), userData);

        // Initialize progress
        const initialProgress = {
            'Time Value of Money': { completed: [], accuracy: 0, attempts: 0 },
            'Portfolio Theory': { completed: [], accuracy: 0, attempts: 0 },
            'Bond Valuation': { completed: [], accuracy: 0, attempts: 0 },
            'Financial Statements': { completed: [], accuracy: 0, attempts: 0 },
            'Derivatives': { completed: [], accuracy: 0, attempts: 0 }
        };
        await replitDbManager.saveProgress(userId, initialProgress);

        return {
            id: userId,
            email: userData.email,
            name: userData.name
        };
    }

    // Enhanced user login
    async login(email: string, password: string, ipAddress: string | null = null) {
        const user = await replitDbManager.getUser(email.toLowerCase());
        
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
            const updates: any = { loginAttempts: attempts };
            
            // Lock account after 5 failed attempts
            if (attempts >= 5) {
                updates.lockoutUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes
            }
            
            await replitDbManager.updateUser(email.toLowerCase(), updates);
            throw new Error('Invalid credentials');
        }

        // Reset login attempts on successful login
        await replitDbManager.updateUser(email.toLowerCase(), {
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
        await replitDbManager.createSession(token, {
            userId: user.id,
            ipAddress,
            userAgent: null
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
    async verifyAuthToken(token: string) {
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
        const session = await replitDbManager.getSession(token);
        if (!session) {
            return null;
        }

        // Get current user data
        const user = await replitDbManager.getUserById(decoded.userId);
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

    // Input validation helpers
    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPassword(password: string): boolean {
        // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }

    generateUserId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Rate limiting disabled for development
// All rate limiting has been disabled to prevent authentication issues

// Middleware functions
export function requireAuth(authManager: ReplitAuthManager) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            const authResult = await authManager.verifyAuthToken(token || '');
            
            if (!authResult) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            
            (req as any).user = authResult.user;
            (req as any).session = authResult.session;
            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            res.status(401).json({ error: 'Invalid authentication' });
        }
    };
}

export function optionalAuth(authManager: ReplitAuthManager) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (token) {
                const authResult = await authManager.verifyAuthToken(token);
                if (authResult) {
                    (req as any).user = authResult.user;
                    (req as any).session = authResult.session;
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
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
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
export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
    // Basic XSS protection - strip HTML tags from text inputs
    function sanitize(obj: any): any {
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

export const replitAuthManager = new ReplitAuthManager();