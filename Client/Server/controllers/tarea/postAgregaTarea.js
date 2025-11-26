import { models } from "../../DB.js";
import moment from "moment";
import { sendEmailCita } from "../../utils/emailNotifier.js";


const { Tarea, Prospecto, Abogado, Caso } = models;
const createTarea = async (idProspecto, asunto, fechaVencimiento, recordatorio, tipoRecordatorio,repetir, frecuencia, repeticiones) => {
  const fechaUTC = moment(fechaVencimiento).utc().toDate();

  const newTarea = await Tarea.create({
    asunto: asunto,
    fechaVencimiento: fechaUTC,
    recordatorio: recordatorio,
    tipoRecordatorio: tipoRecordatorio,
    repetir: repetir,
    frecuencia: frecuencia,
    repeticiones: repeticiones,
    idProspecto: idProspecto
  });

 console.log("Nueva tareea creada en la base de datos:", newTarea);
//  const dataRegistro = {
//     titulo: titulo,
//     descripcion: descripcion,
//     fechaCita: fechaUTC,
//     horaCita: horaCita,
//   };

  
//   // Enviar notificaciones por correo electrónico
//   const { cedulaCliente, cedulaAbogado } = await Caso.findByPk(idCaso);

//   if (cedulaCliente && cedulaAbogado) {
//     const cliente = await Cliente.findOne(cedulaCliente);
//     const abogado = await Abogado.findOne(cedulaAbogado);
//     if (cliente && abogado) {
//       sendEmailCita(cliente, abogado, newTarea);
//     }
//   }
  return newTarea;
};

export { createTarea };