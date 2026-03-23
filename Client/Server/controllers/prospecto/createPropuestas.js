import { models } from "../../DB.js";
import moment from "moment";

const { PropuestaPago, Prospecto } = models;

const createPropuestas = async (
  propuestas,
  cedulaProspecto,
  deleteDeudas = true,
) => {
  console.log("propuestas controller:", propuestas);
  console.log("cedulaProspecto controller:", cedulaProspecto);

  const estaProspecto = await Prospecto.findOne({
    where: {
      cedulaProspecto: Number(cedulaProspecto),
      activo: true,
    },
  });
  // console.log("estaProspecto controller:", estaProspecto);
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
      "-> eliminando asociaciones/propuestas para idProspecto:",
      idProspecto,
    );
    try {
      // Si la instancia Prospecto tiene los helpers de asociación generados por Sequelize, úsalos.
      if (
        estaProspecto &&
        typeof estaProspecto.getPropuestaPagos === "function"
      ) {
        // Obtener deudas asociadas
        const associated = await estaProspecto.getPropuestaPagos();
        if (associated && associated.length) {
          // Desasociar todas las propuestas del prospecto (quita filas de la tabla intermedia)
          if (typeof estaProspecto.setPropuestaPagos === "function") {
            await estaProspecto.setPropuestaPagos([]);
            console.log(
              `Desasociadas ${associated.length} propuestas del prospecto ${idProspecto}`,
            );
          }

          // Si también quieres eliminar los registros de PropuestaPago en la BD, destrúyelos por su PK
          const pk = PropuestaPago.primaryKeyAttribute || "idPropuesta";
          const ids = associated.map((d) => d[pk]).filter(Boolean);
          if (ids.length) {
            await PropuestaPago.destroy({ where: { [pk]: ids } });
            console.log(`Eliminadas ${ids.length} propuestas (registros)`);
          }
        } else {
          console.log("No hay propuestas asociadas para desasociar.");
        }
      } else {
        // Fallback: buscar PropuestaPago que incluyan el Prospecto por la relación y eliminarlas
        const associated = await PropuestaPago.findAll({
          include: {
            model: Prospecto,
            where: { idProspecto },
            attributes: [],
          },
        });
        if (associated && associated.length) {
          const pk = PropuestaPago.primaryKeyAttribute || "idPropuesta";
          const ids = associated.map((d) => d[pk]).filter(Boolean);
          if (ids.length) {
            await PropuestaPago.destroy({ where: { [pk]: ids } });
            console.log(
              `Eliminadas ${ids.length} propuestas (registro fallback)`,
            );
          }
        } else {
          console.log("No se encontraron propuestas asociadas (fallback).");
        }
      }
    } catch (err) {
      console.error("Error eliminando asociaciones/propuestas:", err);
      throw err;
    }
  } else {
    console.log(
      "deleteDeudas está en false: se mantienen las deudas y honorarios existentes",
    );
  }

  if (!Array.isArray(propuestas) || propuestas.length === 0) {
    return [];
  }

  const createdPropuestas = [];

  for (let propuesta of propuestas) {
    var newPropuesta = await PropuestaPago.create({
      Clasificacion: propuesta.Clasificacion,
      tasaIntereses: propuesta.tasaIntereses,
      valorCuota: propuesta.valorCuota,
      numeroCuotas: propuesta.numeroCuotas,
    });
    // console.log("Nueva Propuesta:", newPropuesta);
    newPropuesta.addProspecto(idProspecto);
    createdPropuestas.push(newPropuesta);
  }

  return createdPropuestas;
};

export { createPropuestas };
