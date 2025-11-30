import { models } from "../../DB.js";

const { Tarea } = models;

const completarTarea = async (idTarea) => {
  const consulta = {
    where: { idTarea }
  };

  const tarea = await Tarea.findOne(consulta);
  if (!tarea) throw Error("Tarea no encontrada");

  tarea.completada = true;
  await tarea.save();

  return tarea;
};

export { completarTarea };
