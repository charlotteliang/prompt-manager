import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Prompt, Project, Category } from '../types';

// Collection names
const COLLECTIONS = {
  PROMPTS: 'prompts',
  PROJECTS: 'projects',
  CATEGORIES: 'categories'
};

// Convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

// Convert Date to Firestore timestamp
const convertToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Prompt Services
export const promptService = {
  // Get all prompts
  async getAll(): Promise<Prompt[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.PROMPTS));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt)
    })) as Prompt[];
  },

  // Get prompts by project
  async getByProject(projectName: string): Promise<Prompt[]> {
    const q = query(
      collection(db, COLLECTIONS.PROMPTS),
      where('project', '==', projectName)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt)
    })) as Prompt[];
  },

  // Get favorite prompts
  async getFavorites(): Promise<Prompt[]> {
    const q = query(
      collection(db, COLLECTIONS.PROMPTS),
      where('isFavorite', '==', true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt)
    })) as Prompt[];
  },

  // Search prompts
  async search(searchTerm: string): Promise<Prompt[]> {
    const allPrompts = await this.getAll();
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return allPrompts.filter(prompt => 
      prompt.title.toLowerCase().includes(lowerSearchTerm) ||
      prompt.content.toLowerCase().includes(lowerSearchTerm) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
    );
  },

  // Add new prompt
  async add(prompt: Omit<Prompt, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.PROMPTS), {
      ...prompt,
      createdAt: convertToTimestamp(prompt.createdAt),
      updatedAt: convertToTimestamp(prompt.updatedAt)
    });
    return docRef.id;
  },

  // Update prompt
  async update(id: string, updates: Partial<Prompt>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PROMPTS, id);
    const updateData = {
      ...updates,
      updatedAt: convertToTimestamp(new Date())
    };
    await updateDoc(docRef, updateData);
  },

  // Delete prompt
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PROMPTS, id);
    await deleteDoc(docRef);
  },

  // Toggle favorite
  async toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
    await this.update(id, { isFavorite });
  },

  // Increment usage count
  async incrementUsage(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PROMPTS, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentCount = docSnap.data().usageCount || 0;
      await updateDoc(docRef, { usageCount: currentCount + 1 });
    }
  },

  // Real-time listener for prompts
  subscribeToPrompts(callback: (prompts: Prompt[]) => void) {
    const q = query(
      collection(db, COLLECTIONS.PROMPTS),
      orderBy('updatedAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const prompts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt)
      })) as Prompt[];
      callback(prompts);
    });
  }
};

// Project Services
export const projectService = {
  // Get all projects
  async getAll(): Promise<Project[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.PROJECTS));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt)
    })) as Project[];
  },

  // Add new project
  async add(project: Omit<Project, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), {
      ...project,
      createdAt: convertToTimestamp(project.createdAt)
    });
    return docRef.id;
  },

  // Update project
  async update(id: string, updates: Partial<Project>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PROJECTS, id);
    await updateDoc(docRef, updates);
  },

  // Delete project and all associated prompts
  async delete(id: string): Promise<void> {
    const batch = writeBatch(db);
    
    // Get project name first
    const projectDoc = await getDoc(doc(db, COLLECTIONS.PROJECTS, id));
    if (!projectDoc.exists()) return;
    
    const projectName = projectDoc.data().name;
    
    // Delete all prompts in this project
    const promptsQuery = query(
      collection(db, COLLECTIONS.PROMPTS),
      where('project', '==', projectName)
    );
    const promptsSnapshot = await getDocs(promptsQuery);
    promptsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete the project
    batch.delete(doc(db, COLLECTIONS.PROJECTS, id));
    
    await batch.commit();
  },

  // Real-time listener for projects
  subscribeToProjects(callback: (projects: Project[]) => void) {
    const q = query(
      collection(db, COLLECTIONS.PROJECTS),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt)
      })) as Project[];
      callback(projects);
    });
  }
};

// Category Services
export const categoryService = {
  // Get all categories
  async getAll(): Promise<Category[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.CATEGORIES));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  },

  // Get categories by project
  async getByProject(projectId: string): Promise<Category[]> {
    const q = query(
      collection(db, COLLECTIONS.CATEGORIES),
      where('projectId', '==', projectId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  },

  // Add new category
  async add(category: Omit<Category, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.CATEGORIES), category);
    return docRef.id;
  },

  // Update category
  async update(id: string, updates: Partial<Category>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CATEGORIES, id);
    await updateDoc(docRef, updates);
  },

  // Delete category
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CATEGORIES, id);
    await deleteDoc(docRef);
  },

  // Real-time listener for categories
  subscribeToCategories(callback: (categories: Category[]) => void) {
    const q = query(collection(db, COLLECTIONS.CATEGORIES));
    
    return onSnapshot(q, (querySnapshot) => {
      const categories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      callback(categories);
    });
  }
}; 