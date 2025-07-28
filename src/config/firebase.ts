import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration for Prompt Manager App
const firebaseConfig = {
  apiKey: "AIzaSyDzYTg0iP4ij6qClXXf7lSX658Rn9ZwgG4",
  authDomain: "prompt-manager-2024.firebaseapp.com",
  projectId: "prompt-manager-2024",
  storageBucket: "prompt-manager-2024.firebasestorage.app",
  messagingSenderId: "207796645105",
  appId: "1:207796645105:web:f3ecde1781565fcc7c4d50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app; 