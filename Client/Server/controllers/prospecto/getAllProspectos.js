import { models } from "../../DB.js";
import { Sequelize } from "sequelize";
import moment from "moment-timezone";

const {
  Prospecto,
  Ciudad,
  Departamento,
  Pais,
  Acreedor,
  Bien,
  Cotizacion,
  PropuestaPago,
  Deuda2,
  Honorario,
  Nota,
  Cita,
  Tarea,
} = models;

// función auxiliar para enriquecer prospectos
const enrichProspectos = (prospectos) => {
  const now = new Date();

  return prospectos.map((prospecto) => {

    // Actividades: citas y tareas ya incluidas en el prospecto
    const citasP = (prospecto.Cita || []).map((c) => ({
      type: "cita",
      date: new Date(c.fechaCita),
      title: c.titulo,
    }));

    const tareasP = (prospecto.Tareas || []).map((t) => ({
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

    // Nota más reciente ya incluida en el prospecto
    let notaReciente = null;
    if (prospecto.Nota && prospecto.Nota.length > 0) {
      const latest = prospecto.Nota.reduce((prev, curr) => {
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
      ...prospecto.toJSON(),
      latestActivity,
      color,
      tooltip,
      iconType,
      notaReciente,
    };
  });
};

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
          attributes: [
            "idAcreedor",
            "NIT",
            "nombre",
            "email",
            "telefono",
            "direccion",
            "ciudad",
          ], // ajusta los atributos según tu modelo
        },
        {
          model: Bien,
          through: { attributes: [] },
        },
        {
          model: Deuda2,
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
          model: Honorario,
          through: { attributes: [] },
        },
      ],
    };

    const prospecto = await Prospecto.findOne(consulta);
    if (!prospecto) throw Error("Prospecto no Registrado o no existe");
    allProspecto = [prospecto];
  } else if (filters.celular) {
    const consulta = {
      where: {
        celular: filters.celular,
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
          attributes: [
            "idAcreedor",
            "NIT",
            "nombre",
            "email",
            "telefono",
            "direccion",
            "ciudad",
          ],
        },
        {
          model: Bien,
          through: { attributes: [] },
        },
        {
          model: Deuda2,
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
          model: Honorario,
          through: { attributes: [] },
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
          attributes: [
            "idAcreedor",
            "NIT",
            "nombre",
            "email",
            "telefono",
            "direccion",
            "ciudad",
          ],
        },
        {
          model: Bien,
          through: { attributes: [] },
        },
        {
          model: Deuda2,
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
          model: Honorario,
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
      limit: limit2 || 100000,
    };
    allProspecto = await Prospecto.findAll(consulta);
  }
  // enriquecer prospectos antes de devolver
  return enrichProspectos(allProspecto);
};;

export { getAllProspecto };
