# 🚀 Prompt Manager

A modern, secure web application for managing and organizing AI prompts with Firebase authentication and Firestore database integration.

![Prompt Manager](https://img.shields.io/badge/React-18-blue)
![Firebase](https://img.shields.io/badge/Firebase-10-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)

## ✨ Features

### 🔐 **Authentication & Security**
- **Firebase Authentication** with email/password and Google sign-in
- **User-scoped data** - each user can only access their own content
- **Secure Firestore rules** requiring authentication
- **Beautiful login/signup UI** with form validation

### 📝 **Prompt Management**
- **Create, edit, and delete** prompts with rich metadata
- **Project-based organization** with custom colors
- **Category system** for fine-grained organization
- **Tagging system** for flexible categorization
- **Favorites** for quick access to frequently used prompts
- **Search functionality** across titles, content, and tags
- **Usage tracking** to see which prompts are most popular

### 🎨 **Modern UI/UX**
- **Responsive design** that works on all devices
- **Dark mode support** with system preference detection
- **Real-time updates** using Firestore listeners
- **Intuitive sidebar navigation** with project/category filtering
- **Copy to clipboard** functionality
- **Keyboard shortcuts** for power users

### 🔄 **Data Management**
- **Firestore database** for cloud synchronization across devices
- **Real-time sync** - changes appear instantly across all sessions
- **Offline support** with automatic sync when reconnected
- **Data export/import** capabilities
- **Automatic backups** via Firebase

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Firebase Firestore (NoSQL document database)
- **Authentication**: Firebase Auth
- **Icons**: Lucide React
- **Build Tool**: Create React App
- **Deployment**: Firebase Hosting (optional)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Firebase account (for cloud features)

### 1. Clone and Install

```bash
git clone https://github.com/charlotteliang/prompt-manager.git
cd prompt-manager
npm install
```

### 2. Firebase Setup (Required for authentication)

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password and Google providers
3. Create Firestore Database:
   - Go to Firestore Database > Create database
   - Start in production mode (rules are already configured)
   - Choose a location close to your users
4. Get your config:
   - Go to Project Settings > General
   - Add a web app and copy the config

### 3. Configure Firebase

Update `src/config/firebase.ts` with your project details:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4. Deploy Firestore Rules

```bash
firebase login
firebase use your-project-id
firebase deploy --only firestore:rules
```

### 5. Run the App

```bash
npm start
```

Visit `http://localhost:3000` and create an account to start managing your prompts!

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── LoginForm.tsx   # Authentication UI
│   ├── PromptCard.tsx  # Individual prompt display
│   ├── PromptForm.tsx  # Create/edit prompt form
│   ├── ProjectForm.tsx # Create/edit project form
│   ├── CategoryForm.tsx# Create/edit category form
│   └── Sidebar.tsx     # Navigation sidebar
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── services/           # Business logic
│   ├── firebaseService.ts  # Direct Firebase operations
│   └── dataService.ts      # Unified data access layer
├── types/              # TypeScript definitions
│   └── index.ts        # All interface definitions
├── utils/              # Utility functions
│   ├── promptAnalysis.ts   # AI prompt analysis
│   └── storage.ts          # Local storage fallback
├── config/             # Configuration
│   └── firebase.ts     # Firebase initialization
└── App.tsx             # Main application component
```

## 🔥 Firebase Integration

### Firestore Database Structure

```
users/{userId}/
├── prompts/            # User's prompts
│   └── {promptId}      # Individual prompt document
├── projects/           # User's projects  
│   └── {projectId}     # Individual project document
└── categories/         # User's categories
    └── {categoryId}    # Individual category document
```

### Security Rules

All data is automatically scoped to authenticated users:

```javascript
rules_version = "2";
service cloud.firestore {
  match /databases/{database}/documents {
    match /prompts/{promptId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
    // Similar rules for projects and categories
  }
}
```

## 🛡️ Security Features

- **Authentication required** - No anonymous access
- **User data isolation** - Each user can only access their own data
- **Secure by default** - All Firestore operations are protected
- **Client-side validation** - Form validation with error handling
- **XSS protection** - Safe rendering of user content

## 🚀 Deployment

### Deploy to Firebase Hosting

```bash
npm run build
firebase login
firebase init hosting
firebase deploy
```

### Deploy to Other Platforms

The app builds to static files and can be deployed to:
- Vercel, Netlify, or other static hosts
- GitHub Pages
- Your own server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Firebase](https://firebase.google.com) for backend infrastructure
- [Tailwind CSS](https://tailwindcss.com) for styling system
- [Lucide](https://lucide.dev) for beautiful icons
- [React](https://reactjs.org) for the awesome framework

---

**Made with ❤️ for the AI community** 