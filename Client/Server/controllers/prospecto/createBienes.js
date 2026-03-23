import { models } from "../../DB.js";
import moment from "moment";

const { Bien, Prospecto } = models;

const createBienes = async (bienes, cedulaProspecto, deleteDeudas = true) => {
  console.log("bienes controller:", bienes);
  console.log("cedulaProspecto controller:", cedulaProspecto);

  const estaProspecto = await Prospecto.findOne({
    where: {
      cedulaProspecto: Number(cedulaProspecto),
      activo: true,
    },
  });
  console.log("estaProspecto controller:", estaProspecto);
  var idProspecto;
  if (estaProspecto) {
    idProspecto = estaProspecto.idProspecto;
    console.log("ID del prospecto:", idProspecto);
  } else {
    return JSON.stringify({
      mensaje: "Prospecto no encontrado o Prospecto eliminado",
    });
  }

  if (deleteDeudas) {
    console.log(
      "deleteDeudas:",
      deleteDeudas,
      "-> eliminando asociaciones/bienes para idProspecto:",
      idProspecto,
    );
    try {
      // Si la instancia Prospecto tiene los helpers de asociación generados por Sequelize, úsalos.
      if (estaProspecto && typeof estaProspecto.getBiens === "function") {
        // Obtener deudas asociadas
        const associated = await estaProspecto.getBiens();
        if (associated && associated.length) {
          // Desasociar todas las deudas del prospecto (quita filas de la tabla intermedia)
          if (typeof estaProspecto.setBiens === "function") {
            await estaProspecto.setBiens([]);
            console.log(
              `Desasociados ${associated.length} bienes del prospecto ${idProspecto}`,
            );
          }

          // Si también quieres eliminar los registros de Deuda2 en la BD, destrúyelos por su PK
          const pk = Bien.primaryKeyAttribute || "idBien";
          const ids = associated.map((d) => d[pk]).filter(Boolean);
          if (ids.length) {
            await Bien.destroy({ where: { [pk]: ids } });
            console.log(`Eliminados ${ids.length} bienes (registros)`);
          }
        } else {
          console.log("No hay bienes asociados para desasociar.");
        }
      } else {
        // Fallback: buscar Bien que incluyan el Prospecto por la relación y eliminarlos
        const associated = await Bien.findAll({
          include: {
            model: Prospecto,
            where: { idProspecto },
            attributes: [],
          },
        });
        if (associated && associated.length) {
          const pk = Bien.primaryKeyAttribute || "idBien";
          const ids = associated.map((d) => d[pk]).filter(Boolean);
          if (ids.length) {
            await Bien.destroy({ where: { [pk]: ids } });
            console.log(`Eliminados ${ids.length} bienes (registro fallback)`);
          }
        } else {
          console.log("No se encontraron bienes asociados (fallback).");
        }
      }
    } catch (err) {
      console.error("Error eliminando asociaciones/bienes:", err);
      throw err;
    }
  } else {
    console.log(
      "deleteDeudas está en false: se mantienen las deudas y honorarios existentes",
    );
  }

  if (!Array.isArray(bienes) || bienes.length === 0) {
    return [];
  }

  const createdBienes = [];

  for (let bien of bienes) {
    var newBien = await Bien.create({
      tipoBien: bien?.tipoBien || "No especificado",
      valor: bien.valor,
      tipoAfectacion: bien?.tipoAfectacion || "No especificado",
      descripcionBien: bien?.descripcionBien || "No especificado",
    });
    console.log("Nuevo Bien:", newBien);
    createdBienes.push(newBien);
    newBien.addProspecto(idProspecto);
  }

  return createdBienes;
};

export { createBienes };
