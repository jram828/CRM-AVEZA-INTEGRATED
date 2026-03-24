import { models } from "../../DB.js";
import { Sequelize } from "sequelize";

const { Cliente, Ciudad, Departamento, Pais, Deuda2, Honorario, Bien, Cotizacion, PropuestaPago } = models;
const getAllCliente = async (filters) => {
  let allClient = [];

  if (filters.cedulaCliente) {
    const consulta = {
      where: {
        cedulaCliente: parseInt(filters.cedulaCliente),
        activo: true,
      },
      include: [
        {
          model: Ciudad,
          attributes: ["nombre_ciudad", "codigo_ciudad"],
          through: { attributes: [] },
          include: [
            {
              model: Departamento,
              attributes: ["nombre_departamento"],
              through: { attributes: [] },
              include: [
                {
                  model: Pais,
                  attributes: ["nombre_pais"],
                  through: { attributes: [] },
                },
              ],
            },
          ],
        },
        {
          model: Honorario,
          attributes: [
            "valorHonorarios",
            "valorRadicar",
            "inicial",
            "cuotasHonorarios",
            "honorariosLiquidacion",
            "totalDeudas",
            "honorarios_letras",
            "honorariosLiquidacion_letras",
          ],
          through: { attributes: [] },
        },
        {
          model: Deuda2,
          attributes: [
            "tipoDeuda",
            "tipoGarantia",
            "acreedor",
            "derechoVoto",
            "documentoSoporte",
            "capital",
            "intereses",
            "cuantiaTotal",
            "clasificacion",
            "diasMora",
          ],
          through: { attributes: [] },
        },
        {
          model: Bien,
          through: { attributes: [] },
        },
        {
          model: Cotizacion,
          through: { attributes: [] },
        },
        {
          model: PropuestaPago,
          through: { attributes: [] },
        },
      ],
    };

    const cliente = await Cliente.findOne(consulta);
    if (!cliente) throw Error("Cliente no Registrado o no existe");
    allClient = [cliente];
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
          through: { attributes: [] },
          include: [
            {
              model: Departamento,
              attributes: ["nombre_departamento"],
              through: { attributes: [] },
              include: [
                {
                  model: Pais,
                  attributes: ["nombre_pais"],
                  through: { attributes: [] },
                },
              ],
            },
          ],
        },
        {
          model: Honorario,
          attributes: [
            "valorHonorarios",
            "valorRadicar",
            "inicial",
            "cuotasHonorarios",
            "honorariosLiquidacion",
            "totalDeudas",
            "honorarios_letras",
            "honorariosLiquidacion_letras",
          ],
          through: { attributes: [] },
        },
        {
          model: Deuda2,
          attributes: [
            "tipoDeuda",
            "tipoGarantia",
            "acreedor",
            "derechoVoto",
            "documentoSoporte",
            "capital",
            "intereses",
            "cuantiaTotal",
            "clasificacion",
            "diasMora",
          ],
          through: { attributes: [] },
        },
        {
          model: Bien,
          through: { attributes: [] },
        },
        {
          model: Cotizacion,
          through: { attributes: [] },
        },
        {
          model: PropuestaPago,
          through: { attributes: [] },
        },
      ],
      order,
      offset: offset || 0,
      limit: limit2 || 10000, //3
    };
    allClient = await Cliente.findAll(consulta);
  }

  return allClient;
};

export { getAllCliente };
