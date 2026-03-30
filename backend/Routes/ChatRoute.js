import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { sendMessage, getMessages } from "../Controllers/ChatController.js";

const router = express.Router();

router.post("/send", verifyToken, sendMessage);
router.get("/:conversationId", verifyToken, getMessages);

export default router;
