# Prompt Manager App - Build Guide

## App Description

Build a **Prompt Management Website** that helps users organize, edit, and polish their AI prompts across different projects. This is a web application where users can create, categorize, and analyze their prompts to improve their effectiveness.

## Core Features

### 1. Prompt Management
- **Add/Edit Prompts**: Create new prompts with title, content, project assignment, and category
- **Project Organization**: Group prompts by different projects or use cases
- **Category System**: Tag prompts with categories for easy filtering and organization
- **Rich Text Editing**: Support for bullet points, numbered lists, and emojis

### 2. Prompt Analysis & Polish
- **Real-time Analysis**: Analyze prompts for readability, word count, character count, and estimated tokens
- **Smart Suggestions**: Get contextual suggestions for improving clarity, specificity, structure, context, and tone
- **Visual Feedback**: See analysis results immediately when you click the analyze button
- **Dynamic Suggestions**: Suggestions change based on the actual content of your prompt

### 3. User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modal Dialogs**: Clean, modern interface with modal forms for adding/editing
- **Real-time Updates**: See changes immediately without page refreshes
- **Intuitive Navigation**: Easy filtering and search capabilities

### 4. Data Persistence
- **Cloud Database**: Store all data securely in Firebase Firestore
- **Offline Support**: Fallback to local storage when offline
- **Real-time Sync**: Changes sync across devices automatically

## User Journey (CUJ)

1. **Landing**: User sees a clean dashboard with their existing prompts, projects, and categories
2. **Create Prompt**: Click "Add Prompt" → Fill out form with title, content, project, category → Get instant analysis and suggestions
3. **Organize**: Create projects and categories to group related prompts together
4. **Polish**: Use the analysis panel to improve prompt quality with AI-powered suggestions
5. **Manage**: Edit, delete, and filter prompts as needed

## Build Steps

### Step 1: Build the App Foundation
Ask the LLM: *"Build a React TypeScript application with Tailwind CSS for a prompt management website. The app should have a main dashboard that displays prompts in cards, with forms for adding/editing prompts, projects, and categories. Include a responsive design that works on all devices. Use modern React patterns with hooks and functional components."*

**Key Components Needed:**
- Main App component with state management
- PromptCard component for displaying individual prompts
- PromptForm modal for creating/editing prompts
- ProjectForm and CategoryForm modals
- Analysis panel with metrics and suggestions
- Responsive layout with proper mobile support

### Step 2: Add Firestore Database
Ask the LLM: *"Set up Firebase Firestore as the primary database for this prompt management app. Configure the Firebase project, create the necessary collections (prompts, projects, categories), and implement CRUD operations. Set up real-time subscriptions so the app updates automatically when data changes. Also implement a hybrid storage system that falls back to localStorage when Firebase is not available. IMPORTANT: Use environment variables for all Firebase configuration (REACT_APP_FIREBASE_*) and never hardcode API keys in the source code. Create a .env.example template file for users to copy and configure their own Firebase project."*

**What the LLM Should Handle:**
- Firebase project configuration and initialization using environment variables
- Firestore security rules setup
- Collection structure design
- Real-time data synchronization
- Offline fallback implementation
- Environment variable setup with .env.example template
- Security best practices (no hardcoded API keys)

### Step 3: Add Authentication
Ask the LLM: *"Implement Firebase Authentication for user login and registration. Add a login/signup system with email/password authentication. Protect the app so only authenticated users can access their prompts. Set up user-specific data isolation so each user only sees their own prompts, projects, and categories."*

**What the LLM Should Handle:**
- Firebase Auth configuration
- Login/signup UI components
- User authentication state management
- Data security and user isolation
- Protected routes and components

### Step 4: Deploy to Production
Ask the LLM: *"Deploy this prompt management app to Firebase Hosting. Set up the production build process, configure the hosting settings, and deploy the app so it's accessible via a public URL. Ensure all Firebase services (Firestore, Auth, Hosting) are properly configured for production use."*

**What the LLM Should Handle:**
- Production build optimization
- Firebase Hosting configuration
- Environment variable setup
- Domain and SSL configuration
- Performance optimization

## Technical Requirements

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase Firestore, Firebase Authentication
- **Deployment**: Firebase Hosting
- **Icons**: Lucide React
- **State Management**: React hooks and context
- **Responsive Design**: Mobile-first approach

## Security Requirements

- **Environment Variables**: All Firebase configuration must use environment variables (REACT_APP_FIREBASE_*)
- **No Hardcoded Secrets**: Never commit API keys, passwords, or sensitive data to version control
- **Template Files**: Provide .env.example with placeholder values for user configuration
- **Gitignore**: Ensure .env.local and other sensitive files are properly gitignored
- **Documentation**: Include clear setup instructions for environment variables

### Security Implementation Checklist

**Firebase Configuration:**
- [ ] Use `process.env.REACT_APP_FIREBASE_API_KEY` instead of hardcoded values
- [ ] Create `.env.example` with placeholder values like `your_api_key_here`
- [ ] Add `.env.local` to `.gitignore` to prevent accidental commits
- [ ] Document the setup process in README

**Code Structure:**
- [ ] Firebase config file should only reference environment variables
- [ ] No API keys, project IDs, or sensitive data in source code
- [ ] Provide clear error handling for missing environment variables

**Documentation:**
- [ ] Include step-by-step Firebase setup instructions
- [ ] Explain how to get Firebase config from console
- [ ] Warn users about not committing their `.env.local` file

## Success Criteria

The final app should:
- Allow users to create, edit, and delete prompts with full CRUD operations
- Provide real-time prompt analysis with actionable suggestions
- Support project and category organization
- Work seamlessly across all devices
- Persist data in the cloud with offline fallback
- Have user authentication and data isolation
- Be deployed and accessible via a public URL
- Follow security best practices with no exposed API keys or sensitive data 