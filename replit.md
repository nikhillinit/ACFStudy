# ACF Mastery Platform

## Overview

This is a comprehensive Advanced Corporate Finance (ACF) learning platform designed for Kellogg exam preparation. The application provides an interactive learning experience with diagnostic tests, practice problems, progress tracking, and adaptive learning features. The platform includes 115+ finance problems across five core topics: Time Value of Money, Portfolio Theory, Bond Valuation, Financial Statements, and Derivatives.

## Recent Updates (January 2025)

### Enhanced Security & Analytics Features
- **Production-Ready Authentication**: Integrated enhanced authentication system with JWT tokens, password hashing (bcrypt), and account lockout protection
- **Advanced Security Middleware**: Added helmet for security headers, rate limiting, input sanitization, and HTTPS redirect in production
- **Analytics Dashboard**: Implemented comprehensive learning analytics with progress tracking, topic performance metrics, and study streak calculations
- **Enhanced Database Operations**: Added health checks, backup functionality, and performance monitoring
- **Error Handling**: Comprehensive error tracking and graceful error handling throughout the application

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

- **Primary Database**: PostgreSQL hosted via Neon Database
- **ORM**: Drizzle ORM for type-safe database queries and migrations
- **Session Storage**: PostgreSQL table for user sessions
- **Schema**: Structured tables for users, progress tracking, modules, and learning data

The database schema includes:
- Users table (mandatory for Replit Auth)
- Progress tracking with module completion and scoring
- Sessions table for authentication state
- Modules and user session data

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