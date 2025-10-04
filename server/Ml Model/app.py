from flask import Flask, request, jsonify
from chatmodel import get_physics_answer

# Initialize Flask app
app = Flask(__name__)

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

    answer = get_physics_answer(question)
    return jsonify({"question": question, "answer": answer})

# Run Flask app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
