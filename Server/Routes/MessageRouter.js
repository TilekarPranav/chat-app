import express from "express";
import protectRoutes from "../MiddleWare/auth.js";
import { 
  getMessages, 
  getUser, 
  markMessageAsSeen, 
  sendMessage 
} from "../Controllers/MessageController.js";

const MessageRouter = express.Router();

MessageRouter.get("/users", protectRoutes, getUser);
MessageRouter.get("/:id", protectRoutes, getMessages);
MessageRouter.put("/mark/:id", protectRoutes, markMessageAsSeen);
MessageRouter.post("/send/:id", protectRoutes, sendMessage);

export default MessageRouter;
