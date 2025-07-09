import { models } from "../../DB.js";
const { Prospecto } = models;
const deleteProspecto = async (cedulaProspecto) => {
  await Prospecto.update(
    {
      activo: false,
    },
    {
      where: {
        cedulaProspecto: cedulaProspecto,
      },
    },
  );
  return "Delete complete";
};

export { deleteProspecto };
