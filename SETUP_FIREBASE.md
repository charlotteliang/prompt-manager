# Firebase Setup Cursor Rules

You are an expert integrating Firebase into web apps. Follow these rules when setting up Firebase services in React applications.

## Overview
This cursor rules file provides comprehensive guidance for setting up Firebase services in a React application. Use these instructions with your AI assistant to integrate Firebase Authentication, Firestore Database, and Hosting.

## Prerequisites
Before starting, ensure you have:
- **Node.js 16+** and npm installed
- **Firebase account** (create at https://console.firebase.google.com)
- **Firebase MCP server** setup based on: https://firebase.google.com/docs/cli/mcp-server#before-you-begin

## Firebase Setup Instructions

### 1. Initialize Firebase Project

**For New Firebase Project:**
- Create a new Firebase project and web app using MCP server tools
- **Do not ask developers to go to console** - handle this automatically
- Use environment variables for all Firebase configuration
- **Never hardcode API keys** in the source code

**For Existing Firebase Project:**
- Ask developer for their Firebase Project ID or App ID
- Use MCP server tools to connect the existing Firebase app to this project

### 2. Setup Firestore Database

- Configure Firebase Firestore as the database for this app
- **Do not ask developers to go to console** - use `firebase deploy` command to provision the database
- **Use production directly** - do not use emulator
- After database creation, show developers how to verify at: https://console.firebase.google.com/

### 3. Setup Firebase Authentication

- Build sign up and login pages using Firebase Auth
- **Ask developer permission** before implementing authentication
- Show instructions for enabling Firebase Auth at: https://console.firebase.google.com/
- Update security rules to ensure only authorized users can read/write their own data

### 4. Setup Firebase Hosting

- Configure Firebase Hosting and deploy the app to production
- Ensure proper build configuration and routing setup
