# ClauseIQ — Frontend Web Application 📄✨

> Modern, lightning-fast React application for AI-powered legal contract analysis, risk evaluation, and clause interrogation.

---

## 📋 Table of Contents
- [Overview](#-overview)
- [Tech Stack](#️-tech-stack)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Environment Variables](#️-environment-variables)
- [Getting Started](#-getting-started)
- [Production Build](#-production-build)
- [Deployment Guide (Vercel)](#-deployment-guide-vercel)

---

## 🌟 Overview
ClauseIQ Client is a clean, modern Single Page Application (SPA) built with **React 18** and **Vite**. It provides founders, legal teams, and individuals with an intuitive workspace to upload agreements, inspect structured risk flags, and have focused, citation-backed conversations grounded in contract excerpts.

---

## 🛠️ Tech Stack
- **Framework**: React 18 (Hooks, Context API)
- **Build Tool / Dev Server**: Vite 8
- **Routing**: React Router v6
- **Styling**: Vanilla CSS Design System with custom design tokens, responsive CSS Grid, glassmorphism, and micro-animations
- **Typography**: Google Fonts (*DM Sans* & *Playfair Display*)
- **Cross-Tab Communication**: HTML5 `BroadcastChannel` API + `StorageEvent` fallbacks
- **Networking & Resilience**: Custom `fetch` interceptor with **automatic 3x retry on backend cold-starts (502/503/504)**

---

## 🚀 Key Features

### 1. Interactive Contract Analysis & Q&A
- **Real-time Status Polling**: Seamlessly polls document status during background embedding & OCR ingestion.
- **Risk Cards**: High, Medium, and Low risk severity rectangular alert boxes with direct *"Ask about this clause"* shortcuts.
- **Justified Text Formatting**: Contract summaries, risk details, and Q&A answers formatted with clean justified text for maximum readability.
- **Active vs. Minimized Q&A**:
  - The most recent question appears prominently as **`● Active Explanation`** with an instant **Minimize ▲ / Expand ▼** toggle.
  - Previous questions automatically move into a collapsed **`Previous questions & explanations`** accordion.
- **AI Disclaimer**: Prominent disclaimers in analysis views and navigation footer clarifying automated review limits.

### 2. Robust Authentication & Password Recovery
- **Dual Auth Modes**: Google OAuth 2.0 and Email/Password sign-in.
- **Instant Auto-Verify**: Smooth onboarding where new accounts are immediately activated and logged into their workspace.
- **Smart Password Reset**: Automatically sends email reset links via Resend, with an instant on-screen **`Reset your password now →`** button fallback when testing without a custom domain.
- **Persistent Resend Action**: Persistent *"Didn't receive it? Resend again"* buttons with spam folder guidance.
- **Interactive Password Validation**: Real-time validation for 8+ characters, uppercase, lowercase, numbers, and special symbols with show/hide password visibility toggling.
- **Cross-Tab Logout Synchronization**: Resetting a password in one tab immediately logs out all other open tabs in real-time.

### 3. Account Settings Workspace
- User profile header with account status badges (`Google Sign-in` vs. `Email & Password`, `Verified Email`).
- Ability for Google users to easily initialize a password.
- Inline *"Forgot current password? Send reset link"* action.
- Compact, responsive mobile layout.
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
│   │   ├── ForgotPasswordPage.jsx # Password recovery with direct fallback
│   │   ├── HistoryPage.jsx        # Previous documents overview
│   │   ├── LoginPage.jsx          # Sign in, registration & auto-verification
│   │   ├── ResetPasswordPage.jsx  # Token-based password reset
│   │   ├── SettingsPage.jsx       # Profile & credentials management
│   │   └── VerifyEmailPage.jsx    # Email activation handler
│   ├── services/
│   │   ├── api.js                 # Central fetch wrapper with 3x cold-start auto-retry
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
# Backend API Base URL (Render Production URL or localhost)
VITE_API_URL=https://clauseiq-server.onrender.com/api

# Google OAuth 2.0 Client ID (Optional for frontend button helper)
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

---

## 💻 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start local Vite development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🚢 Deployment Guide (Vercel)

1. Connect your repository to **[Vercel](https://vercel.com)**.
2. Set **Framework Preset**: `Vite`.
3. Set **Root Directory**: `client` (or leave blank if repository is just the client).
4. Add the Environment Variable:
   - `VITE_API_URL`: `https://clauseiq-server.onrender.com/api`
5. Click **Deploy**.
