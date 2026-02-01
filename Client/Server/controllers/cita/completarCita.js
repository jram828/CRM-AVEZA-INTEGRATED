import { models } from "../../DB.js";

const { Cita} = models;

const completarCita = async (idCita) => {
  const consulta = {
    where: { idCita }
  };

  const cita = await Cita.findOne(consulta);
  if (!cita) throw Error("Cita no encontrada");
  cita.completada = true;
  await cita.save();

  return cita;
};

export { completarCita };