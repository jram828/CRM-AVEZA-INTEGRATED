import { models } from "../../DB.js";

const { Prospecto, Nota } = models;

const getNotaById = async (idProspecto) => {
  const consulta = {
    where: {
      idProspecto: idProspecto,
      activo: true,
    },
    include: [
      {
        model: Nota,
        through: { attributes: [] }, // evita traer datos de la tabla intermedia
      },
    ],
  };

  const prospecto = await Prospecto.findOne(consulta);
  if (!prospecto) throw Error("Cliente no Registrado o no existe");

  console.log("Prospecto encontrado notas:", prospecto);  
  // devolvemos solo las notas asociadas
  return prospecto.Notas;
};

export { getNotaById };
