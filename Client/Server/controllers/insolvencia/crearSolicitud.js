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
  Solicitud
} = models;

export const crearSolicitud = async (req, res) => {
  // console.log("Acreedores:", acreedores);

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
    cedulaCliente,
  } = req.body;

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
    cedulaCliente,
  });

  try {
    var newSolicitud = await Solicitud.create();
    newSolicitud.addCliente(cedulaCliente);

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

    for (let acreedor of acreedores) {
      var newAcreedor = await Acreedor.create({
        NIT: acreedor.NIT,
        email: acreedor.email,
        nombre: acreedor.nombre,
        direccion: acreedor.direccion,
        ciudad: acreedor.ciudad,
        telefono: acreedor.telefono,
      });

      newAcreedor.addSolicitud(newSolicitud);
    }
    console.log("Ultimo Acreedor: ", newBien);

    for (let ingreso of ingresos) {
      var newIngreso = await Ingreso.create({
        concepto: ingreso.concepto,
        valor: ingreso.valor,
      });

      newIngreso.addSolicitud(newSolicitud);
    }
    console.log("Ultimo Ingreso: ", newIngreso);

    for (let acreedor of acreedores) {
      foundCliente.addAcreedor(acreedor.idAcreedor);
    }

    var newGastos = await Gastos.create({
      energia: gastos.energia,
      agua: gastos.agua,
      gas: gastos.gas,
      telecomunicaciones: gastos.telecomunicaciones,
      television: gastos.television,
      arriendo: gastos.arriendo,
      seguros: gastos.seguros,
      alimentación: gastos.alimentación,
      transporte: gastos.transporte,
      otros: gastos.otros,
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
        cuantiaTotal: deuda.cuantiaTotal,
        clasificacion: deuda.clasificacion,
        diasMora: deuda.diasMora,
      });

      newDeuda.addSolicitud(newSolicitud);
    }
    console.log("Ultimo Deuda: ", newDeuda);

    for (let propuesta of propuestas) {
      var newPropuesta = await PropuestaPago.create({
        clase: propuesta.clase,
        interes: propuesta.interes,
        valor: propuesta.valor,
        plazo: propuesta.plazo,
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

    // return newAcreedor.dataValues;
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};
