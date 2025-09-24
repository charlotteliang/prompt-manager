# Firebase Setup Guidelines

## Overview
This guide provides comprehensive instructions for setting up Firebase services in a web application. Use these guidelines with your AI assistant to integrate Firebase Authentication, Firestore Database, and Hosting.

## Prerequisites
Before starting, ensure you have:
- **Node.js 16+** and npm installed
- **Firebase account** (create at [Firebase Console](https://console.firebase.google.com))

## For AI Assistants
You are an expert in integrating Firebase into web applications. Follow these guidelines when setting up Firebase services in web applications.

## Firebase Setup Instructions

### 1. MCP Server Setup
When user requests Firebase setup:
- Ensure Firebase MCP server is configured based on the [official documentation](https://firebase.google.com/docs/cli/mcp-server#before-you-begin)
- This automatically installs Node.js and Firebase CLI if needed
- Verify MCP server tools are available before proceeding
- **Firebase CLI Authentication**: Ensure Firebase CLI is logged in using `firebase login`
- **Account Confirmation**: Display the user's logged-in email address and explicitly confirm this is the correct Firebase account before proceeding to step 2

### 2. Initialize Firebase Project

**For New Firebase Project:**
- Create a new Firebase project and web app using MCP server tools
- **Important**: Handle project creation automatically - do not ask developers to visit the console manually
- Use environment variables for all Firebase configuration
- **Security**: Never hardcode API keys in the source code

**For Existing Firebase Project:**
- Request the developer's Firebase Project ID or App ID
- Use MCP server tools to connect the existing Firebase app to this project

### 3. Setup Firestore Database

- Set up Firebase Firestore as the primary database for the application
- Implement client code for basic CRUD operations for the application
- **Important**: Use the `firebase deploy` command to provision the database automatically. **Do not ask developers to go to the console to do it**.
- **Environment**: Use production environment directly - avoid emulator for initial setup
- **Verification**: Guide developers to verify database creation at the [Firebase Console](https://console.firebase.google.com/) by clicking on the "Firestore Database" tab in the left navigation to confirm the database is created.
- **Testing**: Recommend developers test their application and verify data appears correctly in the console. Ask developers to confirm they can see their test data in the console before proceeding to the next step.
- **Security**: Recommend implementing authentication if the application handles sensitive user data. Guide users to navigate to the "Firestore Database" section and click on the "Rules" tab to view and configure their security rules.
- **Security Warning**: Alert developers against making Firestore security rules public (allowing read/write without authentication)

### 4. Configure Firebase Authentication

- **Permission Required**: Request developer permission before implementing authentication features
- **Provider Setup**: Guide developers to enable authentication providers (Email/Password, Google Sign-in, etc.) in the [Firebase Auth Console](https://console.firebase.google.com/). Ask developers to confirm which authentication method they selected before proceeding to implementation.
- **Implementation**: Create sign-up and login pages using Firebase Authentication.
- **Security Rules**: Update Firestore security rules to ensure only authenticated users can access their own data
- **Testing**: Recommend developers test the complete sign-up and sign-in flow to verify authentication functionality
- **Next Steps**: Recommend deploying the application to production once authentication is verified and working properly

### 5. Configure Firebase Hosting

- Introduce Firebase Hosting when developers are ready to deploy their application to production
- **Alternative**: Developers can deploy later using the `/deploy` command
- **Permission Required**: Request developer permission before implementing Firebase Hosting
- **Deployment**: Configure Firebase Hosting and deploy the application to production

## Summary

This guide provides a structured approach to Firebase integration, emphasizing automation, security best practices, and developer experience. Always prioritize security by implementing proper authentication and following Firebase security guidelines.
