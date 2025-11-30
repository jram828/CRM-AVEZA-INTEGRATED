import { google } from "googleapis";
import { config } from "dotenv";
import moment from "moment-timezone";

config();

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;

export const getAllCitaGoogle = async (calendarId, mes) => {
  try {
    const zona = "America/Bogota";
    const hoy = moment.tz(zona);

    // Si llega mes, usamos ese; si no, usamos el mes actual
    const mesUsado = mes ? parseInt(mes, 10) - 1 : hoy.month(); // moment usa 0-11

    console.log("Mes usado para obtener citas de Google Calendar:", mesUsado + 1);
    
    const inicioMes = moment.tz(zona).month(mesUsado).startOf("month");
    const finMes = moment.tz(zona).month(mesUsado).endOf("month");

    // El rango debe empezar desde HOY si el mes es el actual
    const timeMin =
      mesUsado === hoy.month() ? hoy.startOf("day").format() : inicioMes.format();
    const timeMax = finMes.format();

    // Autenticación con JWT
    const jwtClient = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      null,
      GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/calendar.readonly"]
    );

    const calendar = google.calendar({ version: "v3", auth: jwtClient });

    // Obtener eventos del calendario
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin,
      timeMax,
      timeZone: zona,
      singleEvents: true,
      orderBy: "startTime",
    });

    const eventos = response.data.items || [];

    const citas = eventos.map((event) => ({
      id: event.id,
      resumen: event.summary,
      descripcion: event.description || "",
      inicio: event.start?.dateTime || event.start?.date,
      fin: event.end?.dateTime || event.end?.date,
      asistentes: event.attendees || [],
    }));

    return citas;
  } catch (err) {
    console.error("Error al consultar citas:", err.message);
    return { error: "Error al consultar citas" };
  }
};