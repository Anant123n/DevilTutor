from flask import Flask, request, jsonify
from chatmodel import get_physics_answer
from gtts import gTTS
import os
import re
import base64
from io import BytesIO

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return "<h2>Physics Assistant API is running. Use POST /ask to ask questions.</h2>"

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    question = data.get("question", "").strip()

    if not question:
        return jsonify({"error": "Please provide a question"}), 400

    answer = get_physics_answer(question)

    # Clean answer for TTS
    clean_answer = re.sub(r'[\*\n]', ' ', answer).strip()
    clean_answer = re.sub(r'\s+', ' ', clean_answer)

    # Generate TTS and store in memory
    tts = gTTS(text=clean_answer, lang="en")
    mp3_fp = BytesIO()
    tts.write_to_fp(mp3_fp)
    mp3_fp.seek(0)

    # Encode audio to base64
    audio_base64 = base64.b64encode(mp3_fp.read()).decode("utf-8")

    return jsonify({
        "question": question,
        "answer_text": answer,
        "answer_audio": audio_base64
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
