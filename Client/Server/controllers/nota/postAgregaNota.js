import { models } from "../../DB.js";

const { Nota, Prospecto, Cliente } = models;
const createNota = async (idProspecto, descripcion, source) => {


  const newNota = await Nota.create({
      descripcion: descripcion,
  });

 console.log("Nueva nota creada en la base de datos:", newNota);

 if( source === "prospecto") {
  const prospecto = await Prospecto.findByPk(idProspecto);
  if (!prospecto) throw Error("Prospecto no encontrado");

  await prospecto.addNota(newNota);
 } else if (source === "cliente") {
  const cliente = await Cliente.findByPk(idProspecto);
  if (!cliente) throw Error("Cliente no encontrado");

  await cliente.addNota(newNota);
 }
  return newNota;
};

export { createNota };