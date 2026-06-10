"""Train a career prediction classifier from a dataset CSV.

This script expects a raw dataset CSV. It renames columns, encodes job
profession labels, normalizes features using shared preprocess helpers, adds
Gaussian noise for robustness, trains an XGBoost multi-class classifier,
prints Top-1 and Top-5 performance, and displays a classification report.
"""

import argparse
import os

import joblib
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split

from preprocess import add_noise, clean_raw_data, preprocess_data, rename_columns


def load_raw_dataset(df: pd.DataFrame) -> tuple[pd.DataFrame, np.ndarray, LabelEncoder]:
    if 'Job profession' in df.columns:
        df = rename_columns(df)

    if 'job_profession' not in df.columns:
        raise ValueError("Expected 'job_profession' or 'Job profession' column in raw dataset")
    
    X, y, le = preprocess_data(df)
    return X, y, le


def train_model(X_train: np.ndarray, y_train: np.ndarray, num_class: int) -> xgb.XGBClassifier:
    model = xgb.XGBClassifier(
        objective='multi:softmax',
        num_class=num_class,
        learning_rate=0.1,
        max_depth=5,
        n_estimators=500,
        random_state=42,
        use_label_encoder=False,
        eval_metric='mlogloss'
    )
    model.fit(X_train, y_train)
    return model


def evaluate_model(model: xgb.XGBClassifier, X_test: np.ndarray, y_test: np.ndarray) -> tuple[float, float, str]:
    y_pred = model.predict(X_test)
    y_probs = model.predict_proba(X_test)

    top_1_acc = accuracy_score(y_test, y_pred)
    top_5_indices = np.argsort(y_probs, axis=1)[:, -5:][:, ::-1]
    top_5_hits = [y_test[i] in top_5_indices[i] for i in range(len(y_test))]
    top_5_acc = np.mean(top_5_hits)

    report = classification_report(y_test, y_pred, zero_division=0)
    return top_1_acc, top_5_acc, report


def save_model(model: xgb.XGBClassifier, path: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    joblib.dump(model, path)


def main(input_csv: str, model_output: str):
    df = pd.read_csv(input_csv)
    df = clean_raw_data(df)
    X, y, label_encoder = load_raw_dataset(df)
    X_noisy = add_noise(X, noise_level=0.06)

    X_train, X_test, y_train, y_test = train_test_split(
        X_noisy, y, test_size=0.2, random_state=42, stratify=y
    )

    model = train_model(X_train, y_train, num_class=len(np.unique(y)))
    top_1_acc, top_5_acc, report = evaluate_model(model, X_test, y_test)

    print(f"Top-1 Accuracy: {top_1_acc * 100:.2f}%")
    print(f"Top-5 Accuracy: {top_5_acc * 100:.2f}%")
    print("\nClassification Report:\n")
    print(report)

    save_model(model, model_output)
    encoder_output = os.path.join(os.path.dirname(model_output), 'career_label_encoder.h5')
    save_model(label_encoder, encoder_output)
    print(f"Model saved to: {model_output}")
    print(f"Label encoder saved to: {encoder_output}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train a career prediction model from the raw dataset CSV.")
    parser.add_argument("-i", "--input_csv", type=str, required=True, help="Path to the raw dataset CSV")
    parser.add_argument(
        "-m", "--model_output", type=str, default="./models/career_prediction_model.h5",
        help="Path where the trained model will be saved"
    )
    args = parser.parse_args()

    main(args.input_csv, args.model_output)
