import { models } from "../../DB.js";
import { Sequelize } from "sequelize";
import moment from "moment-timezone";

const {
  Cliente,
  Ciudad,
  Departamento,
  Pais,
  Deuda2,
  Honorario,
  Bien,
  Cotizacion,
  PropuestaPago,
  Nota,
  Cita,
  Tarea,
} = models;

// función auxiliar para enriquecer clientes
const enrichClientes = (clientes) => {
  const now = new Date();

  return clientes.map((cliente) => {
    // Actividades: citas y tareas ya incluidas en el cliente
    const citasP = (cliente.Cita || []).map((c) => ({
      type: "cita",
      date: new Date(c.fechaCita),
      title: c.titulo,
    }));

    const tareasP = (cliente.Tareas || []).map((t) => ({
      type: "tarea",
      date: new Date(t.fechaVencimiento),
      title: t.asunto,
    }));

    const combined = [...citasP, ...tareasP].filter((a) => !isNaN(a.date));
    let latestActivity = null;

    if (combined.length > 0) {
      const future = combined.filter((a) => a.date >= now);
      const past = combined.filter((a) => a.date < now);

      if (future.length > 0) {
        latestActivity = future.reduce((prev, curr) =>
          curr.date < prev.date ? curr : prev,
        );
      } else if (past.length > 0) {
        latestActivity = past.reduce((prev, curr) =>
          curr.date > prev.date ? curr : prev,
        );
      }
    }

    // Nota más reciente ya incluida en el cliente
    let notaReciente = null;
    if (cliente.Nota && cliente.Nota.length > 0) {
      const latest = cliente.Nota.reduce((prev, curr) => {
        const prevDate = new Date(prev.updatedAt || prev.createdAt).getTime();
        const currDate = new Date(curr.updatedAt || curr.createdAt).getTime();
        return currDate > prevDate ? curr : prev;
      });
      notaReciente = latest;
    }

    // Calcular color, tooltip e iconType
    let color = "disabled";
    let tooltip = "Sin actividad";
    let iconType = null;

    if (latestActivity) {
      const nowBogota = moment.tz("America/Bogota").startOf("day");
      const activityDate = moment
        .tz(latestActivity.date, "America/Bogota")
        .startOf("day");

      if (activityDate.isBefore(nowBogota)) {
        color = "error.main";
      } else if (activityDate.isSame(nowBogota)) {
        color = "warning.main";
      } else {
        color = "success.main";
      }

      tooltip = latestActivity.title;
      iconType = latestActivity.type === "cita" ? "calendar" : "task";
    }

    return {
      ...cliente.toJSON(),
      latestActivity,
      color,
      tooltip,
      iconType,
      notaReciente,
    };
  });
};

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
            newFilters[field] = Sequelize.where(
              Sequelize.fn("unaccent", Sequelize.col(field)),
              {
                [Sequelize.Op.iLike]: `%${value}%`,
              },
            );
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
        {
          model: Nota,
          through: { attributes: [] },
        },
        {
          model: Cita,
          through: { attributes: [] },
        },
        {
          model: Tarea,
          through: { attributes: [] },
        },
      ],
      order,
      offset: offset || 0,
      limit: limit2 || 10000, //3
    };
    allClient = await Cliente.findAll(consulta);
  }
  return enrichClientes(allClient);
};

export { getAllCliente };
