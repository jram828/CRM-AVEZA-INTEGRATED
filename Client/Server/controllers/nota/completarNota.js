import { models } from "../../DB.js";

const { Nota } = models;

const completarNota = async (idNota) => {
  const consulta = {
    where: { idNota }
  };

  const nota = await Nota.findOne(consulta);
  if (!nota) throw Error("Nota no encontrada");

  nota.completada = true;
  await nota.save();

  return nota;
};

export { completarNota };
