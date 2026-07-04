# Perception Mapper AI

Perception Mapper AI is an enterprise-grade, high-fidelity cognitive bias, tone, and multilingual sentiment analysis platform. Designed for journalists, content teams, and enterprises, it processes text in **English**, **Tamil (தமிழ்)**, and **Sinhala (සිංහල)** to identify cognitive distortions, deliver progress-metered emotional tone breakdowns, and suggest objective alternative rephrasings in real-time.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [System Architecture](#%EF%B8%8F-system-architecture)
- [Directory & Workspace Structure](#-directory--workspace-structure)
- [Features Breakdown](#-features-breakdown)
  - [Subscription Tiers & Dashboards](#subscription-tiers--dashboards)
- [Environment Configuration](#-environment-configuration)
- [Quick Start & Setup](#-quick-start--setup)
  - [1. Backend API & Web Portal (Monorepo Node/PNPM)](#1-backend-api--web-portal-monorepo-nodepnpm)
  - [2. NLP Sidecar Engine (Python)](#2-nlp-sidecar-engine-python)
- [Developer Integration API Spec](#-developer-integration-api-spec)
- [Multi-Container Docker Deployment](#-multi-container-docker-deployment)
- [QA, Verification & Auditing](#-qa-verification--auditing)

---

## 🔍 Overview

Perception Mapper AI operates as a containerized monorepo workspace to orchestrate its microservices: Next.js frontend, NestJS API gateway, and a Python FastAPI NLP engine. It uses Clerk for secure user authentication, Prisma for robust PostgreSQL database management, and zero-shot NLP models for high-accuracy linguistic parsing.

---

## ⚙️ System Architecture

The following diagram illustrates the flow of requests from the user's web browser, through authentication, layout routing, gateway routing, and NLP evaluation:

```mermaid
graph TD
    A[User Web Browser] -->|HTTPS / WebSockets| B(Next.js App Portal - Port 3009)
    A -->|User Session Credentials| C[Clerk Authentication Provider]
    B -->|Workspace API requests / JWT Token| D(NestJS Core Gateway - Port 3001)
    D -->|Local Token Decoding| D
    D -->|Prisma Client ORM| E[(PostgreSQL Database)]
    D -->|Evaluation HTTP Pipelines| F(Python FastAPI NLP Sidecar - Port 8000)
    F -->|Neural Classification| G[BART Zero-Shot Model]
    F -->|Lexical Scans / spaCy| H[Linguistic Rules Engine]
```

---

## 📁 Directory & Workspace Structure

```
Perception_Mapper_AI/
├── apps/
│   ├── web/               # Next.js 14 Web Portal (Tailwind CSS, Clerk, next-intl for i18n)
│   ├── api/               # NestJS Core Gateway API (Prisma ORM, Websocket telemetry stream)
│   └── nlp-engine/        # Python FastAPI NLP Sidecar (SpaCy tokenization, langdetect, zero-shot pipelines)
├── packages/
│   └── ui/                # Shared glassmorphic React components (Button, Card, Input, Badges)
├── docker-compose.yml     # Multi-container local production orchestrator
├── turbo.json             # Turborepo caching & parallel task execution configuration
├── package.json           # Monorepo workspace declarations and primary scripts
```

---

## 🚀 Features Breakdown

1. **Multilingual Processing**: Tailored natural language processing for English, Tamil (தமிழ்), and Sinhala (සිංහල).
2. **Cognitive Bias Classifier**: Scans text against rule-based patterns and zero-shot classifiers to detect:
   - **Over-generalization**: Absolute terms failing to respect context nuances (e.g. *always, never, everyone*).
   - **Confirmation Bias**: Presenting assumptions as verified absolute facts to reinforce beliefs (e.g. *obviously, clearly*).
   - **Sensationalism**: Dramatic phrasing to provoke emotional reactions rather than objective analysis (e.g. *shocking, disaster, conspiracy*).
3. **Tone Analytics**: Dynamic tracking of emotional and communication tones (Informative, Formal, Assertive, Cooperative, Emotional).
4. **Interactive Rule Customization**: Team subscribers can define regex patterns, custom classifications, and alternatives to adapt scans to specific target vocabularies.
5. **Secure Core Gateways**: Dual-layer security featuring local JWT signature checks via Clerk (`ClerkGuard`) for interactive clients and secure api-key tokens (`ApiKeyGuard`) for developer integrations.
6. **Real-time WebSockets Telemetry**: Emits telemetry events to update live dashboards and audit consoles dynamically.
7. **Print-optimized stylesheets**: Enables users to generate and print clean, beautifully structured assessment PDF reports natively.

### Subscription Tiers & Dashboards

The workspace adapts its dashboard interface dynamically based on the current user's subscription tier:
- **Free Plan (`FREE`)** - **Acoustic Basic Gateway**: Simple input editor with real-time word counting and baseline multilingual checks.
- **Basic Plan (`BASIC`)** - **Pro Workspace Suite**: Includes the advanced **Rephrase Sandbox** (generating multiple tones: journalistic, empathetic, professional), CSV data exporters, and the **Batch Processor** tool.
- **Pro Plan (`PRO`)** - **Enterprise OS Telemetry**: Full system suite including the **Bias Network Graph** (visual representation of bias node densities), **TTS Readout** (speech synthesis audio mode), and the **Custom Bias Rules Configuration** panel.

---

## 🔑 Environment Configuration

Ensure the appropriate variables are set in the respective workspace folders before booting development:

### 1. Next.js Client (`apps/web/.env`)
| Key | Type | Description / Fallback |
| --- | --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | String | Clerk publishable key for React middleware |
| `CLERK_SECRET_KEY` | String | Clerk private key for backend session decoding |
| `NEXT_PUBLIC_API_URL` | URL | Target URL for the NestJS API gateway (e.g. `http://localhost:3001/api`) |

### 2. NestJS Core API Gateway (`apps/api/.env`)
| Key | Type | Description / Fallback |
| --- | --- | --- |
| `DATABASE_URL` | Postgres URL | Database connection string (e.g. `postgresql://postgres:password@localhost:5432/...`) |
| `CLERK_SECRET_KEY` | String | Private key matching the client credentials |
| `CLERK_JWKS_URI` | URL | Clerk JWKS verification URL (e.g. `https://api.clerk.com/v1/jwks`) |
| `PORT` | Integer | Application gateway execution port (default: `3001`) |

---

## ⚡ Quick Start & Setup

Ensure you have **Node.js 18+**, **pnpm/npm**, and **Python 3.10+** installed on your system.

### 1. Backend API & Web Portal (Monorepo Node/PNPM)
From the monorepo root directory, install dependencies and start the development servers:

```bash
# Install root and workspace dependencies
npm install

# Start Next.js and NestJS servers in development mode
npm run dev
```

- **Interactive Web Portal:** [http://localhost:3009](http://localhost:3009)
- **NestJS Core Gateway API:** [http://localhost:3001/api](http://localhost:3001/api)

### 2. NLP Sidecar Engine (Python)
Navigate to the `nlp-engine` directory, activate your environment, and run the Python service:

```bash
cd apps/nlp-engine

# Initialize and activate Python environment
python -m venv venv
source venv/bin/activate # Or venv\Scripts\activate on Windows

# Install Python requirements
pip install -r requirements.txt

# Start the FastAPI reload server
python -m uvicorn main:app --reload --port 8000
```

- **Interactive Swagger docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **FastAPI Core health checks:** [http://localhost:8000/health](http://localhost:8000/health)

---

## 🔌 Developer Integration API Spec

Subscribers can invoke analysis and rephrasing engines programmatically using standard API tokens.

### Endpoint 1: Analyze Text via Developer Key
- **Path**: `/api/analyze/developer`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
  - `X-API-Key: <your_developer_api_key>`

**Request Body**:
```json
{
  "text": "This is an absolute disaster and completely unbelievable."
}
```

**Response Payload**:
```json
{
  "success": true,
  "source": "FastAPI Live Sidecar",
  "language": "English",
  "scores": {
    "sentiment": 15,
    "objectivity": 40,
    "biasIndex": 75
  },
  "tones": [
    { "name": "Assertive", "score": 85, "color": "from-red-500 to-orange-500" },
    { "name": "Informative", "score": 30, "color": "from-blue-500 to-indigo-500" }
  ],
  "biases": [
    {
      "quote": "This is an absolute disaster and completely unbelievable.",
      "type": "Sensationalism",
      "description": "Employs dramatic phrasing to provoke emotional reactions rather than objective analysis.",
      "rephrase": "This is a significant / noteworthy event / challenging circumstance."
    }
  ]
}
```

### Endpoint 2: Fetch Alternative Rephrasings
- **Path**: `/api/analyze/rephrase`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <clerk_jwt_token>`

**Request Body**:
```json
{
  "text": "This is obviously a mistake.",
  "language": "en"
}
```

**Response Payload**:
```json
{
  "success": true,
  "source": "FastAPI Live Sidecar",
  "alternatives": {
    "journalistic": "Evidence suggests this is a mistake.",
    "empathetic": "We understand this may be an error.",
    "professional": "Indications point to this being a mistake."
  }
}
```

---

## 🐳 Multi-Container Docker Deployment

To spin up the entire production stack locally (Next.js web portal, NestJS API gateway, PostgreSQL, and FastAPI sidecar), use the root Docker Compose file:

```bash
# Build and run containers in background mode
docker-compose up -d --build

# Confirm running containers
docker-compose ps
```

---

## 🧪 QA, Verification & Auditing

1. **Automated Testing**:
   - NestJS API tests: Run `npm run test` or `turbo run test` to run both UI and backend test suites.
   - Component validation: We run Storybook tests to verify isolated React widgets rendering in `apps/web/stories/`. Run `npm run storybook` to launch the local widget testing suite.
2. **E2E Browser Interaction Audits**:
   - Audits are automated via [ui_audit.js](file:///d:/Perception_Mapper_AI/ui_audit.js). This checks hydration status, responsive breakpoints, route health codes, and CTA triggers.
   - Run the audit manually via: `node ui_audit.js`.
