"""Demo script that collects student intelligence scores and invokes predict.py."""

import subprocess
import sys

FEATURE_PROMPTS = [
    ('language', 'Linguistic score (1-5)'),
    ('musical', 'Musical score (1-5)'),
    ('bodily', 'Bodily score (1-5)'),
    ('math', 'Logical - Mathematical score (1-5)'),
    ('spatial', 'Spatial-Visualization score (1-5)'),
    ('interpersonal', 'Interpersonal score (1-5)'),
    ('intrapersonal', 'Intrapersonal score (1-5)'),
    ('naturalist', 'Naturalist score (1-5)')
]


def ask_for_float(prompt: str) -> float:
    while True:
        try:
            value = float(input(f"{prompt}: ").strip())
            if 1.0 <= value <= 5.0:
                return value
            print("Invalid input. Please enter a value between 1 and 5.")
        except ValueError:
            print("Invalid input. Please enter a numeric value.")


def main():
    print("Career Prediction Demo")
    print("Enter 8 intelligence attribute scores between 1 and 5.")
    print("These values will be normalized and passed to predict.py.")
    print()

    values = {}
    for arg_name, prompt in FEATURE_PROMPTS:
        values[arg_name] = ask_for_float(prompt)

    command = [
        sys.executable,
        "predict.py",
        "--language", str(values['language']),
        "--musical", str(values['musical']),
        "--bodily", str(values['bodily']),
        "--math", str(values['math']),
        "--spatial", str(values['spatial']),
        "--interpersonal", str(values['interpersonal']),
        "--intrapersonal", str(values['intrapersonal']),
        "--naturalist", str(values['naturalist'])
    ]

    print("\nRunning prediction...\n")
    subprocess.run(command, check=True)


if __name__ == '__main__':
    main()
