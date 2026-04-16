import { models } from "../../DB.js";
import { codigoCiudades } from "../../utils/codigoCiudades.js";

const { Prospecto, Ciudad, Pais, Departamento, Acreedor } = models;

const actualizaProspecto = async (
  idProspecto,
  cedula,
  nombres,
  apellidos,
  email,
  celular,
  direccion,
  ciudad,
  ciudad_anterior,
  comentarios,
  cedula_anterior,
  nombres_anterior,
  apellidos_anterior,
  tieneProcesos,
  numeroEntidades,
  tiempoMora,
  totalBienes,
  totalDeudas,
  modoContacto,
  fuente,
  servicio,
  genero,
  // password,
) => {
  const cedulaProspecto = cedula;
  console.log("Cedula Prospecto controller:", cedulaProspecto);

  console.log(
    "Datos para actualizar handler:",
    idProspecto,
    cedula,
    nombres,
    apellidos,
    email,
    celular,
    direccion,
    ciudad,
    ciudad_anterior,
    comentarios,
    cedula_anterior,
    nombres_anterior,
    apellidos_anterior,
    tieneProcesos,
    numeroEntidades,
    tiempoMora,
    totalBienes,
    totalDeudas,
    modoContacto,
    fuente,
    servicio,
    genero,
    // password,
  );
  // console.log("Cedula anterior controller:", cedula_anterior);
  const ciudadfilter = codigoCiudades.filter(
    (Ciudad) => Ciudad.nombre_ciudad === ciudad.toUpperCase(),
  );
  console.log("Ciudad filter:", ciudadfilter);

  const codigo_ciudad = ciudadfilter[0]?.codigo_ciudad || 0;
  console.log("Codigo ciudad:", codigo_ciudad);

//  console.log("ciudad:", ciudadfilter);

  const prospectoActualizar = await Prospecto.findByPk(idProspecto);

  ciudad_anterior ? prospectoActualizar.removeCiudad(ciudad_anterior) : null;

let numeroEntidadesNormalizado = 0;

if (numeroEntidades !== undefined && numeroEntidades !== null) {
  const valor =
    typeof numeroEntidades === "string"
      ? numeroEntidades.trim()
      : numeroEntidades;

  numeroEntidadesNormalizado = parseInt(valor, 10);

  if (isNaN(numeroEntidadesNormalizado)) {
    numeroEntidadesNormalizado = 0;
  }
}
  const [updateCount, updateClient] = await Prospecto.update(
    {
      cedulaProspecto: cedulaProspecto,
      nombres: nombres,
      apellidos: apellidos,
      email: email,
      celular: celular,
      direccion: direccion,
      comentarios: comentarios,
      tieneProcesos: tieneProcesos,
      numeroEntidades: numeroEntidadesNormalizado,
      tiempoMora: tiempoMora,
      totalBienes: totalBienes,
      totalDeudas: totalDeudas,
      modoContacto: modoContacto,
      fuente: fuente,
      servicio: servicio,
      genero: genero,
      activo: true,
      // password: password,
    },
    {
      where: {
        idProspecto: idProspecto,
      },
    },
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
        through: { attributes: [] },
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
