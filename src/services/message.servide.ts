import { createMessage, getMessagesByChatId } from "../models/message.model";

export const createNewMessage = async (
  chatId: string,
  senderId: string,
  content: string,
  type: string
) => {
  return await createMessage(chatId, senderId, content, type);
};

export const getMessages = async (chatId: string) => {
  return await getMessagesByChatId(chatId);
};
