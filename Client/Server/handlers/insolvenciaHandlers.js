import { crearAcreedores } from "../controllers/insolvencia/crearAcreedores.js";
import { crearSolicitud } from "../controllers/insolvencia/crearSolicitud.js";
import { getAllAcreedores } from "../controllers/insolvencia/getAllAcreedores.js";
import { getSolicitudCedula } from "../controllers/insolvencia/getSolicitudByCedula.js";


const crearAcreedoresHandler = async (req, res) => {
  try {
    const response = await crearAcreedores(req.query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllAcreedoresHandler = async (req, res) => {
  try {
    const response = await getAllAcreedores(req.query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const crearSolicitudHandler = async (req, res) => {
  try {
    const response = await crearSolicitud(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSolicitudByCedulaHandler = async (req, res) => {
  console.log(req.params);
  const { cedula } = req.params;
  try {
    const response = await getSolicitudCedula(cedula);
    console.log('Response handler get solicitud:', response)
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export { crearAcreedoresHandler, getAllAcreedoresHandler, crearSolicitudHandler, getSolicitudByCedulaHandler  };