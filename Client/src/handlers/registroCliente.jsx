import axios from "axios";

export async function registroCliente(userDataRegistro) {
  const {
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
  } = userDataRegistro;

  console.log("User data registro:", userDataRegistro);
  
  const URL = "/clientes/registrocliente";
  try {
    await axios.post(URL, {
      email: `${email}`,
      // password: `${password}`,
      nombres: `${nombres}`,
      apellidos: `${apellidos}`,
      cedulaCliente: `${cedulaCliente}`,
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
    window.alert("Se ha registrado el cliente con éxito.");
   
  } catch (error) {
    window.alert("No fue posible registrar el cliente.");
  }
}
