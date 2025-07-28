import { 
  collection, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  writeBatch,
  setDoc
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Prompt, Project, Category } from '../types';

// Collection names
const COLLECTIONS = {
  PROMPTS: 'prompts',
  PROJECTS: 'projects',
  CATEGORIES: 'categories'
};

// Get current user ID
const getCurrentUserId = (): string => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user.uid;
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
  // Get all prompts for current user
  async getAll(): Promise<Prompt[]> {
    const userId = getCurrentUserId();
    const q = query(
      collection(db, COLLECTIONS.PROMPTS),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt)
    })) as Prompt[];
  },

  // Get prompts by project for current user
  async getByProject(projectName: string): Promise<Prompt[]> {
    const userId = getCurrentUserId();
    const q = query(
      collection(db, COLLECTIONS.PROMPTS),
      where('userId', '==', userId),
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

  // Get favorite prompts for current user
  async getFavorites(): Promise<Prompt[]> {
    const userId = getCurrentUserId();
    const q = query(
      collection(db, COLLECTIONS.PROMPTS),
      where('userId', '==', userId),
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

  // Search prompts for current user
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
  async add(prompt: Omit<Prompt, 'id'> & { id: string }): Promise<string> {
    const userId = getCurrentUserId();
    await setDoc(doc(collection(db, COLLECTIONS.PROMPTS), prompt.id), {
      ...prompt,
      userId,
      createdAt: convertToTimestamp(prompt.createdAt),
      updatedAt: convertToTimestamp(prompt.updatedAt)
    });
    return prompt.id;
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
    console.log('Attempting to delete prompt with ID:', id);
    try {
      const docRef = doc(db, COLLECTIONS.PROMPTS, id);
      await deleteDoc(docRef);
      console.log('Successfully deleted prompt with ID:', id);
    } catch (error) {
      console.error('Error deleting prompt:', error);
      throw error;
    }
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
    const userId = getCurrentUserId();
    const q = query(
      collection(db, COLLECTIONS.PROMPTS),
      where('userId', '==', userId),
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
  // Get all projects for current user
  async getAll(): Promise<Project[]> {
    const userId = getCurrentUserId();
    const q = query(
      collection(db, COLLECTIONS.PROJECTS),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt)
    })) as Project[];
  },

  // Add new project
  async add(project: Omit<Project, 'id'> & { id: string }): Promise<string> {
    const userId = getCurrentUserId();
    await setDoc(doc(collection(db, COLLECTIONS.PROJECTS), project.id), {
      ...project,
      userId,
      createdAt: convertToTimestamp(project.createdAt)
    });
    return project.id;
  },

  // Update project
  async update(id: string, updates: Partial<Project>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PROJECTS, id);
    await updateDoc(docRef, updates);
  },

  // Delete project and all associated prompts
  async delete(id: string): Promise<void> {
    console.log('ProjectService: Attempting to delete project with ID:', id);
    try {
      const userId = getCurrentUserId();
      const batch = writeBatch(db);
      
      // Get project name first
      const projectDoc = await getDoc(doc(db, COLLECTIONS.PROJECTS, id));
      if (!projectDoc.exists()) {
        console.log('ProjectService: Project not found with ID:', id);
        return;
      }
      
      const projectData = projectDoc.data();
      // Verify user owns this project
      if (projectData.userId !== userId) {
        throw new Error('Unauthorized: Cannot delete project owned by another user');
      }
      
      const projectName = projectData.name;
      console.log('ProjectService: Found project name:', projectName);
      
      // Delete all prompts in this project for this user
      const promptsQuery = query(
        collection(db, COLLECTIONS.PROMPTS),
        where('userId', '==', userId),
        where('project', '==', projectName)
      );
      const promptsSnapshot = await getDocs(promptsQuery);
      console.log('ProjectService: Found', promptsSnapshot.docs.length, 'prompts to delete');
      
      promptsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      // Delete the project
      batch.delete(doc(db, COLLECTIONS.PROJECTS, id));
      
      await batch.commit();
      console.log('ProjectService: Successfully deleted project and associated prompts');
    } catch (error) {
      console.error('ProjectService: Error deleting project:', error);
      throw error;
    }
  },

  // Real-time listener for projects
  subscribeToProjects(callback: (projects: Project[]) => void) {
    const userId = getCurrentUserId();
    const q = query(
      collection(db, COLLECTIONS.PROJECTS),
      where('userId', '==', userId),
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
  // Get all categories for current user
  async getAll(): Promise<Category[]> {
    const userId = getCurrentUserId();
    const q = query(
      collection(db, COLLECTIONS.CATEGORIES),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  },

  // Get categories by project for current user
  async getByProject(projectId: string): Promise<Category[]> {
    const userId = getCurrentUserId();
    const q = query(
      collection(db, COLLECTIONS.CATEGORIES),
      where('userId', '==', userId),
      where('projectId', '==', projectId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  },

  // Add new category
  async add(category: Omit<Category, 'id'> & { id: string }): Promise<string> {
    const userId = getCurrentUserId();
    await setDoc(doc(collection(db, COLLECTIONS.CATEGORIES), category.id), {
      ...category,
      userId
    });
    return category.id;
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
    const userId = getCurrentUserId();
    const q = query(
      collection(db, COLLECTIONS.CATEGORIES),
      where('userId', '==', userId)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const categories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      callback(categories);
    });
  }
}; 