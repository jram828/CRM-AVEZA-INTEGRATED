import { Router } from "express";
import { crearAcreedoresHandler, crearSolicitudHandler, getAllAcreedoresHandler,getSolicitudByCedulaHandler } from "../handlers/insolvenciaHandlers.js";

const insolvenciaRouter = Router();

insolvenciaRouter.post("/crearacreedores", crearAcreedoresHandler);
insolvenciaRouter.post("/crearsolicitud", crearSolicitudHandler);
insolvenciaRouter.get("/acreedores", getAllAcreedoresHandler);
insolvenciaRouter.get("/obtenersolicitud/:cedula", getSolicitudByCedulaHandler);
export default insolvenciaRouter;
