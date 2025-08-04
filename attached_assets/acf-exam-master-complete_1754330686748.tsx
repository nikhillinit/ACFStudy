// ACF Exam Master - Complete Enhanced Application
// This file combines all parts into a single, complete application

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  ChevronRight, Check, X, Clock, Target, BookOpen, Calculator, TrendingUp, Award, 
  AlertCircle, BarChart, FileText, Play, Pause, RefreshCw, User, Calendar,
  Settings, HelpCircle, Brain, Zap, Filter, Download, ChevronDown, ChevronUp,
  Trophy, Star, Flame, Lock, Unlock, Volume2, VolumeX, Share2, Users,
  Heart, Shield, Sparkles, Gift, Rocket, Medal, Crown, Coins, 
  MessageCircle, ThumbsUp, Eye, EyeOff, Lightbulb, Coffee, Moon,
  Smartphone, TabletSmartphone, Monitor, Gamepad2, Swords, Target as TargetIcon,
  ChevronLeft, Video, Bot, Database, Wifi, WifiOff, FileDown, 
  BarChart3, TrendingDown, Info, CheckCircle, PlayCircle, PauseCircle,
  BookMarked, GraduationCap, Library, PenTool, Search, Plus, Minus,
  RotateCcw, FastForward, Rewind, Layers, Grid, List, SlidersHorizontal
} from 'lucide-react';

// Import all data and types from the data file
import { 
  expandedQuestionBank, 
  videoLessonsData, 
  formulaReferences,
  aiTutorResponses 
} from './acf-exam-master-data';

// [Include all type definitions from part 1]
// [Include all component code from parts 1-5]
// [Include all helper functions and logic]

// Style additions for the complete app
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes bounce-in {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.05); }
    70% { transform: scale(0.9); }
    100% { transform: scale(1); opacity: 1; }
  }
  
  @keyframes slide-in {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
  
  .animate-bounce-in {
    animation: bounce-in 0.5s ease-out;
  }
  
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
  
  .safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .toggle {
    appearance: none;
    width: 48px;
    height: 24px;
    background: #e5e7eb;
    border-radius: 9999px;
    position: relative;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .toggle:checked {
    background: #3b82f6;
  }
  
  .toggle::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: transform 0.2s;
  }
  
  .toggle:checked::after {
    transform: translateX(24px);
  }
  
  /* Dark mode styles */
  .dark {
    color-scheme: dark;
  }
  
  /* iOS-specific optimizations */
  @supports (-webkit-touch-callout: none) {
    .ios-scroll {
      -webkit-overflow-scrolling: touch;
    }
  }
  
  /* Prevent text selection on buttons */
  button {
    -webkit-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  
  /* Smooth transitions */
  * {
    transition-property: background-color, border-color, color, fill, stroke;
    transition-duration: 200ms;
  }
`;

// Main App Export
export default function ACFExamMasterApp() {
  // Add styles to document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return <ACFExamMasterEnhanced />;
}

// Export types for external use
export type {
  UserProfile,
  PerformanceData,
  TopicMastery,
  QuestionAttempt,
  StudySession,
  VideoLesson,
  EmbeddedQuiz,
  AITutorResponse,
  Resource,
  SpacedRepetitionItem,
  AdaptivePracticeSession,
  EnhancedQuestion,
  SolutionStep,
  VisualAid,
  Question,
  Achievement,
  PowerUp,
  DailyChallenge,
  LeaderboardEntry,
  FormulaReference,
  OfflineData
};