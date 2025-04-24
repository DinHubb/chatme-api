import { RowDataPacket } from "mysql2";

export interface Chat extends RowDataPacket {
  id: number;
  user1_id: number;
  user2_id: number;
  last_message_id: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends RowDataPacket {
  id: number;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  msisdn: string;
  lastseen: string;
  is_online: string;
}

export interface Message extends RowDataPacket {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  sen: Date;
}

export interface UserChat {
  chat_id: number;
  last_message: Message | null;
  participant: User;
}
