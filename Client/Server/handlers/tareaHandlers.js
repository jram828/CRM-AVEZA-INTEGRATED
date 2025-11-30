import { completarTarea } from "../controllers/tarea/completarTarea.js";
import { getAllTarea } from "../controllers/tarea/getAllTarea.js";
import { getTareaById } from "../controllers/tarea/getTareaById.js";
import { createTarea } from "../controllers/tarea/postAgregaTarea.js";

const getTareaHandler = async (req, res) => {
  try {
    const response = await getAllTarea(req);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const selectTareaHandler = async (req, res) => {
  try {
    const response = await selectTarea(req);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const tareasByIdHandler = async (req, res) => {
  try {
    const response = await getTareaById(req);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const completarTareaHandler = async (req, res) => {
  const { idTarea } = req.body;
  try {
    const response = await completarTarea(idTarea);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postCreateTareaHandler = async (req, res) => {
  const {
    idProspecto,
    asunto,
    fechaVencimiento,
    recordatorio,
    tipoRecordatorio,
    repetir,
    frecuencia,
    repeticiones,
  } = req.body;
  console.log("Datos recibidos en el handler de creación de tarea:", req.body);
  const email = req.body.email || process.env.EMAIL_NOTIFICACION;
  try {
    const response = await createTarea(
      idProspecto,
      asunto,
      fechaVencimiento,
      recordatorio,
      tipoRecordatorio,
      repetir,
      frecuencia,
      repeticiones,
      email
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
  getTareaHandler,
  selectTareaHandler,
  postCreateTareaHandler,
  tareasByIdHandler,
  completarTareaHandler,
};
