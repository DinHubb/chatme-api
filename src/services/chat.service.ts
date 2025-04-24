import { db } from "../config/db";
import { ChatModel } from "../models/chat.model";

export const ChatService = {
  async getOrCreateChat(userId: number, otherUserId: number) {
    return await ChatModel.findOrCreateChat(userId, otherUserId);
  },

  async getMessages(chatId: number) {
    return await ChatModel.getChatMessages(chatId);
  },

  async sendMessage(chatId: number, senderId: number, content: string) {
    await ChatModel.createMessage(chatId, senderId, content);
  },

  async getChatRoomName(chat: any, userId: number) {
    return await ChatModel.getOtherUserName(chat, userId);
  },

  async getUserChats(userId: number) {
    return await ChatModel.getChatsByUserId(userId);
  },
};
