import { models } from "../../DB.js";
import { codigoCiudades } from "../../utils/codigoCiudades.js";

const { Abogado, Ciudad, Pais, Departamento } = models;

const actualizaAbogado = async (
  cedulaAbogado,
  tarjetaProf,
  nombres,
  apellidos,
  email,
  celular,
  direccion,
  ciudad,
  ciudad_anterior,
  comentarios,
  cedula_anterior
) => {
  // console.log('imagen',imagen)
  console.log("Datos controller actualiza abogado:", {
    cedulaAbogado,
    tarjetaProf,
    nombres,
    apellidos,
    email,
    celular,
    direccion,
    ciudad,
    ciudad_anterior,
    comentarios,
    cedula_anterior,
  });
  console.log("Cedula Abogado controller:", cedulaAbogado);
  console.log("Cedula anterior controller:", cedula_anterior);
  const ciudadfilter = codigoCiudades.filter(
    (Ciudad) => Ciudad.nombre_ciudad === ciudad.toUpperCase()
  );
  console.log("Ciudad filter:", ciudadfilter);

  const codigo_ciudad = ciudadfilter[0].codigo_ciudad;
  console.log("Codigo ciudad:", codigo_ciudad);

  console.log("ciudad:", ciudadfilter);

  const AbogadoActualizar = await Abogado.findByPk(cedula_anterior);

  AbogadoActualizar.removeCiudad(ciudad_anterior);

  const [updateCount, updateClient] = await Abogado.update(
    {
      cedulaAbogado: cedulaAbogado,
      tarjetaProf: tarjetaProf,
      nombres: nombres,
      apellidos: apellidos,
      email: email,
      celular: celular,
      direccion: direccion,
      comentarios: comentarios,
      // password: password,
    },
    {
      where: {
        cedulaAbogado: cedula_anterior,
      },
    }
  );

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

  const nuevoAbogado = await Abogado.findOne(consulta);
  nuevoAbogado.addCiudad(codigo_ciudad);

  if (updateCount > 0) {
    return nuevoAbogado;
  } else {
    return "";
  }
};
export { actualizaAbogado };
