import { models } from "../../DB.js";

const { Nota, Prospecto} = models;
const createNota = async (idProspecto, descripcion) => {


  const newNota = await Nota.create({
      descripcion: descripcion,
  });

 console.log("Nueva nota creada en la base de datos:", newNota);

  const prospecto = await Prospecto.findByPk(idProspecto);
  if (!prospecto) throw Error("Prospecto no encontrado");

  await prospecto.addNota(newNota);

  return newNota;
};

export { createNota };