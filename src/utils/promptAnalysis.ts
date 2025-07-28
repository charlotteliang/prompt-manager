import { PromptAnalysis, PromptSuggestion } from '../types';

export const analyzePrompt = (content: string): PromptAnalysis => {
  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const characterCount = content.length;
  const estimatedTokens = Math.ceil(wordCount * 1.3); // Rough estimation
  
  // Calculate readability score (Flesch Reading Ease)
  const sentences = content.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
  const syllables = countSyllables(content);
  const readabilityScore = sentences > 0 && wordCount > 0 
    ? Math.max(0, Math.min(100, 206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllables / wordCount)))
    : 100;

  const suggestions = generateSuggestions(content, wordCount, readabilityScore);

  return {
    wordCount,
    characterCount,
    readabilityScore: Math.round(readabilityScore),
    suggestions,
    estimatedTokens,
  };
};

const countSyllables = (text: string): number => {
  const words = text.toLowerCase().split(/\s+/);
  let syllableCount = 0;
  
  words.forEach(word => {
    if (word.length <= 3) {
      syllableCount += 1;
    } else {
      // Simple syllable counting algorithm
      const cleanWord = word.replace(/[^a-z]/g, '');
      const syllables = cleanWord.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
        .replace(/^y/, '')
        .match(/[aeiouy]{1,2}/g);
      syllableCount += syllables ? syllables.length : 1;
    }
  });
  
  return syllableCount;
};

const generateSuggestions = (content: string, wordCount: number, readabilityScore: number): PromptSuggestion[] => {
  const suggestions: PromptSuggestion[] = [];

  // Clarity suggestions
  if (content.includes('it') || content.includes('this') || content.includes('that')) {
    suggestions.push({
      type: 'clarity',
      suggestion: 'Consider replacing vague pronouns like "it", "this", or "that" with more specific nouns for better clarity.',
      priority: 'medium'
    });
  }

  if (content.includes('good') || content.includes('bad') || content.includes('nice')) {
    suggestions.push({
      type: 'clarity',
      suggestion: 'Replace subjective terms like "good", "bad", or "nice" with more specific, measurable criteria.',
      priority: 'high'
    });
  }

  // Specificity suggestions
  if (wordCount < 20) {
    suggestions.push({
      type: 'specificity',
      suggestion: 'Your prompt is quite short. Consider adding more context, examples, or specific requirements to get better results.',
      priority: 'medium'
    });
  }

  if (wordCount > 200) {
    suggestions.push({
      type: 'specificity',
      suggestion: 'Your prompt is quite long. Consider breaking it into smaller, more focused prompts or removing redundant information.',
      priority: 'low'
    });
  }

  // Structure suggestions
  if (!content.includes('Please') && !content.includes('please')) {
    suggestions.push({
      type: 'structure',
      suggestion: 'Consider starting your prompt with "Please" to make it more polite and clear.',
      priority: 'low'
    });
  }

  if (!content.includes('Format') && !content.includes('format') && !content.includes('Output') && !content.includes('output')) {
    suggestions.push({
      type: 'structure',
      suggestion: 'Consider specifying the desired output format to get more structured responses.',
      priority: 'medium'
    });
  }

  // Context suggestions
  if (!content.includes('context') && !content.includes('background') && !content.includes('assume')) {
    suggestions.push({
      type: 'context',
      suggestion: 'Consider providing relevant context or background information to help the AI understand your specific situation.',
      priority: 'medium'
    });
  }

  // Tone suggestions
  if (readabilityScore < 30) {
    suggestions.push({
      type: 'tone',
      suggestion: 'Your prompt may be too complex. Consider simplifying the language to make it more accessible.',
      priority: 'high'
    });
  }

  if (content.includes('!') && (content.match(/!/g) || []).length > 2) {
    suggestions.push({
      type: 'tone',
      suggestion: 'Consider reducing the use of exclamation marks to maintain a more professional tone.',
      priority: 'low'
    });
  }

  // Check for common prompt engineering patterns
  if (!content.includes('role') && !content.includes('act as') && !content.includes('you are')) {
    suggestions.push({
      type: 'structure',
      suggestion: 'Consider defining a specific role or persona for the AI to adopt for more targeted responses.',
      priority: 'medium'
    });
  }

  if (!content.includes('step by step') && !content.includes('step-by-step') && !content.includes('steps')) {
    suggestions.push({
      type: 'structure',
      suggestion: 'For complex tasks, consider asking for a step-by-step approach to get more detailed responses.',
      priority: 'low'
    });
  }

  return suggestions.slice(0, 5); // Limit to top 5 suggestions
};

export const getSuggestionIcon = (type: PromptSuggestion['type']) => {
  switch (type) {
    case 'clarity':
      return '👁️';
    case 'specificity':
      return '🎯';
    case 'structure':
      return '🏗️';
    case 'context':
      return '📚';
    case 'tone':
      return '🎭';
    default:
      return '💡';
  }
};

export const getPriorityColor = (priority: PromptSuggestion['priority']) => {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50';
    case 'low':
      return 'text-green-600 bg-green-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}; 