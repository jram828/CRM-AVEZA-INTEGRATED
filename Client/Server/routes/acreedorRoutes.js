import { Router } from "express";
import {
  getAcreedoresHandler,
  postAcreedorHandler,
  getAcreedorDetailHandler,
  deleteAcreedorHandler,
  postActualizaAcreedor,
} from "../handlers/acreedorHandlers.js";

const AcreedoresRouter = Router();

AcreedoresRouter.get("/", getAcreedoresHandler);

AcreedoresRouter.get("/:NIT", getAcreedorDetailHandler);

AcreedoresRouter.post("/", postAcreedorHandler);

AcreedoresRouter.post("/delete", deleteAcreedorHandler);

AcreedoresRouter.put("/actualiza", postActualizaAcreedor);

export default AcreedoresRouter;
