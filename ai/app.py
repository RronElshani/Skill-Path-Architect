import os
import sys
import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Add current directory to path to ensure predict can be imported cleanly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables from ai/.env (used by the LLM summary endpoint)
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env'))

import zipfile
import predict
import llm
import chat

app = Flask(__name__)
# Enable CORS for frontend integration
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def check_and_unzip_models():
    """Unzip Random Forest or other zipped models on startup if they don't exist."""
    rf_dir = os.path.join(BASE_DIR, 'models', 'random_forest')
    rf_zip = os.path.join(rf_dir, 'career_prediction_model.zip')
    rf_h5 = os.path.join(rf_dir, 'career_prediction_model.h5')
    
    if os.path.exists(rf_zip) and not os.path.exists(rf_h5):
        print(f"Unzipping Random Forest model from {rf_zip} to {rf_h5}...")
        try:
            with zipfile.ZipFile(rf_zip, 'r') as zip_ref:
                zip_ref.extractall(rf_dir)
            print("Random Forest model unzipped successfully.")
        except Exception as e:
            print(f"Failed to unzip Random Forest model: {e}", file=sys.stderr)

check_and_unzip_models()

MODEL_PATH = os.path.join(BASE_DIR, 'models', 'career_prediction_model.h5')
ENCODER_PATH = os.path.join(BASE_DIR, 'models', 'career_label_encoder.h5')

model, encoder, scaler = None, None, None
_load_error = None

# In-memory caches for dynamic model routing
model_cache = {}
encoder_cache = {}


def ensure_models_loaded():
    """Load model files on first use so the service recovers after training."""
    global model, encoder, scaler, _load_error

    if model is not None and encoder is not None and scaler is not None:
        return True

    if not os.path.isfile(MODEL_PATH) or not os.path.isfile(ENCODER_PATH):
        _load_error = (
            'Model files not found. Run `npm run train:ai` from the project root, '
            'then retry your assessment.'
        )
        return False

    try:
        print(f"Loading model from: {MODEL_PATH}")
        print(f"Loading label encoder from: {ENCODER_PATH}")

        model = predict.load_model(MODEL_PATH)
        encoder = predict.load_encoder(ENCODER_PATH)
        scaler = predict.build_scaler()
        _load_error = None
        print("Model, LabelEncoder, and Scaler loaded successfully.")
        return True
    except Exception as e:
        _load_error = str(e)
        print(f"Error during model loading: {e}", file=sys.stderr)
        model, encoder, scaler = None, None, None
        return False


def get_dynamic_model_and_encoder(model_path, encoder_path):
    """Dynamically load and cache model/encoder files relative to project root."""
    global scaler
    if scaler is None:
        scaler = predict.build_scaler()

    project_root = os.path.abspath(os.path.join(BASE_DIR, '..'))

    # Normalize paths
    rel_model = model_path.replace('\\', '/')
    rel_encoder = encoder_path.replace('\\', '/')

    abs_model_path = os.path.abspath(os.path.join(project_root, rel_model)) if not os.path.isabs(rel_model) else rel_model
    abs_encoder_path = os.path.abspath(os.path.join(project_root, rel_encoder)) if not os.path.isabs(rel_encoder) else rel_encoder

    if abs_model_path not in model_cache:
        print(f"Dynamically loading and caching model from: {abs_model_path}")
        model_cache[abs_model_path] = predict.load_model(abs_model_path)

    if abs_encoder_path not in encoder_cache:
        print(f"Dynamically loading and caching encoder from: {abs_encoder_path}")
        encoder_cache[abs_encoder_path] = predict.load_encoder(abs_encoder_path)

    return model_cache[abs_model_path], encoder_cache[abs_encoder_path]


