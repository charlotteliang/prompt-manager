import React, { useState, useEffect } from 'react';
import { Prompt, Project, Category } from '../types';
import { analyzePrompt, getSuggestionIcon, getPriorityColor } from '../utils/promptAnalysis';
import { X, Plus, Sparkles } from 'lucide-react';

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

  useEffect(() => {
    setAnalysis(analyzePrompt(formData.content));
  }, [formData.content]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-secondary-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-secondary-900">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
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

            <div className="space-y-4">
              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-secondary-700">
                    Prompt Content *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAnalysis(!showAnalysis)}
                    className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                  >
                    <Sparkles className="w-4 h-4" />
                    Analysis
                  </button>
                </div>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="textarea-field"
                  placeholder="Enter your prompt content..."
                  required
                />
              </div>

              {/* Analysis Panel */}
              {showAnalysis && (
                <div className="card bg-secondary-50 border-secondary-200">
                  <h4 className="font-medium text-secondary-900 mb-3">Prompt Analysis</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-secondary-600">Words:</span>
                      <span className="ml-2 font-medium">{analysis.wordCount}</span>
                    </div>
                    <div>
                      <span className="text-secondary-600">Characters:</span>
                      <span className="ml-2 font-medium">{analysis.characterCount}</span>
                    </div>
                    <div>
                      <span className="text-secondary-600">Readability:</span>
                      <span className="ml-2 font-medium">{analysis.readabilityScore}/100</span>
                    </div>
                    <div>
                      <span className="text-secondary-600">Est. Tokens:</span>
                      <span className="ml-2 font-medium">{analysis.estimatedTokens}</span>
                    </div>
                  </div>
                  
                  {analysis.suggestions.length > 0 && (
                    <div>
                      <h5 className="font-medium text-secondary-900 mb-2">Suggestions</h5>
                      <div className="space-y-2">
                        {analysis.suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border-l-4 ${getPriorityColor(suggestion.priority)} border-l-current`}
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                              <p className="text-sm">{suggestion.suggestion}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-secondary-200">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
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