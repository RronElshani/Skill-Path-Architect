# How to Run - Skill Path Architect

This project integrates a machine learning prediction pipeline, a Node.js Express server backend, and a premium Vite-based React frontend to deliver real-time career recommendations.

---

## 📦 Prerequisites

Before starting, ensure you have the following installed on your machine:

1. **Node.js** (v20 or newer)
2. **MongoDB** (running locally, or a MongoDB Atlas connection URI)
3. **Python** (v3.10 or newer) with `pip` (standard system Python, or managed via `conda` / `venv`)

---

## 🔧 Installation & Setup

You need to install dependencies for all three layers of the project and configure the server's environment variables.

### 1. Install Dependencies
Run the following commands from the root directory of the project:

```bash
# 1. Install root concurrent runner dependency
npm install

# 2. Install Express backend dependencies
cd server && npm install

# 3. Install Vite React frontend dependencies
cd ../frontend && npm install

# 4. Install Python prediction API dependencies
cd ..
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Navigate to the `server` directory, duplicate the environment template, and set up your variables:

```bash
cd server
cp .env.example .env
```
Open the newly created `.env` file and verify or modify:
- `MONGODB_URI`: The connection string to your MongoDB instance.
- `PORT`: Set to `5004` (default) where the Express API will run.
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`: Private keys for authentication.

---

## 🚀 Recommended: Run All Concurrently (Single Command)

We have integrated a concurrent workspace runner. You can spin up all three servers simultaneously inside a single terminal window.

From the root directory:
```bash
npm run dev
```

This starts:
1. **Python Flask API** (`dev:ai`) on port `5001` (http://localhost:5001)
2. **Node.js Express Server** (`dev:server`) on port `5004` (http://localhost:5004)
3. **Vite React Frontend** (`dev:frontend`) on port `5173` (http://localhost:5173)

*All output logs are color-coded, labeled, and piped into this single terminal window.*

---

## 🛠️ Manual Launch (Separate Terminal Windows)

If you prefer to start each service individually, open three separate terminal windows:

### Terminal 1: Python Flask Prediction API
1. Navigate to the `ai` directory:
   ```bash
   cd ai
   ```
2. Start the Flask server:
   ```bash
   python app.py
   ```
   *The server runs on port `5001` (http://localhost:5001) and loads the XGBoost model, label encoder, and feature scaler at startup.*

### Terminal 2: Node.js Express Server
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Start the Express dev server:
   ```bash
   npm run dev
   ```
   *The backend runs on port `5004` (http://localhost:5004), handles authentication, saves assessments, and acts as a gateway to the AI Flask server.*

### Terminal 3: Vite React Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client runs at http://localhost:5173.*

---

## ⚙️ How Preprocessing & Calibration Works

### 1. Preprocessing (1-5 UX Scale to 0-20 Dataset Scale)
The model was trained on a 0-20 questionnaire scale. For optimal user experience (UX), the frontend collects user attributes on a standard `1.0` to `5.0` scale.
Before submitting the values to the API, the frontend preprocesses the inputs:
$$\text{Dataset Score} = (\text{UX Score} - 1.0) \times 5.0$$
*Example: A score of `3.0` (Moderate) maps to `10.0` on the dataset scale. A score of `5.0` (High) maps to `20.0`.*

### 2. Confidence Calibration (UX Calibration)
Standard raw classifier outputs (XGBoost softmax probabilities) tend to be extremely skewed (often outputting close to `99%` for the top predicted class, and `<1%` for the other predictions).
To create a natural and readable dashboard layout in the UI:
1. The Flask API calculates a calibrated top display match score between `75%` and `95%` based on the model's confidence in the primary recommendation.
2. The remaining 4 predictions decay smoothly relative to their proximity to the top class's probability:
   $$\text{Match Score}_i = \text{Top Display} - (4 \times i) - \left(12 \times \left(1.0 - \frac{P_i}{P_0}\right)\right)$$
3. This produces a realistic, well-balanced distribution list (e.g., 94.5%, 78.2%, 73.1%...) while strictly preserving the model's relative rank and classification.

