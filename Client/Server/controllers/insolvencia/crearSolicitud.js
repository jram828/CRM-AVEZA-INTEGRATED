import { where } from "sequelize";
import { models } from "../../DB.js";

const {
  Acreedor,
  Cliente,
  Bien,
  Proceso,
  Ingreso,
  Gastos,
  Deuda,
  Motivos,
  ObligacionAlimentaria,
  PropuestaPago,
  Sociedad,
  Solicitud,
} = models;

export const crearSolicitud = async (datosInsolvencia) => {
  console.log("Body solicitud:", datosInsolvencia);

  const {
    acreedores,
    bienes,
    procesos,
    sociedades,
    obligaciones,
    gastos,
    motivos,
    deudas,
    ingresos,
    propuestas,
    cliente,
  } = datosInsolvencia;

  console.log("Body crear solicitud:", {
    acreedores,
    bienes, //yaa
    procesos, //yaa
    sociedades, //yaa
    obligaciones, //yaa
    gastos, //yaa
    motivos,
    deudas, //yaa
    ingresos, //yaa
    propuestas, //yaa
    cliente,
  });

  try {
    const foundCliente = await Cliente.findOne({
      where: { cedulaCliente: cliente.cedula },
    });

    var newSolicitud = await Solicitud.create();
    newSolicitud.addCliente(foundCliente);

    for (let bien of bienes) {
      var newBien = await Bien.create({
        tipoBien: bien.tipoBien,
        valor: bien.valor,
        tipoAfectacion: bien.tipoAfectacion,
        descripcionBien: bien.descripcionBien,
      });

      newBien.addSolicitud(newSolicitud);
    }
    console.log("Ultimo Bien: ", newBien);

    for (let ingreso of ingresos) {
      var newIngreso = await Ingreso.create({
        concepto: ingreso.concepto,
        valor: ingreso.Valor,
      });

      newIngreso.addSolicitud(newSolicitud);
    }
    console.log("Ultimo Ingreso: ", newIngreso);

    var newGastos = await Gastos.create({
      energia: gastos[0].energia,
      agua: gastos[0].aguaAlcAseo,
      gas: gastos[0].gas,
      telecomunicaciones: gastos[0].telecomunicaciones,
      television: gastos[0].television,
      arriendo: gastos[0].arriendo,
      seguros: gastos[0].seguros,
      alimentacion: gastos[0].alimentacion,
      transporte: gastos[0].transporte,
      otros: gastos[0].otros,
    });

    newGastos.addSolicitud(newSolicitud);

    for (let proceso of procesos) {
      var newProceso = await Proceso.create({
        juzgado: proceso.juzgado,
        demandante: proceso.demandante,
        radicado: proceso.radicado,
        tipoProceso: proceso.tipoProceso,
      });

      newProceso.addSolicitud(newSolicitud);
    }
    console.log("Ultimo Proceso: ", newProceso);

    for (let deuda of deudas) {
      var newDeuda = await Deuda.create({
        tipoDeuda: deuda.tipoDeuda,
        tipoGarantia: deuda.tipoGarantia,
        documentoSoporte: deuda.documentoSoporte,
        capital: deuda.capital,
        intereses: deuda.intereses,
        cuantiaTotal: Number(deuda.capital) + Number(deuda.intereses),
        clasificacion: deuda.clasificacion,
        diasMora: deuda.diasMora,
      });

      newDeuda.addSolicitud(newSolicitud);
    }
    console.log("Ultimo Deuda: ", newDeuda);

    for (let propuesta of propuestas) {
      var newPropuesta = await PropuestaPago.create({
        Clasificacion: propuesta.Clasificacion,
        tasaIntereses: propuesta.tasaIntereses,
        valorCuota: propuesta.valorCuota,
        numeroCuotas: propuesta.numeroCuotas,
      });

      newPropuesta.addSolicitud(newSolicitud);
    }
    console.log("Ultimo Propuesta: ", newPropuesta);

    for (let sociedad of sociedades) {
      var newSociedad = await Sociedad.create({
        nombresApellidos: sociedad.nombresConyuge,
        cedulaConyuge: sociedad.idConyuge,
      });

      newSociedad.addSolicitud(newSolicitud);
    }
    console.log("Ultimo Sociedad: ", newSociedad);

    for (let obligacion of obligaciones) {
      var newObligacion = await ObligacionAlimentaria.create({
        nombresHijo: obligacion.nombresHijo,
        idHijo: obligacion.idHijo,
      });

      newObligacion.addSolicitud(newSolicitud);
    }
    console.log("Ultimo Obligacion: ", newObligacion);

    for (let acreedor of acreedores) {
      var newAcreedor = await Acreedor.create({
        NIT: acreedor.NIT,
        email: acreedor.emailAcreedor,
        nombre: acreedor.nombreAcreedor,
        direccion: acreedor.direccionAcreedor,
        ciudad: acreedor.ciudadAcreedor,
        telefono: acreedor.telefono,
      });

      newAcreedor.addSolicitud(newSolicitud);
    }
    console.log("Ultimo Acreedor: ", newAcreedor);

    // return newAcreedor.dataValues;
  } catch (error) {
    console.log(error);
  }
};
