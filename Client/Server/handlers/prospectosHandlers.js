import { getProspectoById } from "../controllers/prospecto/getProspectoByid.js";
import { getAllProspecto } from "../controllers/prospecto/getAllProspectos.js";
import { getAllProspectoCasos } from "../controllers/prospecto/getAllProspectosCasos.js";
import { getProspectoByName } from "../controllers/prospecto/getProspectoByName.js";
import { createProspectoBd } from "../controllers/prospecto/postProspectosController.js";
import { eliminaProspecto } from "../controllers/prospecto/postEliminaProspecto.js";
import { actualizaProspecto } from "../controllers/prospecto/postActualizaProspectos.js";
import { getProspectoByEmail } from "../controllers/prospecto/getProspectoByEmail.js";
import { actualizaDatosCotizacion } from "../controllers/prospecto/postActualizaDatosCotizacion.js";
import { corregirAcentos } from "../controllers/prospecto/corregirAcentos.js";
import { postProspectoAut } from "../controllers/prospecto/postProspectoAut.js";
import { actualizaStatus } from "../controllers/prospecto/postActualizaStatus.js";
import { actualizaCalificacion } from "../controllers/prospecto/postActualizaCalificacion.js";
import { copyDeudas } from "../controllers/prospecto/copyDeudas.js";
import { createDeudas } from "../controllers/prospecto/createDeudas.js";
import { guardaHonorarios } from "../controllers/prospecto/postHonorarios.js";
import { copiarHonorarios } from "../controllers/prospecto/copiarHonorarios.js";
import { copyBienes } from "../controllers/prospecto/copyBienes.js";
import { createBienes } from "../controllers/prospecto/createBienes.js";
import { copyPropuestas } from "../controllers/prospecto/copyPropuestas.js";
import { createPropuestas } from "../controllers/prospecto/createPropuestas.js";
import { copyCotizacion } from "../controllers/prospecto/copyCotizacion.js";
import { createCotizacion } from "../controllers/prospecto/createCotizacion.js";
import { actualizaFechaCierre } from "../controllers/prospecto/actualizaFechaCierre.js";

