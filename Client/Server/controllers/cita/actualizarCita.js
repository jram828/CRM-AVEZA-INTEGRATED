import { models } from "../../DB.js";
import moment from "moment-timezone";
import {
  sendEmailActualizaCita,
  sendEmailActualizaCitaAveza,
  sendEmailCita,
  sendEmailCitaAveza,
} from "../../utils/emailNotifier.js";
import { google } from "googleapis";

const { Cita } = models;
const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, EMAIL_CALENDAR } = process.env;

export const actualizarCita = async (
  idCita,
  fechaCita,
  horaCita,
  descripcion,
  titulo,
  idProspecto,
  cedulaCliente,
  idCitaGoogle,
  calendarId = EMAIL_CALENDAR,
) => {
  console.log("Actualizando cita con los siguientes datos:", {
    idCita,
    fechaCita,
    horaCita,
    descripcion,
    titulo,
    idProspecto,
    cedulaCliente,
    idCitaGoogle,
    calendarId,
  });

  try {

    const cita = await Cita.findByPk(idCita);
    if (!cita) throw new Error("Cita no encontrada");
    
      // Actualizar directamente en PostgreSQL
      await Cita.update(
        {
          titulo,
          descripcion,
          fechaCita: fechaCita ? moment(fechaCita).utc().toDate() : null,
          horaCita,
        },
        { where: { idCita } },
      );

      const newCita = await Cita.findByPk(idCita);
      console.log("Cita actualizada en la base de datos:", newCita);


      // Preparar objeto de actualización para Google Calendar
      const eventUpdate = {
        summary: titulo,
        description: descripcion,
      };

      if (fechaCita && horaCita) {
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
        if (!startDateTime.isValid())
          throw new Error(`Fecha inválida: ${fechaHoraStr}`);

        const endDateTime = startDateTime.clone().add(30, "minutes");

        eventUpdate.start = {
          dateTime: startDateTime.format(),
          timeZone: "America/Bogota",
        };
        eventUpdate.end = {
          dateTime: endDateTime.format(),
          timeZone: "America/Bogota",
        };
      }

      // Autenticación Google
      const jwtClient = new google.auth.JWT(
        GOOGLE_CLIENT_EMAIL,
        null,
        GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        ["https://www.googleapis.com/auth/calendar"],
      );

      const calendar = google.calendar({ version: "v3", auth: jwtClient });

      // Actualizar evento en Google Calendar
      const response = await calendar.events.patch({
        calendarId,
        eventId: idCitaGoogle,
        resource: eventUpdate,
      });

      newCita.idCitaGoogle = response.data.id;
      await newCita.save();

      // Notificaciones
      const enlaceReunion = response.data?.hangoutLink;
      const dataRegistro = {
        titulo: cita.titulo,
        descripcion: cita.descripcion,
        fechaCita: cita.fechaCita,
        horaCita: cita.horaCita,
        idProspecto,
        cedulaCliente,
      };
      return newCita;
    

    // sendEmailActualizaCita({ ...dataRegistro, URLReunion: enlaceReunion });
    // sendEmailActualizaCitaAveza({ ...dataRegistro, URLReunion: enlaceReunion });
  } catch (err) {
    console.error("Error al actualizar cita:", err.message);
    throw err;
  }
};
