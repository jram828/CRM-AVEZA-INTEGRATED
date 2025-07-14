import { models } from "../../DB.js";
import {codigoCiudades} from "../../utils/codigoCiudades.js";
import { sendEmailProspecto } from "../../utils/emailNotifier.js";

const { Prospecto, Ciudad, TipoDeCaso, TipoUsuario } = models;


export async function postProspectoAut(userDataRegistro) {
  const {
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
  } = userDataRegistro;



  const ciudadfilter = codigoCiudades.filter(
    (ciudad) => ciudad.nombre_ciudad === nombre_ciudad.toUpperCase()
  );
  const codigo_ciudad = ciudadfilter[0].codigo_ciudad;
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
        cedulaProspecto: cedulaProspecto,
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
      });

      newProspecto.addCiudad(codigo_ciudad);
      newProspecto.addTipoDeCaso(tipo_de_caso);
      newProspecto.addTipoUsuario(tipo_usuario);

      return newProspecto;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
};

