import { models } from "../../DB.js";
import moment from "moment";

const { Prospecto, Honorario } = models;

const guardaHonorarios = async (cedulaProspecto,
  inicial,
  cuotasHonorarios,
  valorHonorarios,
  valorRadicar,
  honorariosLiquidacion,
  totalDeudas
) => {

  const estaProspecto = await Prospecto.findOne({
    where: {
      cedulaProspecto: cedulaProspecto,
      activo: true,
    },
  });
  if (!estaProspecto)
    return JSON.stringify({
      mensaje: "Prospecto no encontrado o Prospecto eliminado",
    });

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
    vhonorarios = 0;
  }

  var vcuotas;

  if (typeof cuotasHonorarios === "number") {
    vcuotas = cuotasHonorarios;
  } else {
    vcuotas = 0;
  }

  var vinicial;

  if (typeof inicial === "number") {
    vinicial = inicial;
  } else {
    vinicial = 0;
  }

    var hLiquidacion;

  if (typeof honorariosLiquidacion === "number") {
    hLiquidacion = honorariosLiquidacion;
  } else {
    hLiquidacion = 0;
  }

      var tDeudas;

  if (typeof totalDeudas === "number") {
    tDeudas = totalDeudas;
  } else {
    tDeudas = 0;
  }
  // console.log("Radicado controller:", radicado);
  const newHonorario= await Honorario.create({
    valorHonorarios: vhonorarios,
    valorRadicar: valorRadicar,
    inicial: vinicial,
    cuotasHonorarios: vcuotas,
    honorariosLiquidacion: hLiquidacion,
    totalDeudas: tDeudas,
  });

   newHonorario.addProspecto(cedulaProspecto);

  return newHonorario;

};

export { guardaHonorarios };
