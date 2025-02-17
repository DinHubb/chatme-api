import { conn } from "../config/db";
import { User, UserAuth } from "../models/user.model";

export const createUser = async (
  username: string,
  email: string,
  auth: UserAuth
): Promise<number | null> => {
  try {
    const insertQuery = `
      INSERT INTO users (username, email, password, salt) VALUES (?, ?, ?, ?)
    `;

    const [result] = await conn.query(insertQuery, [
      username,
      email,
      auth.password,
      auth.salt,
    ]);

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

export const getUserByEmail = async (email: User): Promise<User | null> => {
  try {
    const [rows]: any = await conn.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};

export const updateSessionToken = async (
  userId: number,
  sessionToken: string
) => {
  await conn.query("UPDATE users SET sessionToken = ? WHERE id = ?", [
    sessionToken,
    userId,
  ]);
};

export const getUserBySessionToken = async (sessionToken: string) => {
  if (!sessionToken) return null;

  try {
    const [rows]: any = await conn.execute(
      "SELECT * FROM users WHERE sessionToken = ? LIMIT 1",
      [sessionToken]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error fetching user by session token:", error);
    return null;
  }
};
