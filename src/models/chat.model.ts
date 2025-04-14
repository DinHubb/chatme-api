import { RowDataPacket } from "mysql2";
import { db } from "../config/db";

export interface Chat extends RowDataPacket {
  id: string;
  name: string;
  avatarUrl: string | null;
  lastMessageId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const getChatById = async (chatId: string): Promise<Chat | null> => {
  const [rows] = await db.query<Chat[]>("SELECT * FROM chats WHERE id = ?", [
    chatId,
  ]);
  return rows.length > 0 ? rows[0] : null;
};
