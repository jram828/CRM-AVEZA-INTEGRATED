import  { models }  from "../../DB.js";

const Abogado=models.Abogado

const deleteAcreedor = async (cedulaAbogado) => {
  await Abogado.update(
    {
      activo: false,
    },
    {
      where: {
        cedulaAbogado: cedulaAbogado,
      },
    },
  );
  return "Delete complete";
};

export  {
  deleteAcreedor,
};
