import { models } from "../../DB.js";

const { Prospecto, Tarea, Ciudad, Departamento, Pais } = models;
const getTareaById = async (idProspecto) => {
  const consulta = {
    where: {
      idProspecto: idProspecto,
      activo: true,
    },
  };

  const prospecto = await Prospecto.findOne(consulta);
  if (!cliente) throw Error("Cliente no Registrado o no existe");
  return cliente;
};

export { getTareaById };
