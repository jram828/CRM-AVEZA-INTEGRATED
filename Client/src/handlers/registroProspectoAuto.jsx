import axios from "axios";

export async function registroProspectoAuto(userDataRegistro) {
  const {
    email,
    nombres,
    apellidos,
    cedulaProspecto,
    celular,
    direccion,
    nombreEnviar,
    tipo_usuario,
    tipo_de_caso,
    forma_de_pago,
    honorarios,
    cuotas,
    comentarios,
    valor_pretensiones,
    totalDeudas,
  } = userDataRegistro;

  console.log("User data registro:", userDataRegistro);
  
  const URL = "/prospectos/registroprospectoauto";
  try {
   const {data} = await axios.post(URL, {
      email: `${email}`,
      // password: `${password}`,
      nombres: `${nombres}`,
      apellidos: `${apellidos}`,
      cedulaProspecto: `${cedulaProspecto}`,
      celular: `${celular}`,
      direccion: `${direccion}`,
      nombre_ciudad: `${nombreEnviar}`,
      tipo_usuario: `${tipo_usuario}`,
      tipo_de_caso: `${tipo_de_caso}`,
      forma_de_pago: `${forma_de_pago}`,
      honorarios: `${honorarios}`,
      cuotas: `${cuotas}`,
      comentarios: `${comentarios}`,
      valor_pretensiones: `${valor_pretensiones}`,
      totalDeudas: `${totalDeudas}`,
    });
    // window.alert("Se ha registrado el prospecto con éxito.");
   
    console.log("Response registro prospecto auto:", data);
    return data;
  } catch (error) {
    // window.alert("No fue posible registrar el prospecto.");
  }
}
