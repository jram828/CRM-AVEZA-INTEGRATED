import { models } from "../../DB.js";
import { codigoCiudades } from "../../utils/codigoCiudades.js";

const { Prospecto, Ciudad, Pais, Departamento } = models;

const actualizaFechaCierre = async (idProspecto, fechaCierre) => {

  const [updateCount, updateClient] = await Prospecto.update(
    {
      fechaCierre: fechaCierre,
    },
    {
      where: {
        idProspecto: idProspecto,
      },
    }
  );

  const consulta = {
    where: {
      idProspecto: idProspecto,
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
    ],
  };

  const nuevoProspecto = await Prospecto.findOne(consulta);

  if (updateCount > 0) {
    return nuevoProspecto;
  } else {
    return "";
  }

  };
export { actualizaFechaCierre };
  