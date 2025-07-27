import { models } from "../../DB.js";
import moment from "moment";

const { Deuda2, Prospecto } = models;

const createDeudas = async (deudas,cedulaProspecto) => {
  console.log("deudas controller:", deudas);
  console.log("cedulaProspecto controller:", cedulaProspecto);


  const estaProspecto = await Prospecto.findOne({
    where: {
      cedulaProspecto: Number(cedulaProspecto),
      activo: true,
    },
  });
  console.log("estaProspecto controller:", estaProspecto);
  if (!estaProspecto)
    return JSON.stringify({
      mensaje: "Prospecto no encontrado o Prospecto eliminado",
    });


  // var pretensiones;

  // if (typeof(valor_pretensiones) === "number") {
  //   pretensiones = valor_pretensiones;
  // } else {
  //   pretensiones = 0;
  // }

  // var vhonorarios;

  // if (typeof(honorarios) === "number") {
  //   vhonorarios = honorarios;
  // } else {
  //   vhonorarios = 0;
  // }

  // var vcuotas;

  // if (typeof(cuotas) === "number") {
  //   vcuotas = cuotas;
  // } else {
  //   vcuotas = 0;
  // }

  // var porcentajeIni;

  // if (typeof(porcentajeInicial) === "number") {
  //   porcentajeIni = porcentajeInicial;
  // } else {
  //   porcentajeIni = 0;
  // }
  // console.log("Radicado controller:", radicado);

    for (let deuda of deudas) {
      var newDeuda = await Deuda2.create({
        capital: Number(deuda.capital),
        clasificacion: deuda.tipoDeuda,
        derechoVoto: deuda.derechoVoto,
        acreedor: deuda.acreedor,
      });
      console.log("Nueva Deuda:", newDeuda);
      newDeuda.addProspecto(estaProspecto);
    }

  return newDeuda; //Devuelve el último registro creado
};

export { createDeudas };
