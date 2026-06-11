"""Generate career counselor chat replies grounded in the student's assessment.

Builds a system prompt from the user's 8-dimension Gardner intelligence scores and
their top career recommendations, then sends the running conversation to an
OpenAI-compatible chat completions API and returns the assistant's reply.

Configuration mirrors llm.py and reuses the same environment variables, so the
provider can be swapped without code changes (OpenAI, Groq, OpenRouter, Ollama):
    LLM_API_KEY   - API key for the provider (required for live completions)
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


def build_system_prompt(predictions, scores):
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

    context = ''
    if score_lines:
        context += (
            "\n\nThe student rated themselves across Gardner's 8 multiple intelligences (1-5 scale):\n"
            + "\n".join(score_lines)
        )
    if pred_lines:
        context += (
            "\n\nAn ML model returned these top career matches for the student:\n"
            + "\n".join(pred_lines)
        )

    return (
        "You are an empathetic, experienced high school career counselor for the "
        "Skill-Path Architect platform. You help a recently graduated student understand "
        "and refine their AI-generated career recommendations."
        + context
        + "\n\nUse this profile to ground every answer. Explain why the model may have "
        "recommended a career in human-friendly terms, acknowledge the student's "
        "feelings, and suggest concrete next steps when helpful. Keep replies concise "
        "(2-3 short paragraphs), encouraging, and conversational. Write in clean prose "
        "without markdown headings or bullet lists."
    )


def generate_local_reply(messages, predictions, scores):
    """Template-based reply used when no LLM API key is configured."""
    last_question = ''
    for msg in reversed(messages):
        if msg.get('role') == 'user':
            last_question = (msg.get('content') or '').strip()
            break

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
    if len(trait_names) >= 2:
        trait_phrase = f"{trait_names[0]} and {trait_names[1]}"
    else:
        trait_phrase = ', '.join(trait_names) or 'your strongest intelligences'

    top = predictions[0] if predictions else {}
    top_career = top.get('career', 'your top match')

    intro = "That's a great question. " if last_question else ''
    return (
        f"{intro}Your assessment highlights {trait_phrase} as your strongest intelligences, "
        f"and that profile is what led the model to suggest options like {top_career}. "
        f"The recommendation reflects how your scores map to roles in the model's training data, "
        f"not a fixed verdict on what you must do.\n\n"
        f"If a suggestion doesn't feel right, that's useful information too — tell me which part "
        f"feels off and we can look at the alternatives in your list or talk through what a typical "
        f"day in {top_career} actually looks like. A good next step is to research entry paths into "
        f"the matches that interest you most and weigh them against your own preferences.\n\n"
        f"(Note: live AI counseling is not configured on this server, so this is a general response. "
        f"Set LLM_API_KEY in ai/.env to enable personalized chat answers.)"
    )


def generate_reply(messages, predictions, scores):
    """Return the counselor's reply to the running conversation.

    messages: list of {role: 'user'|'assistant', content: str} in chronological order.
    """
    api_key = os.environ.get('LLM_API_KEY')
    if not api_key:
        return generate_local_reply(messages, predictions, scores)

    base_url = os.environ.get('LLM_BASE_URL', DEFAULT_BASE_URL).rstrip('/')
    model = os.environ.get('LLM_MODEL', DEFAULT_MODEL)

    chat_messages = [{'role': 'system', 'content': build_system_prompt(predictions, scores)}]
    for msg in messages:
        role = msg.get('role')
        content = msg.get('content')
        if role in ('user', 'assistant') and content:
            chat_messages.append({'role': role, 'content': content})

    payload = {
        'model': model,
        'messages': chat_messages,
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
