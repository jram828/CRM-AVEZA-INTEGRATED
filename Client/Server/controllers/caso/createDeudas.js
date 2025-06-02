import { models } from "../../DB.js";
import moment from "moment";

const { Deuda2, Cliente } = models;

const createDeudas = async (deudas,cedulaCliente) => {
  console.log("deudas controller:", deudas);
  console.log("cedulaCliente controller:", cedulaCliente);


  const estaCliente = await Cliente.findOne({
    where: {
      cedulaCliente: Number(cedulaCliente),
      activo: true,
    },
  });
  if (!estaCliente)
    return JSON.stringify({
      mensaje: "Cliente no encontrado o Cliente eliminado",
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

      newDeuda.addCliente(estaCliente);
    }

  return newDeuda; //Devuelve el último registro creado
};

export { createDeudas };
