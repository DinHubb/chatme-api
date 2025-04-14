import { getChatById } from "../models/chat.model";

export const getChat = async (chatId: string) => {
  return await getChatById(chatId);
};
