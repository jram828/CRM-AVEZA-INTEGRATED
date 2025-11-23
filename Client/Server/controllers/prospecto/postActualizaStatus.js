import { models } from "../../DB.js";
import { codigoCiudades } from "../../utils/codigoCiudades.js";

const { Prospecto, Ciudad, Pais, Departamento } = models;

const actualizaStatus = async (idProspecto, field, value) => {
  
  const prospectoActualizar = await Prospecto.findByPk(idProspecto);



  const [updateCount, updateClient] = await Prospecto.update(
    {
      [field]: value,
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

  // return await Abogado.create({nombre, duracion,dificultad, temporada}); //?ASI También puede ser
};
export { actualizaStatus };
