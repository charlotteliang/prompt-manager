import React, { useState, useEffect } from 'react';
import { Prompt, Project, Category } from './types';
import { 
  getPrompts, savePrompts, addPrompt, updatePrompt, deletePrompt,
  getProjects, addProject, updateProject,
  getCategories, addCategory, updateCategory
} from './utils/storage';
import PromptCard from './components/PromptCard';
import PromptForm from './components/PromptForm';
import ProjectForm from './components/ProjectForm';
import CategoryForm from './components/CategoryForm';
import Sidebar from './components/Sidebar';
import { Plus, MessageSquare, CheckCircle } from 'lucide-react';

function App() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | undefined>();
  
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [shouldReopenPromptForm, setShouldReopenPromptForm] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    setPrompts(getPrompts());
    setProjects(getProjects());
    setCategories(getCategories());
  }, []);

  // Filter prompts based on current filters
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = searchQuery === '' || 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesProject = selectedProject === '' || prompt.project === selectedProject;
    const matchesCategory = selectedCategory === '' || prompt.category === selectedCategory;
    const matchesFavorites = !showFavorites || prompt.isFavorite;
    
    return matchesSearch && matchesProject && matchesCategory && matchesFavorites;
  });

  // Prompt handlers
  const handleSavePrompt = (prompt: Prompt) => {
    if (editingPrompt) {
      updatePrompt(prompt);
      setPrompts(getPrompts());
    } else {
      addPrompt(prompt);
      setPrompts(getPrompts());
    }
    setShowPromptForm(false);
    setEditingPrompt(undefined);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setShowPromptForm(true);
  };

  const handleDeletePrompt = (promptId: string) => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      deletePrompt(promptId);
      setPrompts(getPrompts());
    }
  };

  const handleToggleFavorite = (promptId: string) => {
    const updatedPrompts = prompts.map(prompt => 
      prompt.id === promptId 
        ? { ...prompt, isFavorite: !prompt.isFavorite }
        : prompt
    );
    setPrompts(updatedPrompts);
    savePrompts(updatedPrompts);
  };

  const handleCopyPrompt = (prompt: Prompt) => {
    navigator.clipboard.writeText(prompt.content);
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 2000);
  };

  // Project handlers
  const handleSaveProject = (project: Project) => {
    if (editingProject) {
      updateProject(project);
      setProjects(getProjects());
    } else {
      addProject(project);
      setProjects(getProjects());
    }
    setShowProjectForm(false);
    setEditingProject(undefined);
    
    // If we were trying to create a prompt, reopen the prompt form
    if (shouldReopenPromptForm) {
      setShowPromptForm(true);
      setShouldReopenPromptForm(false);
    }
  };



  // Category handlers
  const handleSaveCategory = (category: Category) => {
    if (editingCategory) {
      updateCategory(category);
      setCategories(getCategories());
    } else {
      addCategory(category);
      setCategories(getCategories());
    }
    setShowCategoryForm(false);
    setEditingCategory(undefined);
  };



  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white border-b border-secondary-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-secondary-900">Prompt Manager</h1>
          </div>
          <button
            onClick={() => setShowPromptForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Prompt
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          projects={projects}
          categories={categories}
          selectedProject={selectedProject}
          selectedCategory={selectedCategory}
          showFavorites={showFavorites}
          searchQuery={searchQuery}
          onProjectSelect={setSelectedProject}
          onCategorySelect={setSelectedCategory}
          onToggleFavorites={() => setShowFavorites(!showFavorites)}
          onSearchChange={setSearchQuery}
          onAddProject={() => setShowProjectForm(true)}
          onAddCategory={() => setShowCategoryForm(true)}
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Filters and Stats */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-secondary-900">
                  {showFavorites ? 'Favorite Prompts' : 'All Prompts'}
                </h2>
                <p className="text-secondary-600">
                  {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''}
                  {selectedProject && ` in ${selectedProject}`}
                  {selectedCategory && ` • ${selectedCategory}`}
                </p>
              </div>
            </div>
          </div>

          {/* Prompts Grid */}
          {filteredPrompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map(prompt => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onEdit={handleEditPrompt}
                  onDelete={handleDeletePrompt}
                  onToggleFavorite={handleToggleFavorite}
                  onCopy={handleCopyPrompt}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                No prompts found
              </h3>
              <p className="text-secondary-600 mb-6">
                {searchQuery || selectedProject || selectedCategory || showFavorites
                  ? 'Try adjusting your filters or search terms.'
                  : 'Get started by creating your first prompt!'}
              </p>
              {!searchQuery && !selectedProject && !selectedCategory && !showFavorites && (
                <button
                  onClick={() => setShowPromptForm(true)}
                  className="btn-primary"
                >
                  Create Your First Prompt
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showPromptForm && (
        <PromptForm
          prompt={editingPrompt}
          projects={projects}
          categories={categories}
          onSave={handleSavePrompt}
          onCancel={() => {
            setShowPromptForm(false);
            setEditingPrompt(undefined);
          }}
          onAddProject={() => {
            setShowPromptForm(false);
            setShouldReopenPromptForm(true);
            setShowProjectForm(true);
          }}
        />
      )}

      {showProjectForm && (
        <ProjectForm
          project={editingProject}
          onSave={handleSaveProject}
          onCancel={() => {
            setShowProjectForm(false);
            setEditingProject(undefined);
          }}
        />
      )}

      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          projects={projects}
          onSave={handleSaveCategory}
          onCancel={() => {
            setShowCategoryForm(false);
            setEditingCategory(undefined);
          }}
        />
      )}

      {/* Copied Message */}
      {showCopiedMessage && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <CheckCircle className="w-4 h-4" />
          <span>Prompt copied to clipboard!</span>
        </div>
      )}
    </div>
  );
}

export default App; 