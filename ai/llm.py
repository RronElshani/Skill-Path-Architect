"""Generate a personalized career summary from the model's predictions.

Sends the user's 8-dimension intelligence scores plus the top career predictions
to an OpenAI-compatible chat completions API and returns the generated text.

Configuration is done via environment variables, so the provider can be swapped
without code changes (OpenAI, Groq, OpenRouter, local Ollama, etc.):
    LLM_API_KEY   - API key for the provider (required)
    LLM_BASE_URL  - Base URL of the API (default: https://api.openai.com/v1)
    LLM_MODEL     - Model name (default: gpt-4o-mini)
"""

import os
import json
import urllib.request
import urllib.error

DEFAULT_BASE_URL = 'https://api.openai.com/v1'
DEFAULT_MODEL = 'gpt-4o-mini'
REQUEST_TIMEOUT = 30

INTELLIGENCE_LABELS = {
    'language_skills': 'Linguistic',
    'musical_ability': 'Musical',
    'physical_prowess': 'Bodily-Kinesthetic',
    'math_and_logic': 'Logical-Mathematical',
    'spatial_awareness': 'Spatial',
    'collaboration_skills': 'Interpersonal',
    'self_awareness': 'Intrapersonal',
    'sustainability_focus': 'Naturalistic'
}


def build_prompt(predictions, scores):
    score_lines = []
    for key, label in INTELLIGENCE_LABELS.items():
        val = scores.get(key)
        if val is None:
            continue
        score_lines.append(f"- {label}: {float(val):.1f} / 5.0")

    pred_lines = []
    for p in predictions:
        rank = p.get('rank', '?')
        career = p.get('career', 'Unknown')
        confidence = p.get('confidence', 0)
        pred_lines.append(f"- #{rank} {career} ({confidence}% match)")

    return (
        "You are a career counselor helping a recently graduated high school student "
        "understand their AI-generated career recommendations.\n\n"
        "The student rated themselves across Gardner's 8 multiple intelligences (1-5 scale):\n"
        + "\n".join(score_lines) + "\n\n"
        "An ML model returned these top career matches:\n"
        + "\n".join(pred_lines) + "\n\n"
        "Write a personalized 3 to 4 paragraph summary that:\n"
        "1. Explains why these specific careers fit the student's strongest intelligences.\n"
        "2. Notes the current job market demand for the top recommendation.\n"
        "3. Suggests concrete next steps such as university programs, skills to build, or starter projects.\n"
        "Keep the tone encouraging and concrete. Address the student directly using 'you'. "
        "Write in clean prose. Do not use markdown headings, lists, or bullet points."
    )


def generate_local_summary(predictions, scores):
    """Template-based summary used when no LLM API key is configured."""
    top = predictions[0] if predictions else {}
    top_career = top.get('career', 'your top match')
    top_confidence = top.get('confidence', 0)

    ranked_traits = sorted(
        [
            (INTELLIGENCE_LABELS[key], float(scores[key]))
            for key in INTELLIGENCE_LABELS
            if scores.get(key) is not None
        ],
        key=lambda item: item[1],
        reverse=True,
    )
    trait_names = [label for label, _ in ranked_traits[:3]]
    if len(trait_names) >= 3:
        trait_phrase = f"{trait_names[0]}, {trait_names[1]}, and {trait_names[2]}"
    else:
        trait_phrase = ', '.join(trait_names) or 'several balanced intelligences'

    other_matches = predictions[1:3]
    backup_line = ''
    if other_matches:
        names = [f"{p.get('career')} ({p.get('confidence', 0)}%)" for p in other_matches]
        backup_line = f" Strong alternatives include {names[0]}"
        if len(names) > 1:
            backup_line += f" and {names[1]}"
        backup_line += '.'

    return (
        f"Your self-assessment highlights {trait_phrase} as your strongest intelligences. "
        f"These strengths shape how you learn, collaborate, and solve problems — and they are a solid foundation for choosing a direction after high school.\n\n"
        f"Based on your profile, {top_career} is your best-fit career match at {top_confidence}% alignment."
        f"{backup_line} "
        f"This recommendation reflects how your scores map to real-world roles in the model's training data.\n\n"
        f"To move forward, research entry paths into {top_career}, look for short courses or volunteer opportunities in related fields, "
        f"and talk with a counselor about university programs that build on your top strengths. "
        f"Retake the assessment anytime your interests shift — your blueprint should grow with you."
    )


def generate_summary(predictions, scores):
    api_key = os.environ.get('LLM_API_KEY')
    if not api_key:
        return generate_local_summary(predictions, scores)

    base_url = os.environ.get('LLM_BASE_URL', DEFAULT_BASE_URL).rstrip('/')
    model = os.environ.get('LLM_MODEL', DEFAULT_MODEL)

    payload = {
        'model': model,
        'messages': [
            {'role': 'system', 'content': 'You are an experienced, empathetic high-school career counselor.'},
            {'role': 'user', 'content': build_prompt(predictions, scores)}
        ],
        'temperature': 0.7,
        'max_tokens': 600
    }

    body = json.dumps(payload).encode('utf-8')
    request = urllib.request.Request(
        f'{base_url}/chat/completions',
        data=body,
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}',
            # Some providers (e.g. Groq behind Cloudflare) reject the default
            # Python-urllib User-Agent with a 403, so send a standard one.
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        },
        method='POST'
    )

    try:
        with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT) as response:
            data = json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        detail = e.read().decode('utf-8', errors='ignore')
        raise RuntimeError(f'LLM API returned {e.code}: {detail}')
    except urllib.error.URLError as e:
        raise RuntimeError(f'Could not reach LLM API: {e.reason}')

    choices = data.get('choices') or []
    if not choices:
        raise RuntimeError('LLM API returned no choices')
    return choices[0].get('message', {}).get('content', '').strip()
