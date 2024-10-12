import { models } from "../../DB.js";

const Caso=models.Caso
const finCaso = async (idCaso, fechaFin) => {
  console.log('Controller idCaso:',idCaso,'fecha Fin:', fechaFin)
  await Caso.update(
    {
        fechaFin: fechaFin,
    },
    {
      where: {
        idCaso: idCaso,
      },
    }
  );
  return JSON.stringify({ mensaje: "Se agrego fecha de fin al caso" })
};

export {
  finCaso,
};