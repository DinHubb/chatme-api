import { Router } from "express";
import { isOwn, isAuthenticated } from "../middlewares";
import { updateUser } from "../controllers/user.controller";
export default (router: Router) => {
  router.patch("/user-update/:id", isAuthenticated, isOwn, updateUser);
};
