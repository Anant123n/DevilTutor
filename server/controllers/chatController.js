// server/controllers/chatController.js
import { spawn } from "child_process";
import path from "path";

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    console.log("Received message:", message);

    // FULL PATH to your model.py file
    const modelPath = "/Users/anantagrawal140gmail.com/DiviltuttorModel/model.py";

    const pythonProcess = spawn("python3", [modelPath, message]);

    let dataToSend = "";

    pythonProcess.stdout.on("data", (data) => {
      dataToSend += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);
      try {
        const output = JSON.parse(dataToSend);
        res.json({
          reply: output.text,
          audio: output.audio,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to parse Python output" });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
