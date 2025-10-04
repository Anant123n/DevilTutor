// server/routes/chatRoutes.js
import express from "express";
import { handleChat } from "../controllers/chatController.js";
import { handleSTT } from "../controllers/sttController.js";

const router = express.Router();

router.post("/", handleChat);
router.post("/stt", handleSTT);

export default router;
