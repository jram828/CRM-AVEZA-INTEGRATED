import { Router } from "express";
import { tareasByIdHandler,tareasHandler,postCreateTarea} from "../handlers/tareaHandlers.js";

const tareasRouter = Router();

tareasRouter.get("/:idProspecto", tareasByIdHandler); 
tareasRouter.get("/", tareasHandler); 
tareasRouter.post("/", postCreateTarea);


export default tareasRouter; 
