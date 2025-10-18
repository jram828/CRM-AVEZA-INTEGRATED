import { models } from "../../DB.js";
import moment from "moment";
import { sendEmailCita } from "../../utils/emailNotifier.js";
import { createCitaGoogle } from "../../utils/createCitaGoogle.js";

const { Cita, Cliente, Abogado, Caso } = models;
const createCita = async (titulo, descripcion, fechaCita, horaCita, idCaso, email) => {
  const fechaUTC = moment(fechaCita).utc().toDate();

  const newCita = await Cita.create({
    titulo: titulo,
    descripcion: descripcion,
    fechaCita: fechaUTC,
    horaCita: horaCita,
    idCaso: idCaso,
  });
  
 console.log("Nueva cita creada en la base de datos:", newCita);
  dataRegistro = {
    titulo: titulo,
    descripcion: descripcion,
    fechaCita: fechaUTC,
    horaCita: horaCita,
  };


  console.log("Data para Google Calendar:", dataRegistro, email);
  // Crear la cita en Google Calendar
  await createCitaGoogle(dataRegistro, email);
  
  // Enviar notificaciones por correo electrónico
  const { cedulaCliente, cedulaAbogado } = await Caso.findByPk(idCaso);

  if (cedulaCliente && cedulaAbogado) {
    const cliente = await Cliente.findOne(cedulaCliente);
    const abogado = await Abogado.findOne(cedulaAbogado);
    if (cliente && abogado) {
      sendEmailCita(cliente, abogado, newCita);
    }
  }

  //  newAbogado.addCliente(clientes);

  return newCita;

  // return await Abogado.create({nombre, duracion,dificultad, temporada}); //?ASI También puede ser
};

export { createCita };
