import { Router } from "express";
import { getMessages, getConversations, createConversation } from "../controllers/message.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const messageRouter = Router();

// All routes require authentication
messageRouter.use(verifyToken);

messageRouter.route("/conversations").get(getConversations);
messageRouter.route("/conversations/create").post(createConversation);
messageRouter.route("/conversations/:conversationId/messages").get(getMessages);

export default messageRouter;
