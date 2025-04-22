import express from "express";
import authentication from "./authentication.routes";
import users from "./user.routes";
import chatRoutes from "./chat.routes";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  chatRoutes(router);
  return router;
};
