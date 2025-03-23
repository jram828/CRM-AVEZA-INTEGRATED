import { models } from "../../DB.js";

const Caso=models.Caso
const deleteCaso = async (idCaso) => {
  console.log('Controller idCaso:',idCaso)
  await Caso.update(
    {
        activo: false,
    },
    {
      where: {
        idCaso: idCaso,
      },
    }
  );
  return JSON.stringify({ mensaje: "Se eliminó caso" })
};

export {
  deleteCaso,
};