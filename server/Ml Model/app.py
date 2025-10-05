from flask import Flask, request, jsonify, send_file
from chatmodel import get_physics_answer
from gtts import gTTS
import os

# Initialize Flask app
app = Flask(__name__)

# Temporary directory for audio files
AUDIO_DIR = "audio_temp"
os.makedirs(AUDIO_DIR, exist_ok=True)

# Root route
@app.route("/", methods=["GET"])
def home():
    return "<h2>Physics Assistant API is running. Use POST /ask to ask questions.</h2>"

# Ask route
@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    question = data.get("question", "").strip()
    
    if not question:
        return jsonify({"error": "Please provide a question"}), 400

    # Get text answer from the model
    answer = get_physics_answer(question)

    # Clean the text: remove *, \n, and extra whitespace for gTTS
    import re
    clean_answer = re.sub(r'[\*\n]', ' ', answer).strip()
    clean_answer = re.sub(r'\s+', ' ', clean_answer)  # collapse multiple spaces

    # Generate audio using gTTS
    tts = gTTS(text=clean_answer, lang="en")
    audio_filename = os.path.join(AUDIO_DIR, "answer.mp3")
    tts.save(audio_filename)

    # Return JSON response with text and audio file path
    return jsonify({
        "question": question,
        "answer_text": answer,       # original text (with formatting)
        "answer_audio": audio_filename
    })


# Route to serve audio file
@app.route("/audio/<filename>", methods=["GET"])
def serve_audio(filename):
    file_path = os.path.join(AUDIO_DIR, filename)
    if os.path.exists(file_path):
        return send_file(file_path, mimetype="audio/mpeg")
    return jsonify({"error": "File not found"}), 404

# Run Flask app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
