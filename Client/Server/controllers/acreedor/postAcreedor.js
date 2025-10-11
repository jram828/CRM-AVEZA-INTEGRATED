import { models } from "../../DB.js";
import { codigoCiudades } from "../../utils/codigoCiudades.js";
import fs from "fs";
import path from "path";

const Acreedor = models.Acreedor;

const createAcreedor = async (
  NIT,
  email,
  nombre,
  direccion,
  nombre_ciudad,
  telefono,
  idProspecto
) => {
  const ciudadfilter = codigoCiudades.filter(
    (ciudad) => ciudad.nombre_ciudad === nombre_ciudad.toUpperCase()
  );
  // console.log("Ciudad filter:", ciudadfilter);
console.log("id Prospecto:", idProspecto);
  const codigo_ciudad = ciudadfilter[0].codigo_ciudad;

  try {
    const newAcreedor = await Acreedor.create({
      NIT,
      email,
      nombre,
      direccion,
      nombre_ciudad,
      telefono,
    });

    newAcreedor.addCiudad(codigo_ciudad);
    newAcreedor.addProspecto(idProspecto);
    return newAcreedor;
  } catch (error) {
    console.log(error);
  }
};

export { createAcreedor };
