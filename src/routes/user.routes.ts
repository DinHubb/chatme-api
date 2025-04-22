import { Router } from "express";
import { isOwn, isAuthenticated } from "../middlewares";
import { UserController } from "../controllers/user.controller";
import { uploadAvatar } from "../middlewares/upload";
export default (router: Router) => {
  router.get("/user-list/:id", isAuthenticated, UserController.getAllUser);
  router.patch(
    "/user-update/:id",
    isAuthenticated,
    isOwn,
    uploadAvatar,
    UserController.updateUser
  );
};
