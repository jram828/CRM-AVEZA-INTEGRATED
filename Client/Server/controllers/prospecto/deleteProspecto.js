import { models } from "../../DB.js";
const { Prospecto } = models;
const deleteProspecto = async (idProspecto) => {
  await Prospecto.update(
    {
      activo: false,
    },
    {
      where: {
        idProspecto: idProspecto,
      },
    },
  );
  return "Delete complete";
};

export { deleteProspecto };
