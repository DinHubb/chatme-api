import { Request, Response } from "express";
import {
  createUser,
  getUserByEmail,
  updateSessionToken,
} from "../service/user.service";
import { authentication, random } from "../helpers";
import { UserAuth, User } from "../models/user.model";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    const user: any = await getUserByEmail(email);
    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const expectedHash = authentication(user.salt, password);

    if (user.password !== expectedHash) {
      res.status(403).json({ error: "Invalid email or password" });
      return;
    }

    const salt = random();
    const sessionToken = authentication(salt, user.id.toString());

    await updateSessionToken(user.id, sessionToken);

    res.cookie("access_token", sessionToken, {
      httpOnly: true, // Prevents JavaScript access (more secure)
      secure: process.env.NODE_ENV === "production", // Enable secure cookies in production
      sameSite: "strict", // Prevents CSRF attacks
      domain: "localhost", // Change this for production
      path: "/",
      maxAge: 3600000, // 1 hour expiration
    });

    res.status(200).json({ message: "Login successful", user: user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      res.status(400).json({
        error: "Invalid request. Email, username, and password are required.",
      });
      return;
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: "User already exists." });
      return;
    }

    const salt = random();
    const authData = {
      salt,
      password: authentication(salt, password),
    };

    const user = await createUser(username, email, authData);

    res.status(201).json(user);
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
