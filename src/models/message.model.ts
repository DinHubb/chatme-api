import { RowDataPacket } from "mysql2";
import { db } from "../config/db";

export interface Message extends RowDataPacket {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "video" | "audio" | "file" | "sticker" | "system";
  mediaUrl: string | null;
  isEdited: boolean;
  sentAt: Date;
  deliveredAt: Date | null;
}

export const createMessage = async (
  chatId: string,
  senderId: string,
  content: string,
  type: string
): Promise<string | null> => {
  const [result] = await db.query(
    "INSERT INTO messages (chat_id, sender_id, content, type) VALUES (?, ?, ?, ?)",
    [chatId, senderId, content, type]
  );
  return (result as any).insertId;
};

export const getMessagesByChatId = async (
  chatId: string
): Promise<Message[]> => {
  const [rows] = await db.query<Message[]>(
    "SELECT * FROM messages WHERE chat_id = ?",
    [chatId]
  );
  return rows;
};
