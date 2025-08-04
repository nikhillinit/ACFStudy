# ACF Mastery Platform

## Overview

This is a comprehensive Advanced Corporate Finance (ACF) learning platform designed for Kellogg exam preparation. The application provides an interactive learning experience with diagnostic tests, practice problems, progress tracking, and adaptive learning features. The platform includes 115+ finance problems across five core topics: Time Value of Money, Portfolio Theory, Bond Valuation, Financial Statements, and Derivatives.

## Recent Updates (January 2025)

### AI-Powered Platform with Replit Native Integration
- **AI Services Integration**: Successfully integrated Claude, OpenAI, and Perplexity APIs for personalized learning experiences
- **Replit Database Migration**: Migrated from PostgreSQL to native Replit Database for optimal platform deployment and performance
- **AI-Enhanced Features**: Added AI tutor, smart explanations, market context, and practice problem generation
- **Production-Ready Authentication**: Implemented enhanced Replit-native authentication with JWT tokens, bcrypt password hashing, and account lockout protection
- **Advanced Security Middleware**: Added helmet security headers, rate limiting, input sanitization, and comprehensive error handling
- **Analytics Dashboard**: Built comprehensive learning analytics with real-time progress tracking, topic performance metrics, and study streak calculations
- **Comprehensive Platform**: Completed 5 learning modules with 115+ practice problems and AI-enhanced explanations
- **Personalized Learning Paths**: Implemented AI-driven recommendation system with adaptive learning features

### Enhanced Platform Integration (Latest)
- **Course Platform Integration**: Successfully extracted and integrated advanced React components from comprehensive course platform source
- **Enhanced Quiz System**: Integrated sophisticated quiz component with detailed explanations, progress tracking, and performance feedback
- **Advanced Progress Tracker**: Added comprehensive progress tracking with achievements, study streaks, module-level analytics, and milestone celebrations
- **Interactive Note-Taking**: Integrated full-featured note-taking system with tagging, search, and lesson-specific note organization
- **Enriched Learning Components**: Enhanced practice page with 4-tab interface including dedicated Study Notes section
- **Analytics Dashboard**: Completed integration of enhanced progress tracker in home analytics tab with real-time performance metrics
- **AI Study Companion**: Implemented personalized AI study companion with encouraging micro-interactions, adaptive feedback, and customizable settings
- **Micro-Interactions System**: Added celebration system with achievement recognition, progress milestones, and contextual encouragement
- **Companion Settings**: Created comprehensive settings panel for users to customize their AI companion experience
- **Mobile-Friendly Design**: Maintained comprehensive responsive design throughout all integrated components

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with **React** using TypeScript and follows a modern component-based architecture:

- **Framework**: React with TypeScript for type safety
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Query for server state, local state with React hooks
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and bundling

### Backend Architecture

The backend follows a **Node.js Express** server architecture:

- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth integration with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints with JSON responses

### Data Storage Solutions

- **Primary Database**: Replit Database for native platform integration
- **Session Management**: Replit Database with token-based authentication
- **Progress Tracking**: User progress, analytics, and learning data stored in Replit Database
- **AI Integration**: Secure API key management for Claude, OpenAI, and Perplexity services

The database architecture includes:
- User management with enhanced security (bcrypt, account lockout)
- Progress tracking with detailed analytics and study streaks
- Session management with JWT tokens and expiration
- AI service integration with comprehensive error handling
- Real-time analytics and performance monitoring

### Authentication and Authorization

- **Provider**: Replit Auth using OpenID Connect protocol
- **Session Management**: Server-side sessions with PostgreSQL storage
- **Authorization**: Route-level protection with middleware
- **User Data**: Automatic user creation and profile management

### Key Design Patterns

- **Component Composition**: Reusable UI components with consistent API
- **Type Safety**: End-to-end TypeScript for compile-time error prevention
- **Separation of Concerns**: Clear separation between client, server, and shared code
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## External Dependencies

### Core Infrastructure
- **Neon Database**: PostgreSQL hosting and management
- **Replit Auth**: User authentication and session management
- **Replit Environment**: Development and hosting platform

### Frontend Libraries
- **React Ecosystem**: React, React DOM, React Query for data fetching
- **UI Components**: Radix UI primitives, Shadcn/ui component library
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **Icons**: Lucide React icon library
- **Forms**: React Hook Form with Zod validation

### Backend Dependencies
- **Database**: Drizzle ORM, PostgreSQL drivers (@neondatabase/serverless)
- **Authentication**: OpenID Client, Passport.js, session management
- **Server**: Express.js, CORS middleware, session storage
- **Development**: TypeScript, TSX for development server, ESBuild for production

### Development Tools
- **Build System**: Vite with React plugin and runtime error overlay
- **Type Checking**: TypeScript with strict configuration
- **Database Tools**: Drizzle Kit for migrations and schema management
- **Development**: Replit-specific plugins for enhanced development experience

The application uses a monorepo structure with shared schemas and types between client and server, ensuring consistency across the full stack.