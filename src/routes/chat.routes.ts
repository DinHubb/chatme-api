import express from "express";
import { ChatController } from "../controllers/chat.controller";
import { isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
  router.get("/chats/:userId", isAuthenticated, ChatController.getUserChats);
  router.post("/chat-open", isAuthenticated, ChatController.openChat);
  router.post("/send-message", isAuthenticated, ChatController.sendMessage);
};