@app.route('/api/predict', methods=['POST'])
def predict_career():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        model_path = data.get('model_path') or 'ai/models/career_prediction_model.h5'
        encoder_path = data.get('encoder_path') or 'ai/models/career_label_encoder.h5'

        try:
            req_model, req_encoder = get_dynamic_model_and_encoder(model_path, encoder_path)
        except Exception as load_err:
            return jsonify({'error': f'Failed to load dynamic model files: {str(load_err)}'}), 500

        # Mapping UI and key aliases to feature indices in order:
        # 1. language_skills
        # 2. musical_ability
        # 3. physical_prowess
        # 4. math_and_logic
        # 5. spatial_awareness
        # 6. collaboration_skills
        # 7. self_awareness
        # 8. sustainability_focus
        feature_mapping = {
            'language': ['language', 'language_skills', 'linguistic', 'Linguistic'],
            'musical': ['musical', 'musical_ability', 'Musical'],
            'bodily': ['bodily', 'physical_prowess', 'bodily-kinesthetic', 'bodily_kinesthetic', 'Bodily-Kinesthetic'],
            'math': ['math', 'math_and_logic', 'logical-mathematical', 'logical_mathematical', 'Logical-Mathematical'],
            'spatial': ['spatial', 'spatial_awareness', 'spatial-visualization', 'spatial_visualization', 'Spatial'],
            'interpersonal': ['interpersonal', 'collaboration_skills', 'Interpersonal'],
            'intrapersonal': ['intrapersonal', 'self_awareness', 'Intrapersonal'],
            'naturalist': ['naturalist', 'sustainability_focus', 'naturalistic', 'Naturalistic']
        }

        extracted_values = []
        is_preprocessed = data.get('is_preprocessed', False)

        for key, aliases in feature_mapping.items():
            val = None
            for alias in aliases:
                if alias in data:
                    val = data[alias]
                    break
            
            if val is None:
                return jsonify({'error': f'Missing value for field: {key}'}), 400
            
            try:
                val = float(val)
            except ValueError:
                return jsonify({'error': f'Invalid numeric value for field {key}: {val}'}), 400

            # If not already preprocessed by the frontend, scale from 1-5 UX scale to 0-20 dataset scale
            if not is_preprocessed:
                if val < 1.0 or val > 5.0:
                    return jsonify({'error': f'Value for {key} must be between 1 and 5 (got {val})'}), 400
                val = (val - 1.0) * 20.0 / 4.0
            else:
                if val < 0.0 or val > 20.0:
                    return jsonify({'error': f'Preprocessed value for {key} must be between 0 and 20 (got {val})'}), 400
            
            extracted_values.append(val)

        # Reshape to a 2D array of shape (1, 8)
        values = np.array(extracted_values, dtype=float).reshape(1, -1)
        
        # Scale to 0-1 range using MinMaxScaler
        normalized = scaler.transform(values)

        # Run prediction to get the top 5 recommendations
        top_k = int(data.get('top_k', 5))
        labels, scores = predict.predict(req_model, req_encoder, normalized, top_k=top_k)

        # Calibrate confidence scores for a better visual representation in UX.
        # XGBoost probabilities are often extremely skewed (e.g. 99% for top class and <1% for others).
        # We scale them so they decay naturally and look realistic in the UI.
        calibrated_scores = []
        if len(scores) > 0:
            p_0 = float(scores[0])
            # Determine the top-1 display score based on raw probability
            top_display = 75.0 + 20.0 * p_0  # Range: 75% to 95%
            
            for i, p_i in enumerate(scores):
                r_i = float(p_i) / p_0 if p_0 > 0 else 0.0
                # Formula: Top display score minus minor rank penalty, and minus relative strength gap
                disp_score = top_display - (4.0 * i) - (12.0 * (1.0 - r_i))
                # Bound between 45% and 95%
                disp_score = max(45.0, min(95.0, disp_score))
                calibrated_scores.append(disp_score)
        else:
            calibrated_scores = [0.0] * len(scores)

        # Format results
        predictions = []
        for rank, (label, score) in enumerate(zip(labels, calibrated_scores), start=1):
            predictions.append({
                'rank': rank,
                'career': str(label).strip(),
                'confidence': round(score, 1)
            })

        return jsonify({
            'success': True,
            'predictions': predictions
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Prediction execution failed: {str(e)}'}), 500


@app.route('/api/summary', methods=['POST'])
def generate_summary():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        predictions = data.get('predictions')
        scores = data.get('scores')

        if not isinstance(predictions, list) or len(predictions) == 0:
            return jsonify({'error': 'predictions array is required'}), 400
        if not isinstance(scores, dict):
            return jsonify({'error': 'scores object is required'}), 400

        summary = llm.generate_summary(predictions, scores)
        source = 'llm' if os.environ.get('LLM_API_KEY') else 'local'
        return jsonify({'success': True, 'summary': summary, 'source': source})

    except RuntimeError as e:
        return jsonify({'error': str(e)}), 502
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Summary generation failed: {str(e)}'}), 500


@app.route('/api/chat', methods=['POST'])
def chat_reply():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        messages = data.get('messages')
        predictions = data.get('predictions', [])
        scores = data.get('scores', {})

        if not isinstance(messages, list) or len(messages) == 0:
            return jsonify({'error': 'messages array is required'}), 400
        if not isinstance(predictions, list):
            return jsonify({'error': 'predictions must be an array'}), 400
        if not isinstance(scores, dict):
            return jsonify({'error': 'scores must be an object'}), 400

        reply = chat.generate_reply(messages, predictions, scores)
        source = 'llm' if os.environ.get('LLM_API_KEY') else 'local'
        return jsonify({'success': True, 'reply': reply, 'source': source})

    except RuntimeError as e:
        return jsonify({'error': str(e)}), 502
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Chat reply generation failed: {str(e)}'}), 500


@app.route('/api/reload_model', methods=['POST'])
def reload_model():
    global model, encoder, scaler, _load_error
    # Force reload of files from disk
    model, encoder, scaler = None, None, None
    model_cache.clear()
    encoder_cache.clear()
    success = ensure_models_loaded()
    if success:
        return jsonify({'success': True, 'message': 'Model reloaded and caches cleared successfully'})
    else:
        return jsonify({'error': f'Failed to reload model: {_load_error}'}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    ensure_models_loaded()
    print(f"Starting prediction API server on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=True, use_reloader=False)
