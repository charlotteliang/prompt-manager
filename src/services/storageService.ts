import { promptService, projectService, categoryService } from './firebaseService';
import { Prompt, Project, Category } from '../types';
import { 
  getPrompts as getLocalPrompts,
  savePrompts as saveLocalPrompts,
  addPrompt as addLocalPrompt,
  updatePrompt as updateLocalPrompt,
  deletePrompt as deleteLocalPrompt,
  getProjects as getLocalProjects,
  addProject as addLocalProject,
  updateProject as updateLocalProject,
  deleteProject as deleteLocalProject,
  getCategories as getLocalCategories,
  addCategory as addLocalCategory,
  updateCategory as updateLocalCategory,
  deleteCategory as deleteLocalCategory
} from '../utils/storage';

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  };
  
  return config.apiKey && config.authDomain && config.projectId && 
         config.apiKey !== 'your-api-key' && 
         config.authDomain !== 'your-project.firebaseapp.com' && 
         config.projectId !== 'your-project-id';
};

// Fallback to localStorage if Firebase is not configured
const useLocalStorage = !isFirebaseConfigured();

// Unified Storage Service
export const storageService = {
  // Prompt operations
  async getPrompts(): Promise<Prompt[]> {
    if (useLocalStorage) {
      return getLocalPrompts();
    }
    try {
      return await promptService.getAll();
    } catch (error) {
      console.warn('Firebase failed, falling back to localStorage:', error);
      return getLocalPrompts();
    }
  },

  async addPrompt(prompt: Omit<Prompt, 'id'>): Promise<string> {
    if (useLocalStorage) {
      const id = crypto.randomUUID();
      addLocalPrompt({ ...prompt, id });
      return id;
    }
    try {
      return await promptService.add(prompt);
    } catch (error) {
      console.warn('Firebase failed, falling back to localStorage:', error);
      const id = crypto.randomUUID();
      addLocalPrompt({ ...prompt, id });
      return id;
    }
  },

  async updatePrompt(prompt: Prompt): Promise<void> {
    if (useLocalStorage) {
      updateLocalPrompt(prompt);
      return;
    }
    try {
      await promptService.update(prompt.id, prompt);
    } catch (error) {
      console.warn('Firebase failed, falling back to localStorage:', error);
      updateLocalPrompt(prompt);
    }
  },

  async deletePrompt(promptId: string): Promise<void> {
    if (useLocalStorage) {
      deleteLocalPrompt(promptId);
      return;
    }
    try {
      await promptService.delete(promptId);
    } catch (error) {
      console.warn('Firebase failed, falling back to localStorage:', error);
      deleteLocalPrompt(promptId);
    }
  },

  async toggleFavorite(promptId: string, isFavorite: boolean): Promise<void> {
    if (useLocalStorage) {
      const prompts = getLocalPrompts();
      const updatedPrompts = prompts.map(p => 
        p.id === promptId ? { ...p, isFavorite } : p
      );
      saveLocalPrompts(updatedPrompts);
      return;
    }
    try {
      await promptService.toggleFavorite(promptId, isFavorite);
    } catch (error) {
      console.warn('Firebase failed, falling back to localStorage:', error);
      const prompts = getLocalPrompts();
      const updatedPrompts = prompts.map(p => 
        p.id === promptId ? { ...p, isFavorite } : p
      );
      saveLocalPrompts(updatedPrompts);
    }
  },

  // Project operations
  async getProjects(): Promise<Project[]> {
    if (useLocalStorage) {
      return getLocalProjects();
    }
    try {
      return await projectService.getAll();
    } catch (error) {
      console.warn('Firebase failed, falling back to localStorage:', error);
      return getLocalProjects();
    }
  },

  async addProject(project: Omit<Project, 'id'>): Promise<string> {
    if (useLocalStorage) {
      const id = crypto.randomUUID();
      addLocalProject({ ...project, id });
      return id;
    }
    try {
      return await projectService.add(project);
    } catch (error) {
      console.warn('Firebase failed, falling back to localStorage:', error);
      const id = crypto.randomUUID();
      addLocalProject({ ...project, id });
      return id;
    }
  },

  async updateProject(project: Project): Promise<void> {
    if (useLocalStorage) {
      updateLocalProject(project);
      return;
    }
    try {
      await projectService.update(project.id, project);
    } catch (error) {
      console.warn('Firebase failed, falling back to localStorage:', error);
      updateLocalProject(project);
    }
  },

  async deleteProject(projectId: string): Promise<void> {
    if (useLocalStorage) {
      deleteLocalProject(projectId);
      return;
    }
    try {
      await projectService.delete(projectId);
    } catch (error) {
      console.warn('Firebase failed, falling back to localStorage:', error);
      deleteLocalProject(projectId);
    }
  },

  // Category operations
  async getCategories(): Promise<Category[]> {
    if (useLocalStorage) {
      return getLocalCategories();
    }
    try {
      return await categoryService.getAll();
    } catch (error) {
      console.warn('Firebase failed, falling back to localStorage:', error);
      return getLocalCategories();
    }
  },

  async addCategory(category: Omit<Category, 'id'>): Promise<string> {
    if (useLocalStorage) {
      const id = crypto.randomUUID();
      addLocalCategory({ ...category, id });
      return id;
    }
    try {
      return await categoryService.add(category);
    } catch (error) {
      console.warn('Firebase failed, falling back to localStorage:', error);
      const id = crypto.randomUUID();
      addLocalCategory({ ...category, id });
      return id;
    }
  },

  async updateCategory(category: Category): Promise<void> {
    if (useLocalStorage) {
      updateLocalCategory(category);
      return;
    }
    try {
      await categoryService.update(category.id, category);
    } catch (error) {
      console.warn('Firebase failed, falling back to localStorage:', error);
      updateLocalCategory(category);
    }
  },

  async deleteCategory(categoryId: string): Promise<void> {
    if (useLocalStorage) {
      deleteLocalCategory(categoryId);
      return;
    }
    try {
      await categoryService.delete(categoryId);
    } catch (error) {
      console.warn('Firebase failed, falling back to localStorage:', error);
      deleteLocalCategory(categoryId);
    }
  },

  // Real-time subscriptions (Firebase only)
  subscribeToPrompts(callback: (prompts: Prompt[]) => void) {
    if (useLocalStorage) {
      // For localStorage, we'll just call the callback with current data
      callback(getLocalPrompts());
      return () => {}; // No-op unsubscribe
    }
    try {
      return promptService.subscribeToPrompts(callback);
    } catch (error) {
      console.warn('Firebase subscription failed, falling back to localStorage:', error);
      callback(getLocalPrompts());
      return () => {};
    }
  },

  subscribeToProjects(callback: (projects: Project[]) => void) {
    if (useLocalStorage) {
      callback(getLocalProjects());
      return () => {};
    }
    try {
      return projectService.subscribeToProjects(callback);
    } catch (error) {
      console.warn('Firebase subscription failed, falling back to localStorage:', error);
      callback(getLocalProjects());
      return () => {};
    }
  },

  subscribeToCategories(callback: (categories: Category[]) => void) {
    if (useLocalStorage) {
      callback(getLocalCategories());
      return () => {};
    }
    try {
      return categoryService.subscribeToCategories(callback);
    } catch (error) {
      console.warn('Firebase subscription failed, falling back to localStorage:', error);
      callback(getLocalCategories());
      return () => {};
    }
  },

  // Utility functions
  isUsingFirebase(): boolean {
    return !useLocalStorage;
  },

  isUsingLocalStorage(): boolean {
    return useLocalStorage;
  }
}; 