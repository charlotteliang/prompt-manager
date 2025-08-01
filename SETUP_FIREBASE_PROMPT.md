# Prompt Manager App - Firebase Integration Guide

## Overview

This guide helps you integrate Firebase services (Firestore, Authentication, Hosting) into your existing prompt management app prototype. Follow these steps to transform your local prototype into a cloud-powered application.

## Prerequisites

Prototype your app.

## Firebase Services Integration

### Step 1: Initialize Firebase

Copy and paste this prompt to your AI assistant:

```
Setup Firebase MCP server based on this doc: https://firebase.google.com/docs/cli/mcp-server#before-you-begin.
Create a new Firebase project and a new Firebase web app on the Firebase Console, and connect to this app. 
Use environment variables for all Firebase configuration and never hardcode API keys in the source code.
```

**If you already have an existing Firebase project or web app:**

```
Connect Firebase app ID [Your App ID] with this app.
```

### Step 2: Add Firestore Database

Copy and paste this prompt to your AI assistant:

```
Setup Firebase Firestore as the database for this app.
```

**Additional Prompt for AI Assistant:**

**If asked to go to console to create a database:**

```
Deploy Firestore.
```
This will deploy the local setup and provision a Firestore database on the console.

**If you notice LLMs using emulator:**

```
Do not use Emulator, use production directly.
```

### Step 3: Add Authentication

Copy and paste this prompt to your AI assistant:

```
Build login page using Firebase Auth and update security rules to ensure only authorized users can read/write their own data.
```

• **[USER ACTION]** Follow the instruction from LLM to go to Console and enable Firebase Auth.

### Step 4: Setup Firebase Hosting

Copy and paste this prompt to your AI assistant:

```
Setup Firebase Hosting and deploy the app to production.
```

## Security Requirements

### Environment Variables Setup
- **All Firebase Configuration**: Must use environment variables (REACT_APP_FIREBASE_*)
- **No Hardcoded Secrets**: Never commit API keys, passwords, or sensitive data to version control
- **Environment Files**: Use .env files for configuration management
- **Gitignore**: Ensure .env files are properly gitignored
- **Documentation**: Include clear setup instructions for environment variables

### Security Implementation Checklist

**Firebase Configuration:**
- [ ] Use `process.env.REACT_APP_FIREBASE_API_KEY` instead of hardcoded values
- [ ] Use `.env` file with proper Firebase configuration values
- [ ] Add `.env` to `.gitignore` to prevent accidental commits
- [ ] Document the setup process in README

**Authentication & Data Security:**
- [ ] Implement user authentication with email/password and Google Sign-In
- [ ] Set up Firestore security rules for user-scoped data access
- [ ] Ensure each user can only access their own data
- [ ] Add proper error handling for authentication failures

**Code Structure:**
- [ ] Firebase config file should only reference environment variables
- [ ] No API keys, project IDs, or sensitive data in source code
- [ ] Provide clear error handling for missing environment variables
- [ ] Implement proper logout functionality

**Documentation:**
- [ ] Include step-by-step Firebase setup instructions
- [ ] Explain how to get Firebase config from console
- [ ] Warn users about not committing their `.env` files
- [ ] Document deployment process

## Technical Stack

- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication (Email/Password + Google)
- **Hosting**: Firebase Hosting
- **CI/CD**: GitHub Actions
- **Security**: Environment variables, Firestore security rules

## Success Criteria

The Firebase-integrated app should:
- Store all data securely in Firestore with real-time synchronization
- Support user registration, login, and authentication
- Isolate user data (each user sees only their own prompts/projects)
- Be deployed and accessible via a public URL
- Have automatic deployment on code changes
- Follow security best practices with no exposed API keys
- Maintain offline functionality with localStorage fallback
- Include comprehensive error handling and user feedback

## Common Issues & Solutions

### API Key Errors
- **Issue**: `auth/invalid-api-key` error
- **Solution**: Verify all Firebase config values are correct and environment variables are properly set

### Security Rules
- **Issue**: Permission denied errors
- **Solution**: Ensure Firestore rules allow authenticated users to access their own data

### Environment Variables
- **Issue**: Variables not available in production
- **Solution**: For Firebase web apps, API keys are meant to be public; use proper security rules instead

### Deployment Issues
- **Issue**: GitHub Actions failing
- **Solution**: Check workflow files don't reference non-existent directories (like `hosting/`)

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)