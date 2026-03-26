import { models } from "../../DB.js";
import moment from "moment";
import { sendEmailCita } from "../../utils/emailNotifier.js";

const { Tarea, Prospecto, Cliente } = models;

const createTarea = async (
  idProspecto,
  asunto,
  fechaVencimiento,
  recordatorio,
  tipoRecordatorio,
  repetir,
  frecuencia,
  repeticiones,
  email,
  source,
) => {
  const fechaUTC = moment(fechaVencimiento).utc().toDate();
  console.log(
    "ID recibido en el controlador de creación de tarea:",
    idProspecto,
  );
  console.log(
    "Source recibido en el controlador de creación de tarea:",
    source,
  );
  const newTarea = await Tarea.create({
    asunto: asunto,
    fechaVencimiento: fechaUTC,
    recordatorio: recordatorio,
    tipoRecordatorio: tipoRecordatorio,
    repetir: repetir,
    frecuencia: frecuencia,
    repeticiones: repeticiones,
    idProspecto: idProspecto,
  });

  console.log("Nueva tarea creada en la base de datos:", newTarea);
  if (source === "prospecto") {
    const prospecto = await Prospecto.findByPk(idProspecto);
    if (!prospecto) throw Error("Prospecto no encontrado");

    await prospecto.addTarea(newTarea);
  } else if (source === "cliente") {
    const cliente = await Cliente.findByPk(idProspecto);
    if (!cliente) throw Error("Cliente no encontrado");

    await cliente.addTarea(newTarea);
  }

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
