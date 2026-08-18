# CloudWorker AI

CloudWorker AI is an AI-powered workspace platform for remote opportunities, text analytics, cloud sync/backup, trend tracking, 100-point opportunity scoring, dual-language localization (English and Arabic), system security, and payment management.

Rewritten from Android Kotlin (Jetpack Compose) into a modern full-stack React application with TypeScript, Tailwind CSS, and Express server-side Gemini AI integration.

## Key Features

- **Dashboard**: System health, active operating mode badge, quick access cards to all workspace modules, top rated opportunities.
- **AI Text & Opportunity Analyzer**: Powered by Google AI Studio Gemini API (`gemini-3.6-flash`) with heuristic fallback for contract text analysis, scam risk assessment, key deliverables extraction, and required skills identification.
- **Remote Opportunities & 100-Point Scoring Engine**: Interactive port of the 5-factor scoring engine (`ScoringEngine`):
  - Source Reliability (35%)
  - Payout Value (25%)
  - Execution Duration (15%)
  - Description Clarity (10%)
  - Anti-Fraud / Scam Filter (15%)
- **Cloud Synchronization & Backup Manager**: Firebase database automated backup simulator with Local, Cloud, and Hybrid mode toggles.
- **Security & Biometrics Shield**: `BiometricWrapper` simulation, PIN passkey protection, live AES-256 text encryption sandbox, and security audit log.
- **Wallet & Payment Management**: Connected payout bank checking, digital escrow wallet, corporate debit cards, add account modal, and transaction history log.
- **App Settings & Dual-Language Localization**: Full English and Arabic (`RTL` layout) localization support with mode toggles and security switches.

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend**: Node.js, Express, tsx, esbuild
- **AI SDK**: `@google/genai` (Gemini 3.6 Flash)
