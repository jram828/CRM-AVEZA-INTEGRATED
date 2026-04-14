import { models } from "../DB.js";
import { codigoCiudades } from "../utils/codigoCiudades.js";
const { Ciudad } = models;

export const actualizarCiudades = async (req, res) => {
  try {
    let ultimaCiudad;

    for (let i = 0; i < codigoCiudades.length; i++) {
      const { codigo_ciudad, nombre_ciudad, codigo_departamento } =
        codigoCiudades[i];

      // Actualizar si existe, crear si no existe
      ultimaCiudad = await Ciudad.upsert({
        codigo_ciudad,
        nombre_ciudad,
        codigo_departamento,
      });
    }

    console.log("Última ciudad procesada: ", ultimaCiudad);
    return res.status(200).json(ultimaCiudad);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};
