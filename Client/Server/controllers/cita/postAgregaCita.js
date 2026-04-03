import { models } from "../../DB.js";
import moment from "moment";
import { sendEmailCita } from "../../utils/emailNotifier.js";
import { createCitaGoogle } from "../../utils/createCitaGoogle.js";

const { Cita, Prospecto, Cliente } = models;
const createCita = async (
  titulo,
  descripcion,
  fechaCita,
  horaCita,
  idProspecto,
  nombres,
  apellidos,
  email,
  source,
) => {
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
  });

  const fechaUTC = moment(fechaCita).utc().toDate();

  const fechaStr = moment(fechaCita).format("YYYY-MM-DD");
  // Generar enlace de reunión Jitsi

  // Formatear nombre base
  const fullName = `${nombres || ""}-${apellidos || ""}`;
  // quitar acentos/diacríticos, reemplazar caracteres no alfanuméricos por guiones,
  // colapsar guiones repetidos y recortar guiones al inicio/fin
  const nombreBase = fullName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-+|-+$)/g, "")
    .toLowerCase();

  // Generar nombre único para la sala
  const nombreSala = `${nombreBase}-${fechaStr}`;

  // Construir enlace Jitsi
  const enlaceReunion = `https://meet.jit.si/${nombreSala}`;

  // Construir descripción
  const descripcionGoogle = `Enlace para la reunión: ${enlaceReunion}`;

  // 👇 Concatenar la descripción recibida con la de Google
  const descripcionFinal = `${descripcion || ""}\n${descripcionGoogle}`;

  const newCita = await Cita.create({
    titulo: titulo,
    descripcion: descripcionFinal,
    fechaCita: fechaUTC,
    horaCita: horaCita,
    idProspecto: idProspecto,
  });

  console.log("Nueva cita creada en la base de datos:", newCita);

  let dataRegistro;

  if (source === "prospecto") {
    dataRegistro = {
      titulo: titulo,
      descripcion: descripcionFinal,
      fechaCita: fechaUTC,
      horaCita: horaCita,
      idProspecto: idProspecto,
    };
  } else if (source === "cliente") {
    dataRegistro = {
      titulo: titulo,
      descripcion: descripcionFinal,
      fechaCita: fechaUTC,
      horaCita: horaCita,
      cedulaCliente: idProspecto,
    };
  }

  console.log("Data para Google Calendar:", dataRegistro, email);
  // Crear la cita en Google Calendar

  if (source === "prospecto") {
    const prospecto = await Prospecto.findByPk(idProspecto);
    if (!prospecto) throw Error("Prospecto no encontrado");
    await prospecto.addCita(newCita);
  } else if (source === "cliente") {
    const cliente = await Cliente.findByPk(idProspecto);
    if (!cliente) throw Error("Cliente no encontrado");
    await cliente.addCita(newCita);
  }

  const { evento } = await createCitaGoogle(
    dataRegistro,
    email,
    newCita.idCita,
  );

  console.log("Evento Google:", evento);
  newCita.idCitaGoogle = evento.id;
  await newCita.save();

  console.log("Cita actualizada con ID de Google Calendar:", newCita);
  // Enviar notificaciones por correo electrónico
  // const { cedulaCliente, cedulaAbogado } = await Caso.findByPk(idCaso);

  // if (cedulaCliente && cedulaAbogado) {
  //   const cliente = await Cliente.findOne(cedulaCliente);
  //   const abogado = await Abogado.findOne(cedulaAbogado);
  //   if (cliente && abogado) {
  //     sendEmailCita(cliente, abogado, newCita);
  //   }
  // }
  return newCita;
};

export { createCita };
