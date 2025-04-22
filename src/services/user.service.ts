import { db } from "../config/db";
import { User, userModel, UserUpdateInput } from "../models/user.model";

export const userService = {
  async createUser(
    username: string,
    msisdn: string,
    password: string
  ): Promise<string | null> {
    return await userModel.createUser(username, msisdn, password);
  },

  async getAllUsersExcept(currentUserId: string) {
    return await userModel.getAllUsersExcept(currentUserId);
  },

  async getUserById(id: string) {
    return await userModel.getUserById(id);
  },

  async getUserByLogin(login: string) {
    return await userModel.getUserByLogin(login);
  },

  async updateUser(id: string, fieldsToUpdate: UserUpdateInput) {
    const user = await userModel.getUserById(id);
    if (!user) return null;

    await userModel.updateUserFields(id, fieldsToUpdate);
    return await userModel.getUserById(id);
  },
};
