from flask import Flask, request, jsonify
from chatmodel import stream_chat_response, stream_physics_answer_chunks
import re
from gtts import gTTS
import os

app = Flask(__name__)

# Global memory for physics Q&A
physics_history = []


@app.route("/", methods=["GET"])
def home():
    return "<h2>Gemini Chatbot API is running. Use POST /chat or /ask to interact.</h2>"


# -------------------------------
# Helper Function: Clean Text
# -------------------------------
def clean_text(text: str) -> str:
    """Remove markdown, newlines, and extra spaces from model output."""
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)   # remove **bold**
    text = re.sub(r'[\*\n\r]+', ' ', text)         # remove * and newlines
    text = re.sub(r'\s+', ' ', text).strip()       # clean extra spaces
    return text


# -------------------------------
# Physics Q&A Endpoint
# -------------------------------
@app.route("/ask", methods=["POST"])
def physics():
    data = request.get_json()
    question = data.get("question", "").strip()

    if not question:
        return jsonify({"error": "Please provide a 'question' field"}), 400

    # Collect streamed physics answer
    full_answer = ""
    for chunk in stream_physics_answer_chunks(question, physics_history):
        full_answer += chunk

    clean_answer = clean_text(full_answer)

    # Save audio to specified path
    audio_dir = "/Users/anantagrawal140gmail.com/Desktop/DevilTutor/Web Product/client/public"
    os.makedirs(audio_dir, exist_ok=True)  # Ensure folder exists
    audio_path = os.path.join(audio_dir, "output.mp3")

    try:
        tts = gTTS(text=clean_answer, lang="en")
        tts.save(audio_path)
    except Exception as e:
        print(f"[Error] TTS generation failed: {e}")

    return jsonify({
        "question": question,
        "answer_text": clean_answer
        
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
