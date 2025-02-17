import { Router } from "express";
import {
  deleteUser,
  getAllUseres,
  updateUser,
} from "../controllers/user.controller";
import { isOwn, isAuthenticated } from "../middlewares";
export default (router: Router) => {
  router.get("/users", isAuthenticated, getAllUseres);
  router.delete("/users/:id", isAuthenticated, isOwn, deleteUser);
  router.patch("/users/:id", isAuthenticated, isOwn, updateUser);
};
