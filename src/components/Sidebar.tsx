import React from 'react';
import { Project, Category } from '../types';
import { Plus, Folder, Tag, Star, Search, Edit, Trash2 } from 'lucide-react';

interface SidebarProps {
  projects: Project[];
  categories: Category[];
  selectedProject: string;
  selectedCategory: string;
  showFavorites: boolean;
  searchQuery: string;
  onProjectSelect: (project: string) => void;
  onCategorySelect: (category: string) => void;
  onToggleFavorites: () => void;
  onSearchChange: (query: string) => void;
  onAddProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onAddCategory: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  projects,
  categories,
  selectedProject,
  selectedCategory,
  showFavorites,
  searchQuery,
  onProjectSelect,
  onCategorySelect,
  onToggleFavorites,
  onSearchChange,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onAddCategory,
}) => {
  const projectCategories = categories.filter(cat => 
    !selectedProject || cat.projectId === selectedProject
  );

  return (
    <div className="w-64 bg-white border-r border-secondary-200 p-6 space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search prompts..."
          className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Favorites */}
      <div>
        <button
          onClick={onToggleFavorites}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            showFavorites 
              ? 'bg-primary-100 text-primary-700' 
              : 'text-secondary-600 hover:bg-secondary-100'
          }`}
        >
          <Star className={`w-4 h-4 ${showFavorites ? 'fill-current' : ''}`} />
          <span className="font-medium">Favorites</span>
        </button>
      </div>

      {/* Projects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-secondary-900 uppercase tracking-wide">
            Projects
          </h3>
          <button
            onClick={onAddProject}
            className="p-1 hover:bg-secondary-100 rounded transition-colors"
            title="Add new project"
          >
            <Plus className="w-4 h-4 text-secondary-400" />
          </button>
        </div>
        
        <div className="space-y-1">
          <button
            onClick={() => onProjectSelect('')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              !selectedProject 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-secondary-600 hover:bg-secondary-100'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span className="font-medium">All Projects</span>
          </button>
          
          {projects.map(project => (
            <div
              key={project.id}
              className={`group flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                selectedProject === project.name 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-secondary-600 hover:bg-secondary-100'
              }`}
            >
              <button
                onClick={() => onProjectSelect(project.name)}
                className="flex-1 flex items-center gap-3 text-left"
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <span className="font-medium truncate">{project.name}</span>
              </button>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditProject(project);
                  }}
                  className="p-1 hover:bg-secondary-200 rounded transition-colors"
                  title="Edit project"
                >
                  <Edit className="w-3 h-3 text-secondary-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProject(project.id);
                  }}
                  className="p-1 hover:bg-red-200 rounded transition-colors"
                  title="Delete project"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      {selectedProject && projectCategories.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-secondary-900 uppercase tracking-wide">
              Categories
            </h3>
            <button
              onClick={onAddCategory}
              className="p-1 hover:bg-secondary-100 rounded transition-colors"
              title="Add new category"
            >
              <Plus className="w-4 h-4 text-secondary-400" />
            </button>
          </div>
          
          <div className="space-y-1">
            <button
              onClick={() => onCategorySelect('')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                !selectedCategory 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-secondary-600 hover:bg-secondary-100'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span className="font-medium">All Categories</span>
            </button>
            
            {projectCategories.map(category => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  selectedCategory === category.name 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-secondary-600 hover:bg-secondary-100'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span className="font-medium truncate">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="pt-6 border-t border-secondary-200">
        <div className="text-sm text-secondary-500 space-y-2">
          <div className="flex justify-between">
            <span>Total Projects:</span>
            <span className="font-medium">{projects.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Categories:</span>
            <span className="font-medium">{categories.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 