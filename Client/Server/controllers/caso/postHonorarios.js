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
 let idProspecto;
  if (estaProspecto) {
  idProspecto = estaProspecto.idProspecto;
  console.log('ID del prospecto:', idProspecto);
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
  // console.log("Radicado controller:", radicado);
  const newHonorario= await Honorario.create({
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
