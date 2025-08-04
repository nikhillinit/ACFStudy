// AI Services Integration for ACF Learning Platform
import type { Request, Response } from 'express';

interface AIExplanationRequest {
  problem: string;
  topic: string;
  userAnswer?: string;
  correctAnswer: string;
  difficulty: number;
}

interface AITutorRequest {
  topic: string;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  specificQuestion?: string;
}

export class AIServices {
  private claudeApiKey: string;
  private openaiApiKey: string;
  private perplexityApiKey: string;

  constructor() {
    this.claudeApiKey = process.env.CLAUDE_API_KEY || '';
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    this.perplexityApiKey = process.env.PERPLEXITY_API_KEY || '';
  }

  // Get personalized explanation using Claude API
  async getPersonalizedExplanation(data: AIExplanationRequest): Promise<string> {
    if (!this.claudeApiKey) {
      throw new Error('Claude API key not configured');
    }

    try {
      const prompt = this.buildExplanationPrompt(data);
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.claudeApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.content[0].text;
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error('Failed to get AI explanation');
    }
  }

  // Generate additional practice problems using OpenAI
  async generatePracticeProblems(topic: string, difficulty: number, count: number = 3): Promise<any[]> {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const prompt = this.buildProblemGenerationPrompt(topic, difficulty, count);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{
            role: 'user',
            content: prompt
          }],
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const result = await response.json();
      const content = result.choices[0].message.content;
      
      // Parse the generated problems (assuming JSON format)
      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate practice problems');
    }
  }

  // Get real-time market context using Perplexity
  async getMarketContext(topic: string): Promise<string> {
    if (!this.perplexityApiKey) {
      throw new Error('Perplexity API key not configured');
    }

    try {
      const prompt = this.buildMarketContextPrompt(topic);
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.perplexityApiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [{
            role: 'user',
            content: prompt
          }],
          max_tokens: 500,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.choices[0].message.content;
    } catch (error) {
      console.error('Perplexity API error:', error);
      throw new Error('Failed to get market context');
    }
  }

  // AI Tutor for personalized guidance
  async getPersonalizedTutoring(data: AITutorRequest): Promise<string> {
    if (!this.claudeApiKey) {
      throw new Error('Claude API key not configured');
    }

    try {
      const prompt = this.buildTutoringPrompt(data);
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.claudeApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1500,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.content[0].text;
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error('Failed to get AI tutoring');
    }
  }

  private buildExplanationPrompt(data: AIExplanationRequest): string {
    return `As an expert finance tutor, provide a clear, step-by-step explanation for this ${data.topic} problem:

Problem: ${data.problem}
Correct Answer: ${data.correctAnswer}
${data.userAnswer ? `User's Answer: ${data.userAnswer}` : ''}
Difficulty Level: ${data.difficulty}/3

Please provide:
1. A clear explanation of the concept
2. Step-by-step solution approach
3. Key formulas or principles used
4. Common mistakes to avoid
${data.userAnswer && data.userAnswer !== data.correctAnswer ? '5. Why the user\'s answer was incorrect and how to correct it' : ''}

Keep the explanation concise but thorough, suitable for someone preparing for the Kellogg ACF exam.`;
  }

  private buildProblemGenerationPrompt(topic: string, difficulty: number, count: number): string {
    return `Generate ${count} new ${topic} practice problems for the Kellogg ACF exam at difficulty level ${difficulty}/3.

Return as a JSON array with each problem having:
- id: unique identifier
- question: the problem statement
- answer: correct answer choice (A, B, C, or D)
- choices: array of 4 answer choices
- solution: step-by-step solution explanation
- concepts: array of key concepts tested

Topic: ${topic}
Difficulty: ${difficulty === 1 ? 'Beginner' : difficulty === 2 ? 'Intermediate' : 'Advanced'}

Ensure problems are realistic, exam-appropriate, and test core finance concepts.`;
  }

  private buildMarketContextPrompt(topic: string): string {
    return `Provide current market context and real-world examples related to ${topic} in corporate finance. Include:

1. Recent market trends or news affecting this topic
2. Current interest rates, market conditions, or relevant data
3. Real company examples demonstrating these concepts
4. How current economic conditions impact this area

Keep response concise and educational, suitable for ACF exam preparation.`;
  }

  private buildTutoringPrompt(data: AITutorRequest): string {
    return `As a personalized ACF tutor, provide guidance for a ${data.userLevel} student studying ${data.topic}.

${data.specificQuestion ? `Student Question: ${data.specificQuestion}` : ''}

Please provide:
1. Key concepts to understand for this topic
2. Study strategy tailored to ${data.userLevel} level
3. Common exam question patterns
4. Recommended practice focus areas
5. Tips for remembering important formulas or concepts

${data.specificQuestion ? 'Address the specific question asked.' : 'Provide general guidance for mastering this topic.'}

Make recommendations actionable and exam-focused.`;
  }
}

export const aiServices = new AIServices();