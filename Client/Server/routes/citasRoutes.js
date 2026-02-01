import { Router } from "express";
import { getCitaHandler,postCreateCita, postCreateCitaGoogle, getAvailabilityHandler, getCitasByIdHandler, getCitaGoogleHandler, completarCitaHandler } from "../handlers/citaHandlers.js";

const citasRouter = Router();

citasRouter.post("/", postCreateCita);
citasRouter.post("/google", postCreateCitaGoogle);

citasRouter.get("/", getCitaHandler);
citasRouter.get("/calendar", getCitaGoogleHandler);
citasRouter.get("/disponibilidad", getAvailabilityHandler);
citasRouter.get("/:idProspecto", getCitasByIdHandler);

citasRouter.patch("/:idCita", completarCitaHandler); 
export default citasRouter; 
