// server/controllers/chatController.js
import { spawn } from "child_process";
import path from "path";

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    console.log("Received message:", message);
    // Return a dummy reply and dummy audio (null)
    res.json({
      reply: `Echo: ${message}`,
      audio: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
