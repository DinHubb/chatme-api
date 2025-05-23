import { NextFunction, Request, Response } from "express";

import { get, merge } from "lodash";
import { verifyToken } from "../utils/jwt";

export const isOwn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const currentUserId = get(req, "identity.id") as string | undefined;

    if (!currentUserId) {
      res.sendStatus(403).json({
        error: "You are not authorized to perform this action",
      });
      return;
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.sendStatus(403);
      return;
    }

    try {
      const userPayload = verifyToken(token);

      merge(req, { identity: userPayload });
      next();
    } catch (error) {
      res.sendStatus(403);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
