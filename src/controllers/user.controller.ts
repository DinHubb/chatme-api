import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { UserUpdateInput } from "../models/user.model";

export const UserController = {
  async getAllUser(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res
        .status(200)
        .json({ users: users, message: "Users fetched successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const fields: UserUpdateInput = (({ full_name, username, bio }) => ({
        full_name,
        username,
        bio,
      }))(req.body);

      if (req.file) {
        fields.avatar_url = `${req.protocol}://${req.get(
          "host"
        )}/uploads/avatars/${req.file.filename}`;
      }

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
  },
};
