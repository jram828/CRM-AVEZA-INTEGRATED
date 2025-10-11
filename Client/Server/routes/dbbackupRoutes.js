import { Router } from "express";
import { dbBackUpHandler } from "../handlers/dbBackUpHandlers.js";


const dbbackupRouter = Router();

dbbackupRouter.post("/", dbBackUpHandler);

export default uploadRouter;