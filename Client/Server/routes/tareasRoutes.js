import { Router } from "express";
import { tareasByIdHandler,getTareaHandler, postCreateTareaHandler, selectTareaHandler, completarTareaHandler} from "../handlers/tareaHandlers.js";

const tareasRouter = Router();

tareasRouter.get("/:idProspecto", tareasByIdHandler); 
tareasRouter.get("/", getTareaHandler); 
tareasRouter.get("/select", selectTareaHandler); 

tareasRouter.post("/", postCreateTareaHandler);

tareasRouter.patch("/:idTarea", completarTareaHandler); 

export default tareasRouter; 
