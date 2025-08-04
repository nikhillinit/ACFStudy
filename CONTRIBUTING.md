# Contributing to ACF Mastery Platform

Thank you for your interest in contributing to the ACF Mastery Platform! This guide will help you get started.

## Quick Start for Contributors

1. **Fork and Clone**
   ```bash
   git clone <your-fork-url>
   cd acf-mastery-platform
   ```

2. **Set up Development Environment**
   ```bash
   npm install
   cp .env.example .env
   # Edit .env with your development values
   npm run db:push
   npm run dev
   ```

3. **Make Your Changes**
   - Create a feature branch: `git checkout -b feature/your-feature-name`
   - Follow the coding standards below
   - Test your changes thoroughly

4. **Submit a Pull Request**
   - Commit with clear messages
   - Push to your fork
   - Open a PR with description of changes

## Development Guidelines

### Code Standards

- **TypeScript**: Use strict types, avoid `any`
- **Logging**: Use `logger` from `server/logger.ts`, never `console.log`
- **Error Handling**: Always handle errors gracefully with proper logging
- **Testing**: Add tests for new features (when test framework is added)

### File Structure

```
├── client/                 # React frontend
│   ├── src/components/     # Reusable components
│   ├── src/pages/          # Page components
│   ├── src/hooks/          # Custom hooks
│   └── src/lib/            # Utilities
├── server/                 # Express backend
│   ├── routes.ts           # API routes
│   ├── logger.ts           # Logging utilities
│   └── storage.ts          # Database operations
├── shared/                 # Shared types
└── mobile-app/            # React Native app
```

### Environment Variables

Always add new environment variables to:
1. `.env.example` with description
2. `README.md` environment table
3. Type definitions if needed

### Database Changes

1. Update `shared/schema.ts` with new tables/columns
2. Run `npm run db:push` for development
3. Generate migrations for production: `npm run db:generate`

### UI Components

- Use existing shadcn/ui components when possible
- Follow Tailwind CSS patterns
- Ensure mobile responsiveness
- Add proper TypeScript props

### API Routes

- Use proper HTTP status codes
- Validate inputs with Zod schemas
- Handle errors with structured logging
- Document new endpoints

## Common Tasks

### Adding a New Page

1. Create component in `client/src/pages/`
2. Add route in `client/src/App.tsx`
3. Update navigation if needed

### Adding API Endpoint

1. Add route in `server/routes.ts`
2. Update storage interface if needed
3. Add proper error handling and logging

### Database Schema Changes

1. Modify `shared/schema.ts`
2. Run `npm run db:push` for development
3. Test thoroughly

## Code Review Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] No `console.log` statements left in code
- [ ] Error handling implemented
- [ ] TypeScript types are proper
- [ ] Manual testing completed
- [ ] Documentation updated if needed

### PR Requirements

- Clear description of changes
- Links to related issues
- Screenshots for UI changes
- Breaking change callouts

## Common Issues

### Development Setup

**Database Connection Issues**
- Ensure `DATABASE_URL` is set correctly
- Check database is running and accessible
- Verify credentials

**Build Failures**
- Run `npm run check` to find TypeScript errors
- Ensure all imports are correct
- Check for missing dependencies

**Authentication Issues**
- Verify all auth environment variables are set
- Check Replit Auth configuration
- Test login flow thoroughly

### Coding Standards

**Logging**
```typescript
// ✅ Good
import { logger } from './logger';
logger.info('User logged in', { userId });

// ❌ Bad
console.log('User logged in');
```

**Error Handling**
```typescript
// ✅ Good
try {
  const result = await apiCall();
  return result;
} catch (error) {
  logger.error(error, 'API call failed');
  throw new Error('Failed to process request');
}

// ❌ Bad
const result = await apiCall(); // No error handling
```

**TypeScript**
```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
}

// ❌ Bad
const user: any = getUserData();
```

## Getting Help

- Check existing issues and documentation
- Ask questions in discussions
- Reach out to maintainers for guidance

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.