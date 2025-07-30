import React, { useState, useEffect, useRef } from 'react';
import { Prompt, Project, Category } from '../types';
import { analyzePrompt, getSuggestionIcon, getPriorityColor } from '../utils/promptAnalysis';
import { X, Plus, Sparkles, List, Smile, Type } from 'lucide-react';

interface PromptFormProps {
  prompt?: Prompt;
  projects: Project[];
  categories: Category[];
  onSave: (prompt: Prompt) => void;
  onCancel: () => void;
  onAddProject?: () => void;
}

const PromptForm: React.FC<PromptFormProps> = ({
  prompt,
  projects,
  categories,
  onSave,
  onCancel,
  onAddProject,
}) => {
  const [formData, setFormData] = useState({
    title: prompt?.title || '',
    content: prompt?.content || '',
    project: prompt?.project || '',
    category: prompt?.category || '',
    tags: prompt?.tags || [],
  });
  const [newTag, setNewTag] = useState('');
  const [analysis, setAnalysis] = useState(analyzePrompt(formData.content));
  const [showAnalysis, setShowAnalysis] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Common emojis for prompts
  const commonEmojis = ['✨', '🚀', '💡', '🎯', '📝', '🔥', '💪', '⭐', '🌟', '🎨', '📊', '🎉', '🔧', '💰', '📈', '🏆', '🎭', '🌈', '⚡', '🌍'];

  useEffect(() => {
    setAnalysis(analyzePrompt(formData.content));
  }, [formData.content]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = formData.content;
    
    const newContent = currentContent.substring(0, start) + text + currentContent.substring(end);
    handleInputChange('content', newContent);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const addBulletPoint = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const content = formData.content;
    
    // Check if we're at the beginning of a line
    const beforeCursor = content.substring(0, start);
    const isNewLine = beforeCursor.length === 0 || beforeCursor.endsWith('\n');
    
    const bulletText = isNewLine ? '• ' : '\n• ';
    insertAtCursor(bulletText);
  };

  const addNumberedList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const content = formData.content;
    
    // Check if we're at the beginning of a line
    const beforeCursor = content.substring(0, start);
    const isNewLine = beforeCursor.length === 0 || beforeCursor.endsWith('\n');
    
    const numberedText = isNewLine ? '1. ' : '\n1. ';
    insertAtCursor(numberedText);
  };

  const addEmoji = (emoji: string) => {
    insertAtCursor(emoji);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.project) {
      return;
    }

    const updatedPrompt: Prompt = {
      id: prompt?.id || crypto.randomUUID(),
      title: formData.title.trim(),
      content: formData.content.trim(),
      project: formData.project,
      category: formData.category,
      tags: formData.tags,
      createdAt: prompt?.createdAt || new Date(),
      updatedAt: new Date(),
      version: prompt ? prompt.version + 1 : 1,
      isFavorite: prompt?.isFavorite || false,
      usageCount: prompt?.usageCount || 0,
    };

    onSave(updatedPrompt);
  };

  const projectCategories = categories.filter(cat => cat.projectId === formData.project);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl h-full max-h-[98vh] sm:max-h-[95vh] overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 border-b border-secondary-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-secondary-900">
              {prompt ? 'Edit Prompt' : 'Create New Prompt'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-secondary-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 overflow-y-auto">
          {/* Title and Project Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="input-field"
                placeholder="Enter prompt title..."
                required
              />
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Project *
              </label>
              {projects.length === 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-secondary-600">No projects available. Create one first:</p>
                  <button
                    type="button"
                    onClick={onAddProject}
                    className="btn-primary w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Project
                  </button>
                </div>
              ) : (
                <select
                  value={formData.project}
                  onChange={(e) => handleInputChange('project', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.name}>
                      {project.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Category and Tags Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="input-field"
              >
                <option value="">Select a category</option>
                {projectCategories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="input-field flex-1"
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn-secondary px-3"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-primary-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis Panel - Now Above Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-secondary-700">
                Prompt Content *
              </label>
              <button
                type="button"
                onClick={() => setShowAnalysis(!showAnalysis)}
                className={`flex items-center gap-1 text-sm px-3 py-1 rounded-lg transition-all duration-200 ${
                  showAnalysis 
                    ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                    : 'text-primary-600 hover:text-primary-700 hover:bg-primary-50'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${showAnalysis ? 'animate-pulse' : ''}`} />
                {showAnalysis ? 'Hide Analysis' : 'Show Analysis'}
              </button>
            </div>

            {/* Analysis Panel - Always visible when enabled */}
            {showAnalysis && (
              <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Live Prompt Analysis</h4>
                  <div className="ml-auto text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    Real-time
                  </div>
                </div>
                
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-blue-200">
                    <div className="text-lg sm:text-2xl font-bold text-blue-600">{analysis.wordCount}</div>
                    <div className="text-xs text-blue-700">Words</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-blue-200">
                    <div className="text-lg sm:text-2xl font-bold text-blue-600">{analysis.characterCount}</div>
                    <div className="text-xs text-blue-700">Characters</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-blue-200">
                    <div className="text-lg sm:text-2xl font-bold text-blue-600">{analysis.readabilityScore}</div>
                    <div className="text-xs text-blue-700">Readability</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-blue-200">
                    <div className="text-lg sm:text-2xl font-bold text-blue-600">~{analysis.estimatedTokens}</div>
                    <div className="text-xs text-blue-700">Est. Tokens</div>
                  </div>
                </div>
                
                {/* Dynamic Suggestions */}
                {analysis.suggestions.length > 0 ? (
                  <div>
                    <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <span className="text-lg">💡</span>
                      Smart Suggestions ({analysis.suggestions.length})
                    </h5>
                    <div className="space-y-3">
                      {analysis.suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${getPriorityColor(suggestion.priority)} border-l-current`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl mt-0.5">{getSuggestionIcon(suggestion.type)}</span>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{suggestion.suggestion}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                                  suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {suggestion.priority} priority
                                </span>
                                <span className="text-xs text-gray-500 capitalize">
                                  {suggestion.type} improvement
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-blue-600">
                    <Sparkles className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Great prompt! No suggestions needed.</p>
                  </div>
                )}
              </div>
            )}

            {/* Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-secondary-50 border border-secondary-200 rounded-lg">
              <span className="text-sm font-medium text-secondary-700 mr-2">Format:</span>
              
              <button
                type="button"
                onClick={addBulletPoint}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-white border border-secondary-300 rounded hover:bg-secondary-50 transition-colors"
                title="Add bullet point"
              >
                <List className="w-4 h-4" />
                Bullet
              </button>

              <button
                type="button"
                onClick={addNumberedList}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-white border border-secondary-300 rounded hover:bg-secondary-50 transition-colors"
                title="Add numbered list"
              >
                <Type className="w-4 h-4" />
                Number
              </button>

              <div className="h-4 w-px bg-secondary-300 mx-1"></div>
              
              <span className="text-sm text-secondary-600">
                <Smile className="w-4 h-4 inline mr-1" />
                Emojis:
              </span>
              
              <div className="flex flex-wrap gap-1">
                {commonEmojis.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => addEmoji(emoji)}
                    className="text-lg hover:bg-white hover:scale-110 transition-all duration-150 rounded px-1 py-0.5"
                    title={`Add ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Content Textarea */}
            <textarea
              ref={textareaRef}
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[300px] sm:min-h-[400px] resize-vertical font-mono text-sm leading-relaxed"
              placeholder="✨ Enter your prompt content here...

💡 Pro tips:
• Use the formatting tools above to add bullet points and emojis
• Press Tab to indent, Shift+Tab to outdent
• This editor supports multiline text with good spacing
• The analysis panel above will help you optimize your prompt in real-time"
              required
            />

            <div className="text-sm text-secondary-500 flex items-center justify-between">
              <span>
                {formData.content.length} characters • {formData.content.split(/\s+/).filter(word => word.length > 0).length} words
              </span>
              <span className="text-xs">
                💡 Tip: Use bullet points and emojis to make your prompts more engaging
              </span>
            </div>
          </div>



          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-secondary-200 flex-shrink-0">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary text-sm sm:text-base px-3 sm:px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-sm sm:text-base px-3 sm:px-4 py-2"
              disabled={!formData.title.trim() || !formData.content.trim() || !formData.project}
            >
              {prompt ? 'Update Prompt' : 'Create Prompt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromptForm; 