import { models } from "../../DB.js";
import { Sequelize } from "sequelize";

const { Cliente, Ciudad, Departamento, Pais} = models;
const getAllClienteCasos = async (filters) => {
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
      ],
    };

    const cliente = await Cliente.findOne(consulta);
    if (!cliente) throw Error("Cliente no Registrado o no existe");
    allClient = [cliente];
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
    allClient = await Cliente.findAll(consulta);
  }

  return allClient;
};

export { getAllClienteCasos };
