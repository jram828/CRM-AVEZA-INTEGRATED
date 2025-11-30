import { Router } from "express";
import { tareasByIdHandler,getTareaHandler, postCreateTareaHandler, selectTareaHandler} from "../handlers/tareaHandlers.js";

const tareasRouter = Router();

tareasRouter.get("/:idProspecto", tareasByIdHandler); 
tareasRouter.get("/", getTareaHandler); 
tareasRouter.get("/select", selectTareaHandler); 
tareasRouter.post("/", postCreateTareaHandler);


export default tareasRouter; 
