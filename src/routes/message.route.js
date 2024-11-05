import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import protectRoute from "../middlewares/protectRoute.js"; // Assuming you have an authentication middleware

const messageRouter = express.Router();

// Route for sending a message
messageRouter.post("/messages/:id", protectRoute, sendMessage);
// Route for retrieving messages between two users
messageRouter.get("/messages/:id", protectRoute, getMessages);

export default messageRouter;
