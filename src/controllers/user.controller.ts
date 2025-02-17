import { Request, Response } from "express";
import { conn } from "../config/db";
import { getUserById } from "../service/user.service";

export const getAllUseres = async (req: Request, res: Response) => {
  try {
    const [rows] = await conn.query("SELECT * FROM users");
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Database query failed" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await conn.query("DELETE FROM users WHERE id = ?", [id]);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Database query failed" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      res.sendStatus(400);
      return;
    }

    const user = await getUserById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await conn.execute("UPDATE users SET username = ? WHERE id = ?", [
      username,
      id,
    ]);

    const updatedUser = await getUserById(id);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
