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
  const lowerContent = content.toLowerCase();
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 0;

  // Dynamic clarity suggestions based on content analysis
  const vaguePronouns = ['it', 'this', 'that', 'these', 'those'];
  const vaguePronounCount = vaguePronouns.filter(pronoun => lowerContent.includes(pronoun)).length;
  
  if (vaguePronounCount > 2) {
    suggestions.push({
      type: 'clarity',
      suggestion: `Found ${vaguePronounCount} vague pronouns. Replace "it", "this", "that" with specific nouns for better clarity.`,
      priority: 'high'
    });
  } else if (vaguePronounCount > 0) {
    suggestions.push({
      type: 'clarity',
      suggestion: 'Consider replacing vague pronouns with more specific nouns for better clarity.',
      priority: 'medium'
    });
  }

  const subjectiveTerms = ['good', 'bad', 'nice', 'great', 'terrible', 'amazing', 'awful'];
  const subjectiveCount = subjectiveTerms.filter(term => lowerContent.includes(term)).length;
  
  if (subjectiveCount > 3) {
    suggestions.push({
      type: 'clarity',
      suggestion: `Found ${subjectiveCount} subjective terms. Replace with specific, measurable criteria for better results.`,
      priority: 'high'
    });
  } else if (subjectiveCount > 0) {
    suggestions.push({
      type: 'clarity',
      suggestion: 'Replace subjective terms with specific, measurable criteria.',
      priority: 'medium'
    });
  }

  // Dynamic specificity suggestions
  if (wordCount < 15) {
    suggestions.push({
      type: 'specificity',
      suggestion: 'Very short prompt. Add context, examples, or specific requirements for better results.',
      priority: 'high'
    });
  } else if (wordCount < 30) {
    suggestions.push({
      type: 'specificity',
      suggestion: 'Short prompt. Consider adding more context or specific requirements.',
      priority: 'medium'
    });
  } else if (wordCount > 300) {
    suggestions.push({
      type: 'specificity',
      suggestion: 'Very long prompt. Consider breaking into smaller, focused prompts.',
      priority: 'medium'
    });
  } else if (wordCount > 150) {
    suggestions.push({
      type: 'specificity',
      suggestion: 'Long prompt. Consider removing redundant information or breaking into parts.',
      priority: 'low'
    });
  }

  // Dynamic structure suggestions
  const hasPlease = lowerContent.includes('please');
  const hasFormat = lowerContent.includes('format') || lowerContent.includes('output');
  const hasRole = lowerContent.includes('role') || lowerContent.includes('act as') || lowerContent.includes('you are');
  const hasSteps = lowerContent.includes('step') || lowerContent.includes('steps');
  const hasExamples = lowerContent.includes('example') || lowerContent.includes('for instance') || lowerContent.includes('such as');

  if (!hasPlease && wordCount > 20) {
    suggestions.push({
      type: 'structure',
      suggestion: 'Consider starting with "Please" for a more polite and clear tone.',
      priority: 'low'
    });
  }

  if (!hasFormat && wordCount > 50) {
    suggestions.push({
      type: 'structure',
      suggestion: 'Specify desired output format (e.g., "Format: bullet points" or "Output: JSON") for structured responses.',
      priority: 'medium'
    });
  }

  if (!hasRole && wordCount > 40) {
    suggestions.push({
      type: 'structure',
      suggestion: 'Define a specific role or persona (e.g., "Act as a marketing expert") for targeted responses.',
      priority: 'medium'
    });
  }

  if (!hasSteps && wordCount > 80) {
    suggestions.push({
      type: 'structure',
      suggestion: 'For complex tasks, ask for step-by-step instructions for more detailed responses.',
      priority: 'low'
    });
  }

  if (!hasExamples && wordCount > 60) {
    suggestions.push({
      type: 'structure',
      suggestion: 'Include examples or sample outputs to guide the AI response.',
      priority: 'medium'
    });
  }

  // Dynamic context suggestions
  const contextWords = ['context', 'background', 'assume', 'given', 'considering'];
  const hasContext = contextWords.some(word => lowerContent.includes(word));
  
  if (!hasContext && wordCount > 30) {
    suggestions.push({
      type: 'context',
      suggestion: 'Provide relevant context or background information to help the AI understand your situation.',
      priority: 'medium'
    });
  }

  // Dynamic tone suggestions
  if (readabilityScore < 20) {
    suggestions.push({
      type: 'tone',
      suggestion: 'Very complex language. Simplify to make it more accessible and clear.',
      priority: 'high'
    });
  } else if (readabilityScore < 40) {
    suggestions.push({
      type: 'tone',
      suggestion: 'Complex language detected. Consider simplifying for better understanding.',
      priority: 'medium'
    });
  }

  const exclamationCount = (content.match(/!/g) || []).length;
  if (exclamationCount > 3) {
    suggestions.push({
      type: 'tone',
      suggestion: `Too many exclamation marks (${exclamationCount}). Reduce for a more professional tone.`,
      priority: 'medium'
    });
  } else if (exclamationCount > 1) {
    suggestions.push({
      type: 'tone',
      suggestion: 'Consider reducing exclamation marks for a more professional tone.',
      priority: 'low'
    });
  }

  // Sentence structure analysis
  if (avgSentenceLength > 25) {
    suggestions.push({
      type: 'structure',
      suggestion: 'Long sentences detected. Break into shorter sentences for better readability.',
      priority: 'medium'
    });
  }

  // Check for repetition
  const words = lowerContent.split(/\s+/);
  const wordFrequency: { [key: string]: number } = {};
  words.forEach(word => {
    if (word.length > 3) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });
  
  const repeatedWords = Object.entries(wordFrequency)
    .filter(([_, count]) => count > 3)
    .map(([word, _]) => word);
  
  if (repeatedWords.length > 0) {
    suggestions.push({
      type: 'clarity',
      suggestion: `Repetitive words detected: ${repeatedWords.slice(0, 3).join(', ')}. Consider using synonyms.`,
      priority: 'medium'
    });
  }

  // Shuffle suggestions to avoid showing the same order every time
  const shuffled = suggestions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 6); // Show top 6 suggestions
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