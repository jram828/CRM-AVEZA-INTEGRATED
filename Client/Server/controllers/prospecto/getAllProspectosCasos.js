import { models } from "../../DB.js";
import { Sequelize } from "sequelize";

const { Prospecto, Ciudad, Departamento, Pais} = models;
const getAllProspectoCasos = async (filters) => {
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

    const prospecto = await Prospecto.findOne(consulta);
    if (!prospecto) throw Error("Prospecto no Registrado o no existe");
    allProspecto = [prospecto];
  } else {
    

    const consulta = {
      where: {
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
    allProspecto = await Prospecto.findAll(consulta);
  }

  return allProspecto;
};

export { getAllProspectoCasos };
