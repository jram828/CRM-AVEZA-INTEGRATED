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

  console.log("DataRegistro en createCitaGoogle:", dataRegistro);
  const fecha = dataRegistro.fechaCita;
  const hora = dataRegistro.horaCita;

  // Si fechaCita es un objeto Date, convertirlo a string ISO
  const fechaObj = typeof fecha === "string" ? new Date(fecha) : fecha;

  console.log("Fecha objeto cita Google:", fechaObj);
  const [horaHoras, horaMinutos] = hora.split(":");

  // Formato RFC2822 para Google Calendar (devuelve fecha en formato: "Mon, 02 Jan 2006 15:04:05 -0700")
  const formatRFC3339 = (date) => {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(date.getTime() - offsetMs);
  const iso = localDate.toISOString(); // "2025-10-19T00:00:00.000Z"
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absOffset = Math.abs(offsetMinutes);
  const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, '0');
  const offsetMins = String(absOffset % 60).padStart(2, '0');
  const offset = `${sign}${offsetHours}:${offsetMins}`;
  return iso.replace('Z', offset); // "2025-10-19T00:00:00-05:00"
};

const startDateTime = new Date(
  fechaObj.getFullYear(),
  fechaObj.getMonth(),
  fechaObj.getDate(),
  parseInt(horaHoras, 10),
  parseInt(horaMinutos, 10)
);

const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000);

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
 console.log("Evento para Google Calendar:", event);
  // Autenticación con cuenta de servicio y delegación (impersonation)
  const jwtClient = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    null,
    GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/calendar'],
    calendarId // Impersonate the user
  );
  console.log("JWT Client:", jwtClient);
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
