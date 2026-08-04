import { Router } from "express";
import { postHandler } from "../handlers/chatHandlers.js";
import { getHandler } from "../handlers/chatHandlers.js";

const chatRouter = Router();
  
chatRouter.get("/webhookWa", getHandler);
chatRouter.post("/webhookWa", postHandler);

export default chatRouter;