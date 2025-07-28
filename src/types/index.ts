export interface Prompt {
  id: string;
  title: string;
  content: string;
  project: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  version: number;
  isFavorite: boolean;
  usageCount: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  projectId: string;
}

export interface PromptSuggestion {
  type: 'clarity' | 'specificity' | 'structure' | 'context' | 'tone';
  suggestion: string;
  priority: 'low' | 'medium' | 'high';
}

export interface PromptAnalysis {
  wordCount: number;
  characterCount: number;
  readabilityScore: number;
  suggestions: PromptSuggestion[];
  estimatedTokens: number;
} 