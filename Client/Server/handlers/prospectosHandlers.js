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
  console.log("Body post prospecto handler:", req.body);
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
      valor_pretensiones
    );
    console.log("Response crear prospecto", response);
    if (response) res.status(200).json(response);
    else res.status(200).send("La cedula ya existe");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postEliminaProspectos = async (req, res) => {
  const { cedulaProspecto } = req.body;

  try {
    const response = await eliminaProspecto(cedulaProspecto);
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
  } = req.body;

  const cedula = cedulanew;

  try {
    console.log("Cedula anterior handler:", cedula_anterior);
    const response = await actualizaProspecto(
      idProspecto,
      cedula,
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
      apellidos_anterior
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

const corregirAcentosProspectos = async (req, res) => {
  
  try {
    const response = await corregirAcentos();
    if (response) res.status(200).json(response);
    else res.status(204).json("No se corrigieron los Prospectos");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
  prospectosHandler,
  prospectosCasosHandler,
  prospectosDetailHandler,
  postProspectosHandler,
  postEliminaProspectos,
  postActualizaProspectos,
  postActualizaDatosCotizacion,
  getProspectoByEmailHandler,
  corregirAcentosProspectos,
};
