import { Sequelize } from "sequelize";
import { models } from "../../DB.js";

const { Nota, Caso, Cliente, Abogado, TipoDeCaso } = models;

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
  if (todos.toUpperCase() === "FALSE") {
    //console.log('Estoy en el true del if')
    getAllNotaBd = await Nota.findAll({
      where: {
        fechaNota: {
          [Sequelize.Op.gt]: Sequelize.literal("CURRENT_DATE"),
        },
      },
      attributes: ["idNota", "titulo", "descripcion", "fechaNota", "horaNota"],
      include: [
        {
          model: Caso,
          attributes: ["idCaso", "fecha", "descripcion"],
          include: [
            {
              model: Cliente,
              attributes: ["apellidos", "nombres"],
            },
            {
              model: Abogado,
              attributes: ["apellidos", "nombres"],
            },
            {
              model: TipoDeCaso,
              attributes: ["descripcion"],
            },
          ],
        },
      ],
    });
  } else {
    getAllNotaBd = await Nota.findAll({
      attributes: ["idNota", "titulo", "descripcion", "fechaNota", "horaNota"],
      include: {
        model: Caso,
        model: Caso,
        as: "Caso",
        foreignKey: "idCaso", // Especifica el campo de clave foránea en Nota
        targetKey: "idCaso",
        attributes: ["idCaso", "fecha", "descripcion"],
        include: [
          {
            model: Cliente,
            attributes: ["apellidos", "nombres"],
          },
          {
            model: Abogado,
            attributes: ["apellidos", "nombres"],
          },
          {
            model: TipoDeCaso,
            attributes: ["descripcion"],
          },
        ],
      },
    });
  }

  //Obtiene los campos a devolver
  let datos = getAllNotaBd.map((elemento) => ({
    idNota: elemento.idNota,
    titulo: elemento.titulo,
    descripcion: elemento.descripcion,
    fechaNota: elemento.fechaNota,
    horaNota: elemento.horaNota,
    idCaso: elemento.Caso.idCaso,
    fechaCaso: elemento.Caso.fecha,
    descripcionCaso: elemento.Caso.descripcion,
    nombreCliente: elemento.Caso.Cliente.nombres,
    apellidoCliente: elemento.Caso.Cliente.apellidos,
    nombreabogado: elemento.Caso.Abogado.nombres,
    apellidoAbogado: elemento.Caso.Abogado.apellidos,
    tipoCaso: elemento.Caso.TipoDeCaso.descripcion,
  }));

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
      arregloOrdenado = datos.slice().sort((a, b) => a.fechaNota - b.fechaNota);
  }

  //Devuelve desde la pagina solinotada y la cantidad de elementos solinotados

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
