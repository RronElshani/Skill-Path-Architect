"""Train a career prediction classifier from a dataset CSV.

This script expects a raw dataset CSV. It renames columns, encodes job
profession labels, normalizes features using shared preprocess helpers, adds
Gaussian noise for robustness, trains the selected classifier (XGBoost, Random Forest,
Neural Network, or SVM), prints Top-1 and Top-5 performance, displays a classification
report, and saves the configuration and metrics to a JSON file.
"""

import argparse
import os
import json
import time
import joblib
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier

from preprocess import add_noise, clean_raw_data, preprocess_data, rename_columns


def save_model(model, path: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    joblib.dump(model, path)


def main():
    parser = argparse.ArgumentParser(description="Train a career prediction model from the raw dataset CSV.")
    parser.add_argument("-i", "--input_csv", type=str, required=True, help="Path to the raw dataset CSV")
    parser.add_argument(
        "-m", "--model_output", type=str, default="./models/career_prediction_model.h5",
        help="Path where the trained model will be saved"
    )
    parser.add_argument(
        "--algorithm", type=str, default="XGBoost",
        choices=["XGBoost", "Random Forest", "Neural Network", "SVM"],
        help="Machine learning algorithm to train"
    )
    parser.add_argument("--run_id", type=str, default="", help="Run ID of the experiment")
    
    # Hyperparameters
    parser.add_argument("--learning_rate", type=float, default=None, help="Learning rate (XGBoost eta / Neural Network initial lr)")
    parser.add_argument("--max_depth", type=int, default=None, help="Max depth (XGBoost / Random Forest)")
    parser.add_argument("--n_estimators", type=int, default=None, help="Number of estimators (XGBoost / Random Forest)")
    parser.add_argument("--c_value", type=float, default=None, help="Regularization C value (SVM)")
    parser.add_argument("--hidden_layer_sizes", type=str, default=None, help="Hidden layer sizes for MLP, e.g. '128,64'")
    parser.add_argument("--epochs", type=int, default=None, help="Max iterations/epochs (Neural Network)")

    args = parser.parse_args()

    print(f"Loading raw dataset from: {args.input_csv}")
    df = pd.read_csv(args.input_csv)
    df = clean_raw_data(df)
    
    if 'Job profession' in df.columns:
        df = rename_columns(df)

    if 'job_profession' not in df.columns:
        raise ValueError("Expected 'job_profession' or 'Job profession' column in raw dataset")
    
    X, y, label_encoder = preprocess_data(df)
    print("Adding Gaussian noise to features for robustness (noise_level=0.06)...")
    X_noisy = add_noise(X, noise_level=0.06)

    X_train, X_test, y_train, y_test = train_test_split(
        X_noisy, y, test_size=0.2, random_state=42, stratify=y
    )

    num_classes = len(np.unique(y))
    print(f"Train samples: {X_train.shape[0]} | Test samples: {X_test.shape[0]} | Classes: {num_classes}")

    # Build model according to chosen algorithm
    algo = args.algorithm
    hparams = {}
    
    if algo == "XGBoost":
        lr = args.learning_rate if args.learning_rate is not None else 0.1
        depth = args.max_depth if args.max_depth is not None else 5
        est = args.n_estimators if args.n_estimators is not None else 500
        
        hparams = {"learningRate": lr, "maxDepth": depth, "nEstimators": est}
        print(f"Configured XGBoost with: {hparams}")
        
        model = xgb.XGBClassifier(
            objective='multi:softmax',
            num_class=num_classes,
            learning_rate=lr,
            max_depth=depth,
            n_estimators=est,
            random_state=42,
            use_label_encoder=False,
            eval_metric='mlogloss'
        )
    elif algo == "Random Forest":
        depth = args.max_depth if (args.max_depth is not None and args.max_depth > 0) else None
        est = args.n_estimators if args.n_estimators is not None else 200
        
        hparams = {"maxDepth": depth, "nEstimators": est}
        print(f"Configured Random Forest with: {hparams}")
        
        model = RandomForestClassifier(
            n_estimators=est,
            max_depth=depth,
            random_state=42,
            n_jobs=-1
        )
    elif algo == "Neural Network":
        lr = args.learning_rate if args.learning_rate is not None else 0.001
        epochs = args.epochs if args.epochs is not None else 1000
        
        sizes_str = args.hidden_layer_sizes if args.hidden_layer_sizes else "128,64"
        sizes = tuple(map(int, sizes_str.split(',')))
        
        hparams = {"learningRate": lr, "epochs": epochs, "hiddenLayerSizes": list(sizes)}
        print(f"Configured Neural Network (MLPClassifier) with: {hparams}")
        
        model = MLPClassifier(
            hidden_layer_sizes=sizes,
            activation='relu',
            solver='adam',
            learning_rate_init=lr,
            max_iter=epochs,
            random_state=42,
            verbose=True
        )
    elif algo == "SVM":
        c_val = args.c_value if args.c_value is not None else 10.0
        
        hparams = {"cValue": c_val}
        print(f"Configured SVM with: {hparams}")
        
        model = SVC(
            kernel='rbf',
            C=c_val,
            gamma='scale',
            probability=True,
            random_state=42
        )
    else:
        raise ValueError(f"Unsupported algorithm: {algo}")

    print("Fitting model...")
    model.fit(X_train, y_train)
    print("Fitting completed.")

    # Evaluation
    print("Evaluating model performance...")
    y_pred = model.predict(X_test)
    y_probs = model.predict_proba(X_test)

    top_1_acc = accuracy_score(y_test, y_pred)
    top_5_indices = np.argsort(y_probs, axis=1)[:, -5:][:, ::-1]
    top_5_hits = [y_test[i] in top_5_indices[i] for i in range(len(y_test))]
    top_5_acc = np.mean(top_5_hits)

    # Classification Report
    target_names = [str(cls) for cls in label_encoder.classes_]
    report_text = classification_report(y_test, y_pred, target_names=target_names, zero_division=0)
    report_dict = classification_report(y_test, y_pred, target_names=target_names, output_dict=True, zero_division=0)

    print(f"Top-1 Accuracy: {top_1_acc * 100:.2f}%")
    print(f"Top-5 Accuracy: {top_5_acc * 100:.2f}%")
    print("\nClassification Report:\n")
    print(report_text)

    # Calculate overall metrics
    overall_precision = report_dict['weighted avg']['precision']
    overall_recall = report_dict['weighted avg']['recall']
    overall_f1 = report_dict['weighted avg']['f1-score']

    # Save trained model and label encoder
    print(f"Saving model to: {args.model_output}")
    save_model(model, args.model_output)
    
    if args.run_id:
        encoder_output = os.path.join(os.path.dirname(args.model_output), f"encoder_{args.run_id}.h5")
    else:
        encoder_output = os.path.join(os.path.dirname(args.model_output), "career_label_encoder.h5")
    print(f"Saving label encoder to: {encoder_output}")
    save_model(label_encoder, encoder_output)

    # Normalize paths to match standard format expected by Node (using relative path starting with 'ai/')
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    rel_model_path = os.path.relpath(args.model_output, project_root).replace('\\', '/')
    rel_encoder_path = os.path.relpath(encoder_output, project_root).replace('\\', '/')
    
    run_id = args.run_id if args.run_id else f"run_{int(time.time())}"
    
    metrics_data = {
        "runId": run_id,
        "algorithm": algo,
        "hyperparameters": hparams,
        "accuracy": float(top_1_acc),
        "precision": float(overall_precision),
        "recall": float(overall_recall),
        "f1Score": float(overall_f1),
        "metricsPerClass": {},
        "filePath": rel_model_path,
        "encoderPath": rel_encoder_path
    }
    
    # Print a single clean json line to stdout that the server can parse
    print(f"__METRICS_JSON__:{json.dumps(metrics_data)}")
    print("Training job complete!")


if __name__ == "__main__":
    main()
