import { models } from "../../DB.js";
import { codigoCiudades } from "../../utils/codigoCiudades.js";
const { ACCOUNTSID, AUTHTOKEN, NUMBER } = process.env;
import twilio from "twilio";

const Abogado = models.Abogado;

const createAbogadoBd = async (
  email,
  nombres,
  apellidos,
  cedulaAbogado,
  celular,
  direccion,
  nombre_ciudad,
  tarjetaProf,
  password,
  administrador
) => {
  const ciudadfilter = codigoCiudades.filter(
    (ciudad) => ciudad.nombre_ciudad === nombre_ciudad.toUpperCase()
  );
  console.log("Ciudad filter:", ciudadfilter);

  const codigo_ciudad = ciudadfilter[0].codigo_ciudad;
  console.log("Codigo ciudad:", codigo_ciudad);

  console.log("ciudad:", ciudadfilter);

  // console.log('imagen',imagen)
  console.log(cedulaAbogado);
  console.log("Datos abogado:", {
    email,
    nombres,
    apellidos,
    cedulaAbogado,
    celular,
    direccion,
    nombre_ciudad,
    tarjetaProf,
    password,
    administrador
  });
  try {
    const newAbogado = await Abogado.create({
      email,
      nombres,
      apellidos,
      cedulaAbogado,
      celular,
      direccion,
      nombre_ciudad,
      tarjetaProf,
      password,
      administrador
    });

          newAbogado.addCiudad(codigo_ciudad);
    const client = new twilio(ACCOUNTSID, AUTHTOKEN);
    const telefono = "+573204746006";
    client.messages
      .create({
        body: "Se ha creado un nuevo Abogado en CRM AVEZA!",
        from: NUMBER,
        to: telefono,
      })
      .then((message) => console.log(message.sid))
      .done();
    return newAbogado;
  } catch (error) {
    console.log(error);
  }
};

export { createAbogadoBd };
