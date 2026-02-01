import { models } from "../../DB.js";

const { Prospecto, Tarea } = models;

const getTareaById = async (idProspecto) => {
  const consulta = {
    where: {
      idProspecto: idProspecto,
      activo: true,
    },
    include: [
      {
        model: Tarea,
        through: { attributes: [] }, // evita traer datos de la tabla intermedia
      },
    ],
  };

  const prospecto = await Prospecto.findOne(consulta);
  if (!prospecto) throw Error("Cliente no Registrado o no existe");

  console.log("Prospecto encontrado tareas:", prospecto);  
  // devolvemos solo las tareas asociadas
  return prospecto.Tareas;
};

export { getTareaById };
