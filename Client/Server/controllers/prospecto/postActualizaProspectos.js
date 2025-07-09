import { models } from "../../DB.js";
import { codigoCiudades } from "../../utils/codigoCiudades.js";

const { Prospecto, Ciudad, Pais, Departamento } = models;

const actualizaProspecto = async (
  cedula,
  nombres,
  apellidos,
  email,
  celular,
  direccion,
  ciudad,
  ciudad_anterior,
  comentarios,
  cedula_anterior
  // password,
) => {
  const cedulaProspecto = cedula;
  // console.log('Cedula Prospecto controller:', cedulaProspecto)
  // console.log("Cedula anterior controller:", cedula_anterior);
    const ciudadfilter = codigoCiudades.filter(
      (Ciudad) => Ciudad.nombre_ciudad === ciudad.toUpperCase()
    );
    // console.log("Ciudad filter:", ciudadfilter);

    const codigo_ciudad = ciudadfilter[0].codigo_ciudad;
    // console.log("Codigo ciudad:", codigo_ciudad);

  // console.log("ciudad:", ciudadfilter);
  
  const prospectoActualizar = await Prospecto.findByPk(cedula_anterior);

  prospectoActualizar.removeCiudad(ciudad_anterior);

  const [updateCount, updateClient] = await Prospecto.update(
    { cedulaProspecto: cedulaProspecto,
      nombres: nombres,
      apellidos: apellidos,
      email: email,
      celular: celular,
      direccion: direccion,
      comentarios: comentarios
      // password: password,
    },
    {
      where: {
        cedulaProspecto: cedula_anterior,
      },
    }
  );
  
      const consulta = {
        where: {
          cedulaProspecto: parseInt(cedulaProspecto),
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
  nuevoProspecto.addCiudad(codigo_ciudad);

  if (updateCount > 0) {

    return nuevoProspecto;
  } else {
    return "";
  }

  // return await Abogado.create({nombre, duracion,dificultad, temporada}); //?ASI También puede ser
};
export { actualizaProspecto };
