import { Router } from "express";
import { dbBackUpHandler, createAcreedoresDbHandler } from "../handlers/dbBackUpHandlers.js";

const dbbackupRouter = Router();

dbbackupRouter.get("/", dbBackUpHandler);
dbbackupRouter.get("/acreedores", createAcreedoresDbHandler);


export default dbbackupRouter;