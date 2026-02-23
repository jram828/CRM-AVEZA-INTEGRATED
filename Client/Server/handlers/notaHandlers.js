import { completarNota } from "../controllers/nota/completarNota.js";
import { getAllNota } from "../controllers/nota/getAllNota.js";
import { getNotaById } from "../controllers/nota/getNotaById.js";
import { createNota } from "../controllers/nota/postAgregaNota.js";

const getNotaHandler = async (req, res) => {
  try {
    const response = await getAllNota(req);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const selectNotaHandler = async (req, res) => {
  try {
    const response = await selectNota(req);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const notasByIdHandler = async (req, res) => {
  const { idProspecto } = req.params;

  try {
    const response = await getNotaById(idProspecto);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const completarNotaHandler = async (req, res) => {
  const { idNota } = req.body;
  try {
    const response = await completarNota(idNota);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postCreateNotaHandler = async (req, res) => {
  const { idProspecto, descripcion, source, cedulaCliente } = req.body;
  console.log("Datos recibidos en el handler de creación de nota:", req.body);

  const idFinal = idProspecto || cedulaCliente;
  try {
    const response = await createNota(idFinal, descripcion, source);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
  getNotaHandler,
  selectNotaHandler,
  postCreateNotaHandler,
  notasByIdHandler,
  completarNotaHandler,
};
