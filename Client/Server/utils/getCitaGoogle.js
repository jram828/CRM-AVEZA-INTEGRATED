import { google } from "googleapis";

import { config } from "dotenv";

config();

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;



export const getCitaGoogle = async (calendarId, eventId) => {
  try {
    // Autenticación con JWT
    const jwtClient = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      null,
      GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/calendar.readonly"],
    );

    const calendar = google.calendar({ version: "v3", auth: jwtClient });

    const res = await calendar.events.get({
      calendarId,
      eventId,
    });
    return res.data;
  } catch (error) {
    if (error.code === 404) return null; 
    throw error; // otros errores sí se propagan
  }
};
