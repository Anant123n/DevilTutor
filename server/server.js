// server/server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

app.use("/api/chat", chatRoutes);
app.use("/api/stt", chatRoutes); // Add this line to mount /api/stt

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
