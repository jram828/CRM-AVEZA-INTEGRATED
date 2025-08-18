import { Router } from "express";
import {
  createCasosHandler,
  getCasoHandler,
  finCasoHandler,
  getTipoDeCasoByIdHandler,
  postActualizaCaso,
  postActualizaCasoCotizacion,
  deleteCasoHandler,
  createDeudasHandler,
  copyDeudasHandler,
  copyHonorariosHandler,
  postHonorariosHandler
} from "../handlers/casosHandlers.js";

const casosRouter = Router();

casosRouter.get("/", getCasoHandler);

casosRouter.get("/:idCaso", getTipoDeCasoByIdHandler);

casosRouter.post("/", createCasosHandler);

casosRouter.post("/findecaso", finCasoHandler);

casosRouter.post("/elimina", deleteCasoHandler);
casosRouter.post("/creardeudas", createDeudasHandler);
casosRouter.post("/copiardeudas", copyDeudasHandler);
casosRouter.post("/honorarios", postHonorariosHandler);
casosRouter.post("/copiarhonorarios", copyHonorariosHandler);

casosRouter.put("/actualiza", postActualizaCaso); //Actualizar datos (uno a la vez)

casosRouter.put("/actualizacotizacion", postActualizaCasoCotizacion);
export default casosRouter;
