import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  uploadChatFile,
  deleteMessage,
  createOrGetConversation,
} from "../controllers/chat.controller.js";

const chatRouter = Router();

// File upload for chat messages
chatRouter.post(
  "/upload",
  auth,
  upload.single("messageAttachment"),
  uploadChatFile,
);

// Delete message
chatRouter.delete("/messages/:messageId", auth, deleteMessage);
chatRouter.post('/conversation', auth, createOrGetConversation);

export default chatRouter;
