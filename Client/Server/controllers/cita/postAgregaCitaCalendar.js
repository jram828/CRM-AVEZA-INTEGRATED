import { models } from "../../DB.js";
import moment from "moment";
import { sendEmailCita, sendEmailCitaAveza } from "../../utils/emailNotifier.js";
import { createCitaGoogle } from "../../utils/createCitaGoogle.js";

const { Cita, Prospecto, Abogado } = models;
const createCitaCalendar = async (idProspecto, titulo, fechaCita, horaCita, email, calendarId, nombres, apellidos) => {
  console.log("Creando cita en calendario con datos:", {
    idProspecto,
    titulo,
    fechaCita,
    horaCita,
    email,
    calendarId,
    nombres,
    apellidos,
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
  const descripcion = `Enlace para la reunión: ${enlaceReunion}`;



 const dataRegistro = {
    titulo: titulo,
    descripcion: descripcion,
    fechaCita: fechaUTC,
    horaCita: horaCita,
    invitados: [email],
    nombres: nombres,
    apellidos: apellidos
  };


  console.log("Data para Google Calendar:", dataRegistro);
  // Crear la cita en Google Calendar
  // Recuperar las propiedades devueltas por createCitaGoogle
  const { evento} = await createCitaGoogle(dataRegistro, calendarId);
  console.log("Evento Google:", evento);
     
  
   // Combinar fecha y hora en la zona correcta
  const fechaStr2 = typeof fechaCita === "string"
    ? fechaCita.slice(0, 10)
    : moment(fechaCita).format("YYYY-MM-DD");
console.log("fechaStr2:", fechaStr2);
  const fechaHoraStr = `${fechaStr2} ${horaCita}`;
  console.log("fechaHoraStr:", fechaHoraStr);
const startDateTime = moment.utc(fechaHoraStr, "YYYY-MM-DD HH:mm");
console.log("startDateTime:", startDateTime);
  if (!startDateTime.isValid()) {
    throw new Error(`Fecha inválida: ${fechaHoraStr}`);
  }


    const newCita = await Cita.create({
    titulo: titulo,
    descripcion: descripcion,
    fechaCita: startDateTime.toDate(), 
    horaCita: startDateTime.format("HH:mm"),
  });

 console.log("Nueva cita creada en la base de datos:", newCita);

    const prospecto = await Prospecto.findByPk(idProspecto);
  if (!prospecto) throw Error("Prospecto no encontrado");

  await prospecto.addCita(newCita);
  
  // Enviar notificaciones por correo electrónico
      sendEmailCita({...dataRegistro, URLReunion: enlaceReunion});
      sendEmailCitaAveza({...dataRegistro, URLReunion: enlaceReunion});

  //  newAbogado.addCliente(clientes);

  return newCita;
};

export { createCitaCalendar };
