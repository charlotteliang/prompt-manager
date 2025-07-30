# Prompt Manager - 4-Step Firebase Build Guide

## 🎯 **Goal**
Build a React app for managing prompts with Firebase Firestore, Auth, and Hosting in 4 clear steps.

## 🛠️ **Tech Stack**
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Hosting)
- **Icons**: Lucide React

---

## 📋 **Step 1: Build the App**

### **Create React App**
```bash
npx create-react-app prompt-manager --template typescript
cd prompt-manager
npm install tailwindcss lucide-react uuid
npm install -D @types/uuid
```

### **Setup Tailwind CSS**
```bash
npx tailwindcss init -p
```

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#eff6ff', 500: '#3b82f6', 600: '#2563eb' },
        secondary: { 50: '#f9fafb', 200: '#e5e7eb', 500: '#6b7280', 700: '#374151', 900: '#111827' }
      }
    }
  }
}
```

### **Core Features to Build**
- ✅ Create, edit, delete prompts
- ✅ Organize by projects and categories
- ✅ Real-time analysis (word count, readability)
- ✅ Responsive design with modal dialogs
- ✅ Local storage for data persistence

### **Key Components**
```typescript
// src/types/index.ts
interface Prompt {
  id: string;
  title: string;
  content: string;
  project: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  version: number;
  isFavorite: boolean;
  usageCount: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔥 **Step 2: Add Firestore as Database**

### **Install Firebase**
```bash
npm install firebase
```

### **Create Firebase Project**
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create new project
3. Enable Firestore Database
4. Create web app and copy config

### **Setup Environment Variables**
Create `.env.local`:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### **Initialize Firebase**
```typescript
// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### **Create Firestore Service**
```typescript
// src/services/firebaseService.ts
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const promptService = {
  add: async (prompt: Omit<Prompt, 'id'>) => {
    return await addDoc(collection(db, 'prompts'), prompt);
  },
  getAll: async () => {
    const snapshot = await getDocs(collection(db, 'prompts'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  update: async (id: string, data: Partial<Prompt>) => {
    const docRef = doc(db, 'prompts', id);
    return await updateDoc(docRef, data);
  },
  delete: async (id: string) => {
    const docRef = doc(db, 'prompts', id);
    return await deleteDoc(docRef);
  }
};
```

---

## 🔐 **Step 3: Add Login with Auth**

### **Enable Authentication**
1. In Firebase Console, go to Authentication
2. Enable Email/Password sign-in method
3. Add test users if needed

### **Install Auth Dependencies**
```bash
npm install firebase
```

### **Setup Auth Service**
```typescript
// src/services/authService.ts
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { app } from '../config/firebase';

const auth = getAuth(app);

export const authService = {
  login: async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  },
  register: async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  },
  logout: async () => {
    return await signOut(auth);
  }
};
```

### **Create Auth Components**
```typescript
// src/components/LoginForm.tsx
import { useState } from 'react';
import { authService } from '../services/authService';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.login(email, password);
      // Redirect or update state
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};
```

### **Add Auth Context**
```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

const AuthContext = createContext<{ user: User | null }>({ user: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

## 🚀 **Step 4: Add Hosting to Launch to Production**

### **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

### **Login to Firebase**
```bash
firebase login
```

### **Initialize Firebase Hosting**
```bash
firebase init hosting
# Select your project
# Use build folder: build
# Configure as single-page app: Yes
# Don't overwrite index.html: No
```

### **Build the App**
```bash
npm run build
```

### **Deploy to Production**
```bash
firebase deploy
```

### **Your app is now live!**
Visit your Firebase Hosting URL (e.g., `https://your-project.web.app`)

---

## 📝 **Summary**

1. **✅ Build the App**: React + TypeScript + Tailwind with core features
2. **✅ Add Firestore**: Cloud database for data persistence
3. **✅ Add Auth**: User authentication and login system
4. **✅ Add Hosting**: Deploy to production with Firebase Hosting

Your Prompt Manager app is now fully functional with Firebase backend and deployed to production! 