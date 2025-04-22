import { Router } from "express";
import {
  createCasosHandler,
  getCasoHandler,
  finCasoHandler,
  getTipoDeCasoByIdHandler,
  postActualizaCaso,
  postActualizaCasoCotizacion,
  deleteCasoHandler,
} from "../handlers/casosHandlers.js";

const casosRouter = Router();

casosRouter.get("/", getCasoHandler);

casosRouter.get("/:idCaso", getTipoDeCasoByIdHandler);

casosRouter.post("/", createCasosHandler);

casosRouter.post("/findecaso", finCasoHandler);

casosRouter.post("/elimina", deleteCasoHandler);

casosRouter.put("/actualiza", postActualizaCaso); //Actualizar datos (uno a la vez)

casosRouter.put("/actualizacotizacion", postActualizaCasoCotizacion);
export default casosRouter;
