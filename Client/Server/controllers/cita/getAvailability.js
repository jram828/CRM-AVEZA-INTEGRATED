import { google } from "googleapis";
import { config } from "dotenv";
import moment from "moment-timezone";

config();

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, EMAIL_CALENDAR } = process.env;

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
        items: [{ id: EMAIL_CALENDAR }],
      },
    });

    const ocupados = response.data.calendars[EMAIL_CALENDAR].busy;
    console.log("Bloques ocupados:", ocupados);

    const horasPosibles = [];
    const hoy = moment.tz(zona).format("YYYY-MM-DD");

    // Si la fecha es hoy, inicio desde la hora actual redondeada al próximo bloque de 30 min
    let inicioDia;
    if (fecha === hoy) {
      const ahora = moment.tz(zona);
      const minutos = ahora.minutes();
      const extra = minutos % 30 === 0 ? 0 : 30 - (minutos % 30);
      inicioDia = ahora.clone().add(extra, "minutes").seconds(0);
    } else {
      const diaSemana = moment.tz(fecha, zona).day(); // 0=domingo, 6=sábado
      if (diaSemana === 6) {
        inicioDia = moment.tz(`${fecha} 09:00`, zona); // sábados desde las 9
      } else {
        inicioDia = moment.tz(`${fecha} 08:00`, zona); // resto de días desde las 8
      }
    }

    const finDia = moment.tz(`${fecha} 18:00`, zona);

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

    return horasPosibles;
  } catch (err) {
    console.error("Error al consultar disponibilidad:", err.message);
    return "Error al consultar disponibilidad";
  }
};


// import { google } from "googleapis";
// import { config } from "dotenv";
// import moment from "moment-timezone";

// config();

// const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, EMAIL_CALENDAR } = process.env;

// export const obtenerDisponibilidad = async (req, res) => {
//   try {
//     const { fecha } = req.query;
//     console.log("Fecha recibida para disponibilidad:", fecha);
//     const zona = "America/Bogota";

//     const startOfDay = moment.tz(`${fecha} 00:00`, zona).format();
//     const endOfDay = moment.tz(`${fecha} 23:59`, zona).format();

//     const jwtClient = new google.auth.JWT(
//       GOOGLE_CLIENT_EMAIL,
//       null,
//       GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//       ["https://www.googleapis.com/auth/calendar"]
//     );

//     const calendar = google.calendar({ version: "v3", auth: jwtClient });

//     const response = await calendar.freebusy.query({
//       requestBody: {
//         timeMin: startOfDay,
//         timeMax: endOfDay,
//         timeZone: zona,
//         items: [{ id: EMAIL_CALENDAR}],
//       },
//     });

//     const ocupados = response.data.calendars[EMAIL_CALENDAR].busy;
//  console.log("Bloques ocupados:", ocupados);
//     const horasPosibles = [];
// const inicioDia = moment.tz(`${fecha} 08:00`, zona);
// const finDia = moment.tz(`${fecha} 18:00`, zona);

// let actual = inicioDia.clone();
// while (actual.isBefore(finDia)) {
//   const siguiente = actual.clone().add(30, "minutes");

//   const estaOcupado = ocupados.some(
//     (bloque) =>
//       actual.isBefore(moment(bloque.end)) &&
//       siguiente.isAfter(moment(bloque.start))
//   );

//   if (!estaOcupado) {
//     horasPosibles.push(actual.format("HH:mm"));
//   }

//   actual = siguiente;
// }
//     return horasPosibles;
//   } catch (err) {
//     console.error("Error al consultar disponibilidad:", err.message);
//     return "Error al consultar disponibilidad";
//   }
// };