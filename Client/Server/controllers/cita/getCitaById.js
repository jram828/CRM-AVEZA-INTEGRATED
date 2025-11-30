import { models } from "../../DB.js";

const { Prospecto, Cita } = models;

const getCitaById = async (idProspecto) => {
  const consulta = {
    where: {
      idProspecto: idProspecto,
      activo: true,
    },
    include: [
      {
        model: Cita,
        through: { attributes: [] }, // evita traer datos de la tabla intermedia
      },
    ],
  };

  const prospecto = await Prospecto.findOne(consulta);
  if (!prospecto) throw Error("Cliente no Registrado o no existe");

  // devolvemos solo las tareas asociadas
  return prospecto.Citas;
};

export { getCitaById };
