import { google } from "googleapis";
import { config } from "dotenv";
import moment from "moment-timezone";

config();

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;

export const obtenerDisponibilidad = async (req, res) => {
  try {
    const { fecha } = req.query;
    console.log("Fecha recibida para disponibilidad:", fecha);
    const zona = "America/Bogota";

    const startOfDay = moment.tz(`${fecha} 00:00`, zona).format();
    const endOfDay = moment.tz(`${fecha} 23:59`, zona).format();

    const jwtClient = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      null,
      GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/calendar"]
    );

    const calendar = google.calendar({ version: "v3", auth: jwtClient });

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startOfDay,
        timeMax: endOfDay,
        timeZone: zona,
        items: [{ id: "jram828@gmail.com" }],
      },
    });

    const ocupados = response.data.calendars["jram828@gmail.com"].busy;
 console.log("Bloques ocupados:", ocupados);
    const horasPosibles = [];
const inicioDia = moment.tz(`${fecha} 08:00`, zona);
const finDia = moment.tz(`${fecha} 17:00`, zona);

let actual = inicioDia.clone();
while (actual.isBefore(finDia)) {
  const siguiente = actual.clone().add(30, "minutes");

  const estaOcupado = ocupados.some(
    (bloque) =>
      actual.isBefore(moment(bloque.end)) &&
      siguiente.isAfter(moment(bloque.start))
  );

  if (!estaOcupado) {
    horasPosibles.push(actual.format("HH:mm"));
  }

  actual = siguiente;
}
//     const horasPosibles = [];
//     for (let h = 8; h <= 17; h++) {
//       const inicio = moment.tz(`${fecha} ${h}:00`, zona);
//       const fin = inicio.clone().add(30, "minutes");

//       const estaOcupado = ocupados.some(
//         (bloque) =>
//           inicio.isBefore(moment(bloque.end)) &&
//           fin.isAfter(moment(bloque.start))
//       );

//       if (!estaOcupado) {
//         horasPosibles.push(inicio.format("HH:mm"));
//       }
//     }

    return horasPosibles;
  } catch (err) {
    console.error("Error al consultar disponibilidad:", err.message);
    return "Error al consultar disponibilidad";
  }
};