import { models } from "../../DB.js";
import moment from "moment";
import { sendEmailCita, sendEmailCitaAveza } from "../../utils/emailNotifier.js";
import { createCitaGoogle } from "../../utils/createCitaGoogle.js";
import { calendar } from "googleapis/build/src/apis/calendar/index.js";
const {  EMAIL_CALENDAR,
} = process.env;

const { Cita, Prospecto, Cliente } = models;
const createCita = async (
  titulo,
  descripcion,
  fechaCita,
  horaCita,
  idProspecto,
  nombres,
  apellidos,
  source,
  email,
  cedulaCliente,
) => {

  const calendarId = EMAIL_CALENDAR;

  console.log("Creando cita con los siguientes datos:", {
    titulo,
    descripcion,
    fechaCita,
    horaCita,
    idProspecto,
    nombres,
    apellidos,
    email,
    source,
    calendarId,
    cedulaCliente,

  });

  const fechaUTC = moment(fechaCita).utc().toDate();

  const fechaStr = moment(fechaCita).format("YYYY-MM-DD");
  // Generar enlace de reunión Jitsi

  // Formatear nombre base
  // const fullName = `${nombres || ""}-${apellidos || ""}`;
  // // quitar acentos/diacríticos, reemplazar caracteres no alfanuméricos por guiones,
  // // colapsar guiones repetidos y recortar guiones al inicio/fin
  // const nombreBase = fullName
  //   .normalize("NFD")
  //   .replace(/[\u0300-\u036f]/g, "")
  //   .replace(/[^a-zA-Z0-9]/g, "-")
  //   .replace(/-+/g, "-")
  //   .replace(/(^-+|-+$)/g, "")
  //   .toLowerCase();

  // // Generar nombre único para la sala
  // const nombreSala = `${nombreBase}-${fechaStr}`;

  // // Construir enlace Jitsi
  // const enlaceReunion = `https://meet.jit.si/${nombreSala}`;

  // // Construir descripción
  // const descripcionGoogle = `Enlace para la reunión: ${enlaceReunion}`;

  // // 👇 Concatenar la descripción recibida con la de Google
  // const descripcionFinal = `${descripcion || ""}\n${descripcionGoogle}`;

  const newCita = await Cita.create({
    titulo: titulo,
    descripcion: descripcion,
    fechaCita: fechaUTC,
    horaCita: horaCita,
    idProspecto: idProspecto,
  });

  console.log("Nueva cita creada en la base de datos:", newCita);

  let dataRegistro;

  if (source === "prospecto") {
    dataRegistro = {
      titulo: titulo,
      fechaCita: fechaUTC,
      horaCita: horaCita,
      descripcion: descripcion,
      idProspecto: idProspecto,
      email: email,
      nombres: nombres,
      apellidos: apellidos,
    };
  } else if (source === "cliente") {
    dataRegistro = {
      titulo: titulo,
      fechaCita: fechaUTC,
      horaCita: horaCita,
      descripcion: descripcion,
      cedulaCliente: cedulaCliente,
      email: email,
      nombres: nombres,
      apellidos: apellidos,
    };
  }

  console.log("Data para Google Calendar:", dataRegistro, calendarId, email);
  // Crear la cita en Google Calendar

  if (source === "prospecto") {
    const prospecto = await Prospecto.findByPk(idProspecto);
    if (!prospecto) throw Error("Prospecto no encontrado");
    await prospecto.addCita(newCita);
  } else if (source === "cliente") {
    const cliente = await Cliente.findByPk(cedulaCliente);
    console.log("Cliente encontrado:", cliente);
    if (!cliente) throw Error("Cliente no encontrado");
    await cliente.addCita(newCita);
  }

  const { evento } = await createCitaGoogle(
    dataRegistro,
    calendarId,
    newCita.idCita,
  );

  console.log("Evento Google:", evento);

    const enlaceReunion = evento?.conferenceData?.entryPoints?.[0]?.uri;
  console.log("Enlace Google Meet:", enlaceReunion);

  const descripcionFinal = `${descripcion || ""}\nEnlace para la reunión: ${enlaceReunion}`;

  newCita.idCitaGoogle = evento.id;
  newCita.descripcion = descripcionFinal;
  await newCita.save();

  console.log("Cita actualizada con ID de Google Calendar:", newCita);
  // Enviar notificaciones por correo electrónico
  sendEmailCita({ ...dataRegistro, URLReunion: enlaceReunion });
  sendEmailCitaAveza({ ...dataRegistro, URLReunion: enlaceReunion });
  return newCita;
};

export { createCita };
