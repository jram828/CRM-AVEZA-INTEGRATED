import { google } from "googleapis";
import { config } from "dotenv";
import moment from "moment-timezone";

config();

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, EMAIL_CALENDAR, EMAIL_MARKETING } = process.env;

export const createCitaGoogle = async (dataRegistro, calendarId, idCita) => {
  try {
    const { fechaCita, horaCita, titulo, descripcion,  idProspecto, cedulaCliente, email } = dataRegistro;

    // Convertir fechaCita a string YYYY-MM-DD si viene como Date
    const fechaStr =
      typeof fechaCita === "string"
        ? fechaCita.slice(0, 10)
        : moment(fechaCita).format("YYYY-MM-DD");

    const fechaHoraStr = `${fechaStr} ${horaCita}`;
    const startDateTime = moment.tz(
      fechaHoraStr,
      "YYYY-MM-DD HH:mm",
      "America/Bogota",
    );

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
      },
      visibility: "public",
      extendedProperties: {
        private: {
          idCita: idCita.toString(),
          idProspecto: idProspecto ? idProspecto.toString() : undefined,
          cedulaCliente: cedulaCliente ? cedulaCliente.toString() : undefined,
        },
      },
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`, // identificador único
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      attendees: [
        {
          email: EMAIL_CALENDAR,
        },
        {
          email: email,
        },
        {
          email: EMAIL_MARKETING,
        },
      ],
    };

    // const jwtClient = new google.auth.JWT(
    //   GOOGLE_CLIENT_EMAIL,
    //   null,
    //   GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    //   ["https://www.googleapis.com/auth/calendar"],
    // );

// Con delegación a un usuario del dominio
const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/calendar"],
  EMAIL_CALENDAR, // 👈 correo del usuario del Workspace
);


    const calendar = google.calendar({ version: "v3", auth: jwtClient });

const response = await calendar.events.insert({
  calendarId: EMAIL_CALENDAR,
  resource: event,
  conferenceDataVersion: 1, // 👈 necesario para que se genere el enlace
  
});


    return {
      evento: response.data,
    };
  } catch (err) {
    console.error("Error al crear evento en Google Calendar:", err.message);
    throw err;
  }
};
