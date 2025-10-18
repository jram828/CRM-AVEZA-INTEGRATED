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
console.log("Fechas cita Google:", startDateTime, endDateTime);
  // Formato RFC2822 para Google Calendar (devuelve fecha en formato: "Mon, 02 Jan 2006 15:04:05 -0700")
  const formatRFC3339 = (inputDate) => {
    const date = inputDate instanceof Date ? inputDate : new Date(inputDate);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const pad = (n) => String(n).padStart(2, '0');

    // Local components (RFC2822 uses local time with numeric offset)
    const dayName = days[date.getDay()];
    const day = pad(date.getDate());
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    // Time zone offset in format ±HHMM
    const offsetMinutes = -date.getTimezoneOffset(); // minutes ahead of UTC
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const absOffset = Math.abs(offsetMinutes);
    const offsetHours = pad(Math.floor(absOffset / 60));
    const offsetMins = pad(absOffset % 60);
    const offset = `${sign}${offsetHours}${offsetMins}`;

    return `${dayName}, ${day} ${monthName} ${year} ${hours}:${minutes}:${seconds} ${offset}`;
  };

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
