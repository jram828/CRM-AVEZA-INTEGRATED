import { calendar } from "googleapis/build/src/apis/calendar/index.js";
import { getAllCita } from "../controllers/cita/getAllCita.js";
import { createCita } from "../controllers/cita/postAgregaCita.js";
import { createCitaCalendar } from "../controllers/cita/postAgregaCitaCalendar.js";
import { obtenerDisponibilidad } from "../controllers/cita/getAvailability.js";
import { getCitaById } from "../controllers/cita/getCitaById.js";
import { getAllCitaGoogle } from "../controllers/cita/getAllCitaGoogle.js";
import { completarCita } from "../controllers/cita/completarCita.js";
import { eliminarCitaCalendar } from "../controllers/cita/eliminarCitaCalendar.js";
import { actualizarCita } from "../controllers/cita/actualizarCita.js";

const getCitaHandler = async (req, res) => {
  try {
    const response = await getAllCita(req);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCitaGoogleHandler = async (req, res) => {
  const { calendarId1, calendarId2, mes } = req.query;

  console.log("Calendar IDs en el handler:", calendarId1, calendarId2, mes);
  try {
    const response = await getAllCitaGoogle(calendarId1, calendarId2, mes);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCitasByIdHandler = async (req, res) => {
  const { idProspecto } = req.params;
  try {
    const response = await getCitaById(idProspecto);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAvailabilityHandler = async (req, res) => {
  const { fecha } = req.query;
  console.log("Fecha recibida en el handler de disponibilidad:", req.query);
  try {
    const response = await obtenerDisponibilidad(fecha);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postCreateCita = async (req, res) => {
  const {
    titulo,
    descripcion,
    fechaCita,
    horaCita,
    idProspecto,
    nombres,
    apellidos,
    source,
    calendarId,
    email,
    cedulaCliente,
  } = req.body;

  console.log(
    "Datos recibidos en el handler de creación de cita:",
    req.body,
    calendarId,
  );
  try {
    const response = await createCita(
      titulo,
      descripcion,
      fechaCita,
      horaCita,
      idProspecto,
      nombres,
      apellidos,
      source,
      email,
      cedulaCliente,
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postCreateCitaGoogle = async (req, res) => {
  const {
    idProspecto,
    titulo,
    fechaCita,
    horaCita,
    email,
    calendarId,
    nombres,
    apellidos,
    descripcion,
    source,
    cedulaCliente,
  } = req.body;
  console.log(
    "Datos recibidos en el handler de creación de cita Google:",
    req.body,
  );

  const idFinal = idProspecto || cedulaCliente;
  try {
    const response = await createCitaCalendar(
      idFinal,
      titulo,
      fechaCita,
      horaCita,
      email,
      calendarId,
      nombres,
      apellidos,
      descripcion,
      source,
    );
    res.status(200).json(response);
  } catch (error) {
    f;
    res.status(400).json({ error: error.message });
  }
};

const completarCitaHandler = async (req, res) => {
  const { idCita } = req.body;
  try {
    const response = await completarCita(idCita);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const actualizarCitaHandler = async (req, res) => {
  const {
    idCita,
    fechaCita,
    horaCita,
    descripcion,
    titulo,
    idProspecto,
    cedulaCliente,
    idCitaGoogle,
    calendarId,
    email,
    nombres,
    apellidos,
    source,
  } = req.body;

  console.log("Datos recibidos para actualizar cita:", req.body);
  try {
    const response = await actualizarCita(
      idCita,
      fechaCita,
      horaCita,
      descripcion,
      titulo,
      idProspecto,
      cedulaCliente,
      idCitaGoogle,
      calendarId,
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const eliminarCitaCalendarHandler = async (req, res) => {
  const { idCitaGoogle, idCita, calendarId, source } = req.query;
  console.log("Datos recibidos para eliminar cita de calendario:", {
    idCitaGoogle,
    idCita,
    calendarId,
    source,
  });
  try {
    const response = await eliminarCitaCalendar(
      idCitaGoogle,
      idCita,
      calendarId,
      source,
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const eliminarCitaHandler = async (req, res) => {
  const { idCitaGoogle, idCita, calendarId, source } = req.params;
  try {
    const response = await eliminarCita(
      idCitaGoogle,
      idCita,
      calendarId,
      source,
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export {
  getCitaHandler,
  getCitaGoogleHandler,
  getCitasByIdHandler,
  getAvailabilityHandler,
  postCreateCita,
  postCreateCitaGoogle,
  completarCitaHandler,
  actualizarCitaHandler,
  eliminarCitaCalendarHandler,
  eliminarCitaHandler,
};
