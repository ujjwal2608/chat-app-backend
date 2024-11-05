import express from "express";
import {
  login,
  register,
  resetPassword,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
