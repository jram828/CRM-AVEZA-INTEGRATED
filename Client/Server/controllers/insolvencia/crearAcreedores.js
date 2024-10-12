import { models } from "../../DB.js";
import {acreedores } from "../../utils/listaAcreedores.js";
const { Acreedor} = models;

export const crearAcreedores = async (req, res) => {
  console.log('Acreedores:', acreedores)
  try {
    for (let i = 0; i < acreedores.length; i++) {
      var newAcreedor = await Acreedor.create({
        nombre: acreedores[i].nombre,
        NIT: acreedores[i].NIT,
        direccion: acreedores[i].direccion,
        ciudad: acreedores[i].ciudad,
        telefono: acreedores[i].telefono,
        email: acreedores[i].email,
      });
    }
    console.log("Ultimo Acreedor: ", newAcreedor);
    return newAcreedor.dataValues;
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};
