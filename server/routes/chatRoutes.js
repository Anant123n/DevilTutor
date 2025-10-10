import express from "express";
import { askTutor } from "../controllers/chatController.js";

const router = express.Router();

router.post("/chat", askTutor);

export default router;
