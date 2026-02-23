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
  email,
  source,
) => {
  console.log("Creando cita con los siguientes datos:", {
    titulo,
    descripcion,
    fechaCita,
    horaCita,
    idProspecto,
    email,
    source,
  });
  const fechaUTC = moment(fechaCita).utc().toDate();

  const newCita = await Cita.create({
    titulo: titulo,
    descripcion: descripcion,
    fechaCita: fechaUTC,
    horaCita: horaCita,
    idProspecto: idProspecto,
  });

  console.log("Nueva cita creada en la base de datos:", newCita);
  const dataRegistro = {
    titulo: titulo,
    descripcion: descripcion,
    fechaCita: fechaUTC,
    horaCita: horaCita,
  };

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

  await createCitaGoogle(dataRegistro, email);

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
