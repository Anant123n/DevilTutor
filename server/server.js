import express from "express";
import cors from "cors";
import path from "path";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());

// 🔹 Serve Audio_temp folder as static files
app.use("/audio_temp", express.static(path.join(__dirname, "client", "src", "Audio_temp")));

// 🔹 API routes
app.use("/api", chatRoutes);

app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);
