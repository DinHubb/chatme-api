import express from "express";
import { ChatController } from "../controllers/chat.controller";

export default (router: express.Router) => {
  router.get("/user/:id", ChatController.list);
  router.post("/create-chat", ChatController.create);
};
