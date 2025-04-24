import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db";
import { Chat, User, Message, UserChat } from "../types/chat.types";

export const ChatModel = {
  async findOrCreateChat(user1Id: number, user2Id: number): Promise<Chat> {
    const [rows] = await db.query<Chat[]>(
      `SELECT * FROM chats WHERE 
       (user1_id = ? AND user2_id = ?) OR 
       (user1_id = ? AND user2_id = ?)`,
      [user1Id, user2Id, user2Id, user1Id]
    );

    if (rows.length > 0) return rows[0];

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO chats (user1_id, user2_id) VALUES (?, ?)`,
      [user1Id, user2Id]
    );

    return {
      id: result.insertId,
      user1_id: user1Id,
      user2_id: user2Id,
      last_message_id: null,
    } as Chat;
  },

  async getChatMessages(chatId: number): Promise<Message[]> {
    const [rows] = await db.query<Message[]>(
      `SELECT * FROM messages WHERE chat_id = ? ORDER BY sent_at ASC`,
      [chatId]
    );
    return rows;
  },

  async createMessage(
    chatId: number,
    senderId: number,
    content: string
  ): Promise<void> {
    await db.query(
      `INSERT INTO messages (chat_id, sender_id, content) VALUES (?, ?, ?)`,
      [chatId, senderId, content]
    );
  },

  async getOtherUserName(
    chat: Chat,
    currentUserId: number
  ): Promise<any | undefined> {
    const otherUserId =
      chat.user1_id === currentUserId ? chat.user2_id : chat.user1_id;
    const [rows] = await db.query<User[]>(
      `SELECT id, username, avatar_url, lastseen FROM users WHERE id = ?`,
      [otherUserId]
    );
    return rows[0];
  },

  async getChatsByUserId(userId: number): Promise<UserChat[]> {
    const [chats] = await db.query<Chat[]>(
      `SELECT * FROM chats WHERE user1_id = ? OR user2_id = ?`,
      [userId, userId]
    );

    const result: UserChat[] = await Promise.all(
      chats.map(async (chat) => {
        const otherUserId =
          chat.user1_id === userId ? chat.user2_id : chat.user1_id;

        const [[otherUser]] = await db.query<User[]>(
          `SELECT id, username, avatar_url, is_online, lastseen FROM users WHERE id = ?`,
          [otherUserId]
        );

        const [[lastMessage]] = await db.query<Message[]>(
          `SELECT * FROM messages WHERE chat_id = ? ORDER BY sent_at DESC LIMIT 1`,
          [chat.id]
        );

        return {
          chat_id: chat.id,
          participant: otherUser,
          last_message: lastMessage ?? null,
        };
      })
    );

    return result;
  },
};
