"""Train the statistical baseline: multinomial logistic regression.

This establishes the benchmark *floor* for the career classifier project. The
linear model ingests both the Gaussian noise-augmented intelligence features
and the engineered K-Means cluster tags (Task 1). Production models (e.g. the
XGBoost classifier in ``train.py``) run *without* cluster features and are
expected to beat this baseline.

To keep the comparison honest, this script reuses the exact same preprocessing,
noise augmentation, and stratified 80/20 split as ``train.py`` and reports the
same Top-1 / Top-5 metrics.
"""

import argparse
import os

import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split

from preprocess import add_noise, clean_raw_data, preprocess_data, rename_columns
from cluster_features import DEFAULT_N_CLUSTERS, add_cluster_features, fit_kmeans


def load_raw_dataset(df: pd.DataFrame):
    if 'Job profession' in df.columns:
        df = rename_columns(df)

    if 'job_profession' not in df.columns:
        raise ValueError("Expected 'job_profession' or 'Job profession' column in raw dataset")

    return preprocess_data(df)


def train_model(X_train, y_train) -> LogisticRegression:
    # Multinomial logistic regression: lbfgs defaults to a true softmax
    # (multinomial) objective for multi-class targets in modern scikit-learn.
    model = LogisticRegression(
        solver='lbfgs',
        max_iter=2000,
        random_state=42,
    )
    model.fit(X_train, y_train)
    return model


def evaluate_model(model, X_test, y_test):
    y_pred = model.predict(X_test)
    y_probs = model.predict_proba(X_test)

    top_1_acc = accuracy_score(y_test, y_pred)
    top_5_indices = np.argsort(y_probs, axis=1)[:, -5:][:, ::-1]
    top_5_hits = [y_test[i] in top_5_indices[i] for i in range(len(y_test))]
    top_5_acc = np.mean(top_5_hits)

    report = classification_report(y_test, y_pred, zero_division=0)
    return top_1_acc, top_5_acc, report


def save_artifact(obj, path: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    joblib.dump(obj, path)


def main(input_csv: str, model_output: str, n_clusters: int):
    df = pd.read_csv(input_csv)
    df = clean_raw_data(df)
    X, y, label_encoder = load_raw_dataset(df)

    # Gaussian noise augmentation (same as the production pipeline).
    X_noisy = add_noise(X, noise_level=0.06)

    X_train, X_test, y_train, y_test = train_test_split(
        X_noisy, y, test_size=0.2, random_state=42, stratify=y
    )

    # K-Means cluster tags (Task 1): fit on the training split only, then tag
    # both splits so no test geometry leaks into the clusters.
    kmeans = fit_kmeans(X_train, n_clusters=n_clusters, random_state=42)
    X_train_aug = add_cluster_features(X_train, kmeans)
    X_test_aug = add_cluster_features(X_test, kmeans)

    print(f"Baseline features: {X_train_aug.shape[1]} "
          f"({X_train.shape[1]} intelligence + {n_clusters} cluster tags)")

    model = train_model(X_train_aug, y_train)
    top_1_acc, top_5_acc, report = evaluate_model(model, X_test_aug, y_test)

    print(f"\n=== Multinomial Logistic Regression Baseline ===")
    print(f"Top-1 Accuracy: {top_1_acc * 100:.2f}%")
    print(f"Top-5 Accuracy: {top_5_acc * 100:.2f}%")
    print("\nClassification Report:\n")
    print(report)

    model_dir = os.path.dirname(model_output)
    save_artifact(model, model_output)
    kmeans_output = os.path.join(model_dir, 'career_baseline_kmeans.joblib')
    encoder_output = os.path.join(model_dir, 'career_baseline_label_encoder.joblib')
    save_artifact(kmeans, kmeans_output)
    save_artifact(label_encoder, encoder_output)

    print(f"\nBaseline model saved to: {model_output}")
    print(f"K-Means tagger saved to: {kmeans_output}")
    print(f"Label encoder saved to: {encoder_output}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Train the multinomial logistic regression baseline (noise + K-Means cluster tags)."
    )
    parser.add_argument("-i", "--input_csv", type=str, required=True, help="Path to the raw dataset CSV")
    parser.add_argument(
        "-m", "--model_output", type=str, default="./models/career_baseline_logreg.joblib",
        help="Path where the trained baseline model will be saved"
    )
    parser.add_argument(
        "-k", "--n_clusters", type=int, default=DEFAULT_N_CLUSTERS,
        help="Number of K-Means clusters (default: 8, one per intelligence dimension)"
    )
    args = parser.parse_args()

    main(args.input_csv, args.model_output, args.n_clusters)
