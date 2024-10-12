// import { models } from "../../DB.js";
// const Abogado=models.Abogado

// const getAbogadoById = async (cedulaAbogado) => {
//   console.log(cedulaAbogado);
//   const abogado = await Abogado.findByPk(cedulaAbogado);
//   if (!abogado) throw Error("Abogado no Registrado o no existe");
//   return abogado;
// };

// export {
//   getAbogadoById,
// };

import { models } from "../../DB.js";

const { Abogado, Ciudad, Departamento, Pais } = models;
const getAbogadoById = async (cedulaAbogado) => {
  console.log("Cedula abogado controller:", cedulaAbogado);
  const consulta = {
    where: {
      cedulaAbogado: parseInt(cedulaAbogado),
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

  const abogado = await Abogado.findOne(consulta);

  console.log('Abogado encontrado:', abogado)
  if (!abogado) throw Error("Abogado no existe");
  return abogado;
};

export { getAbogadoById };