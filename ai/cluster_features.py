"""K-Means cluster feature engineering (Task 1).

Engineers categorical cluster tags from the 8 scaled intelligence features by
fitting a K-Means model and one-hot encoding each sample's assigned cluster.
These cluster tags are consumed by the multinomial logistic-regression baseline
as extra features, alongside the Gaussian noise-augmented intelligence scores.

The KMeans model is fit on the training split only and then used to tag both
train and test samples, so no test information leaks into the cluster geometry.
"""

import numpy as np
import pandas as pd
from sklearn.cluster import KMeans

# One cluster per multiple-intelligence dimension.
DEFAULT_N_CLUSTERS = 8


def fit_kmeans(X: pd.DataFrame, n_clusters: int = DEFAULT_N_CLUSTERS, random_state: int = 42) -> KMeans:
    """Fit a K-Means model on the (scaled, noise-augmented) feature matrix."""
    kmeans = KMeans(n_clusters=n_clusters, random_state=random_state, n_init=10)
    kmeans.fit(X)
    return kmeans


def add_cluster_features(X: pd.DataFrame, kmeans: KMeans) -> pd.DataFrame:
    """Append one-hot encoded K-Means cluster tags to the feature matrix.

    Returns a new DataFrame with the original features plus ``cluster_0`` …
    ``cluster_{k-1}`` indicator columns. The index of ``X`` is preserved so the
    result stays aligned with the corresponding labels.
    """
    labels = kmeans.predict(X)
    n_clusters = kmeans.n_clusters

    cluster_cols = [f'cluster_{i}' for i in range(n_clusters)]
    one_hot = pd.DataFrame(
        np.eye(n_clusters, dtype=float)[labels],
        columns=cluster_cols,
        index=X.index,
    )
    return pd.concat([X, one_hot], axis=1)
