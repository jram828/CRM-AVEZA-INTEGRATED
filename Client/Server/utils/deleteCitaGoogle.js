import { google } from "googleapis";
import { config } from "dotenv";

config();

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;

export const deleteCitaGoogle = async (calendarId, eventId) => {
  try {
    console.log("Intentando eliminar evento en Google Calendar con calendarId:", calendarId, "y eventId:", eventId);  
    // Autenticación con JWT
    const jwtClient = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      null,
      GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/calendar"],
    );

    const calendar = google.calendar({ version: "v3", auth: jwtClient });

    // Eliminar el evento en Google Calendar
    await calendar.events.delete({
      calendarId,
      eventId, // 👈 este es el ID del evento en Google Calendar
    });

    return { mensaje: "Evento eliminado correctamente de Google Calendar" };
  } catch (err) {
    console.error("Error al eliminar evento en Google Calendar:", err.message);
    throw err;
  }
};
