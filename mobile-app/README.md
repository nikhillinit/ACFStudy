# ACF Mastery Mobile App

A React Native mobile application for Advanced Corporate Finance learning, built with Expo and compatible with iPhone.

## Features

- 📱 **Native iOS Experience**: Optimized for iPhone with native navigation and gestures
- 🎥 **MIT Video Lectures**: Access to 18+ hours of MIT 15.401 Finance Theory lectures
- 📚 **Practice Problems**: 115+ curated ACF practice problems with detailed explanations
- 🤖 **AI-Powered Learning**: Intelligent tutoring and personalized explanations
- 📊 **Progress Tracking**: Comprehensive analytics and achievement system
- 🔒 **Secure Authentication**: Token-based authentication with secure storage
- 🎨 **Modern UI**: Beautiful, accessible interface with Material Design 3
- 📱 **Offline Ready**: Download content for offline studying (coming soon)

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **UI Library**: React Native Paper (Material Design 3)
- **Navigation**: React Navigation v6
- **State Management**: TanStack Query (React Query)
- **Authentication**: Expo Secure Store
- **Video**: Expo AV with YouTube integration
- **Styling**: StyleSheet with theme system

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (for development) or physical iPhone
- Expo Go app (for testing on device)

### Installation

1. **Clone and navigate to mobile app directory**:
   ```bash
   cd mobile-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```

4. **Run on iOS**:
   - Press `i` to open iOS Simulator
   - Or scan QR code with Camera app on iPhone (requires Expo Go)

### Building for iOS

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Configure EAS project**:
   ```bash
   eas login
   eas build:configure
   ```

3. **Build for iOS**:
   ```bash
   # Development build
   eas build --profile development --platform ios
   
   # Production build
   eas build --profile production --platform ios
   ```

## Project Structure

```
mobile-app/
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/            # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── screens/            # App screens/pages
│   │   ├── HomeScreen.tsx
│   │   ├── LearningScreen.tsx
│   │   ├── PracticeScreen.tsx
│   │   ├── VideoPlayerScreen.tsx
│   │   ├── QuizScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── LoginScreen.tsx
│   ├── services/           # API and external services
│   ├── theme/              # Theme and styling
│   └── utils/              # Utility functions
├── assets/                 # Images, icons, fonts
├── App.tsx                 # Main app component
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Key Features

### Authentication
- Secure login with JWT tokens
- Biometric authentication support (coming soon)
- Demo account for testing

### Learning Modules
- MIT 15.401 Finance Theory video library
- Interactive video player with progress tracking
- Curated learning paths for ACF exam preparation

### Practice System
- 115+ practice problems across 5 core topics
- Timed quizzes with instant feedback
- Detailed explanations for all answers
- Progress tracking and performance analytics

### User Experience
- Bottom tab navigation
- Pull-to-refresh data loading
- Offline content caching
- Dark mode support
- Accessibility optimizations

## API Integration

The mobile app connects to your existing ACF platform backend:

- **Development**: `http://localhost:5000`
- **Production**: `https://your-replit-app.replit.app`

### Supported Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/learning/videos` - Video library
- `GET /api/modules` - Practice modules
- `GET /api/problems` - Practice problems
- `POST /api/learning/progress` - Progress tracking
- `GET /api/analytics/dashboard` - User analytics

## Configuration

### Environment Variables

Create a `.env` file in the mobile-app directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000
EXPO_PUBLIC_API_URL_PROD=https://your-replit-app.replit.app
```

### App Configuration

Edit `app.json` to customize:
- App name and description
- Bundle identifier
- App store metadata
- Permissions and capabilities

## Testing

### Running Tests
```bash
npm test
```

### Testing on Device
1. Install Expo Go from App Store
2. Scan QR code from `expo start`
3. Test all features including video playback

### iOS Simulator Testing
```bash
npx expo start --ios
```

## Deployment

### TestFlight (Beta)
```bash
eas build --profile preview --platform ios
eas submit --profile preview --platform ios
```

### App Store
```bash
eas build --profile production --platform ios
eas submit --profile production --platform ios
```

## Performance Optimizations

- Lazy loading of video content
- Image optimization and caching
- Bundle size optimization
- Memory-efficient video playback
- Background task management

## Troubleshooting

### Common Issues

1. **Video playback issues**:
   - Ensure network connectivity
   - Check YouTube video availability
   - Verify Expo AV permissions

2. **Authentication failures**:
   - Check API endpoint configuration
   - Verify secure store permissions
   - Clear app data and retry

3. **Build failures**:
   - Update Expo CLI: `npm install -g @expo/cli@latest`
   - Clear cache: `npx expo start --clear`
   - Check iOS certificate validity

### Getting Help

- Check Expo documentation: https://docs.expo.dev
- React Native Paper: https://react-native-paper.github.io
- TanStack Query: https://tanstack.com/query

## Contributing

1. Follow TypeScript strict mode
2. Use React Native Paper components
3. Implement proper error handling
4. Add loading states for all async operations
5. Test on both simulator and physical device

## License

This project is part of the ACF Mastery learning platform.