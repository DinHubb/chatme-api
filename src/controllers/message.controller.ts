import { Request, Response } from "express";
import { db } from "../config/db";

export async function getMessagesByChatId(req: Request, res: Response) {
  const { chatId } = req.params;
  try {
    const [rows] = await db.query(
      `
      SELECT id, chat_id AS chatId, sender_id AS senderId, content, type,
             media_url AS mediaUrl, replied_to_message_id AS repliedToMessageId,
             is_edited AS isEdited, sent_at AS sentAt, delivered_at AS deliveredAt
      FROM messages
      WHERE chat_id = ?
      ORDER BY sent_at ASC
    `,
      [chatId]
    );
    res.json(rows);
  } catch (error) {
    res.status(400).json({ message: "Error fetching messages", error });
  }
}
