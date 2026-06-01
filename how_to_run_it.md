# How to Run - Skill Path Architect

This project integrates a machine learning prediction pipeline with a premium Vite-based React frontend to deliver real-time career recommendations.

---

## 🚀 Recommended: Run All Concurrently (Single Command)

For convenience, we have integrated the `concurrently` runner package into the root workspace folder to launch both the frontend dev server and python API backend simultaneously in one terminal window.

1. Install dependencies in the root directory (only needs to be done once):
   ```bash
   npm install
   ```
2. Start both services concurrently:
   ```bash
   npm run dev
   ```
   *This starts both the Flask backend on port `5001` and the Vite React frontend dev server on port `5173` concurrently. Their output logs will be color-coded and piped into the same terminal window.*


---

## 📦 Prerequisites: Python Environment (Conda)

This project requires a Python environment with Conda/Miniconda installed to manage packages and run the predictions model.

1. **Install Conda**: If you don't have it, download and install [Miniconda](https://docs.anaconda.com/miniconda/) or [Anaconda](https://www.anaconda.com/download).
2. **Open Command Prompt / Terminal**: Make sure your terminal has active conda access (e.g., Anaconda Prompt or configured shell).
3. **Install python packages**: Run the following command from the root directory to install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

## 🛠️ Manual Launch (Separate Terminal Windows)

If you prefer to start each service individually, open two separate terminal windows:

### Terminal 1: Python Flask Prediction API
1. Navigate to the `ai` directory:
   ```powershell
   cd ai
   ```
2. Start the API server:
   ```powershell
   python app.py
   ```
   *The server will boot on port `5001` (http://localhost:5001) and load the XGBoost model, label encoder, and feature scaler at startup.*

### Terminal 2: Vite React Frontend
1. Navigate to the `frontendpreview` directory:
   ```powershell
   cd frontendpreview
   ```
2. Start the Vite dev server:
   ```powershell
   npm run dev
   ```
   *The frontend preview will run at http://localhost:5173.*

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
