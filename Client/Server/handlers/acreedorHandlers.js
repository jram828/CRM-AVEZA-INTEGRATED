import { deleteAcreedor } from "../controllers/acreedor/deleteAcreedor.js";
import { getAcreedorById } from "../controllers/acreedor/getAcreedorById.js";
import { getAllAcreedores } from "../controllers/acreedor/getAllAcreedores.js";
import { createAcreedor } from "../controllers/acreedor/postAcreedor.js";
import { actualizaAcreedor } from "../controllers/acreedor/actualizaAcreedor.js";
import { deleteDuplicatesAcreedor } from "../controllers/acreedor/deleteDuplicatesAcreedor copy.js";

const getAcreedoresHandler = async (req, res) => {
  let response;

  try {
    response = await getAllAcreedores(req.query);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

// Creando Acreedores
// todo esto a continuacion puedo enviarlo como un objeto para evitar errores, pero debo modificarlo en todos los modulos que esten
const postAcreedorHandler = async (req, res) => {
  const {
    NIT,
    email,
    nombre,
    direccion,
    ciudad,
    telefono,
    idProspecto,
  } = req.body;

  console.log("body crear Acreedor:", {
    NIT,
    email,
    nombre,
    direccion,
    ciudad,
    telefono,
    idProspecto,
  });

  try {
    const response = await createAcreedor(
      NIT,
      email,
      nombre,
      direccion,
      ciudad,
      telefono,
      idProspecto
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  // res.status(200).send(`creando actividades`);
};

const getAcreedorDetailHandler = async (req, res) => {
  const { cedulaAcreedor } = req.params;
  try {
    console.log("Cedula Acreedor handler:", cedulaAcreedor);
    const response = await getAcreedorById(cedulaAcreedor);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json((error = error.message));
  }
};

const deleteAcreedorHandler = async (req, res) => {
  const { NIT } = req.body;
  try {
    const response = await deleteAcreedor(NIT);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteDuplicatesAcreedorHandler = async (req, res) => {
  const { NIT } = req.body;
  try {
    const response = await deleteDuplicatesAcreedor(NIT);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postActualizaAcreedor = async (req, res) => {
  console.log("Body actualiza Acreedor: ", req.body);
  const {
    NITnew,
    NIt_anterior,
    email,
    nombre,
    direccion,
    nombre_ciudad,
    telefono,
    idProspecto,
  } = req.body;

  const cedulaAcreedor = cedulanew;

  try {
    const response = await actualizaAcreedor(
      NITnew,
      NIt_anterior,
      email,
      nombre,
      direccion,
      nombre_ciudad,
      telefono,
      idProspecto
    );
    if (response) res.status(200).json(response);
    else res.status(204).json("No se actualizo el Acreedor");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
  getAcreedoresHandler,
  getAcreedorDetailHandler,
  postAcreedorHandler,
  deleteAcreedorHandler,
  deleteDuplicatesAcreedorHandler,
  postActualizaAcreedor,
};
