import { Request, Response } from "express";
import { ChatService } from "../services/chat.service";

export const ChatController = {
  async openChat(req: Request, res: Response) {
    try {
      const user1_id = parseInt(req.body.user1_id);
      const user2_id = parseInt(req.body.user2_id);

      if (isNaN(user1_id) || isNaN(user2_id)) {
        res.status(400).json({ error: "Invalid user IDs" });
        return;
      }

      const chat = await ChatService.getOrCreateChat(user1_id, user2_id);
      const participant = await ChatService.getChatRoomName(chat, user1_id);
      const messages = await ChatService.getMessages(chat.id);

      res.status(201).json({ chat_id: chat.id, participant, messages });
    } catch (error) {
      console.error("openChat error:", error);
      res.status(500).json({ error: "Failed to open chat" });
    }
  },

  async sendMessage(req: Request, res: Response) {
    try {
      const { chat_id, sender_id, content } = req.body;

      if (!chat_id || !sender_id || !content) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      await ChatService.sendMessage(chat_id, sender_id, content);
      res.sendStatus(201);
    } catch (error) {
      console.error("sendMessage error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  },

  async getUserChats(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      const chats = await ChatService.getUserChats(userId);
      res.json(chats);
    } catch (error) {
      console.error("getUserChats error:", error);
      res.status(500).json({ error: "Failed to get user chats" });
    }
  },
};
