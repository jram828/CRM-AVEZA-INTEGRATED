import { deleteAbogado } from "../controllers/controllersAbogados/deleteAbogado.js";
import { getAbogadoById } from "../controllers/controllersAbogados/getAbogadoById.js";
import { getAllAbogados } from "../controllers/controllersAbogados/getAllAbogados.js";
import { createAbogadoBd } from "../controllers/controllersAbogados/postAbogadosController.js";
import { actualizaAbogado } from "../controllers/controllersAbogados/postActualizaAbogado.js";

const getAbogadosHandler = async (req, res) => {
  let response;
  
  try {
    
    response = await getAllAbogados(req.query);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

// Creando Abogados
// todo esto a continuacion puedo enviarlo como un objeto para evitar errores, pero debo modificarlo en todos los modulos que esten
const postAbogadosHandler = async (req, res) => {
  const {
      email,
      nombres,
      apellidos,
      cedulaAbogado,
      celular,
      direccion,
      nombre_ciudad,
      tarjetaProf,
      password,
      administrador,
  } = req.body;

  console.log("body crear abogado:", {
    email,
    nombres,
    apellidos,
    cedulaAbogado,
    celular,
    direccion,
    nombre_ciudad,
    tarjetaProf,
    password,
    administrador,
  });

  try {
    const response = await createAbogadoBd(
      email,
      nombres,
      apellidos,
      cedulaAbogado,
      celular,
      direccion,
      nombre_ciudad,
      tarjetaProf,
      password,
      administrador
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  // res.status(200).send(`creando actividades`);
};

const getAbogadoDetailHandler = async (req, res) => {
  const { cedulaAbogado } = req.params;
  try {
    console.log('Cedula abogado handler:', cedulaAbogado)
    const response = await getAbogadoById(cedulaAbogado);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json((error = error.message));
  }
};

const deleteAbogadoHandler = async (req, res) => {
  const { cedulaAbogado } = req.body;
  try {
    const response = await deleteAbogado(cedulaAbogado);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postActualizaAbogado = async (req, res) => {
  console.log('Body actualiza abogado: ', req.body)
  const {
    cedulanew,
    tarjetaProf,
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

  const cedulaAbogado = cedulanew;

  try {
    const response = await actualizaAbogado(
      cedulaAbogado,
      tarjetaProf,
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
    else res.status(204).json("No se actualizo el abogado");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
  getAbogadosHandler,
  getAbogadoDetailHandler,
  postAbogadosHandler,
  deleteAbogadoHandler,
  postActualizaAbogado,
};
