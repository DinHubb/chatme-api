import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { authentication, random } from "../helpers";
import { generateToken } from "../utils/jwt";
import { User } from "../models/user.model";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      res.status(400).json({ errors: { message: "Invalid request" } });
      return;
    }

    const user: User | null = await userService.getUserByLogin(login);

    if (!user) {
      res.status(404).json({ errors: { message: "User not found" } });
      return;
    }

    const expectedHash = authentication(password);

    if (user.password_hash !== expectedHash) {
      res
        .status(403)
        .json({ errors: { message: "Invalid login or password" } });
      return;
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    res.status(200).json({ message: "Login successful", meta: { token } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { msisdn, password, username } = req.body;

    if (!msisdn || !password || !username) {
      res.status(400).json({
        error:
          "Invalid request. Phone number, username, and password are required.",
      });
      return;
    }

    const existingUser = await userService.getUserByLogin(msisdn);
    if (existingUser) {
      res.status(400).json({ error: "User already exists." });
      return;
    }

    const authData = {
      password: authentication(password),
    };

    const user = await userService.createUser(
      username,
      msisdn,
      authData.password
    );

    res.status(201).json(user);
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const me = async (req: any, res: Response): Promise<void> => {
  try {
    if (!req?.identity) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await userService.getUserById(req?.identity.id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user: user });
  } catch (error) {
    console.error("Error in auth/me:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
