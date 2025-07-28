import React from 'react';
import { Prompt } from '../types';
import { Edit, Trash2, Star, Copy } from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (promptId: string) => void;
  onToggleFavorite: (promptId: string) => void;
  onCopy: (prompt: Prompt) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onEdit,
  onDelete,
  onToggleFavorite,
  onCopy,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-secondary-900 truncate">
              {prompt.title}
            </h3>
            {prompt.isFavorite && (
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary-500 mb-2">
            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
              {prompt.project}
            </span>
            {prompt.category && (
              <span className="px-2 py-1 bg-secondary-100 text-secondary-600 rounded-full text-xs">
                {prompt.category}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleFavorite(prompt.id)}
            className="p-1 hover:bg-secondary-100 rounded transition-colors"
            title={prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star 
              className={`w-4 h-4 ${prompt.isFavorite ? 'text-yellow-500 fill-current' : 'text-secondary-400'}`} 
            />
          </button>
          <button
            onClick={() => onCopy(prompt)}
            className="p-1 hover:bg-secondary-100 rounded transition-colors"
            title="Copy prompt"
          >
            <Copy className="w-4 h-4 text-secondary-400" />
          </button>
          <button
            onClick={() => onEdit(prompt)}
            className="p-1 hover:bg-secondary-100 rounded transition-colors"
            title="Edit prompt"
          >
            <Edit className="w-4 h-4 text-secondary-400" />
          </button>
          <button
            onClick={() => onDelete(prompt.id)}
            className="p-1 hover:bg-red-100 rounded transition-colors"
            title="Delete prompt"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-secondary-700 text-sm leading-relaxed">
          {truncateText(prompt.content, 150)}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-secondary-500">
        <div className="flex items-center gap-4">
          <span>v{prompt.version}</span>
          <span>Used {prompt.usageCount} times</span>
          <span>Updated {formatDate(prompt.updatedAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          {prompt.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-secondary-50 text-secondary-600 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
          {prompt.tags.length > 2 && (
            <span className="text-secondary-400">+{prompt.tags.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptCard; 