const prospectosHandler = async (req, res) => {
  //const { name } = req.query;
  console.log(req.query);
  const { pagina = 1, porPagina = 10 } = req.query;
  const offset = (parseInt(pagina) - 1) * parseInt(porPagina);

  try {
    const response = await getAllProspecto(req.query);
    res.status(200).json(response);
    /*}  else {
            const countyByName = await getProspectoByName(name)
            res.status(200).json(countyByName);
        } ;*/
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const prospectosCasosHandler = async (req, res) => {
  //const { name } = req.query;
  console.log(req.query);
  const { pagina = 1, porPagina = 10 } = req.query;
  const offset = (parseInt(pagina) - 1) * parseInt(porPagina);

  try {
    const response = await getAllProspectoCasos(req.query);
    res.status(200).json(response);
    /*}  else {
            const countyByName = await getProspectoByName(name)
            res.status(200).json(countyByName);
        } ;*/
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const prospectosDetailHandler = async (req, res) => {
  const { cedulaProspecto } = req.query;
  console.log("Cédula Prospecto en handler:", cedulaProspecto);

  try {
    const response = await getProspectoById(cedulaProspecto);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json((error = error.message));
  }
};

const getProspectoByEmailHandler = async (req, res) => {
  const { correo } = req.query;

  try {
    const response = await getProspectoByEmail(correo);
    console.log("Response by email:", response);
    res.status(200).json(response);
  } catch (error) {
    console.log("Error by email:", error.message);
    res.status(400).json({ error: error.message });
  }
};

const postProspectosHandler = async (req, res) => {
  // console.log("Body post prospecto handler:", req.body);
  const {
    email,
    nombres,
    apellidos,
    cedulaProspecto,
    celular,
    direccion,
    nombre_ciudad,
    tipo_usuario,
    tipo_de_caso,
    forma_de_pago,
    honorarios,
    cuotas,
    comentarios,
    valor_pretensiones,
    tieneProcesos,
    responsable,
    fuente,
    genero,
    totalBienes,
    tiempoMora,
    numeroEntidades,
    servicio,
    fase,
    status,
    totalDeudas,
  } = req.body;

  try {
    const response = await createProspectoBd(
      email,
      nombres,
      apellidos,
      cedulaProspecto,
      celular,
      direccion,
      nombre_ciudad,
      tipo_usuario,
      tipo_de_caso,
      forma_de_pago,
      honorarios,
      cuotas,
      comentarios,
      valor_pretensiones,
      tieneProcesos,
      responsable,
      fuente,
      genero,
      totalBienes,
      tiempoMora,
      numeroEntidades,
      servicio,
      fase,
      status,
      totalDeudas,
    );
    console.log("Response crear prospecto", response);
    if (response) res.status(200).json(response);
    else res.status(200).send("La cedula ya existe");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postProspectosAutoHandler = async (req, res) => {
  // console.log("Body post prospecto handler:", req.body);

  try {
    const response = await postProspectoAut(req.body);
    console.log("Response crear prospecto", response);
    if (response) res.status(200).json(response);
    else res.status(200).send("La cedula ya existe");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postEliminaProspectos = async (req, res) => {
  const { idProspecto } = req.body;

  try {
    const response = await eliminaProspecto(idProspecto);
    if (response) res.status(200).json("Prospecto eliminado");
    else res.status(204).json("No existe el Prospecto");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  // res.status(200).send(`creando actividades`);
};

const postActualizaProspectos = async (req, res) => {
  const {
    idProspecto,
    cedulanew,
    nombres,
    apellidos,
    email,
    celular,
    direccion,
    ciudad,
    ciudad_anterior,
    comentarios,
    cedula_anterior,
    nombres_anterior,
    apellidos_anterior,
    tieneProcesos,
    numeroEntidades,
    tiempoMora,
    totalBienes,
    totalDeudas,
    modoContacto,
    ciudadEnviar,
    fuente,
    servicio,
    genero,
  } = req.body;

  const ciudadNew = ciudadEnviar || ciudad;
  const cedula = cedulanew;

  try {
    console.log("Cedula anterior handler:", cedula_anterior);
    console.log("Datos para actualizar handler:", req.body);
    const response = await actualizaProspecto(
      idProspecto,
      cedula,
      nombres,
      apellidos,
      email,
      celular,
      direccion,
      ciudadNew,
      ciudad_anterior,
      comentarios,
      cedula_anterior,
      nombres_anterior,
      apellidos_anterior,
      tieneProcesos,
      numeroEntidades,
      tiempoMora,
      totalBienes,
      totalDeudas,
      modoContacto,
      fuente,
      servicio,
      genero,
    );

    if (response) res.status(200).json(response);
    else res.status(204).json("No se actualizo el Prospecto");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postActualizaDatosCotizacion = async (req, res) => {
  const { idProspecto, field, value } = req.body;

  try {
    const response = await actualizaDatosCotizacion(idProspecto, field, value);
    if (response) res.status(200).json(response);
    else res.status(204).json("No se actualizo el Prospecto");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postActualizaStatus = async (req, res) => {
  const { idProspecto, field, value } = req.body;

  try {
    const response = await actualizaStatus(idProspecto, field, value);
    if (response) res.status(200).json(response);
    else res.status(204).json("No se actualizo el Prospecto");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const actualizaFechaCierreHandler = async (req, res) => {
  const { idProspecto, fechaCierre } = req.body;

  try {
    const response = await actualizaFechaCierre(idProspecto, fechaCierre);
    if (response) res.status(200).json(response);
    else res.status(204).json("No se actualizo el Prospecto");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postActualizaCalificacion = async (req, res) => {
  const { idProspecto, field, value } = req.body;

  try {
    const response = await actualizaCalificacion(idProspecto, field, value);
    if (response) res.status(200).json(response);
    else res.status(204).json("No se actualizo el Prospecto");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const corregirAcentosProspectos = async (req, res) => {
  try {
    const response = await corregirAcentos();
    if (response) res.status(200).json(response);
    else res.status(204).json("No se corrigieron los Prospectos");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createDeudasHandler = async (req, res) => {
  const { deudas, cedulaProspecto, deleteDeudas } = req.body;
  console.log("body handler crear deudas:", req.body);

  try {
    const response = await createDeudas(deudas, cedulaProspecto, deleteDeudas);
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

const postHonorariosHandler = async (req, res) => {
  const {
    cedulaProspecto,
    honorarios,
    deleteDeudas,
    honorarios_letras,
    honorariosLiquidacion_letras,
    saldoHonorarios,
    saldoHonorariosUnificado,
    totalDeudas,
    // planpagos,
    // planpagosUnificado,
  } = req.body;

  const {
    inicial,
    cuotasHonorarios,
    valorHonorarios,
    honorariosLiquidacion,
    valorRadicar,
  } = honorarios;
  console.log("body handler honorarios:", req.body);

  try {
    const response = await guardaHonorarios(
      cedulaProspecto,
      inicial,
      cuotasHonorarios,
      valorHonorarios,
      honorariosLiquidacion,
      deleteDeudas,
      honorarios_letras,
      honorariosLiquidacion_letras,
      saldoHonorarios,
      saldoHonorariosUnificado,
      totalDeudas,
      valorRadicar,
      // planpagos,
      // planpagosUnificado
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postBienesHandler = async (req, res) => {
  const { bienes, cedulaProspecto } = req.body;
  console.log("body handler crear bienes:", req.body);

  try {
    const response = await createBienes(bienes, cedulaProspecto);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const copyBienesHandler = async (req, res) => {
  const { cedulaProspecto } = req.body;
  console.log("body handler copiar bienes:", req.body);

  try {
    const response = await copyBienes(cedulaProspecto);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postCotizacionHandler = async (req, res) => {
  const {
    bienes,
    cedulaProspecto,
    ingresos,
    gastos,
    posibleCuota,
    totalBienes,
    totalBienes_letras,
    totalDeudas,
    totalDeudas_letras,
    valorRadicar_letras,
  } = req.body;
  console.log("body handler crear cotizacion:", req.body);

  try {
    const response = await createCotizacion(
      cedulaProspecto,
      ingresos,
      gastos,
      posibleCuota.mensual,
      totalBienes,
      totalBienes_letras,
      totalDeudas,
      totalDeudas_letras,
      valorRadicar_letras,
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const copyCotizacionHandler = async (req, res) => {
  const { cedulaProspecto } = req.body;
  console.log("body handler copiar cotizacion:", req.body);

  try {
    const response = await copyCotizacion(cedulaProspecto);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postPropuestasHandler = async (req, res) => {
  const { propuestas, cedulaProspecto } = req.body;
  console.log("body handler crear propuestas:", req.body);

  try {
    const response = await createPropuestas(propuestas, cedulaProspecto);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const copyPropuestasHandler = async (req, res) => {
  const { cedulaProspecto } = req.body;
  console.log("body handler copiar propuestas:", req.body);

  try {
    const response = await copyPropuestas(cedulaProspecto);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
  prospectosHandler,
  prospectosCasosHandler,
  prospectosDetailHandler,
  postProspectosHandler,
  postProspectosAutoHandler,
  postEliminaProspectos,
  postActualizaProspectos,
  postActualizaDatosCotizacion,
  getProspectoByEmailHandler,
  corregirAcentosProspectos,
  postActualizaStatus,
  postActualizaCalificacion,
  createDeudasHandler,
  copyDeudasHandler,
  copyHonorariosHandler,
  postHonorariosHandler,
  postPropuestasHandler,
  copyPropuestasHandler,
  postBienesHandler,
  copyBienesHandler,
  postCotizacionHandler,
  copyCotizacionHandler,
  actualizaFechaCierreHandler,
};
