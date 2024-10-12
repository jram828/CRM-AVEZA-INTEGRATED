import { createCaso } from "../controllers/caso/postAgregaCaso.js";
import { getAllCaso } from "../controllers/caso/getAllCaso.js";
import { finCaso } from "../controllers/caso/finCaso.js";
import { deleteCaso } from "../controllers/caso/deleteCaso.js";
import { getCasoId } from "../controllers/caso/getCasoById.js";
import { actualizaCaso } from "../controllers/caso/postActualizaCaso.js";

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
    console.log('Req get caso handler:', req.query)
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
    console.log('Response handler get caso:', response)
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const finCasoHandler = async (req, res) => {
  const { idCaso, fechaFin } = req.body;
  console.log('body handler fin:', req.body)

  try {
    const response = await finCaso(idCaso, fechaFin);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteCasoHandler = async (req, res) => {
  const { idCaso} = req.body;
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
  } = req.body;

  const cedula = cedulanew;

  try {
    console.log("Cedula anterior handler:", cedula_anterior);
    const response = await actualizaCaso(
      cedula,
      nombres,
      apellidos,
      email,
      celular,
      direccion,
      ciudad,
      ciudad_anterior,
      comentarios,
      cedula_anterior
    );
    if (response) res.status(200).json(response);
    else res.status(204).json("No se actualizo el caso");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
  createCasosHandler,
  getCasoHandler,
  finCasoHandler,
  deleteCasoHandler,
  getTipoDeCasoByIdHandler,
  postActualizaCaso,
};
