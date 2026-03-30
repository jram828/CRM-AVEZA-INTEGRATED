import { models } from "../../DB.js";
import { deleteCitaGoogle } from "../../utils/deleteCitaGoogle.js";

import { getAllCitaGoogle } from "./getAllCitaGoogle.js"; // importa tu controller de obtener citas

const { Cita, Prospecto, Cliente } = models;

const eliminarCitaCalendar = async (
  idCitaGoogle,
  idCita,
  calendarId,
  source,
) => {

  if (idCitaGoogle) await deleteCitaGoogle(calendarId, idCitaGoogle);

  // 2. Eliminar asociación en BD local
  const cita = await Cita.findByPk(idCita);
  if (!cita) throw Error("Cita no encontrada en BD local");

  if (source === "prospecto") {
    const prospectos = await cita.getProspectos();
    for (const prospecto of prospectos) {
      await cita.removeProspecto(prospecto);
    }
  }

  if (source === "cliente") {
    const clientes = await cita.getClientes();
    for (const cliente of clientes) {
      await cita.removeCliente(cliente);
    }
  }

  // 3. Retornar citas actualizadas desde Google Calendar
  const citasActualizadas = await getAllCitaGoogle(calendarId);
  return citasActualizadas;
};

export { eliminarCitaCalendar };
