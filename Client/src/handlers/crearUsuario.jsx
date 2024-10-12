import axios from "axios";
import { codigoCiudades } from "../utils/codigoCiudades.js";

export async function crearUsuario(userDataCrear) {
  const {
    email,
    password,
    nombres,
    apellidos,
    cedula,
    celular,
    direccion,
    nombre_ciudad,
    tipo_usuario,
  } = userDataCrear;
  
  console.log("Userdata: ", userDataCrear);

  const ciudad = codigoCiudades.filter(
    (ciudad) => ciudad.nombre_ciudad === nombre_ciudad.toUpperCase()
  );

  console.log("Codigo ciudad Userdata: ", ciudad);
  // const URL = "/crearusuario";
  try {
    await axios.post("/usuarios", {
      email: `${email}`,
      password: `${password}`,
      nombres: `${nombres}`,
      apellidos: `${apellidos}`,
      cedula: `${cedula}`,
      celular: `${celular}`,
      direccion: `${direccion}`,
      nombre_ciudad: [`${ciudad[0].codigo_ciudad}`],
      tipo_usuario: `${tipo_usuario}`,
    });
    window.alert("Usuario creado con éxito.");
   
  } catch (error) {
    window.alert("No fue posible crear el usuario.");
  }
}
