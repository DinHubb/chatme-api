import { db } from "../config/db";

export const ChatService = {
  async getAllChatsForUser(userId: number) {
    const [rows] = await db.query(
      `SELECT c.* FROM chats c
       JOIN chat_participants cp ON cp.chat_id = c.id
       WHERE cp.user_id = ?`,
      [userId]
    );
    return rows;
  },

  async createChat(name: string, userIds: number[]) {
    const [result] = await db.query("INSERT INTO chats (name) VALUES (?)", [
      name,
    ]);
    const chatId = (result as any).insertId;

    for (const userId of userIds) {
      await db.query(
        "INSERT INTO chat_participants (chat_id, user_id) VALUES (?, ?)",
        [chatId, userId]
      );
    }

    return { chatId };
  },
};
