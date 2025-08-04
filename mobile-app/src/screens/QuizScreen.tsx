import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  RadioButton,
  ProgressBar,
  Chip,
  IconButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';

interface Problem {
  id: string;
  title: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: number;
  timeLimit: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: number;
}

export default function QuizScreen({ route, navigation }: any) {
  const { module, problems }: { module: Module; problems: Problem[] } = route.params;
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<Array<{ problemId: string; answer: number; correct: boolean }>>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStartTime] = useState(Date.now());

  const currentProblem = problems[currentProblemIndex];
  const isLastProblem = currentProblemIndex === problems.length - 1;
  const progress = (currentProblemIndex + 1) / problems.length;

  const submitAnswerMutation = useMutation({
    mutationFn: (data: { problemId: string; answer: number; timeSpent: number }) =>
      api.submitAnswer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    },
  });

  // Timer effect
  useEffect(() => {
    if (currentProblem && !showExplanation) {
      setTimeLeft(currentProblem.timeLimit * 60); // Convert minutes to seconds
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentProblemIndex, showExplanation]);

  const handleTimeUp = () => {
    Alert.alert(
      'Time\'s Up!',
      'Time limit reached for this problem.',
      [{ text: 'OK', onPress: handleSubmitAnswer }]
    );
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      Alert.alert('No Answer', 'Please select an answer before submitting.');
      return;
    }

    const isCorrect = selectedAnswer === currentProblem.correctAnswer;
    const timeSpent = Math.round((Date.now() - quizStartTime) / 1000);
    
    // Save answer
    const newAnswer = {
      problemId: currentProblem.id,
      answer: selectedAnswer,
      correct: isCorrect,
    };
    
    setAnswers(prev => [...prev, newAnswer]);
    
    // Submit to server
    submitAnswerMutation.mutate({
      problemId: currentProblem.id,
      answer: selectedAnswer,
      timeSpent,
    });

    setShowExplanation(true);
  };

  const handleNextProblem = () => {
    if (isLastProblem) {
      // Quiz completed
      const correctAnswers = answers.filter(a => a.correct).length + (selectedAnswer === currentProblem.correctAnswer ? 1 : 0);
      const score = Math.round((correctAnswers / problems.length) * 100);
      
      Alert.alert(
        'Quiz Completed!',
        `You scored ${score}% (${correctAnswers}/${problems.length} correct)`,
        [
          { text: 'Review Answers', onPress: () => navigation.goBack() },
          { text: 'Continue', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      setCurrentProblemIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return theme.colors.tertiary;
      case 2: return theme.colors.primary;
      case 3: return '#f59e0b';
      default: return theme.colors.onSurfaceVariant;
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      default: return 'Unknown';
    }
  };

  if (!currentProblem) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text>No problems available for this module.</Text>
          <Button onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <IconButton
            icon="arrow-left"
            onPress={() => navigation.goBack()}
          />
          <Text variant="titleMedium" style={styles.moduleTitle}>
            {module.title}
          </Text>
          <View style={styles.timer}>
            <Ionicons 
              name="time-outline" 
              size={16} 
              color={timeLeft < 60 ? theme.colors.error : theme.colors.onSurfaceVariant} 
            />
            <Text 
              variant="bodySmall" 
              style={[
                styles.timerText,
                { color: timeLeft < 60 ? theme.colors.error : theme.colors.onSurfaceVariant }
              ]}
            >
              {formatTime(timeLeft)}
            </Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <Text variant="bodySmall" style={styles.progressText}>
            Question {currentProblemIndex + 1} of {problems.length}
          </Text>
          <ProgressBar
            progress={progress}
            color={theme.colors.primary}
            style={styles.progressBar}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.problemCard}>
          <Card.Content>
            <View style={styles.problemHeader}>
              <Text variant="titleLarge" style={styles.problemTitle}>
                {currentProblem.title}
              </Text>
              <Chip
                mode="flat"
                style={[
                  styles.difficultyChip,
                  { backgroundColor: getDifficultyColor(currentProblem.difficulty) }
                ]}
                textStyle={{ color: 'white' }}
              >
                {getDifficultyText(currentProblem.difficulty)}
              </Chip>
            </View>
            
            <Text variant="bodyLarge" style={styles.question}>
              {currentProblem.question}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.optionsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.optionsTitle}>
              Choose your answer:
            </Text>
            
            <RadioButton.Group
              onValueChange={(value) => setSelectedAnswer(parseInt(value))}
              value={selectedAnswer?.toString() || ''}
            >
              {currentProblem.options.map((option, index) => (
                <View key={index} style={styles.optionContainer}>
                  <View style={styles.optionRow}>
                    <RadioButton
                      value={index.toString()}
                      disabled={showExplanation}
                    />
                    <Text
                      variant="bodyMedium"
                      style={[
                        styles.optionText,
                        showExplanation && index === currentProblem.correctAnswer && styles.correctOption,
                        showExplanation && selectedAnswer === index && index !== currentProblem.correctAnswer && styles.incorrectOption,
                      ]}
                      onPress={() => !showExplanation && setSelectedAnswer(index)}
                    >
                      {option}
                    </Text>
                  </View>
                  {showExplanation && index === currentProblem.correctAnswer && (
                    <View style={styles.correctIndicator}>
                      <Ionicons name="checkmark-circle" size={20} color={theme.colors.tertiary} />
                    </View>
                  )}
                  {showExplanation && selectedAnswer === index && index !== currentProblem.correctAnswer && (
                    <View style={styles.incorrectIndicator}>
                      <Ionicons name="close-circle" size={20} color={theme.colors.error} />
                    </View>
                  )}
                </View>
              ))}
            </RadioButton.Group>
          </Card.Content>
        </Card>

        {showExplanation && (
          <Card style={styles.explanationCard}>
            <Card.Content>
              <View style={styles.explanationHeader}>
                <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
                <Text variant="titleMedium" style={styles.explanationTitle}>
                  Explanation
                </Text>
              </View>
              <Text variant="bodyMedium" style={styles.explanationText}>
                {currentProblem.explanation}
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {!showExplanation ? (
          <Button
            mode="contained"
            onPress={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            style={styles.submitButton}
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={handleNextProblem}
            style={styles.nextButton}
          >
            {isLastProblem ? 'Complete Quiz' : 'Next Question'}
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  moduleTitle: {
    flex: 1,
    textAlign: 'center',
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    marginLeft: 4,
    fontWeight: '600',
  },
  progressContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  progressText: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  problemCard: {
    marginBottom: 16,
  },
  problemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  problemTitle: {
    flex: 1,
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
  difficultyChip: {
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  question: {
    color: theme.colors.onSurface,
    lineHeight: 24,
  },
  optionsCard: {
    marginBottom: 16,
  },
  optionsTitle: {
    color: theme.colors.onSurface,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    flex: 1,
    marginLeft: 8,
    color: theme.colors.onSurface,
  },
  correctOption: {
    color: theme.colors.tertiary,
    fontWeight: '600',
  },
  incorrectOption: {
    color: theme.colors.error,
  },
  correctIndicator: {
    marginLeft: 8,
  },
  incorrectIndicator: {
    marginLeft: 8,
  },
  explanationCard: {
    backgroundColor: theme.colors.primaryContainer,
    marginBottom: 16,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  explanationTitle: {
    marginLeft: 8,
    color: theme.colors.onPrimaryContainer,
    fontWeight: '600',
  },
  explanationText: {
    color: theme.colors.onPrimaryContainer,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceVariant,
  },
  submitButton: {
    paddingVertical: 4,
  },
  nextButton: {
    paddingVertical: 4,
  },
});