import { Request, Response } from "express";
import { ChatService } from "../services/chat.service";

export const ChatController = {
  async list(req: Request, res: Response) {
    const id = Number(req.params.id);
    const chats = await ChatService.getAllChatsForUser(id);
    res.status(200).json(chats);
  },

  async create(req: Request, res: Response) {
    const { name, userIds } = req.body;
    const chat = await ChatService.createChat(name, userIds);
    res.status(201).json(chat);
  },
};
