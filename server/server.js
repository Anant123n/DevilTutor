import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", chatRoutes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
