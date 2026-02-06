import { Router } from "express";
import { notasByIdHandler,getNotaHandler, postCreateNotaHandler, selectNotaHandler, completarNotaHandler} from "../handlers/notaHandlers.js";

const notasRouter = Router();

notasRouter.get("/:idProspecto", notasByIdHandler); 
notasRouter.get("/", getNotaHandler); 
notasRouter.get("/select", selectNotaHandler); 

notasRouter.post("/", postCreateNotaHandler);

notasRouter.patch("/:idNota", completarNotaHandler); 

export default notasRouter; 
