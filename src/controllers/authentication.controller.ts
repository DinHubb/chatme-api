import { Request, Response } from "express";
import { createUser, getUserByLogin } from "../service/user.service";
import { authentication, random } from "../helpers";
import { generateToken } from "../utils/jwt";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      res.status(400).json({ errors: { message: "Invalid request" } });
      return;
    }

    const user: any = await getUserByLogin(login);
    if (!user) {
      res.status(404).json({ errors: { message: "User not found" } });
      return;
    }

    const expectedHash = authentication(password);

    if (user.password !== expectedHash) {
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

    res.cookie("access_token", token, {
      httpOnly: true, // Prevents JavaScript access (more secure)
      secure: false, // Enable secure cookies in production
      sameSite: "strict", // Prevents CSRF attacks
      domain: "localhost", // Change this for production
      path: "/",
      maxAge: 3600000, // 1 hour expiration
    });

    res.status(200).json({ message: "Login successful", meta: { token } });
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

    const existingUser = await getUserByLogin(email);
    if (existingUser) {
      res.status(400).json({ error: "User already exists." });
      return;
    }

    const authData = {
      password: authentication(password),
    };

    const user = await createUser(username, email, authData.password);

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

    res.status(200).json({ user: req?.identity });
  } catch (error) {
    console.error("Error in auth/me:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
