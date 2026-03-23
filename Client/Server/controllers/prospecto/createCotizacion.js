import { models } from "../../DB.js";

const { Cotizacion, Prospecto } = models;


const createCotizacion = async (
      cedulaProspecto,
      ingresos,
      gastos,
      posibleCuota,
      totalBienes_letras,
      totalDeudas_letras,
      valorRadicar_letras,
      deleteDeudas=true,
) => {
  console.log("cedulaProspecto controller:", cedulaProspecto);
console.log("Datos recibidos para crear cotización:", {
  ingresos,
  gastos,  posibleCuota,
  totalDeudas_letras,
  totalBienes_letras,
  valorRadicar_letras,
  cedulaProspecto})

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
      "-> eliminando asociaciones/cotizaciones para idProspecto:",
      idProspecto,
    );
    try {
      // Si la instancia Prospecto tiene los helpers de asociación generados por Sequelize, úsalos.
      if (estaProspecto && typeof estaProspecto.getCotizacions === "function") {
        // Obtener deudas asociadas
        const associated = await estaProspecto.getCotizacions();
        if (associated && associated.length) {
          // Desasociar todas las cotizaciones del prospecto (quita filas de la tabla intermedia)
          if (typeof estaProspecto.setCotizacions === "function") {
            await estaProspecto.setCotizacions([]);
            console.log(
              `Desasociadas ${associated.length} cotizaciones del prospecto ${idProspecto}`,
            );
          }

          // Si también quieres eliminar los registros de Cotizacion en la BD, destrúyelos por su PK
          const pk = Cotizacion.primaryKeyAttribute || "idCotizacion";
          const ids = associated.map((d) => d[pk]).filter(Boolean);
          if (ids.length) {
            await Cotizacion.destroy({ where: { [pk]: ids } });
            console.log(`Eliminadas ${ids.length} cotizaciones (registros)`);
          }
        } else {
          console.log("No hay cotizaciones asociadas para desasociar.");
        }
      } else {
        // Fallback: buscar Cotizacion que incluyan el Prospecto por la relación y eliminarlas
        const associated = await Cotizacion.findAll({
          include: {
            model: Prospecto,
            where: { idProspecto },
            attributes: [],
          },
        });
        if (associated && associated.length) {
          const pk = Cotizacion.primaryKeyAttribute || "idCotizacion";
          const ids = associated.map((d) => d[pk]).filter(Boolean);
          if (ids.length) {
            await Cotizacion.destroy({ where: { [pk]: ids } });
            console.log(
              `Eliminadas ${ids.length} cotizaciones (registro fallback)`,
            );
          }
        } else {
          console.log("No se encontraron cotizaciones asociadas (fallback).");
        }
      }
    } catch (err) {
      console.error("Error eliminando asociaciones/cotizaciones:", err);
      throw err;
    }
  } else {
    console.log(
      "deleteDeudas está en false: se mantienen las deudas y honorarios existentes",
    );
  }

  var newCotizacion = await Cotizacion.create({
    ingresos: ingresos,
    gastos: gastos,
    posibleCuota: posibleCuota,
    totalDeudas_letras: totalDeudas_letras,
    totalBienes_letras: totalBienes_letras,
    valorRadicar_letras: valorRadicar_letras,
  });
  console.log("Nueva Cotización:", newCotizacion);
  newCotizacion.addProspecto(idProspecto);
  return newCotizacion;
};

export { createCotizacion };
