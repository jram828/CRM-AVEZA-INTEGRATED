import { Router } from "express";
import { getCitaHandler,postCreateCita, postCreateCitaGoogle, getAvailabilityHandler } from "../handlers/citaHandlers.js";

const citasRouter = Router();

citasRouter.post("/", postCreateCita);
citasRouter.post("/google", postCreateCitaGoogle);

citasRouter.get("/", getCitaHandler);
citasRouter.get("/disponibilidad", getAvailabilityHandler);

export default citasRouter; 
