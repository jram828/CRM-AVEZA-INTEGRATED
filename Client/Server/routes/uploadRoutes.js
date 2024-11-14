import { Router } from "express";
import { uploadHandler } from "../handlers/uploadHandlers.js";
import Multer from "multer";

const multer = Multer({
  storage: Multer.memoryStorage(), // change this into memoryStorage from diskStorage
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const upload = multer({ dest: 'uploads/' });
const uploadRouter = Router();

uploadRouter.post("/upload", upload.single("file"), uploadHandler);

export default uploadRouter;