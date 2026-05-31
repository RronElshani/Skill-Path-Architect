"""Preprocess the career recommendation dataset.

This script cleans the raw dataset, renames columns, encodes the job profession
labels, scales the feature values to a 0-1 range, optionally adds Gaussian
noise, and saves the preprocessed dataset to a CSV file.
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, MinMaxScaler


def rename_columns(df: pd.DataFrame) -> pd.DataFrame:
    column_rename_mapping = {
        'Job profession': 'job_profession',
        'Linguistic': 'language_skills',
        'Student': 'student_id',
        'Musical': 'musical_ability',
        'Bodily': 'physical_prowess',
        'Logical - Mathematical': 'math_and_logic',
        'Spatial-Visualization': 'spatial_awareness',
        'Interpersonal': 'collaboration_skills',
        'Intrapersonal': 'self_awareness',
        'Naturalist': 'sustainability_focus'
    }
    return df.rename(columns=column_rename_mapping)


def preprocess_data(df: pd.DataFrame) -> tuple[pd.DataFrame, np.ndarray, LabelEncoder]:
    le_target = LabelEncoder()
    y = le_target.fit_transform(df['job_profession'].str.strip())

    scaler = MinMaxScaler()
    feature_columns = df.drop(columns=['job_profession', 'student_id']).columns
    X = pd.DataFrame(scaler.fit_transform(df[feature_columns]), columns=feature_columns)

    return X, y, le_target


def clean_raw_data(df: pd.DataFrame) -> pd.DataFrame:
    df_clean = df.copy()
    df_clean = df_clean.drop(columns=[
        'Sr.No.', 'Course', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 's/p'
    ], errors='ignore')

    if 'Job profession' in df_clean.columns:
        df_clean['Job profession'] = df_clean['Job profession'].astype(str).str.strip()

    return df_clean


def add_noise(X: pd.DataFrame, noise_level) -> pd.DataFrame:
    noise = np.random.normal(0, noise_level, X.shape)
    return (X + noise).clip(0, 1)
