import { models } from "../../DB.js";
import moment from "moment";

const { Prospecto, Honorario } = models;

const guardaHonorarios = async (
  cedulaProspecto,
  inicial,
  cuotasHonorarios,
  valorHonorarios,
  valorRadicar,
  honorariosLiquidacion,
  totalDeudas,
  deleteDeudas=true
) => {
  const estaProspecto = await Prospecto.findOne({
    where: {
      cedulaProspecto: cedulaProspecto,
      activo: true,
    },
  });
  let idProspecto;
  if (estaProspecto) {
    idProspecto = estaProspecto.idProspecto;
    console.log("ID del prospecto:", idProspecto);
  } else {
    return JSON.stringify({
      mensaje: "Prospecto no encontrado o Prospecto eliminado",
    });
  }

  // var pretensiones;

  // if (typeof valor_pretensiones === "number") {
  //   pretensiones = valor_pretensiones;
  // } else {
  //   pretensiones = 0;
  // }

  var vhonorarios;

  if (typeof valorHonorarios === "number") {
    vhonorarios = valorHonorarios;
  } else {
    vhonorarios = BigInt(valorHonorarios);
  }

  var vcuotas;

  if (typeof cuotasHonorarios === "number") {
    vcuotas = cuotasHonorarios;
  } else {
    vcuotas = parseInt(cuotasHonorarios);
  }

  var vinicial;

  if (typeof inicial === "number") {
    vinicial = inicial;
  } else {
    vinicial = BigInt(inicial);
  }

  var hLiquidacion;

  if (typeof honorariosLiquidacion === "number") {
    hLiquidacion = honorariosLiquidacion;
  } else {
    hLiquidacion = BigInt(honorariosLiquidacion);
  }

  var tDeudas;

  if (typeof totalDeudas === "number") {
    tDeudas = totalDeudas;
  } else {
    tDeudas = BigInt(totalDeudas);
  }


  if (deleteDeudas) {
    console.log("deleteDeudas:", deleteDeudas, "-> eliminando asociaciones de honorarios para idProspecto:", idProspecto);
    try {
      // Remueve todas las asociaciones many-to-many entre este prospecto y sus honorarios.
      // Requiere que la asociación esté configurada (Prospecto.belongsToMany(Honorario, ...) y viceversa).
      await estaProspecto.setHonorarios([]);
      console.log("Asociaciones de honorarios eliminadas para el prospecto:", idProspecto);
      // Intento obtener los honorarios vinculados antes/después de la eliminación de la asociación.
      // Si setHonorarios([]) ya eliminó la relación en la BD, hacemos un intento adicional
      // buscando honorarios que incluyan este prospecto (si aún existieran).
      let honorariosVinculados = [];
      try {
        honorariosVinculados = await estaProspecto.getHonorarios();
      } catch (e) {
        console.warn("No se pudo obtener honorarios desde la instancia; se intentará con una consulta directa.", e);
      }

      if (!honorariosVinculados || honorariosVinculados.length === 0) {
        try {
          honorariosVinculados = await Honorario.findAll({
        include: [
          {
            model: Prospecto,
            where: { idProspecto: idProspecto },
            through: { attributes: [] },
          },
        ],
          });
        } catch (e) {
          console.warn("Consulta directa de honorarios vinculados falló:", e);
          honorariosVinculados = [];
        }
      }

      if (honorariosVinculados && honorariosVinculados.length > 0) {
        console.log("Honorarios vinculados encontrados para evaluar eliminación:", honorariosVinculados.map(h => h.idHonorario ?? h.id));
        for (const h of honorariosVinculados) {
          try {
        // Si el honorario solo está asociado a este prospecto, lo eliminamos completamente.
        // Si está asociado a otros prospectos, solo dejamos la desvinculación (ya realizada con setHonorarios([])).
        const asociatedCount = typeof h.countProspectos === "function" ? await h.countProspectos() : 0;
        if (asociatedCount <= 1) {
          await h.destroy();
          console.log("Honorario eliminado (no compartido):", h.idHonorario ?? h.id);
        } else {
          console.log("Honorario compartido con otros prospectos; dejado sin eliminar:", h.idHonorario ?? h.id);
        }
          } catch (errDestroy) {
        console.error("Error eliminando honorario:", h.idHonorario ?? h.id, errDestroy);
          }
        }
      } else {
        console.log("No se encontraron honorarios vinculados para eliminar para el prospecto:", idProspecto);
      }
    } catch (err) {
      console.error("Error eliminando asociaciones de honorarios:", err);
      throw err;
    }
  } else {
    console.log("deleteDeudas está en false: se mantienen los honorarios existentes");
  }

  // console.log("Radicado controller:", radicado);
  const newHonorario = await Honorario.create({
    valorHonorarios: vhonorarios,
    valorRadicar: valorRadicar,
    inicial: vinicial,
    cuotasHonorarios: vcuotas,
    honorariosLiquidacion: hLiquidacion,
    totalDeudas: tDeudas,
  });

  newHonorario.addProspecto(idProspecto);

  return newHonorario;
};

export { guardaHonorarios };
