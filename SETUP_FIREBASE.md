# Firebase Setup Guidelines

## Overview
This guide provides step-by-step instructions for setting up Firebase services in web applications. Use these guidelines with your AI assistant to integrate Firebase Authentication, Firestore Database, and Hosting.

**Note**: This guide is optimized for web applications.

**Key Principles:**
- **Automation**: Minimize manual console work
- **Security**: Implement proper authentication and security rules
- **User Experience**: Clear, step-by-step guidance
- **Best Practices**: Follow Firebase security guidelines

Always prioritize security and user experience throughout the setup process.


## Prerequisites
Before starting, ensure you have:
- **Node.js 16+** and npm installed
- **Firebase account** (create at [Firebase Console](https://console.firebase.google.com))

## For AI Assistants
You are an expert Firebase integration specialist. Follow these guidelines when setting up Firebase services in web applications. Always prioritize automation, security, and user experience.

## Firebase Setup Instructions

### 1. MCP Server Setup
When user requests Firebase setup:

**Initial Setup:**
- Configure Firebase MCP server using the [official documentation](https://firebase.google.com/docs/cli/mcp-server#before-you-begin)
- This automatically installs Node.js and Firebase CLI if needed
- Verify MCP server tools are available before proceeding

**Authentication:**
- Ensure Firebase CLI is logged in using `firebase login`
- Display the user's logged-in email address
- Confirm this is the correct Firebase account before proceeding to step 2

### 2. Initialize Firebase Project

**For New Firebase Project:**
- Create a new Firebase project and web app using MCP server tools
- Handle project creation automatically (do not ask developers to visit console manually)
- Use environment variables for all Firebase configuration
- Never hardcode API keys in source code

**For Existing Firebase Project:**
- Request the developer's Firebase Project ID or App ID
- Use MCP server tools to connect the existing Firebase app to this project

### 3. Setup Firestore Database

**Database Setup:**
- Set up Firebase Firestore as the primary database for the application
- Implement client code for basic CRUD operations using Firestore SDK
- Run `firebase deploy` command to provision the database automatically
- Use production environment directly (avoid emulator for initial setup)

**Verification & Testing:**
- Only proceed to verification after running the `firebase deploy` command
- Guide developers to verify database creation at the [Firebase Console](https://console.firebase.google.com/)
- Navigate to "Firestore Database" in the left navigation to confirm database creation
- Ask developers to test their application and confirm they can see test data in the console
- Only proceed to the next step after confirmation

**Security:**
- Recommend implementing authentication if the application handles sensitive user data
- Guide users to navigate to "Firestore Database" → "Rules" tab to configure security rules
- **Warning**: Never make Firestore security rules public (allowing read/write without authentication)

### 4. Configure Firebase Authentication

**Permission & Setup:**
- Request developer permission before implementing sign-up and login features
- Guide developers to enable authentication providers (Email/Password, Google Sign-in, etc.) in the [Firebase Auth Console](https://console.firebase.google.com/)
- Ask developers to confirm which authentication method they selected before proceeding

**Implementation:**
- Create sign-up and login pages using Firebase Authentication
- Update Firestore security rules and deploy them to ensure only authenticated users can access their own data
- Handle security rule updates automatically (do not ask developers to go to console)

**Testing & Deployment:**
- Test the complete sign-up and sign-in flow to verify authentication functionality
- Deploy the application to production once authentication is verified and working properly

### 5. Configure Firebase Hosting

**When to Deploy:**
- Introduce Firebase Hosting when developers are ready to deploy their application to production
- Alternative: Developers can deploy later using the `/deploy` command

**Deployment Process:**
- Request developer permission before implementing Firebase Hosting
- Check security rules before deploying - do not deploy if rules are public without explicit confirmation
- Configure Firebase Hosting and deploy the application to production

