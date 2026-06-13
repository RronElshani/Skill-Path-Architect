# AI Module — Career Prediction Engine

This module contains the machine learning pipeline that powers **AI Guidance Counselor's** career recommendation system. It predicts suitable career paths for recently graduated high school students based on their self-assessed intelligence profile using **Gardner's Theory of Multiple Intelligences**.

## Goal

Help young graduates understand their post-secondary options by mapping their personal strengths to real-world career paths — turning a subjective self-assessment into an actionable shortlist of professions.

---

## Dataset

Dataset Link: https://www.kaggle.com/datasets/tea340yashjoshi/skill-and-career-recommendation-dataset

**Source:** `dataset/dataset_skill_predictor.csv`

| Property | Value |
|---|---|
| Samples | 3,600 |
| Unique Professions | 72 |
| Features Used | 8 intelligence scores |
| Target Variable | `Job profession` |

### Feature Columns (Gardner's Multiple Intelligences)

| Column | Renamed As | Description |
|---|---|---|
| `Linguistic` | `language_skills` | Verbal and written language proficiency |
| `Musical` | `musical_ability` | Rhythm, pitch, and musical comprehension |
| `Bodily` | `physical_prowess` | Body coordination and kinesthetic skills |
| `Logical - Mathematical` | `math_and_logic` | Reasoning, pattern recognition, and math |
| `Spatial-Visualization` | `spatial_awareness` | 3D thinking and spatial reasoning |
| `Interpersonal` | `collaboration_skills` | Social interaction and teamwork ability |
| `Intrapersonal` | `self_awareness` | Self-reflection and emotional intelligence |
| `Naturalist` | `sustainability_focus` | Understanding of nature and the environment |

### Dropped Columns

The following columns from the raw CSV are **dropped** during preprocessing as they do not contribute to the prediction model:

- `Sr.No.` — Row index
- `Course` — Empty/unused field
- `P1`–`P8` — Categorical proficiency labels (redundant with the numeric scores)
- `Student` — Student identifier
- `s/p` — Student/profession key

---

## Pipeline Overview

```
Raw CSV  →  Cleanup  →  Normalize (MinMaxScaler 0-1)  →  Encode Labels  →  Train/Test Split  →  XGBoost Classifier  →  Predictions
```

### Steps

1. **Data Loading & Cleanup** — Load the CSV, drop irrelevant columns, strip whitespace from profession labels.
2. **Feature Normalization** — Scale all 8 intelligence scores to a `[0, 1]` range using `MinMaxScaler` to ensure no single feature dominates due to raw magnitude.
3. **Label Encoding** — Convert the 72 profession names into numeric class labels.
4. **Train/Test Split** — 80/20 stratified split (`random_state=42`).
5. **Model Training** — Multi-class classifier Training (`multi:softmax`).
6. **Robustness Testing** — Add Gaussian noise (σ = 0.06) to simulate real-world self-assessment error and re-evaluate.

---

## Model Performance

| Metric | Clean Data | Noisy Data (σ = 0.06) |
|---|---|---|
| **Top-1 Accuracy** | 98.33% | ~82.64% |
| **Top-5 Accuracy** | — | ~98.06% |

### Key Findings

- **Normalization is critical** — Scaling to 0–1 prevents raw score magnitude from biasing predictions and improves robustness to noisy inputs.
- **Top-5 is the practical metric** — For career guidance, presenting a shortlist of 5 likely professions is more useful (and robust) than a single prediction. Even under simulated human error, the correct career appears in the Top 5 ~97% of the time.
- **8 core scores are sufficient** — The supplementary P1–P8 categorical ratings are redundant; the 8 numeric intelligence scores carry all the signal.

---

## Model Configuration

```python
xgb.XGBClassifier(
    objective='multi:softmax',
    num_class=72,
    learning_rate=0.3,    # 0.1 for noisy variant
    max_depth=4,          # 5 for noisy variant
    n_estimators=100,
    random_state=42
)
```

---

## LLM Integration & Interactive Counselor

The AI module integrates with Large Language Models (LLMs) to provide two primary features:
1. **Personalized Narrative Summaries** — Explains *why* the recommended careers fit the student's Multiple Intelligences profile, highlighting university pathways, skill building, and starter projects.
2. **Interactive Career Counselor Chat** — An interactive conversational chat counselor grounded in the student's assessment scores and top predictions.

### System Flow

```
XGBoost Top-5 Output + Intelligence Profile → LLM Prompt + Chat History → API Server (Flask) → Front-end UI
```

### Key Features

* **Flexible Provider Configuration** — Configured via `ai/.env` variables. Reuses standard OpenAI-compatible API schemas to support easy swaps between providers (e.g., OpenAI, Groq, OpenRouter, or local Ollama).
* **Local Template Fallback** — If no `LLM_API_KEY` is configured in the environment, the engine gracefully falls back to a deterministic, rule-based template summary and response generator to keep the application fully functional.
* **Empathetic Grounding** — Employs custom system prompts to ensure the LLM stays grounded in the student's 8-dimensional scores and top predicted professions, giving structured guidance without hallucinating off-topic suggestions.

### Flask API Endpoints

* `POST /api/summary` — Generates a 3-4 paragraph personalized career narrative summary based on student scores and recommendations.
* `POST /api/chat` — Returns the interactive counselor's chat reply to user message sequences, maintaining contextual awareness of the assessment scores and predictions.

### Configuration (`ai/.env`)

To activate live completions, create a `.env` file in the `ai` directory:

```bash
LLM_API_KEY=your_api_key_here
LLM_BASE_URL=https://api.openai.com/v1  # Optional: API base URL (defaults to OpenAI)
LLM_MODEL=gpt-4o-mini                    # Optional: Model name (defaults to gpt-4o-mini)
```

---

## How to Run

### Prerequisites

- Python 3.10+
- Jupyter Notebook or JupyterLab

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Launch the Notebook

```bash
cd ai/jupyter
jupyter notebook {notebook_name}.ipynb
```

Run all cells sequentially. The notebook is self-contained — it loads the CSV, trains the model, and outputs accuracy metrics.

---

## File Structure

```
ai/
├── dataset/
│   ├── dataset_skill_predictor.csv            # Raw dataset (3,600 × 21 columns)
│   └── README.md                              # Dataset description
├── jupyter/                                   # Jupyter Notebooks for exploration and training
│   ├── cluster_features.ipynb                 # K-Means clustering feature engineering
│   ├── train_baseline.ipynb                   # Multinomial Logistic Regression baseline
│   ├── initial_model_training.ipynb           # Primary XGBoost model training
│   ├── alternative_classifiers_training.ipynb  # Random Forest & SVM models
│   ├── neural_network_training.ipynb          # MLP Neural Network training
│   └── python_demo_of_model_application.ipynb  # Demo of prediction using models
├── app.py                                     # Flask API server
├── chat.py                                    # LLM chat session handler
├── llm.py                                     # Gemini LLM integration service
├── predict.py                                 # Career prediction logic
├── preprocess.py                              # Data cleaning and scaling
├── train.py                                   # Primary model training script
└── README.md                                  # ← You are here
```
