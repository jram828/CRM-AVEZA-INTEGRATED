import { models } from "../../DB.js";

const deleteAcreedor = async (NIT) => {
  const Acreedor = models.Acreedor;

  // Borrar definitivamente el acreedor por NIT
  const deletedCount = await Acreedor.destroy({
    where: {
      NIT,
    },
  });

  if (deletedCount === 0) return "Acreedor no encontrado";
  return "Delete complete";
};

export { deleteAcreedor };
