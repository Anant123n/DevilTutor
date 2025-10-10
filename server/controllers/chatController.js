import fetch from "node-fetch";

export const askTutor = async (req, res) => {
  try {
    const { question } = req.body;

    const response = await fetch("http://127.0.0.1:5001/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Python API error:", text);
      return res.status(500).json({ error: "Python API returned an error", details: text });
    }

    const data = await response.json();

    // Only send question and answer text
    res.json({
      question: data.question,
      answer_text: data.answer_text
    });

  } catch (err) {
    console.error("Error contacting Python API:", err);
    res.status(500).json({ error: "Failed to contact Python API" });
  }
};
