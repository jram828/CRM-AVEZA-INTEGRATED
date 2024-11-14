import { Router } from "express";
import { uploadHandler } from "../handlers/uploadHandlers.js";
import Multer from "multer";

const multer = Multer({
  storage: Multer.memoryStorage(), // change this into memoryStorage from diskStorage
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadRouter = Router();

uploadRouter.post("/upload", multer.single("file"), uploadHandler);

export default uploadRouter;