import { authenticateGoogle, deleteFile, uploadToGoogleDrive } from "../controllers/upload/upload.js";

export const uploadHandler = async (req, res, next) => {
    console.log("FILE",req.file);
  try {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }
    const auth = authenticateGoogle();
    const response = await uploadToGoogleDrive(req.file, auth);
    res.status(200).json({ response });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error uploading file.");
  }
};

