import { models } from "../../DB.js";
import { codigoCiudades } from "../../utils/codigoCiudades.js";
import { sendEmailProspecto } from "../../utils/emailNotifier.js";

const { Prospecto } = models;

export async function postProspectoAut(userDataRegistro) {
  const {
    email,
    nombres,
    apellidos,
    cedula,
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
    impuestoLaboral,
    vehiculoCooperativas,
    hipotecario,
    proveedores,
    bancoPersonas,
    familiares,
    tieneBienes,
    bienes,
    totalBienes,
    totalDeudas,
    modoContacto,
  } = userDataRegistro;

  const ciudadfilter = codigoCiudades.filter(
    (ciudad) => ciudad.nombre_ciudad === nombre_ciudad?.toUpperCase(),
  );
  const codigo_ciudad = ciudadfilter[0]?.codigo_ciudad || 0;

  console.log("Codigo ciudad encontrado:", codigo_ciudad);

  if (
    !email ||
    !nombres ||
    !apellidos ||
    !celular ||
    nombres.length === 0 ||
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

      // convertir celular a número si no lo es
      const celularParsed =
        typeof celular === "number"
          ? celular
          : (() => {
              const cleaned = String(celular || "").replace(/\D/g, "");
              const n = cleaned ? Number(cleaned) : NaN;
              return Number.isFinite(n) ? n : null;
            })();

      if (prospecto) {
        console.log(
          "Prospecto ya existente, actualizando:",
          prospecto.idProspecto,
        );

        await prospecto.update({
          cedulaProspecto: cedula,
          email,
          nombres,
          apellidos,
          celular: celularParsed,
          direccion,
          forma_de_pago,
          honorarios,
          cuotas,
          comentarios,
          valor_pretensiones,
          impuestoLaboral,
          vehiculoCooperativas,
          hipotecario,
          proveedores,
          bancoPersonas,
          familiares,
          tieneBienes,
          bienes,
          totalBienes,
          totalDeudas,
          modoContacto,
        });

        if (codigo_ciudad !== 0) {
          await prospecto.addCiudad(codigo_ciudad); // actualizar relación
        }

        return { ...prospecto.toJSON() };
      }

      // Si no existe, crear nuevo
      const newProspecto = await Prospecto.create({
        cedulaProspecto: cedula,
        email,
        nombres,
        apellidos,
        celular: celularParsed,
        direccion,
        forma_de_pago,
        honorarios,
        cuotas,
        comentarios,
        valor_pretensiones,
        impuestoLaboral,
        vehiculoCooperativas,
        hipotecario,
        proveedores,
        bancoPersonas,
        familiares,
        tieneBienes,
        bienes,
        totalBienes,
        totalDeudas,
        modoContacto,
      });

      if (codigo_ciudad !== 0) {
        await newProspecto.addCiudad(codigo_ciudad);
      }

      return newProspecto;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}
