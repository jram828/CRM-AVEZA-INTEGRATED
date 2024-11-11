import { Router } from "express";
import { crearAcreedoresHandler, crearSolicitudHandler, getAllAcreedoresHandler } from "../handlers/insolvenciaHandlers.js";

const insolvenciaRouter = Router();

insolvenciaRouter.post("/crearacreedores", crearAcreedoresHandler);
insolvenciaRouter.post("/crearsolicitud", crearSolicitudHandler);
insolvenciaRouter.get("/acreedores", getAllAcreedoresHandler);

export default insolvenciaRouter;
