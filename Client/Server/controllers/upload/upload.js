import { google } from "googleapis";
import {config} from "dotenv";
import fs from 'fs';
// Folder ID const response = await drive.files.list(params);
config();

export const authenticateGoogle = () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  return auth;
};

export const uploadToGoogleDrive = async (file, auth) => {
  const fileMetadata = {
    name: file.originalname,
    parents: ["1fVi187njfYMXq_f1J2xWO75ghU8hL0Ed"], 
  };

  const media = {
    mimeType: file.mimetype,
    body: file.buffer,
  };

  const driveService = google.drive({ version: "v3", auth });

  const response = await driveService.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id",
  });
  return response;
};

export const deleteFile = (filePath) => {
  fs.unlink(filePath, () => {
    console.log("file deleted");
  });
};
