import express from "express";
import { login, me, register } from "../controllers/authentication.controller";
import { isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.get("/auth/me", isAuthenticated, me);
};
