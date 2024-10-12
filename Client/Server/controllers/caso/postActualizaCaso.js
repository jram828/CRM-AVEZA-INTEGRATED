import { models } from "../../DB.js";
import { codigoCiudades } from "../../utils/codigoCiudades.js";

const { Cliente, Ciudad, Pais, Departamento } = models;

const actualizaCaso = async (
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
  const cedulaCliente = cedula;
  console.log('Cedula cliente controller:', cedulaCliente)
  console.log("Cedula anterior controller:", cedula_anterior);
    const ciudadfilter = codigoCiudades.filter(
      (Ciudad) => Ciudad.nombre_ciudad === ciudad.toUpperCase()
    );
    console.log("Ciudad filter:", ciudadfilter);

    const codigo_ciudad = ciudadfilter[0].codigo_ciudad;
    console.log("Codigo ciudad:", codigo_ciudad);

  console.log("ciudad:", ciudadfilter);
  
  const clienteActualizar = await Cliente.findByPk(cedula_anterior);

  clienteActualizar.removeCiudad(ciudad_anterior);

  const [updateCount, updateClient] = await Cliente.update(
    { cedulaCliente: cedulaCliente,
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
        cedulaCliente: cedula_anterior,
      },
    }
  );
  
      const consulta = {
        where: {
          cedulaCliente: parseInt(cedulaCliente),
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

      const nuevoCaso = await Caso.findOne(consulta);
  // nuevoCliente.addCiudad(codigo_ciudad);

  if (updateCount > 0) {

    return nuevoCaso;
  } else {
    return "";
  }

  // return await Abogado.create({nombre, duracion,dificultad, temporada}); //?ASI También puede ser
};
export { actualizaCaso };
