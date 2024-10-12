import { Router } from "express";
import { crearAcreedoresHandler, getAllAcreedoresHandler } from "../handlers/insolvenciaHandlers.js";

const insolvenciaRouter = Router();

insolvenciaRouter.post("/crearacreedores", crearAcreedoresHandler);
insolvenciaRouter.post("/crearsolicitud", crearAcreedoresHandler);
insolvenciaRouter.get("/acreedores", getAllAcreedoresHandler);

export default insolvenciaRouter;
