import { models } from "../../DB.js";
import { deleteCitaGoogle } from "../../utils/deleteCitaGoogle.js";
import { getAllCitaGoogle } from "./getAllCitaGoogle.js";
import { getCitaGoogle } from "../../utils/getCitaGoogle.js"; // nueva función para verificar existencia

const { Cita, Prospecto, Cliente } = models;

const eliminarCitaCalendar = async (
  idCitaGoogle,
  idCita,
  calendarId,
  source,
) => {
  // 1. Verificar si la cita existe en Google Calendar antes de eliminar
  if (idCitaGoogle) {
    const citaGoogle = await getCitaGoogle(calendarId, idCitaGoogle);
    console.log(`Verificando existencia de cita en Google Calendar con ID ${idCitaGoogle}:`, citaGoogle); 
if (citaGoogle && citaGoogle.status !== "cancelled") {
      await deleteCitaGoogle(calendarId, idCitaGoogle);
    } else {
      console.warn(
        "La cita ya no existe en Google Calendar, se continúa con la eliminación local.",
      );
    }
  }

  // 2. Eliminar asociación en BD local
  const cita = await Cita.findByPk(idCita);
  if (!cita) throw Error("Cita no encontrada en BD local");

    // 3. Eliminar la cita de la BD local
  await cita.destroy();

  
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
  return await getAllCitaGoogle(calendarId);
};

export { eliminarCitaCalendar };
