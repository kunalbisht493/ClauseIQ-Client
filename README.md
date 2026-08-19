# ClauseIQ — Frontend Web Application 📄✨

> Modern, lightning-fast React application for AI-powered legal contract analysis, risk evaluation, and clause interrogation.

---

## 📋 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Production Build](#production-build)
- [Deployment Guide](#deployment-guide)

---

## 🌟 Overview
ClauseIQ Client is a clean, modern Single Page Application (SPA) built with **React 18** and **Vite**. It provides legal professionals, founders, and teams with an intuitive workspace to upload complex legal agreements, inspect extracted risk flags, and have focused, cite-backed conversations about individual clauses.

---

## 🛠️ Tech Stack
- **Framework**: React 18 (Hooks, Context API)
- **Build Tool / Dev Server**: Vite 8
- **Routing**: React Router v6
- **Styling**: Vanilla CSS Design System with custom design tokens, responsive CSS Grid, glassmorphism, and micro-animations
- **Typography**: Google Fonts (*DM Sans* & *Playfair Display*)
- **Cross-Tab Communication**: HTML5 `BroadcastChannel` API + `StorageEvent` fallbacks

---

## 🚀 Key Features

### 1. Interactive Contract Analysis & Q&A
- **Real-time Status Polling**: Seamlessly polls document status during background embedding & OCR ingestion.
- **Risk Cards**: High, Medium, and Low risk severity badges with direct *"Ask about this clause"* actions.
- **Active vs. Minimized Q&A**:
  - The most recent question appears prominently as **`● Active Explanation`** with an instant **Minimize ▲ / Expand ▼** toggle.
  - Previous questions automatically move into a collapsed **`Previous questions & explanations`** accordion.
  - Strict text truncation ensures zero horizontal scrollbars on any screen width.

### 2. Robust Authentication & Password Security
- **Dual Auth Modes**: Google OAuth 2.0 and Email/Password sign-in.
- **Show/Hide Password Eye Toggle**: Instant visibility toggling on all password fields.
- **Interactive Strong Password Checklist**: Real-time validation for 8+ characters, uppercase, lowercase, numbers, and symbols.
- **Instant Cross-Tab Logout Synchronization**: Resetting a password in one tab immediately logs out all other open tabs in real-time without requiring a page refresh.

### 3. Account Settings Workspace
- User profile header with account status badges (`Google Sign-in` vs. `Email & Password`, `Verified Email`).
- Ability for Google users to easily initialize a password.
- Inline *"Forgot current password? Send reset link"* action.
- Isolated Danger Zone for permanent account and contract data deletion.

---

## 📁 Project Structure

```text
client/
├── public/
│   └── _redirects          # SPA fallback routing for Netlify / Cloudflare / Render
├── src/
│   ├── components/
│   │   ├── analysis/       # RiskBadge, RiskCards, Analysis components
│   │   ├── chat/           # ChatBox, AskQuestion input
│   │   └── common/         # Layout, Header, PrivateRoute, PasswordInput
│   ├── context/
│   │   └── AuthContext.jsx # Auth state, session persistence & cross-tab sync
│   ├── pages/
│   │   ├── AnalysisPage.jsx       # Contract analysis & interactive Q&A
│   │   ├── AuthCallbackPage.jsx   # OAuth redirect handler
│   │   ├── DashboardPage.jsx      # Uploads & document library
│   │   ├── ForgotPasswordPage.jsx # Password recovery
│   │   ├── HistoryPage.jsx        # Previous documents overview
│   │   ├── LoginPage.jsx          # Sign in & registration
│   │   ├── ResetPasswordPage.jsx  # Token-based password reset
│   │   ├── SettingsPage.jsx       # Profile & credentials management
│   │   └── VerifyEmailPage.jsx    # Email activation handler
│   ├── services/
│   │   ├── api.js                 # Central fetch wrapper with 401 handling
│   │   ├── auth.service.js        # Auth API calls & BroadcastChannel sync
│   │   └── document.service.js    # Document upload, analysis & Q&A APIs
│   ├── App.jsx             # React Router routing configuration
│   ├── main.jsx            # React root mount
│   └── styles.css          # Design system & responsive styles
├── vercel.json             # Vercel SPA rewrite configuration
├── vite.config.js          # Vite configuration
└── package.json            # Project dependencies & build scripts
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root of `/client`:

```ini
# Backend API Base URL
VITE_API_URL=http://localhost:5000/api

# Google OAuth 2.0 Client ID (Optional for frontend button helper)
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

---

## 💻 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation & Local Run
```bash
# 1. Navigate to client directory
cd client

# 2. Install dependencies
npm install

# 3. Create local env file
cp .env.example .env

# 4. Start local Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📦 Production Build

```bash
# Compile and minify for production
npm run build

# Preview the production bundle locally
npm run preview
```

Output files are written to the `/dist` directory.

---

## 🚢 Deployment Guide

### Vercel
1. Connect your repository to [Vercel](https://vercel.com).
2. Set the **Root Directory** to `client`.
3. Set the **Build Command** to `npm run build` and **Output Directory** to `dist`.
4. Add the environment variable: `VITE_API_URL=https://your-backend-api.com/api`.
5. *Note:* [`vercel.json`](file:///c:/Users/Admin/Desktop/client/vercel.json) is pre-configured for client-side route rewrites.

### Netlify / Cloudflare Pages / Render
1. Connect your repository.
2. Set **Root Directory**: `client`.
3. Set **Build Command**: `npm run build`.
4. Set **Publish Directory**: `dist`.
5. Add `VITE_API_URL` environment variable.
6. *Note:* The included [`public/_redirects`](file:///c:/Users/Admin/Desktop/client/public/_redirects) automatically ensures routes like `/documents/:id` and `/reset-password` do not produce 404 errors on refresh.
