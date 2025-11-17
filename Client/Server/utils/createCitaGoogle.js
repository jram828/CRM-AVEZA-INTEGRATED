import { google } from "googleapis";
import { config } from "dotenv";
import moment from "moment-timezone";

config();

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;

export const createCitaGoogle = async (dataRegistro, calendarId) => {
  try {
    const { fechaCita, horaCita, titulo, descripcion } = dataRegistro;

    // Convertir fechaCita a string YYYY-MM-DD si viene como Date
    const fechaStr = typeof fechaCita === "string"
      ? fechaCita.slice(0, 10)
      : moment(fechaCita).format("YYYY-MM-DD");

    const fechaHoraStr = `${fechaStr} ${horaCita}`;
    const startDateTime = moment.tz(fechaHoraStr, "YYYY-MM-DD HH:mm", "America/Bogota");

    if (!startDateTime.isValid()) {
      throw new Error(`Fecha inválida: ${fechaHoraStr}`);
    }

    const endDateTime = startDateTime.clone().add(30, "minutes");

    const event = {
      summary: titulo,
      description: descripcion,
      start: {
        dateTime: startDateTime.format(),
        timeZone: "America/Bogota",
      },
      end: {
        dateTime: endDateTime.format(),
        timeZone: "America/Bogota",
      }
    };

    const jwtClient = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      null,
      GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/calendar"]
    );

    const calendar = google.calendar({ version: "v3", auth: jwtClient });

    const response = await calendar.events.insert({
      calendarId,
      resource: event
    });

    return {
      evento: response.data
    };
  } catch (err) {
    console.error("Error al crear evento en Google Calendar:", err.message);
    throw err;
  }
};
// import { google } from "googleapis";
// import { config } from "dotenv";
// import moment from "moment-timezone";

// config();

// const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;

// export const createCitaGoogle = async (dataRegistro, calendarId) => {
//   try {
//     const { fechaCita, horaCita, titulo, descripcion } = dataRegistro;

//     // Convertir fechaCita a string YYYY-MM-DD si viene como Date
//     const fechaStr = typeof fechaCita === "string"
//       ? fechaCita.slice(0, 10)
//       : moment(fechaCita).format("YYYY-MM-DD");

//     const fechaHoraStr = `${fechaStr} ${horaCita}`;

//     const startDateTime = moment.tz(fechaHoraStr, "YYYY-MM-DD HH:mm", "America/Bogota");

//     if (!startDateTime.isValid()) {
//       throw new Error(`Fecha inválida: ${fechaHoraStr}`);
//     }

//     const endDateTime = startDateTime.clone().add(30, "minutes");

//     const event = {
//       summary: titulo,
//       description: descripcion,
//       start: {
//         dateTime: startDateTime.format(), // RFC3339 con offset correcto
//         timeZone: "America/Bogota",
//       },
//       end: {
//         dateTime: endDateTime.format(),
//         timeZone: "America/Bogota",
//       },
//     };

//     const jwtClient = new google.auth.JWT(
//       GOOGLE_CLIENT_EMAIL,
//       null,
//       GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//       ["https://www.googleapis.com/auth/calendar"]
//     );

//     const calendar = google.calendar({ version: "v3", auth: jwtClient });

//     const response = await calendar.events.insert({
//       calendarId,
//       resource: event,
//     });

//     return response.data;
//   } catch (err) {
//     console.error("Error al crear evento en Google Calendar:", err.message);
//     throw err;
//   }
// };

