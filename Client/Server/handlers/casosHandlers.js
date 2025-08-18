import { createCaso } from "../controllers/caso/postAgregaCaso.js";
import { createDeudas } from "../controllers/caso/createDeudas.js";
import { getAllCaso } from "../controllers/caso/getAllCaso.js";
import { finCaso } from "../controllers/caso/finCaso.js";
import { deleteCaso } from "../controllers/caso/deleteCaso.js";
import { getCasoId } from "../controllers/caso/getCasoById.js";
import { actualizaCaso } from "../controllers/caso/postActualizaCaso.js";
import { actualizaCasoCotizacion } from "../controllers/caso/postActualizaCasoCotizacion.js";
import { copyDeudas } from "../controllers/caso/copyDeudas.js";
import { guardaHonorarios } from "../controllers/caso/postHonorarios.js";
const createCasosHandler = async (req, res) => {
  const {
    radicado,
    juzgado,
    cedulaAbogado,
    cedulaCliente,
    fecha,
    fechaFin,
    descripcion,
    TipoDeCasoid,
    honorarios,
    valor_pretensiones,
    cuotas,
    forma_de_pago,
  } = req.body;
  //const fecha_caso= new Date(fecha)
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
    cuotas
  );

  try {
    const response = await createCaso(
      radicado,
      juzgado,
      parseInt(cedulaCliente),
      parseInt(cedulaAbogado),
      fecha,
      fechaFin,
      descripcion,
      TipoDeCasoid,
      honorarios,
      valor_pretensiones,
      cuotas,
      forma_de_pago
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCasoHandler = async (req, res) => {
  try {
    console.log("Req get caso handler:", req.query);
    const response = await getAllCaso(req);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTipoDeCasoByIdHandler = async (req, res) => {
  console.log(req.params);
  const { idCaso } = req.params;
  try {
    const response = await getCasoId(idCaso);
    console.log("Response handler get caso:", response);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const finCasoHandler = async (req, res) => {
  const { idCaso, fechaFin } = req.body;
  console.log("body handler fin:", req.body);

  try {
    const response = await finCaso(idCaso, fechaFin);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createDeudasHandler = async (req, res) => {
  const { deudas, cedulaCliente } = req.body;
  console.log("body handler crear deudas:", req.body);

  try {
    const response = await createDeudas(deudas, cedulaCliente);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const copyDeudasHandler = async (req, res) => {
  const { cedulaProspecto } = req.body;
  console.log("body handler crear deudas:", req.body);

  try {
    const response = await copyDeudas(cedulaProspecto);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const copyHonorariosHandler = async (req, res) => {
  const { cedulaProspecto } = req.body;
  console.log("body handler crear honorarios:", req.body);

  try {
    const response = await copiarHonorarios(cedulaProspecto);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteCasoHandler = async (req, res) => {
  const { idCaso } = req.body;
  console.log("body handler delete:", req.body);

  try {
    const response = await deleteCaso(idCaso);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postActualizaCaso = async (req, res) => {
  const {
    etapa,
    idCaso,
    valor_pretensiones,
    honorarios,
    honorariosLiquidacion,
    aceptacion_cotizacion,
    tiene_contrato,
    forma_de_pago,
    descripcion,
    radicado,
    juzgado,
    cuotas,
    porcentajeInicial,
  } = req.body;

  try {
    const response = await actualizaCaso(
      etapa,
      idCaso,
      parseInt(valor_pretensiones),
      parseInt(honorarios),
      parseInt(honorariosLiquidacion),
      aceptacion_cotizacion,
      tiene_contrato,
      forma_de_pago,
      descripcion,
      radicado,
      juzgado,
      parseInt(cuotas),
      parseInt(porcentajeInicial)
    );
    if (response) res.status(200).json(response);
    else res.status(204).json("No se actualizo el caso");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postActualizaCasoCotizacion = async (req, res) => {
  const {
    caso,
    ingreso,
    gasto,
    bienes,
    deudas,
    propuestas,
    cliente,
    honorarios,
    resultadosCotizacion,
  } = req.body;

  try {
    const response = await actualizaCasoCotizacion(
      caso.idCaso,
      parseInt(resultadosCotizacion.totalDeudas),
      parseInt(honorarios.inicial),
      parseInt(honorarios.cuotasHonorarios),
      parseInt(honorarios.valorHonorarios),
      parseInt(honorarios.honorariosLiquidacion)
    );
    if (response) res.status(200).json(response);
    else res.status(204).json("No se actualizo el caso");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postHonorariosHandler = async (req, res) => {
  const { cedulaProspecto, honorarios } = req.body;

  const {
    inicial,
    cuotasHonorarios,
    valorHonorarios,
    valorRadicar,
    honorariosLiquidacion,
  } = honorarios;
  console.log("body handler honorarios:", req.body);

  try {
    const response = await guardaHonorarios(
      cedulaProspecto,
      inicial,
      cuotasHonorarios,
      valorHonorarios,
      valorRadicar,
      honorariosLiquidacion
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
  createCasosHandler,
  createDeudasHandler,
  copyDeudasHandler,
  getCasoHandler,
  finCasoHandler,
  deleteCasoHandler,
  getTipoDeCasoByIdHandler,
  postActualizaCaso,
  postActualizaCasoCotizacion,
  postHonorariosHandler,
  copyHonorariosHandler,
};
