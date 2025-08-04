# ACF Mastery Platform

A comprehensive Advanced Corporate Finance (ACF) learning platform designed for Kellogg exam preparation. Features AI-powered tutoring, adaptive learning, diagnostic testing, and personalized study companions.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (recommended: use nvm with `.nvmrc`)
- PostgreSQL database or Replit Database
- API keys for AI services (OpenAI, Claude, Perplexity)

### One-Line Setup
```bash
npm install && cp .env.example .env && npm run db:push && npm run dev
```

### Manual Setup
1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd acf-mastery-platform
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Set up database:**
   ```bash
   npm run db:push
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 📋 Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/acf` |
| `SESSION_SECRET` | Yes | Session encryption key (32+ chars) | `your-secure-session-secret-here` |
| `JWT_SECRET` | Yes | JWT signing key (32+ chars) | `your-secure-jwt-secret-here` |
| `OPENAI_API_KEY` | Yes | OpenAI API key for AI features | `sk-...` |
| `CLAUDE_API_KEY` | Optional | Anthropic Claude API key | `sk-ant-...` |
| `PERPLEXITY_API_KEY` | Optional | Perplexity API key | `pplx-...` |
| `ISSUER_URL` | Yes | OIDC issuer URL for auth | `https://replit.com/oidc` |
| `NODE_ENV` | No | Environment mode | `development` or `production` |

## 🏗️ Project Structure

```
├── client/                 # React frontend (TypeScript)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configurations
├── server/                 # Express.js backend
│   ├── routes.ts           # API routes
│   ├── auth.ts             # Authentication middleware
│   └── storage.ts          # Database operations
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema (Drizzle ORM)
├── learning-modules/       # Course content and materials
├── mobile-app/            # React Native mobile application
└── migrations/            # Database migrations
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:push` | Push schema changes to database |
| `npm run db:generate` | Generate database migrations |
| `npm run db:migrate` | Run database migrations |
| `npm run check` | Type check with TypeScript |
| `npm run lint` | Lint code with ESLint |

## 🎓 Key Features

### Learning Platform
- **Interactive Practice Problems**: 115+ problems across 5 core topics
- **AI-Powered Tutoring**: Personalized explanations and study guidance
- **Diagnostic Testing**: Placement exams and skill assessment
- **Progress Tracking**: Detailed analytics and performance monitoring
- **Study Companion**: AI companion with 4 personality types

### Technical Features
- **Authentication**: Secure Replit Auth integration with OpenID Connect
- **Real-time Updates**: Live progress tracking and notifications
- **Responsive Design**: Mobile-friendly interface with React Native app
- **Offline Support**: Local storage progress tracking
- **API Integration**: Multiple AI services for enhanced learning

## 📱 Mobile Application

The platform includes a React Native mobile app for iOS and Android:

```bash
cd mobile-app
npm install
npm run expo:start
```

See `MOBILE_APP_SETUP.md` for detailed mobile development instructions.

## 🔧 Development

### Type Checking
```bash
npm run check
```

### Database Operations
```bash
# Push schema changes (development)
npm run db:push

# Generate migrations (production)
npm run db:generate
npm run db:migrate
```

### Building for Production
```bash
npm run build
npm start
```

## 🚀 Deployment

### Replit Deployment
The platform is optimized for Replit deployment:
1. Import project to Replit
2. Set environment variables in Secrets
3. Run `npm run db:push`
4. Deploy using Replit Deployments

### Manual Deployment
1. Set production environment variables
2. Run `npm run build`
3. Start with `npm start`
4. Configure reverse proxy (nginx) if needed

## 🔒 Security

- Session-based authentication with secure cookies
- JWT tokens for API authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection
- Security headers with Helmet.js

## 📊 Performance

- Vite for fast development builds
- Code splitting with dynamic imports
- Optimized database queries with Drizzle ORM
- Cached API responses with React Query
- Compressed assets in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `npm install`
4. Set up environment: `cp .env.example .env`
5. Run tests: `npm run test`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check existing GitHub issues
2. Review the documentation
3. Contact the development team

## 🔄 Recent Updates

See `replit.md` for detailed changelog and recent platform updates.