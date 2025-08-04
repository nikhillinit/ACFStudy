import { useState, useEffect } from 'react';
import type { LearningStyleResult } from '@/components/LearningStyleQuiz';

interface LearningStyleData {
  primary: string;
  secondary: string;
  description: string;
  studyTips: string[];
  scores: {
    visual: number;
    auditory: number;
    kinesthetic: number;
    reading: number;
    social: number;
    solitary: number;
    logical: number;
    sequential: number;
  };
}

const STORAGE_KEY = 'learningStyle';

export function useLearningStyle() {
  const [learningStyle, setLearningStyleState] = useState<LearningStyleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load learning style from localStorage on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setLearningStyleState(parsed);
      }
    } catch (error) {
      console.error('Error loading learning style from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setLearningStyle = (result: LearningStyleResult) => {
    const styleData: LearningStyleData = {
      primary: result.primary,
      secondary: result.secondary,
      description: result.description,
      studyTips: result.studyTips,
      scores: {
        visual: result.visual,
        auditory: result.auditory,
        kinesthetic: result.kinesthetic,
        reading: result.reading,
        social: result.social,
        solitary: result.solitary,
        logical: result.logical,
        sequential: result.sequential,
      }
    };

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(styleData));
      setLearningStyleState(styleData);
    } catch (error) {
      console.error('Error saving learning style to localStorage:', error);
    }
  };

  const clearLearningStyle = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setLearningStyleState(null);
    } catch (error) {
      console.error('Error clearing learning style from localStorage:', error);
    }
  };

  const hasCompletedQuiz = !!learningStyle;

  const getStudyRecommendations = (topic?: string) => {
    if (!learningStyle) return [];

    const baseRecommendations = learningStyle.studyTips;
    
    // Add topic-specific recommendations based on learning style
    const topicSpecific: Record<string, string[]> = {
      'time-value-money': [
        learningStyle.primary === 'visual' ? 'Use timeline diagrams for cash flows' : '',
        learningStyle.primary === 'kinesthetic' ? 'Practice with different calculator scenarios' : '',
        learningStyle.primary === 'auditory' ? 'Explain the concepts aloud as you work' : '',
        learningStyle.primary === 'reading' ? 'Write out the formula steps in detail' : '',
      ].filter(Boolean),
      'portfolio-theory': [
        learningStyle.primary === 'visual' ? 'Create risk-return scatter plots' : '',
        learningStyle.primary === 'logical' ? 'Focus on the mathematical relationships' : '',
        learningStyle.primary === 'kinesthetic' ? 'Build sample portfolios with real data' : '',
      ].filter(Boolean),
      'bonds': [
        learningStyle.primary === 'sequential' ? 'Follow bond pricing step-by-step' : '',
        learningStyle.primary === 'visual' ? 'Use yield curve graphs' : '',
        learningStyle.primary === 'logical' ? 'Understand the math behind duration' : '',
      ].filter(Boolean),
    };

    const topicRecs = topic && topicSpecific[topic] ? topicSpecific[topic] : [];
    
    return [...baseRecommendations, ...topicRecs].slice(0, 6);
  };

  return {
    learningStyle,
    setLearningStyle,
    clearLearningStyle,
    hasCompletedQuiz,
    isLoading,
    getStudyRecommendations,
  };
}