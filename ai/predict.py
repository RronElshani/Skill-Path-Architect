"""Predict career labels from 8 raw intelligence attribute scores.

This script loads a saved XGBoost model and LabelEncoder, converts 1-5
user inputs into the original 0-20 questionnaire scale, normalizes them
with the same MinMax scaling range as the dataset, and returns the predicted
profession labels.
"""

import argparse
import joblib
import numpy as np
from sklearn.preprocessing import MinMaxScaler

FEATURE_NAMES = [
    'language_skills',
    'musical_ability',
    'physical_prowess',
    'math_and_logic',
    'spatial_awareness',
    'collaboration_skills',
    'self_awareness',
    'sustainability_focus'
]

FEATURE_BOUNDS = {
    'language_skills': {'min': 0, 'max': 20},
    'musical_ability': {'min': 0, 'max': 20},
    'physical_prowess': {'min': 0, 'max': 20},
    'math_and_logic': {'min': 0, 'max': 20},
    'spatial_awareness': {'min': 0, 'max': 20},
    'collaboration_skills': {'min': 0, 'max': 20},
    'self_awareness': {'min': 0, 'max': 20},
    'sustainability_focus': {'min': 0, 'max': 20}
}


def build_scaler() -> MinMaxScaler:
    """Build a MinMaxScaler using the same bounds as the original dataset."""
    mins = np.array([FEATURE_BOUNDS[name]['min'] for name in FEATURE_NAMES]).reshape(1, -1)
    maxs = np.array([FEATURE_BOUNDS[name]['max'] for name in FEATURE_NAMES]).reshape(1, -1)
    scaler = MinMaxScaler()
    scaler.fit(np.vstack([mins, maxs]))
    return scaler


def map_inputs_to_dataset_scale(values: np.ndarray) -> np.ndarray:
    """Convert 1-5 UI values into the original 0-20 dataset scale."""
    return (values - 1) * 20.0 / 4.0


def prepare_input(args: argparse.Namespace, scaler: MinMaxScaler) -> np.ndarray:
    values = np.array([
        args.language,
        args.musical,
        args.bodily,
        args.math,
        args.spatial,
        args.interpersonal,
        args.intrapersonal,
        args.naturalist
    ], dtype=float).reshape(1, -1)

    values = map_inputs_to_dataset_scale(values)
    normalized = scaler.transform(values)
    return normalized


def load_model(path: str):
    return joblib.load(path)


def load_encoder(path: str):
    return joblib.load(path)


def predict(model, encoder, X: np.ndarray, top_k: int = 5):
    probabilities = model.predict_proba(X)[0]
    indices = np.argsort(probabilities)[-top_k:][::-1]
    labels = encoder.inverse_transform(indices)
    scores = probabilities[indices]
    return labels, scores


def main():
    parser = argparse.ArgumentParser(description='Predict a career using 8 raw attribute values.')
    parser.add_argument('--model', type=str, default='./models/career_prediction_model.h5', help='Path to the saved XGBoost model')
    parser.add_argument('--encoder', type=str, default='./models/career_label_encoder.h5', help='Path to the saved LabelEncoder')
    parser.add_argument('--language', type=float, required=True, help='Linguistic score (1-5)')
    parser.add_argument('--musical', type=float, required=True, help='Musical score (1-5)')
    parser.add_argument('--bodily', type=float, required=True, help='Bodily score (1-5)')
    parser.add_argument('--math', type=float, required=True, help='Logical - Mathematical score (1-5)')
    parser.add_argument('--spatial', type=float, required=True, help='Spatial-Visualization score (1-5)')
    parser.add_argument('--interpersonal', type=float, required=True, help='Interpersonal score (1-5)')
    parser.add_argument('--intrapersonal', type=float, required=True, help='Intrapersonal score (1-5)')
    parser.add_argument('--naturalist', type=float, required=True, help='Naturalist score (1-5)')
    parser.add_argument('--top_k', type=int, default=5, help='Number of top predictions to display')
    args = parser.parse_args()

    scaler = build_scaler()
    X = prepare_input(args, scaler)

    model = load_model(args.model)
    encoder = load_encoder(args.encoder)

    labels, scores = predict(model, encoder, X, top_k=args.top_k)

    print('Input values:')
    for name, value in zip(FEATURE_NAMES, X[0]):
        print(f'  {name}: {value:.4f}')

    print('\nPredicted top careers:')
    for rank, (label, score) in enumerate(zip(labels, scores), start=1):
        print(f'  {rank}. {label} ({score * 100:.2f}%)')


if __name__ == '__main__':
    main()
