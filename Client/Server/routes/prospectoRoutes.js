import { Router } from "express";

import { relacionarPaises} from "../controllers/relacionarPaises.js";
import { relacionarDepartamentos } from "../controllers/relacionarDepartamentos.js";
import { crearCiudades } from "../controllers/crearCiudades.js";
import {
  prospectosDetailHandler,
  prospectosHandler,
  prospectosCasosHandler,
  postProspectosHandler,
  postEliminaProspectos,
  postActualizaProspectos,
  postActualizaDatosCotizacion,
  corregirAcentosProspectos,
  postProspectosAutoHandler,
  postActualizaStatus,
  // getClientByEmailHandler,
} from "../handlers/prospectosHandlers.js";

const prospectosRouter = Router();

prospectosRouter.get("/prospectos", prospectosHandler);
prospectosRouter.get("/prospectoscasos", prospectosCasosHandler);
prospectosRouter.get("/:cedulaprospecto", prospectosDetailHandler); // obtiene un único C


prospectosRouter.post("/registroprospecto", postProspectosHandler);
prospectosRouter.post("/registroprospectoauto", postProspectosAutoHandler);
prospectosRouter.post("/relacionarpaises", relacionarPaises);
prospectosRouter.post("/relacionardepartamentos", relacionarDepartamentos);
prospectosRouter.post("/crearciudades", crearCiudades);
prospectosRouter.post("/acentos", corregirAcentosProspectos);

prospectosRouter.put("/actualiza", postActualizaProspectos); //Actualizar datos (uno a la vez)
prospectosRouter.put("/cotizacion", postActualizaDatosCotizacion); 
prospectosRouter.put("/status", postActualizaStatus); 

prospectosRouter.post("/elimina", postEliminaProspectos);

export default prospectosRouter;

// clientesRouter.get("/email", getClientByEmailHandler);