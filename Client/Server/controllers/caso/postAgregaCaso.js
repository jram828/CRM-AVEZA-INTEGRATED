import { models } from "../../DB.js";
import moment from "moment";

const { Caso, Cliente, Abogado, TipoDeCaso } = models;

const createCaso = async (
  radicado,
  juzgado,
  cedulaCliente,
  cedulaAbogado,
  fecha,
  fechaFin,
  descripcion,
  TipoDeCasoid,
  honorarios,
  valor_pretensiones,
  cuotas,
  forma_de_pago
) => {
  console.log(
    "radicado",
    radicado,
    "juzgado",
    juzgado,
    "cedulaCliente",
    cedulaCliente,
    "cedulaAbogado",
    cedulaAbogado,
    "fecha",
    fecha,
    "descripcion",
    descripcion,
    "TipoDeCasoId",
    TipoDeCasoid,
    "cuotas",
    cuotas,
    "honorarios",
    honorarios,
    "valor_pretensiones",
    valor_pretensiones,
    "cuotas",
    cuotas,
    "forma_de_pago",
    forma_de_pago
  );

  const estaCliente = await Cliente.findOne({
    where: {
      cedulaCliente: cedulaCliente,
      activo: true,
    },
  });
  if (!estaCliente)
    return JSON.stringify({
      mensaje: "Cliente no encontrado o Cliente eliminado",
    });

  const estaAbogado = await Abogado.findOne({
    where: {
      cedulaAbogado: cedulaAbogado,
      activo: true,
    },
  });
  if (!estaAbogado)
    return JSON.stringify({
      mensaje: "Abogado no encontrado o Abogado eliminado",
    });

  const estaTipoDeCaso = await TipoDeCaso.findOne({
    where: {
      TipoDeCasoid: TipoDeCasoid,
      activo: true,
    },
  });
  if (!estaTipoDeCaso)
    return JSON.stringify({
      mensaje: "Tipo de Caso no encontrado o Tipo de Caso eliminado",
    });
  const fechaUTC = moment(fecha).utc().toDate();

  console.log("Radicado controller:", radicado);
  const newCaso = await Caso.create({
    radicado: radicado,
    juzgado: juzgado,
    fecha: fechaUTC,
    descripcion: descripcion,
    TipoDeCasoTipoDeCasoid: TipoDeCasoid,
    ClienteCedulaCliente: cedulaCliente,
    AbogadoCedulaAbogado: cedulaAbogado,
    honorarios: honorarios,
    forma_de_pago: forma_de_pago,
    valor_pretensiones: valor_pretensiones,
    cuotas: cuotas,
  });

  //  newAbogado.addCliente(clientes);

  return newCaso;

  // return await Abogado.create({nombre, duracion,dificultad, temporada}); //?ASI También puede ser
};

export { createCaso };
