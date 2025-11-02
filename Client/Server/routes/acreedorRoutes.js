import { Router } from "express";
import {
  getAcreedoresHandler,
  postAcreedorHandler,
  getAcreedorDetailHandler,
  deleteAcreedorHandler,
  postActualizaAcreedor,
  deleteDuplicatesAcreedorHandler,
} from "../handlers/acreedorHandlers.js";

const AcreedoresRouter = Router();

AcreedoresRouter.get("/", getAcreedoresHandler);

AcreedoresRouter.get("/:NIT", getAcreedorDetailHandler);

AcreedoresRouter.post("/", postAcreedorHandler);

AcreedoresRouter.delete("/delete", deleteAcreedorHandler);
AcreedoresRouter.delete("/deleteduplicates", deleteDuplicatesAcreedorHandler);

AcreedoresRouter.put("/actualiza", postActualizaAcreedor);

export default AcreedoresRouter;
