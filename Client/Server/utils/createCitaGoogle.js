import { google } from 'googleapis';
import { config } from 'dotenv';

config(); // Cargar variables de entorno desde el archivo .env

const {  GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;

/**
 * Crea una cita en Google Calendar usando credenciales de servicio.
 * @param {Object} dataRegistro - Datos de la cita.
 * @param {string} calendarId - El ID del calendario del usuario (usualmente su email de Google).
 * @returns {Promise<Object>} - El evento creado.
 */
export const createCitaGoogle = async (dataRegistro, calendarId) => {
  // Formatear fecha y hora para Google Calendar (RFC3339)
  const fecha = dataRegistro.fechaCita;
  const hora = dataRegistro.horaCita;

  // Si fechaCita es un objeto Date, convertirlo a string ISO
  const fechaObj = typeof fecha === "string" ? new Date(fecha) : fecha;
  const [horaHoras, horaMinutos] = hora.split(":");
  const startDateTime = new Date(
    fechaObj.getFullYear(),
    fechaObj.getMonth(),
    fechaObj.getDate(),
    parseInt(horaHoras, 10),
    parseInt(horaMinutos, 10)
  );

  // Duración de la cita: 30 minutos (ajusta si es necesario)
  const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000);

  // Formato RFC3339 para Google Calendar
  const formatRFC3339 = (date) =>
    date.toISOString().replace(/\.\d{3}Z$/, "Z");

  const event = {
    summary: dataRegistro.titulo,
    description: dataRegistro.descripcion,
    start: {
      dateTime: formatRFC3339(startDateTime),
      timeZone: "America/Bogota",
    },
    end: {
      dateTime: formatRFC3339(endDateTime),
      timeZone: "America/Bogota",
    },
  };

  // Autenticación con cuenta de servicio y delegación (impersonation)
  const jwtClient = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    null,
    GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/calendar'],
    calendarId // Impersonate the user
  );
 
  const calendar = google.calendar({ version: 'v3', auth: jwtClient });
 console.log("Calendar cita:", calendar);
  try {
    const response = calendar.events.insert({
      calendarId,
      resource: event,
    });
    console.log("Evento creado en Google Calendar:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error al crear evento en Google Calendar:", err);
    throw err;
  }
};
