import { models } from "../../DB.js";
import { codigoCiudades } from "../../utils/codigoCiudades.js";
import { sendEmailCliente } from "../../utils/emailNotifier.js";

const { Cliente } = models;

const createClienteBd = async (
  email,
  nombres,
  apellidos,
  cedulaCliente,
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
  console.log("Body crear cliente controller:", {
    email,
    nombres,
    apellidos,
    cedulaCliente,
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
      // 👇 Verificar si ya existe cliente con email y celular
      let cliente = await Cliente.findOne({
        where: {
          email: email,
          celular: celular,
        },
      });

      if (cliente) {
        console.log(
          "Cliente ya existente, actualizando:",
          cliente.cedulaCliente,
        );

        await cliente.update({
          nombres,
          apellidos,
          cedulaCliente,
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
            await cliente.setCiudads([codigo_ciudad]); // actualizar relación
          }
        }

        return { ...cliente.toJSON() };
      }

      // Si no existe, crear nuevo
      const newCliente = await Cliente.create({
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
        cedulaCliente,
      });

      if (nombre_ciudad) {
        const ciudadfilter = codigoCiudades.filter(
          (ciudad) => ciudad.nombre_ciudad === nombre_ciudad.toUpperCase(),
        );
        if (ciudadfilter.length > 0) {
          const codigo_ciudad = ciudadfilter[0].codigo_ciudad;
          await newCliente.addCiudad(codigo_ciudad);
        }
      }

      // if (newCliente) sendEmailCliente(newCliente);
      console.log(newCliente);
      return { ...newCliente.toJSON() };
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
};

export { createClienteBd };
