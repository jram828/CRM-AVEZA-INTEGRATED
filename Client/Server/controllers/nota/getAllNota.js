import { Sequelize } from "sequelize";
import { models } from "../../DB.js";

const { Nota, Prospecto, Abogado } = models;

function paginarArreglo(arreglo, paginaActual, tamañoPagina) {
  const indiceInicial = parseInt(paginaActual) * parseInt(tamañoPagina);
  const indiceFinal = indiceInicial + parseInt(tamañoPagina);
  return arreglo.slice(indiceInicial, indiceFinal);
}

const getAllNota = async (filters) => {
  //console.log(filters.query);
  const todos = filters.query.todos || "true";
  //console.log(filters.query.todos.trim().toUpperCase())
  //if (todos==='false') console.log('todos viene en false')
  let getAllNotaBd = [];
  // if (todos.toUpperCase() === "FALSE") {
  //console.log('Estoy en el true del if')
  getAllNotaBd = await Nota.findAll({
    include: [
      {
        model: Prospecto,
        attributes: ["idProspecto", "nombres", "apellidos", "email", "celular", "status"], 
        through: { attributes: [] }, 
      },
      {
        model: Abogado,
        attributes: ["cedulaAbogado", "nombres", "apellidos"], 
        through: { attributes: [] },
      },
    ],
  });
 
  let datos = getAllNotaBd;
  //console.log(datos)

  //Filtra de acuerdo a los parametros recibidos
  Object.entries(filters.query).forEach(([field, value]) => {
    if (
      field !== "ordenarPor" &&
      field !== "pagina" &&
      field !== "porPagina" &&
      field !== "todos"
    )
      datos = datos.filter((elemento) => elemento[field] === value);
  });

  console.log("Datos despues de filtrar:", datos);
  //Ordena de acuerdo al parametro de ordenacion recibido
  let arregloOrdenado = [];

  switch (filters.query.ordenarPor) {
    case "apellidoCliente": {
      arregloOrdenado = datos.slice().sort((a, b) => {
        if (a.apellidoCliente < b.apellidoCliente) return -1;
        if (a.apellidoCliente > b.apellidoCliente) return 1;

        // Si apellido es igual, ordena por nombre
        if (a.nombreCliente < b.nombreCliente) return -1;
        if (a.nombreCliente > b.nombreCliente) return 1;

        // Si ambos son iguales, no hay cambios en el orden
        return 0;
      });
      break;
    }
    case "apellidoAbogado": {
      arregloOrdenado = datos.slice().sort((a, b) => {
        if (a.apellidoAbogado < b.apellidoAbogado) return -1;
        if (a.apellidoAbogado > b.apellidoAbogado) return 1;

        // Si apellido es igual, ordena por nombre
        if (a.nombreAbogado < b.nombreAbogado) return -1;
        if (a.nombreAbogado > b.nombreAbogado) return 1;

        // Si ambos son iguales, no hay cambios en el orden
        return 0;
      });
      break;
    }
    case "tipoCaso": {
      arregloOrdenado = datos.slice().sort((a, b) => {
        if (a.tipoCaso < b.tipoCaso) return -1;
        if (a.tipoCaso > b.tipoCaso) return 1;

        // Si apellido es igual, ordena por nombre
        if (a.tipoCaso < b.tipoCaso) return -1;
        if (a.tipoCaso > b.tipoCaso) return 1;

        // Si ambos son iguales, no hay cambios en el orden
        return 0;
      });
      break;
    }
    default:
      arregloOrdenado = datos.slice().sort((a, b) => a.fechaCita - b.fechaCita);
  }

  //Devuelve desde la pagina solicitada y la cantidad de elementos solicitados

  let elementos = filters.query.porPagina || 30; // los elementos por pag por default
  let offset = filters.query.pagina || 1; // manda pag 1 por default
  //if (filters.query.porPagina) elementos = filters.query.porPagina;
  //if (filters.query.pagina) offset = (filters.query.pagina - 1) * parseInt(elementos);
  //console.log(arregloOrdenado)
  //console.log(datos)
  // console.log("offset....", offset, "  elementos........", elementos);
  const totalPaginas = Math.ceil(arregloOrdenado.length / elementos);
  const paginaActual = paginarArreglo(arregloOrdenado, offset - 1, elementos);

  return { datosPagina: paginaActual, totalPaginas: totalPaginas };
};

export { getAllNota };
