// Enhanced authentication middleware for ACF Learning Platform
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { storage } from './storage.js';
import type { Request, Response, NextFunction } from 'express';

export class EnhancedAuthManager {
    private jwtSecret: string;
    private saltRounds: number = 12;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'acf-learning-platform-secret-key';
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

// Rate limiting configurations
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
        error: 'Too many authentication attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
        error: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // 30 API calls per minute
    message: {
        error: 'API rate limit exceeded, please slow down.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Security headers middleware
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
    // HTTPS redirect in production
    if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
        return res.redirect(`https://${req.header('host')}${req.url}`);
    }

    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
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

// Enhanced middleware that works with existing Replit Auth
export function enhancedAuth(req: Request, res: Response, next: NextFunction) {
    // First check for Replit Auth (existing system)
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    // Fallback to JWT if no Replit Auth
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
        const authManager = new EnhancedAuthManager();
        const decoded = authManager.verifyToken(token);
        if (decoded) {
            (req as any).user = decoded;
            return next();
        }
    }

    return res.status(401).json({ error: 'Authentication required' });
}

export const enhancedAuthManager = new EnhancedAuthManager();