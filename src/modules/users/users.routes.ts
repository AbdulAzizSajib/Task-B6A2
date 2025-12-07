import express from "express";
import { userController } from "./users.controller";
import auth from "../../middleware/auth";
const userRouter = express.Router();

userRouter.post("/auth/signup", userController.createUser);
userRouter.get("/users", auth("admin"), userController.getAllUsers);
userRouter.put(
  "/users/:userId",
  auth("admin", "customer"),
  userController.updateUser
);
userRouter.delete("/users/:userId", auth("admin"), userController.deleteUser);

export default userRouter;
