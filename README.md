# 🎯 Skill Path Architect

**Helping recently graduated high school students discover their best career paths.**

Skill Path Architect is a full-stack web application that guides young graduates through the overwhelming transition from school to career. By evaluating a student's personal strengths across eight dimensions of intelligence (based on Gardner's Theory of Multiple Intelligences), the platform uses a trained machine learning model to recommend the most fitting career paths — turning self-reflection into a concrete, data-driven action plan.

---

## ✨ What It Does

1. **Students register and log in** to a secure, personal dashboard.
2. **They complete a self-assessment** rating themselves across eight intelligence dimensions (language, logic, spatial reasoning, interpersonal skills, etc.).
3. **The AI engine processes their scores** through a trained XGBoost classifier.
4. **They receive a ranked shortlist of career recommendations** — not just one answer, but a Top-5 list of professions that match their profile.
5. **An LLM generates a personalized summary** *(planned)* — explaining what the results mean, why these careers suit their profile, and what concrete next steps they can take.

> The system is designed for *exploration*, not prescription — helping students see possibilities they may not have considered.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT (Access + Refresh Tokens) |
| **AI / ML** | Python, XGBoost, scikit-learn, pandas |

---

## 📐 Architecture

### Backend — Layered Architecture

```
Controllers  →  Services  →  Repositories  →  Database
```

| Layer | Responsibility |
|---|---|
| **Controllers** | Handle HTTP requests/responses (no business logic) |
| **Services** | All business logic and application rules |
| **Repositories** | Database communication (isolates Mongoose from services) |

### AI Module — ML Pipeline

```
Raw Dataset  →  Cleanup  →  Normalize (0–1)  →  XGBoost Classifier  →  Top-5 Career Predictions
```

The AI module uses a dataset of 3,600 student profiles across 72 unique professions, achieving **98.33% accuracy** on clean data and **~97% Top-5 accuracy** even under simulated human self-assessment error.

> 📖 See the full AI documentation: [`ai/README.md`](ai/README.md)

---

## 🔒 Security

- **Authentication & Authorization** — JWT with short-lived access tokens (15 min) and refresh tokens (7 days). Role-based endpoint protection (user / admin).
- **Password Hashing** — bcrypt with 12 salt rounds; passwords are never stored as plain text.
- **Input Validation** — express-validator with sanitization (XSS / injection protection).
- **CORS** — Configured to only allow the authorized client origin.
- **Environment Variables** — All secrets managed via `.env` files (never committed to version control).

---

## 📂 Project Structure

```
Skill-Path-Architect/
│
├── ai/                            # AI / Machine Learning module
│   ├── dataset/
│   │   ├── dataset_skill_predictor.csv   # 3,600 samples, 72 professions
│   │   └── README.md
│   ├── dataset_exploration.ipynb  # Full ML pipeline (XGBoost)
│   └── README.md                  # AI module documentation
│
├── client/                        # Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Page components (Home, Login, Register, Dashboard)
│   │   ├── services/              # API service layer (axios)
│   │   ├── App.jsx                # Route definitions
│   │   └── main.jsx               # App entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                        # Backend (Express + MongoDB)
│   ├── src/
│   │   ├── config/                # Configuration & DB connection
│   │   ├── controllers/           # HTTP request handlers
│   │   ├── middleware/            # Auth, error handling
│   │   ├── models/                # Mongoose schemas
│   │   ├── repositories/         # Database access layer
│   │   ├── routes/                # Route definitions
│   │   ├── services/              # Business logic
│   │   ├── validators/           # Input validation rules
│   │   └── server.js              # Server entry point
│   ├── .env.example               # Template for environment variables
│   └── package.json
│
├── .gitignore
└── README.md                      # ← You are here
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20+
- **MongoDB** running locally or a MongoDB Atlas URI
- **Python** 3.10+ (for the AI module only)

### 1. Clone the Repository

```bash
git clone <repo-url>
cd Skill-Path-Architect
```

### 2. Install Dependencies

```bash
# Frontend
cd client && npm install

# Backend
cd ../server && npm install

# AI module (optional — only needed to re-train the model)
pip install pandas numpy xgboost scikit-learn jupyter
```

### 3. Configure Environment

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
```

### 4. Start the Backend

```bash
cd server
npm run dev
```

### 5. Start the Frontend (new terminal)

```bash
cd client
npm run dev
```

### 6. Open in Browser

Navigate to **`http://localhost:5173`**

---

## 🔌 API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register a new user |
| POST | `/login` | No | Login and receive tokens |
| POST | `/refresh-token` | No | Get a new access token |
| POST | `/logout` | Yes | Logout (clear refresh token) |
| GET | `/me` | Yes | Get current authenticated user |

### Users (`/api/users`) — Admin Only

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Admin | Get all users |
| GET | `/:id` | Admin | Get user by ID |
| PUT | `/:id` | Admin | Update user |
| DELETE | `/:id` | Admin | Delete user |

### Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | No | Health check |

---

## 🤖 AI Module at a Glance

| Property | Value |
|---|---|
| Algorithm | XGBoost (multi-class) |
| Dataset Size | 3,600 samples |
| Career Categories | 72 unique professions |
| Input Features | 8 intelligence scores (Gardner's MI) |
| Baseline Accuracy | **98.33%** |
| Noisy Top-5 Accuracy | **~97%** |

The model is designed to be **robust to self-assessment error** — even if students rate themselves imprecisely, the correct career still appears in the Top 5 recommendations ~97% of the time.

> For full details on the dataset, preprocessing, and model evaluation, see [`ai/README.md`](ai/README.md).

---

## 💡 Planned Feature: LLM-Powered Career Summary

> **Status:** Planned — not yet implemented.

After the XGBoost model produces a student's Top-5 career predictions, the raw results alone can feel abstract. The next step is to integrate a **Large Language Model (LLM)** that takes the prediction output and generates a **personalized, human-readable summary** for the student.

### How It Would Work

```
Student Assessment  →  XGBoost (Top-5 Predictions)  →  LLM Prompt  →  Personalized Career Summary
```

1. The student completes the self-assessment and receives their Top-5 career matches with confidence scores.
2. The prediction results (career names, scores, and the student's intelligence profile) are passed as context to an LLM.
3. The LLM generates a narrative summary that:
   - **Explains *why*** each career is a good fit based on the student's specific strengths.
   - **Suggests actionable next steps** — relevant university programs, certifications, entry-level roles, or skills to develop.
   - **Highlights connections** between careers the student may not have considered (e.g., "Your high spatial and logical scores make you a strong fit for both architecture *and* data science").

### Model Options Under Consideration

| Approach | Examples | Trade-offs |
|---|---|---|
| **Open-source (self-hosted)** | LLaMA, Mistral, Gemma | Full control, no API costs, privacy-friendly — but requires GPU infrastructure |
| **API-controlled** | OpenAI GPT, Google Gemini, Anthropic Claude | Easy to integrate, high quality — but introduces API costs and external dependency |

The final choice will depend on deployment constraints, cost, and privacy requirements. Both approaches are viable — the LLM receives only the prediction output and intelligence scores (no sensitive personal data beyond what the student entered).

---

## 👥 Team

University project — UBT, Semester 6, LAB-2.

---

## 📄 License

This project is for educational purposes.
