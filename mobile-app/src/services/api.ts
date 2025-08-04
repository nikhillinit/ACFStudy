import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Replace with your actual server URL
const BASE_URL = __DEV__ 
  ? 'http://localhost:5000' // Local development
  : 'https://your-replit-app.replit.app'; // Production URL

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, remove it
      await SecureStore.deleteItemAsync('authToken');
      // You might want to redirect to login here
    }
    return Promise.reject(error);
  }
);

// API service functions
export const api = {
  // Auth endpoints
  login: (email: string, password: string) =>
    apiClient.post('/api/auth/login', { email, password }),
  
  getUser: () =>
    apiClient.get('/api/auth/user'),

  // Learning endpoints
  getVideoLibrary: () =>
    apiClient.get('/api/learning/videos'),
  
  getLearningContent: (topic: string) =>
    apiClient.get(`/api/learning/content/${topic}`),
  
  updateProgress: (data: { lectureId: string; progress: number; completed: boolean }) =>
    apiClient.post('/api/learning/progress', data),
  
  getUserProgress: (userId: string) =>
    apiClient.get(`/api/learning/progress/${userId}`),

  // Practice endpoints
  getModules: () =>
    apiClient.get('/api/modules'),
  
  getProblems: () =>
    apiClient.get('/api/problems'),
  
  submitAnswer: (data: { problemId: string; answer: any; timeSpent: number }) =>
    apiClient.post('/api/practice/submit', data),

  // Analytics endpoints
  getDashboard: () =>
    apiClient.get('/api/analytics/dashboard'),
  
  getTopicStats: () =>
    apiClient.get('/api/analytics/topics'),

  // AI endpoints
  getAITutor: (data: { topic: string; question: string }) =>
    apiClient.post('/api/ai/tutor', data),
  
  getSmartExplanation: (data: { problemId: string; userAnswer: any }) =>
    apiClient.post('/api/ai/explanation', data),
};