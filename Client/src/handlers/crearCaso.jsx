import axios from "axios";

export async function postCaso(data) {
  const {
    radicado,
    juzgado,
    cedulaAbogado,
    cedulaCliente,
    fecha,
    fechaFin,
    descripcion,
    TipoDeCasoid,
    honorarios,
    valor_pretensiones,
    cuotas,
    forma_de_pago,
  } = data;
  // console.log("data del post", data);

  const fechaValida = new Date(fecha);
 var fechaVer; 
    // Comprobar si la fecha es inválida
    if (isNaN(fechaValida.getTime())) {
        // Si no es válida, asignar la fecha actual
        const hoy = new Date();
        fechaVer = hoy.toISOString()//.split('T')[0]; // Retornar solo la fecha en formato YYYY-MM-DD
    } else {
        // Si la fecha es válida, retornar la fecha existente
       fechaVer = fechaValida.toISOString()//.split('T')[0];
    }


  const URL = "/casos";
  try {
    await axios.post(URL, {
      radicado: `${radicado}`,
      juzgado: `${juzgado}`,
      cedulaCliente: `${cedulaCliente}`,
      cedulaAbogado: `${cedulaAbogado}`,
      fecha: `${fechaVer}`,
      fechaFin: `${fechaFin}`,
      descripcion: `${descripcion}`,
      TipoDeCasoid: `${TipoDeCasoid}`,
      honorarios: `${honorarios}`,
      valor_pretensiones: `${valor_pretensiones}`,
      forma_de_pago: `${forma_de_pago}`,
      cuotas: `${cuotas}`,
    });
    window.alert("Se ha registrado el caso con éxito.");
  } catch (error) {
    window.alert("No fue posible registrar el caso.");
  }
}
