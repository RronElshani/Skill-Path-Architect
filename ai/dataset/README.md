# Dataset — Skill Predictor

## Source

The dataset (`dataset_skill_predictor.csv`) maps student intelligence profiles to job professions, based on **Gardner's Theory of Multiple Intelligences**.

## At a Glance

| Property | Value |
|---|---|
| File | `dataset_skill_predictor.csv` |
| Rows | 3,600 |
| Unique Professions | 72 |
| Feature Columns | 8 intelligence scores (numeric) |
| Target Column | `Job profession` |

## Column Reference

### Columns Used by the Model

| Column | Type | Description |
|---|---|---|
| `Job profession` | Categorical (target) | The profession associated with the student's intelligence profile (72 unique values, e.g., Astronomer, Software Developer, Teacher, etc.) |
| `Linguistic` | Numeric | Verbal and written language proficiency |
| `Musical` | Numeric | Rhythm, pitch, and musical comprehension |
| `Bodily` | Numeric | Body coordination and kinesthetic ability |
| `Logical - Mathematical` | Numeric | Reasoning, abstract thinking, and math |
| `Spatial-Visualization` | Numeric | 3D thinking, spatial reasoning, and visualization |
| `Interpersonal` | Numeric | Social interaction, empathy, and teamwork |
| `Intrapersonal` | Numeric | Self-reflection and emotional intelligence |
| `Naturalist` | Numeric | Understanding of nature and the environment |

### Columns Dropped During Preprocessing

| Column | Reason for Dropping |
|---|---|
| `Sr.No.` | Row index — no predictive value |
| `Course` | Empty / unused field |
| `Student` | Student identifier (e.g., S1, S2) — no predictive value |
| `s/p` | Student/profession key — no predictive value |
| `P1` – `P8` | Categorical proficiency labels (POOR, AVG, BEST) — redundant with the numeric intelligence scores |

## Sample Rows

```
Job profession  | Student | Linguistic | Musical | Bodily | Logical-Math | Spatial | Interpersonal | Intrapersonal | Naturalist
Astronomer      | S1      | 11         | 5       | 12     | 16           | 17      | 11            | 18            | 19
Astronomer      | S2      | 12         | 6       | 12     | 16           | 16      | 11            | 18            | 19
```

## Notes

- Each profession has approximately 50 student entries (3,600 ÷ 72 = 50).
- The raw intelligence scores are normalized to a `[0, 1]` range using `MinMaxScaler` before being fed to the model.
- The dataset is used as-is for training — no external augmentation is applied. Gaussian noise is only added during robustness testing (see the notebook).

Each entry represents a specific student's intelligence profile and their associated career recommendation. For the full ML pipeline, see [`../dataset_exploration.ipynb`](../dataset_exploration.ipynb).