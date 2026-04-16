import { models } from "../../DB.js";
import { codigoCiudades } from "../../utils/codigoCiudades.js";
import { sendEmailProspecto } from "../../utils/emailNotifier.js";

const { Prospecto } = models;

const createProspectoBd = async (
  email,
  nombres,
  apellidos,
  cedulaProspecto,
  celular,
  direccion,
  nombre_ciudad,
  tipo_usuario,
  tipo_de_caso,
  forma_de_pago,
  honorarios,
  cuotas,
  comentarios,
  valor_pretensiones,
  tieneProcesos,
  responsable,
  fuente,
  genero,
  totalBienes,
  tiempoMora,
  numeroEntidades,
  servicio,
  fase,
  status,
  totalDeudas,
) => {
  console.log("Body crear prospecto controller:", {
    email,
    nombres,
    apellidos,
    cedulaProspecto,
    celular,
    direccion,
    nombre_ciudad,
    tipo_usuario,
    tipo_de_caso,
    forma_de_pago,
    honorarios,
    cuotas,
    comentarios,
    valor_pretensiones,
    tieneProcesos,
    responsable,
    fuente,
    genero,
    totalBienes,
    tiempoMora,
    numeroEntidades,
    servicio,
    fase,
    status,
    totalDeudas,
  });

  if (
    !email ||
    !nombres ||
    !apellidos ||
    !celular ||
    nombres.length === 0 ||
    apellidos.length === 0 ||
    email.length === 0 ||
    celular.length === 0
  ) {
    console.log("Faltan datos.");
    return "Faltan datos";
  } else {
    try {
      // 👇 Verificar si ya existe prospecto con email y celular
      let prospecto = await Prospecto.findOne({
        where: {
          email,
          celular,
        },
      });

      if (prospecto) {
        console.log(
          "Prospecto ya existe, actualizando:",
          prospecto.idProspecto,
        );

        await prospecto.update({
          nombres,
          apellidos,
          cedulaProspecto,
          celular,
          direccion,
          comentarios,
          tieneProcesos,
          responsable,
          fuente,
          genero,
          totalBienes,
          tiempoMora,
          numeroEntidades,
          servicio,
          fase,
          status,
          totalDeudas,
        });

        if (nombre_ciudad) {
          const ciudadfilter = codigoCiudades.filter(
            (ciudad) => ciudad.nombre_ciudad === nombre_ciudad.toUpperCase(),
          );
          if (ciudadfilter.length > 0) {
            const codigo_ciudad = ciudadfilter[0].codigo_ciudad;
            await prospecto.setCiudads([codigo_ciudad]); // actualizar relación
          }
        }

        return { ...prospecto.toJSON() };
      }

      // Si no existe, crear nuevo
      const newProspecto = await Prospecto.create({
        email,
        nombres,
        apellidos,
        celular,
        direccion,
        comentarios,
        tieneProcesos,
        responsable,
        fuente,
        genero,
        totalBienes,
        tiempoMora,
        numeroEntidades,
        servicio,
        fase,
        status,
        totalDeudas,
        cedulaProspecto: cedulaProspecto && cedulaProspecto !== "" ? cedulaProspecto : null,
      });

      if (nombre_ciudad) {
        const ciudadfilter = codigoCiudades.filter(
          (ciudad) => ciudad.nombre_ciudad === nombre_ciudad.toUpperCase(),
        );
        if (ciudadfilter.length > 0) {
          const codigo_ciudad = ciudadfilter[0].codigo_ciudad;
          await newProspecto.addCiudad(codigo_ciudad);
        }
      }

      // if (newProspecto) sendEmailProspecto(newProspecto);
      console.log(newProspecto);
      return { ...newProspecto.toJSON() };
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
};

export { createProspectoBd };
