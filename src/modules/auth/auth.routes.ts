import express from "express";
import { authController } from "./auth.controller";

const authRouter = express.Router();

authRouter.post("/auth/signin", authController.login);

export default authRouter;
