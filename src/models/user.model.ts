import { RowDataPacket, ResultSetHeader } from "mysql2";
import { db } from "../config/db";

export interface User extends RowDataPacket {
  id: string;
  username: string;
  full_name: string;
  msisdn: string;
  avatar_url: string | null;
  password_hash: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserUpdateInput {
  username?: string;
  avatar_url?: string;
  full_name?: string;
  bio?: string;
}

export const userModel = {
  async createUser(
    username: string,
    msisdn: string,
    password_hash: string
  ): Promise<string | null> {
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO users (username, msisdn, password_hash) VALUES (?, ?, ?)",
      [username, msisdn, password_hash]
    );

    return result.insertId ? String(result.insertId) : null;
  },

  async getAllUsersExcept(currentUserId: string) {
    const [rows] = await db.execute<User[]>(
      "SELECT * FROM users WHERE id != ?",
      [currentUserId]
    );
    return rows;
  },

  async getUserById(id: string): Promise<User | null> {
    const [rows] = await db.execute<User[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    return rows.length > 0 ? rows[0] : null;
  },

  async getUserByLogin(login: string): Promise<User | null> {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE msisdn = ? OR username = ?",
      [login, login]
    );
    return Array.isArray(rows) && rows.length ? (rows[0] as User) : null;
  },

  async updateUserFields(
    id: string,
    fieldsToUpdate: UserUpdateInput
  ): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(fieldsToUpdate).forEach(([key, value]) => {
      if (value) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return;

    values.push(id);

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    await db.execute(sql, values);
  },
};
