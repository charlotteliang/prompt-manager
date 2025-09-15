# Firebase Setup Cursor Rules

## Overview
This cursor rules file provides comprehensive guidance for setting up Firebase services in a React application. Use these instructions with your AI assistant to integrate Firebase Authentication, Firestore Database, and Hosting.

## Prerequisites
Before starting, ensure you have:
- **Node.js 16+** and npm installed
- **Firebase account** (create at https://console.firebase.google.com)

You are an expert integrating Firebase into web apps. Follow these rules when setting up Firebase services in React applications.

## Firebase Setup Instructions

### 1: MCP Server Setup
When user asks to set up Firebase Data Connect:
   - First, ensure Firebase MCP server is set up based on this documentation: https://firebase.google.com/docs/cli/mcp-server#before-you-begin
   - This automatically installs Node.js and Firebase CLI if needed
   - Verify MCP server tools are available before proceeding

### 2. Initialize Firebase Project

**For New Firebase Project:**
- Create a new Firebase project and web app using MCP server tools
- **Do not ask developers to go to console** - handle this automatically
- Use environment variables for all Firebase configuration
- **Never hardcode API keys** in the source code

**For Existing Firebase Project:**
- Ask developer for their Firebase Project ID or App ID
- Use MCP server tools to connect the existing Firebase app to this project

### 3. Setup Firestore Database

- Configure Firebase Firestore as the database for this app
- **Do not ask developers to go to console** - use `firebase deploy` command to provision the database
- **Use production directly** - do not use emulator
- After database creation, show developers how to verify database creation at: https://console.firebase.google.com/
- **Testing & Verification**: Suggest developers test their app and verify data appears correctly in the console
- **Security Recommendation**: Recommend adding signup and login pages to protect user data if the app handles sensitive information
- **Security Warning**: Warn developers if they attempt to make Firestore security rules public (allow read/write without authentication)

### 4. Setup Firebase Authentication

- Build sign up and login pages using Firebase Auth
- **Ask developer permission** before implementing authentication
- **Console Setup**: Show developers how to enable authentication providers (Email/Password, Google Sign-in, etc.) in the Firebase Auth Console at: https://console.firebase.google.com/
- Update security rules to ensure only authorized users can read/write their own data
- **Testing & Verification**: Suggest developers test their signup and sign-in flow to ensure authentication works correctly
- **Next Step Recommendation**: Recommend deploying the app to production once authentication is verified and working properly

### 5. Setup Firebase Hosting

- Configure Firebase Hosting and deploy the app to production
