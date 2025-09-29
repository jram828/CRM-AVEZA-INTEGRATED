import { models } from "../../DB.js";
import { Sequelize } from "sequelize";

const { Prospecto, Ciudad, Departamento, Pais, Acreedor} = models;
const getAllProspecto = async (filters) => {
  let allProspecto = [];

  if (filters.cedulaProspecto) {
    const consulta = {
      where: {
      cedulaProspecto: parseInt(filters.cedulaProspecto),
      activo: true,
      },
      include: [
      {
        model: Ciudad,
        attributes: ["nombre_ciudad", "codigo_ciudad"],
        include: [
        {
          model: Departamento,
          attributes: ["nombre_departamento"],
          include: [
          {
            model: Pais,
            attributes: ["nombre_pais"],
          },
          ],
        },
        ],
      },
      {
        model: Acreedor,
        attributes: ["idAcreedor", "NIT", "nombre", "email", "telefono", "direccion", "ciudad"], // ajusta los atributos según tu modelo
      },
      ],
    };

    const prospecto = await Prospecto.findOne(consulta);
    if (!prospecto) throw Error("Prospecto no Registrado o no existe");
    allProspecto = [prospecto];
  } else {
    const pagina = [];
    const newFilters = {};
    const newOrder = {};
    const order = [];
    const limit2 = filters.porPagina;

    if (filters.field) {
      //  si no te envian filters.order que sea por defecto asc
      // se ordena
      const ord = filters.order?.toUpperCase() || "ASC";
      order.push([filters.field, ord]);
    }

    delete filters.order;
    delete filters.field;

    Object.entries(filters).forEach(([field, value]) => {
      // destructuro filters

      if (value) {
        // verifico no sea undefind

        if (field !== "pagina" && field !== "porPagina") {
          if (value === "ord") {
            //verifico que el comando requiera ser ordnado
            newOrder[field.substring(0, field.length - 3)]; //traeme desde el cero hasta los tres anteriorres
          } else {
            newFilters[field] = {
              [Sequelize.Op.iLike]: `%${value}%`,
            }; // acá estoy guardando de forma dinamica los valores de cada propiedad
          }
        } else {
          pagina[field];
        }

        // se pueden poner mas if para formatear los valores entramtes.
        //por ejemplo: si es un correo usar value.toLowerCase()
      }
    });
    const offset = (filters.pagina - 1) * parseInt(limit2);

    const consulta = {
      where: {
        activo: true,
        ...newFilters, // agrego los campos cuyos valores existan
      },
      include: [
        {
          model: Ciudad,
          attributes: ["nombre_ciudad", "codigo_ciudad"],
          include: [
        {
          model: Departamento,
          attributes: ["nombre_departamento"],
          include: [
            {
          model: Pais,
          attributes: ["nombre_pais"],
            },
          ],
        },
          ],
        },
        {
          model: Acreedor,
          attributes: ["idAcreedor", "NIT", "nombre", "email", "telefono", "direccion", "ciudad"],
        },
      ],
      order,
      offset: offset || 0,
      limit: limit2 || 3,
    };
    allProspecto = await Prospecto.findAll(consulta);
  }

  return allProspecto;
};

export { getAllProspecto };
