import { authenticateGoogle, deleteFile, uploadToGoogleDrive } from "../controllers/upload/upload.js";

const uploadHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }
    const auth = authenticateGoogle();
    const response = await uploadToGoogleDrive(req.file, auth);
    deleteFile(req.file.path);
    res.status(200).json({ response });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error uploading file.");
  }
};
export default uploadHandler;