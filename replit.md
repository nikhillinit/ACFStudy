# ACF Mastery Platform

## Overview

This is a comprehensive Advanced Corporate Finance (ACF) learning platform designed for Kellogg exam preparation. The application provides an interactive learning experience with diagnostic tests, practice problems, progress tracking, and adaptive learning features. The platform includes 115+ finance problems across five core topics: Time Value of Money, Portfolio Theory, Bond Valuation, Financial Statements, and Derivatives. The business vision is to provide a robust, AI-enhanced educational tool for mastering corporate finance concepts, with market potential in professional education and exam preparation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with **React** using TypeScript, Shadcn/ui components (based on Radix UI), and Tailwind CSS for styling. State management uses React Query for server state, and local state is handled with React hooks. Wouter is used for client-side routing, and Vite serves as the build tool. The design approach is mobile-first, ensuring responsive design across devices.

### Backend Architecture

The backend follows a **Node.js Express** server architecture. It uses PostgreSQL with Drizzle ORM for type-safe database operations. Replit Auth integration handles authentication via OpenID Connect, with session management configured using Express sessions and PostgreSQL storage. API endpoints are RESTful, returning JSON responses.

### Data Storage Solutions

The primary database is **Replit Database** for native platform integration, storing user progress, analytics, learning data, and session management information. It also manages secure API keys for AI services. The database architecture supports user management with enhanced security (bcrypt, account lockout), detailed progress tracking with analytics and study streaks, and real-time analytics.

### Authentication and Authorization

Authentication is handled by **Replit Auth** using the OpenID Connect protocol. Server-side sessions are managed with PostgreSQL storage. Authorization is implemented with route-level protection via middleware. The system supports automatic user creation and profile management.

### Key Design Patterns

The architecture emphasizes **component composition** for reusable UI elements, **type safety** through end-to-end TypeScript, and **separation of concerns** between client, server, and shared code. It follows a **progressive enhancement** approach and a **responsive design** philosophy with a mobile-first approach.

### Key Features and Implementations

The platform integrates AI services (Claude, OpenAI, Perplexity) for personalized learning experiences including an AI tutor, smart explanations, market context, and practice problem generation. It includes a comprehensive quiz system with detailed explanations, advanced progress tracking with achievements and study streaks, and interactive note-taking. A video learning system is integrated with the MIT Finance video library, and interactive learning tools such as a Financial Statement Classification Game, ACF Exam Simulator, and Portfolio Calculator are available. An AI study companion provides personalized encouragement and feedback. The platform also includes detailed learning modules from the ACF Master Playbook, featuring formulas, Excel tips, examples, videos, and quick references.

## External Dependencies

### Core Infrastructure
- **Neon Database**: PostgreSQL hosting and management (for specific components requiring PostgreSQL)
- **Replit Auth**: User authentication and session management
- **Replit Environment**: Development and hosting platform
- **Replit Database**: Primary database for the application

### AI Services
- **Claude API**
- **OpenAI API**
- **Perplexity API**

### Frontend Libraries
- **React Ecosystem**: React, React DOM, React Query
- **UI Components**: Radix UI, Shadcn/ui, Lucide React (icons)
- **Styling**: Tailwind CSS, class-variance-authority
- **Forms**: React Hook Form, Zod

### Backend Dependencies
- **Database**: Drizzle ORM, PostgreSQL drivers (@neondatabase/serverless)
- **Authentication**: OpenID Client, Passport.js, Express sessions
- **Server**: Express.js, CORS middleware
- **Logging**: Pino

### Development Tools
- **Build System**: Vite
- **Type Checking**: TypeScript
- **Database Tools**: Drizzle Kit