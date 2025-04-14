import { Request, Response } from "express";

import { userService } from "../services/user.service";

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { full_name, username, avatar_url, bio } = req.body;

    if (!username && !full_name && !avatar_url && !bio) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    const updatedUser = await userService.updateUser(id, {
      full_name,
      username,
      avatar_url,
      bio,
    });

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
