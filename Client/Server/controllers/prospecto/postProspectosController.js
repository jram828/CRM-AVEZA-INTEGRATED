import { models } from "../../DB.js";
import {codigoCiudades} from "../../utils/codigoCiudades.js";
import { sendEmailProspecto } from "../../utils/emailNotifier.js";

const { Prospecto, Ciudad, TipoDeCaso, TipoUsuario } = models;
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
  valor_pretensiones
) => {

  
  console.log("Body:", {
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
  });
  if (
    !email ||
    !nombres ||
    !apellidos ||
    !cedulaProspecto ||
    !celular ||
    nombres.length === 0 ||
    email.length === 0 ||
    cedulaProspecto.length === 0 ||
    celular.length === 0
  ) {
    console.log("Faltan datos.");
    // res.status(400).send("Faltan datos");
    return "Faltan datos";
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
      if(nombre_ciudad){
        const ciudadfilter = codigoCiudades.filter(
          (ciudad) => ciudad.nombre_ciudad === nombre_ciudad.toUpperCase()
        );
        console.log("Ciudad filter:", ciudadfilter);
      
        const codigo_ciudad = ciudadfilter[0].codigo_ciudad;
        console.log("Codigo ciudad:", codigo_ciudad);
      
        console.log("ciudad:", ciudadfilter);
        newProspecto.addCiudad(codigo_ciudad);
      }
      
      // newProspecto.addTipoDeCaso(tipo_de_caso);
      // newProspecto.addTipoUsuario(tipo_usuario);

      if (newProspecto) sendEmailProspecto(newProspecto);
      console.log(newProspecto);
      return {
        ...newProspecto.toJSON(),
      };
    } catch (error) {
      console.log(error);
      // res.status(500).send(error.message);
      return error.message
    }
  }
};

export { createProspectoBd };
