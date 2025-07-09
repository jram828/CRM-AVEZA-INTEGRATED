import axios from "axios";

export async function registroProspecto(userDataRegistro) {
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

  // console.log("User data registro:", userDataRegistro);
  
  const URL = "/prospectos/registroprospecto";
  try {
    await axios.post(URL, {
      email: `${email}`,
      // password: `${password}`,
      nombres: `${nombres}`,
      apellidos: `${apellidos}`,
      cedulaProspecto: `${cedulaProspecto}`,
      celular: `${celular}`,
      direccion: `${direccion}`,
      nombre_ciudad: `${nombre_ciudad}`,
      tipo_usuario: `${tipo_usuario}`,
      tipo_de_caso: `${tipo_de_caso}`,
      forma_de_pago: `${forma_de_pago}`,
      honorarios: `${honorarios}`,
      cuotas: `${cuotas}`,
      comentarios: `${comentarios}`,
      valor_pretensiones: `${valor_pretensiones}`,
    });
    window.alert("Se ha registrado el prospecto con éxito.");
   
  } catch (error) {
    window.alert("No fue posible registrar el prospecto.");
  }
}
