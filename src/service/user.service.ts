import { conn } from "../config/db";
import { User } from "../models/user.model";

export const createUser = async (
  username: User,
  email: User,
  password: string
): Promise<number | null> => {
  try {
    const insertQuery = `
      INSERT INTO users (username, email, password) VALUES (?, ?, ?)
    `;

    const [result] = await conn.query(insertQuery, [username, email, password]);

    return (result as any).insertId;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const [rows]: any = await conn.query("SELECT * FROM users WHERE id = ?", [
      id,
    ]);

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error fetching user by id:", error);
  }
};

export const getUserByLogin = async (login: string): Promise<User | null> => {
  try {
    const [rows]: any = await conn.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [login, login]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};
