import { models } from "../../DB.js";
import moment from "moment";

const { Deuda2, Prospecto } = models;

const createDeudas = async (deudas, cedulaProspecto, deleteDeudas=true) => {
  console.log("deudas controller:", deudas);
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
      console.log("deleteDeudas:", deleteDeudas, "-> eliminando asociaciones/deudas para idProspecto:", idProspecto);
      try {
        // Si la instancia Prospecto tiene los helpers de asociación generados por Sequelize, úsalos.
        if (estaProspecto && typeof estaProspecto.getDeuda2s === "function") {
          // Obtener deudas asociadas
          const associated = await estaProspecto.getDeuda2s();
          if (associated && associated.length) {
            // Desasociar todas las deudas del prospecto (quita filas de la tabla intermedia)
            if (typeof estaProspecto.setDeuda2s === "function") {
              await estaProspecto.setDeuda2s([]);
              console.log(`Desasociadas ${associated.length} deudas del prospecto ${idProspecto}`);
            }

            // Si también quieres eliminar los registros de Deuda2 en la BD, destrúyelos por su PK
            const pk = Deuda2.primaryKeyAttribute || "idDeuda";
            const ids = associated.map(d => d[pk]).filter(Boolean);
            if (ids.length) {
              await Deuda2.destroy({ where: { [pk]: ids } });
              console.log(`Eliminadas ${ids.length} deudas (registros)`);
            }
          } else {
            console.log("No hay deudas asociadas para desasociar.");
          }
        } else {
          // Fallback: buscar Deuda2 que incluyan el Prospecto por la relación y eliminarlas
          const associated = await Deuda2.findAll({
            include: {
              model: Prospecto,
              where: { idProspecto },
              attributes: []
            }
          });
          if (associated && associated.length) {
            const pk = Deuda2.primaryKeyAttribute || "idDeuda";
            const ids = associated.map(d => d[pk]).filter(Boolean);
            if (ids.length) {
              await Deuda2.destroy({ where: { [pk]: ids } });
              console.log(`Eliminadas ${ids.length} deudas (registro fallback)`);
            }
          } else {
            console.log("No se encontraron deudas asociadas (fallback).");
          }
        }
      } catch (err) {
        console.error("Error eliminando asociaciones/deudas:", err);
        throw err;
      }
    } else {
      console.log("deleteDeudas está en false: se mantienen las deudas y honorarios existentes");
    }

  if (!Array.isArray(deudas) || deudas.length === 0) {
    return [];
  }

  const createdDeudas = [];
  for (let deuda of deudas) {
    const newDeuda = await Deuda2.create({
      capital: Number(deuda.capital),
      clasificacion: deuda.tipoDeuda,
      derechoVoto: deuda.derechoVoto,
      acreedor: deuda.acreedor,
      idProspecto: idProspecto, // FK asociada
    });
    console.log("Nueva Deuda:", newDeuda);
    createdDeudas.push(newDeuda);
  }

  return createdDeudas;
};

export { createDeudas };
