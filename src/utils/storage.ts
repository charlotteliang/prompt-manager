import { Prompt, Project, Category } from '../types';

// Local storage keys for browser storage fallback
const STORAGE_KEYS = {
  PROMPTS: 'prompt-manager-prompts',
  PROJECTS: 'prompt-manager-projects',
  CATEGORIES: 'prompt-manager-categories'
};

// Generic local storage functions for fallback when Firestore is unavailable
const getFromStorage = <T>(key: string): T[] => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error(`Error reading from localStorage for key ${key}:`, error);
    return [];
  }
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage for key ${key}:`, error);
  }
};

// Prompt storage functions
export const getPrompts = (): Prompt[] => {
  const prompts = getFromStorage<Prompt>(STORAGE_KEYS.PROMPTS);
  return prompts.map(prompt => ({
    ...prompt,
    createdAt: new Date(prompt.createdAt),
    updatedAt: new Date(prompt.updatedAt),
  }));
};

export const savePrompts = (prompts: Prompt[]): void => {
  saveToStorage(STORAGE_KEYS.PROMPTS, prompts);
};

export const addPrompt = (prompt: Prompt): void => {
  const prompts = getPrompts();
  prompts.push(prompt);
  savePrompts(prompts);
};

export const updatePrompt = (updatedPrompt: Prompt): void => {
  const prompts = getPrompts();
  const index = prompts.findIndex(p => p.id === updatedPrompt.id);
  if (index !== -1) {
    prompts[index] = updatedPrompt;
    savePrompts(prompts);
  }
};

export const deletePrompt = (promptId: string): void => {
  const prompts = getPrompts();
  const filteredPrompts = prompts.filter(p => p.id !== promptId);
  savePrompts(filteredPrompts);
};

// Project storage functions
export const getProjects = (): Project[] => {
  const projects = getFromStorage<Project>(STORAGE_KEYS.PROJECTS);
  return projects.map(project => ({
    ...project,
    createdAt: new Date(project.createdAt),
  }));
};

export const saveProjects = (projects: Project[]): void => {
  saveToStorage(STORAGE_KEYS.PROJECTS, projects);
};

export const addProject = (project: Project): void => {
  const projects = getProjects();
  projects.push(project);
  saveProjects(projects);
};

export const updateProject = (updatedProject: Project): void => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === updatedProject.id);
  if (index !== -1) {
    projects[index] = updatedProject;
    saveProjects(projects);
  }
};

export const deleteProject = (projectId: string): void => {
  const projects = getProjects();
  const filteredProjects = projects.filter(p => p.id !== projectId);
  saveProjects(filteredProjects);
};

// Category storage functions
export const getCategories = (): Category[] => {
  const categories = getFromStorage<Category>(STORAGE_KEYS.CATEGORIES);
  return categories.map(category => ({
    ...category,
  }));
};

export const saveCategories = (categories: Category[]): void => {
  saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
};

export const addCategory = (category: Category): void => {
  const categories = getCategories();
  categories.push(category);
  saveCategories(categories);
};

export const updateCategory = (updatedCategory: Category): void => {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === updatedCategory.id);
  if (index !== -1) {
    categories[index] = updatedCategory;
    saveCategories(categories);
  }
};

export const deleteCategory = (categoryId: string): void => {
  const categories = getCategories();
  const filteredCategories = categories.filter(c => c.id !== categoryId);
  saveCategories(filteredCategories);
}; 