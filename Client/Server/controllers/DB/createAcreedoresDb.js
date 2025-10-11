import { listaAcreedores } from "../../utils/listaAcreedores.js";
import { models as models2 } from "../../DB2.js";

// Utilidad para exportar toda la información de la base de datos a un archivo JSON
export const createAcreedoresDb = async () => {
  try {
    for (const acreedorData of listaAcreedores) {
      // Ajusta los nombres de las propiedades si es necesario para que coincidan con el modelo
      await models2.Acreedor.create({
        nombre: acreedorData.nombre,
        NIT: acreedorData.NIT,
        direccion: acreedorData.direccion,
        ciudad: acreedorData.ciudad,
        telefono: acreedorData.telefono,
        email: acreedorData.email,
      });
    }
    console.log("Acreedores creados exitosamente.");
  } catch (err) {
    console.error("Error creando los acreedores:", err);
  }
};
