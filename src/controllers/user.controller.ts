import { Request, Response } from "express";

import { userService } from "../services/user.service";
import { UserUpdateInput } from "../models/user.model";

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fields: UserUpdateInput = (({
      full_name,
      username,
      avatar_url,
      bio,
    }) => ({
      full_name,
      username,
      avatar_url,
      bio,
    }))(req.body);

    const hasFieldsToUpdate = Object.values(fields).some(
      (val) => val !== undefined && val !== null
    );

    if (!hasFieldsToUpdate) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    const updatedUser = await userService.updateUser(id, fields);

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
