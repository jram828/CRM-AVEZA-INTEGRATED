import { models } from "../../DB.js";
import { codigoCiudades } from "../../utils/codigoCiudades.js";
import { sendEmailProspecto } from "../../utils/emailNotifier.js";

const { Prospecto, Ciudad, TipoDeCaso, TipoUsuario } = models;

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
    (ciudad) => ciudad.nombre_ciudad === nombre_ciudad.toUpperCase()
  );
  const codigo_ciudad = ciudadfilter[0]?.codigo_ciudad || 0;
  console.log("Codigo ciudad:", codigo_ciudad);

  console.log("ciudad:", ciudadfilter);
  console.log("Body post prospecto:", {
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
  });
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
    res.status(400).send("Faltan datos");
  } else {
    try {
      const newProspecto = await Prospecto.create({
        cedulaProspecto: cedula,
        email: email,
        nombres: nombres,
        apellidos: apellidos,
        celular: celular,
        direccion: direccion,
        forma_de_pago: forma_de_pago,
        honorarios: honorarios,
        cuotas: cuotas,
        comentarios: comentarios,
        valor_pretensiones: valor_pretensiones,
        impuestoLaboral: impuestoLaboral,   
        vehiculoCooperativas: vehiculoCooperativas,
        hipotecario: hipotecario,
        proveedores: proveedores,
        bancoPersonas: bancoPersonas,
        familiares: familiares,
        tieneBienes: tieneBienes,
        bienes: bienes,
        totalBienes: totalBienes,
        totalDeudas: totalDeudas,
        modoContacto: modoContacto,
      });

      codigo_ciudad === 0 ? newProspecto.addCiudad(codigo_ciudad) : null;
      // newProspecto.addTipoDeCaso(tipo_de_caso);
      // newProspecto.addTipoUsuario(tipo_usuario);

      return newProspecto;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}
