import {models} from "../../DB.js";

 const { Prospecto, Abogado } = models;
const getProspectoByEmail = async (email) => {
  const prospecto = await Prospecto.findOne({
    where: {
      email,
    },
  });

  if (!prospecto) {
    const abogado = await Abogado.findOne({
      where: {
        email,
      },
    });
    return abogado;
  }

  return prospecto;
};

export {
  getProspectoByEmail,
};
