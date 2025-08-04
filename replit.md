# ACF Mastery Platform

## Overview

This is a comprehensive Advanced Corporate Finance (ACF) learning platform designed for Kellogg exam preparation. The application provides an interactive learning experience with diagnostic tests, practice problems, progress tracking, and adaptive learning features. The platform includes 115+ finance problems across five core topics: Time Value of Money, Portfolio Theory, Bond Valuation, Financial Statements, and Derivatives.

## Recent Updates (January 2025)

### Production Readiness Improvements (Latest - January 2025)
- **Technical Review Implementation**: Addressed comprehensive technical review findings for production readiness
- **Documentation Enhancement**: Added complete README.md with setup instructions, environment variables table, and project structure
- **Environment Configuration**: Created `.env.example` with all required environment variables and their descriptions
- **Cross-Platform Compatibility**: Added cross-env package for Windows/Unix script compatibility
- **Structured Logging**: Implemented Pino logger replacing console.log calls for better production logging
- **Node.js Version Specification**: Added `.nvmrc` and engines specification for Node.js 18+ requirement
- **Security Improvements**: Enhanced environment variable documentation and security best practices
- **Build Pipeline Optimization**: Improved build scripts for better development and production workflows

### Complete Replit Authentication Integration (Latest - January 2025)
- **Full Replit Auth System**: Successfully implemented complete OpenID Connect authentication with Replit's native OAuth
- **Landing Page Creation**: Built professional landing page for unauthenticated users showcasing platform features
- **Session Management**: Configured PostgreSQL session storage with automatic user creation and profile management
- **Protected Routes**: All platform features now require authentication with seamless login/logout flow
- **Rate Limiting Resolution**: Fixed development environment rate limiting issues for smooth local testing
- **Authentication Hooks**: Created useAuth React hook for frontend authentication state management
- **Security Enhancement**: Added input sanitization and security headers while maintaining development usability

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

### Video Learning System Integration (Complete - January 2025)
- **MIT Finance Video Library**: Integrated complete MIT 15.401 Finance Theory video library with 11 lectures (18+ hours content)
- **Interactive Video Player**: Built React-based video player with YouTube integration, progress tracking, and playlist navigation
- **Curated Learning Paths**: Created specialized playlists including ACF Exam Prep sequence, Time Value of Money, Portfolio Management, and Derivatives
- **Progress Tracking System**: Implemented video watch progress with completion tracking and user-specific learning analytics
- **Interactive Content Integration**: Added Time Value of Money interactive learning module with step-by-step tutorials
- **Server API Integration**: Created REST endpoints for video library, learning content, and progress tracking
- **Home Dashboard Integration**: Added "Video Lectures" quick action button for seamless navigation to learning modules
- **Mobile-Responsive Design**: Ensured complete mobile compatibility for video learning experience
- **Demo System**: Created standalone demo.html showcasing the complete learning system functionality

### Native Mobile App Development (Complete - January 2025)
- **React Native iOS App**: Built complete native mobile app using Expo framework optimized for iPhone
- **Native Navigation**: Implemented bottom tab navigation with Home, Learning, Practice, and Profile sections
- **Video Learning Mobile**: Full MIT video library integration with native video player and progress tracking
- **Mobile Practice System**: Complete practice problem interface with timed quizzes and instant feedback
- **Authentication Integration**: Secure login system with token-based auth and biometric support ready
- **Material Design UI**: Modern interface using React Native Paper with custom theme system
- **Offline Capabilities**: Prepared infrastructure for offline content download and study
- **Build System**: Configured EAS build system for TestFlight and App Store distribution
- **API Integration**: Complete backend connectivity with all existing web platform features
- **Production Ready**: Full setup for iOS development, testing, and App Store deployment

### ACF Master Playbook Integration (Complete - January 2025)
- **Comprehensive Content Expansion**: Created detailed learning modules from ACF Master Playbook PDF content
- **Enhanced Module System**: Built structured learning components with 6-tab interface (Overview, Formulas, Excel Tips, Examples, Videos, Quick Reference)
- **Formula Library**: Integrated 15+ key formulas across 5 core topics with mathematical formulas and Excel functions
- **Excel "Stealth Mode" Tips**: Added productivity shortcuts and exam-specific Excel techniques
- **Mini-Model Examples**: Created step-by-step worked examples with Excel formulas and explanations
- **Practice Problem Integration**: Embedded practice problems with timing estimates and detailed solutions
- **Video Resource Library**: Curated Khan Academy and educational video resources for each topic
- **Quick Reference System**: Built concept maps and rule summaries for rapid review
- **New Learning Page**: Replaced existing learning page with enhanced ACF Master content as primary interface
- **Progressive Module Navigation**: Created smooth transition between module overview and detailed content study

### Enhanced Interactive Learning Tools (Latest - January 2025)
- **Financial Statement Classification Game**: Timed classification challenge with 20 accounting items, 5-minute timer, and instant feedback
- **ACF Exam Simulator**: Full placement exam simulation with 10 questions across all competency areas and 2-hour time limit
- **Portfolio Calculator**: Interactive risk-return calculator with correlation analysis, preset portfolios, and practice problems
- **Real-Time Exam Performance Tracker**: Live analytics during exam with competency tracking, momentum analysis, and predictive scoring
- **Interactive Exam Simulation**: Real-time performance tracking with question-by-question analytics, live competency scoring, and predictive feedback
- **Performance Analytics Dashboard**: Comprehensive real-time metrics including accuracy trends, pace monitoring, strength/weakness identification
- **Modal-Based Interface**: Seamless overlay system for launching interactive tools from practice challenges tab
- **Performance Tracking**: Integrated scoring, timing, and detailed solution explanations for all interactive components
- **Mobile-Responsive Design**: Fully responsive interactive tools that work across all device sizes
- **Gamified Learning**: Speed challenges, accuracy targets, and achievement-based feedback systems

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