import React, { useState, useEffect, useRef } from 'react';
import { Prompt, Project } from '../types';
import { analyzePrompt, getSuggestionIcon, getPriorityColor } from '../utils/promptAnalysis';
import { X, Plus, Sparkles, List, Smile, Type, Bold, Indent, Outdent, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface PromptFormProps {
  prompt?: Prompt;
  projects: Project[];
  onSave: (prompt: Prompt) => void;
  onCancel: () => void;
  onAddProject?: () => void;
}

const PromptForm: React.FC<PromptFormProps> = ({
  prompt,
  projects,
  onSave,
  onCancel,
  onAddProject,
}) => {
  const [formData, setFormData] = useState({
    title: prompt?.title || '',
    content: prompt?.content || '',
    project: prompt?.project || '',
  });
  const [analysis, setAnalysis] = useState(analyzePrompt(formData.content));
  const [showAnalysis, setShowAnalysis] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');

  // Common emojis for prompts
  const commonEmojis = ['✨', '🚀', '💡', '🎯', '📝', '🔥', '💪', '⭐', '🌟', '🎨', '📊', '🎉', '🔧', '💰', '📈', '🏆', '🎭', '🌈', '⚡', '🌍'];

  useEffect(() => {
    setAnalysis(analyzePrompt(formData.content));
  }, [formData.content]);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = formData.content || '';
    }
  }, [formData.content]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerText || editorRef.current.textContent || '';
      handleInputChange('content', content);
    }
  };

  const insertAtCursor = (text: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // If no selection, append to the end
      const currentText = editor.innerText || editor.textContent || '';
      editor.innerText = currentText + text;
      // Set cursor to end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editor);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    updateContent();
  };

  const addBulletPoint = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const bulletText = document.createTextNode('• ');
      range.insertNode(bulletText);
      range.setStartAfter(bulletText);
      range.setEndAfter(bulletText);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      insertAtCursor('• ');
    }
    updateContent();
  };

  const addNumberedList = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const numberedText = document.createTextNode('1. ');
      range.insertNode(numberedText);
      range.setStartAfter(numberedText);
      range.setEndAfter(numberedText);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      insertAtCursor('1. ');
    }
    updateContent();
  };

  const addEmoji = (emoji: string) => {
    insertAtCursor(emoji);
  };

  const toggleBold = () => {
    document.execCommand('bold', false);
    setIsBold(!isBold);
    updateContent();
  };

  const toggleItalic = () => {
    document.execCommand('italic', false);
    setIsItalic(!isItalic);
    updateContent();
  };

  const toggleUnderline = () => {
    document.execCommand('underline', false);
    setIsUnderline(!isUnderline);
    updateContent();
  };

  const increaseIndent = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      
      if (container.nodeType === Node.TEXT_NODE) {
        const parent = container.parentNode;
        if (parent && parent.nodeName === 'DIV') {
          const currentStyle = (parent as HTMLElement).style.marginLeft || '0px';
          const currentIndent = parseInt(currentStyle) || 0;
          (parent as HTMLElement).style.marginLeft = `${currentIndent + 20}px`;
        }
      }
    }
    updateContent();
  };

  const decreaseIndent = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      
      if (container.nodeType === Node.TEXT_NODE) {
        const parent = container.parentNode;
        if (parent && parent.nodeName === 'DIV') {
          const currentStyle = (parent as HTMLElement).style.marginLeft || '0px';
          const currentIndent = parseInt(currentStyle) || 0;
          const newIndent = Math.max(0, currentIndent - 20);
          (parent as HTMLElement).style.marginLeft = `${newIndent}px`;
        }
      }
    }
    updateContent();
  };

  const setTextAlignment = (alignment: 'left' | 'center' | 'right') => {
    document.execCommand('justifyLeft', false);
    if (alignment === 'center') {
      document.execCommand('justifyCenter', false);
    } else if (alignment === 'right') {
      document.execCommand('justifyRight', false);
    }
    setTextAlign(alignment);
    updateContent();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        decreaseIndent();
      } else {
        increaseIndent();
      }
    }
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
      category: '',
      tags: [],
      createdAt: prompt?.createdAt || new Date(),
      updatedAt: new Date(),
      version: prompt ? prompt.version + 1 : 1,
      isFavorite: prompt?.isFavorite || false,
      usageCount: prompt?.usageCount || 0,
    };

    onSave(updatedPrompt);
  };



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

            {/* Enhanced Google Docs-style Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-secondary-50 border border-secondary-200 rounded-lg">
              <span className="text-sm font-medium text-secondary-700 mr-2">Format:</span>
              
              {/* Text Formatting */}
              <div className="flex items-center gap-1 border-r border-secondary-300 pr-2">
                <button
                  type="button"
                  onClick={toggleBold}
                  className={`flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-white transition-colors ${
                    isBold ? 'bg-primary-100 text-primary-700 border border-primary-300' : 'bg-white border border-secondary-300'
                  }`}
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={toggleItalic}
                  className={`flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-white transition-colors ${
                    isItalic ? 'bg-primary-100 text-primary-700 border border-primary-300' : 'bg-white border border-secondary-300'
                  }`}
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={toggleUnderline}
                  className={`flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-white transition-colors ${
                    isUnderline ? 'bg-primary-100 text-primary-700 border border-primary-300' : 'bg-white border border-secondary-300'
                  }`}
                  title="Underline (Ctrl+U)"
                >
                  <Underline className="w-4 h-4" />
                </button>
              </div>

              {/* Text Alignment */}
              <div className="flex items-center gap-1 border-r border-secondary-300 pr-2">
                <button
                  type="button"
                  onClick={() => setTextAlignment('left')}
                  className={`flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-white transition-colors ${
                    textAlign === 'left' ? 'bg-primary-100 text-primary-700 border border-primary-300' : 'bg-white border border-secondary-300'
                  }`}
                  title="Align Left"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setTextAlignment('center')}
                  className={`flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-white transition-colors ${
                    textAlign === 'center' ? 'bg-primary-100 text-primary-700 border border-primary-300' : 'bg-white border border-secondary-300'
                  }`}
                  title="Align Center"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setTextAlignment('right')}
                  className={`flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-white transition-colors ${
                    textAlign === 'right' ? 'bg-primary-100 text-primary-700 border border-primary-300' : 'bg-white border border-secondary-300'
                  }`}
                  title="Align Right"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>

              {/* Indentation Controls */}
              <div className="flex items-center gap-1 border-r border-secondary-300 pr-2">
                <button
                  type="button"
                  onClick={decreaseIndent}
                  className="flex items-center gap-1 px-2 py-1 text-sm bg-white border border-secondary-300 rounded hover:bg-secondary-50 transition-colors"
                  title="Decrease Indent (Shift+Tab)"
                >
                  <Outdent className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={increaseIndent}
                  className="flex items-center gap-1 px-2 py-1 text-sm bg-white border border-secondary-300 rounded hover:bg-secondary-50 transition-colors"
                  title="Increase Indent (Tab)"
                >
                  <Indent className="w-4 h-4" />
                </button>
              </div>

              {/* List Formatting */}
              <div className="flex items-center gap-1 border-r border-secondary-300 pr-2">
                <button
                  type="button"
                  onClick={addBulletPoint}
                  className="flex items-center gap-1 px-2 py-1 text-sm bg-white border border-secondary-300 rounded hover:bg-secondary-50 transition-colors"
                  title="Add bullet point"
                >
                  <List className="w-4 h-4" />
                  Bullet
                </button>

                <button
                  type="button"
                  onClick={addNumberedList}
                  className="flex items-center gap-1 px-2 py-1 text-sm bg-white border border-secondary-300 rounded hover:bg-secondary-50 transition-colors"
                  title="Add numbered list"
                >
                  <Type className="w-4 h-4" />
                  Number
                </button>
              </div>
              
              {/* Emojis */}
              <div className="flex items-center gap-1">
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
            </div>

            {/* Enhanced Rich Text Editor */}
            <div className="relative">
              <div
                ref={editorRef}
                contentEditable
                onInput={updateContent}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (editorRef.current && !editorRef.current.innerText) {
                    editorRef.current.innerText = '';
                  }
                }}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[300px] sm:min-h-[400px] resize-vertical font-mono text-sm leading-relaxed bg-white"
                style={{ 
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  direction: 'ltr'
                }}
              />
              {!formData.content && (
                <div className="absolute top-2 left-3 text-secondary-400 pointer-events-none font-mono text-sm leading-relaxed">
                  ✨ Enter your prompt content here...

💡 Pro tips:
• Use the formatting toolbar above for bold, italic, and alignment
• Press Tab to indent, Shift+Tab to outdent
• Use bullet points and emojis to make your prompts more engaging
• The analysis panel above will help you optimize your prompt in real-time
                </div>
              )}
            </div>

            <div className="text-sm text-secondary-500 flex items-center justify-between">
              <span>
                {formData.content.length} characters • {formData.content.split(/\s+/).filter(word => word.length > 0).length} words
              </span>
              <span className="text-xs">
                💡 Tip: Use the formatting toolbar for Google Docs-like editing experience
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