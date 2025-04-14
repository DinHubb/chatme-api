import { Request, Response } from "express";
import { db } from "../config/db";

export async function getChatsByUserId(req: Request, res: Response) {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(
      `
      SELECT c.id, c.type, c.name, c.avatar_url AS avatarUrl, c.updated_at AS updatedAt
      FROM chats c
      JOIN chat_participants cp ON cp.chat_id = c.id
      WHERE cp.user_id = ?
    `,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(400).json({ message: "Error fetching chats", error });
  }
}

export async function getChatById(req: Request, res: Response) {
  const { chatId } = req.params;
  try {
    const [chatRows] = await db.query(
      `
      SELECT id, type, name, avatar_url AS avatarUrl, created_at, updated_at
      FROM chats
      WHERE id = ?
    `,
      [chatId]
    );

    const [participants] = await db.query(
      `
      SELECT u.id, u.username, u.avatar_url AS avatarUrl
      FROM chat_participants cp
      JOIN users u ON cp.user_id = u.id
      WHERE cp.chat_id = ?
    `,
      [chatId]
    );

    res.json({ ...chatRows, participants });
  } catch (error) {
    res.status(400).json({ message: "Error fetching chat", error });
  }
}
