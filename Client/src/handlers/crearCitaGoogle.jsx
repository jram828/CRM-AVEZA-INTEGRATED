import axios from "axios";

export async function postCitaGoogleHandlers(data) {
  const {
    titulo,
    descripcion, 
    fechaCita, 
    horaCita,
    email,
    calendarId,
    nombres,
    apellidos,
  } = data;
  console.log("data del post", data);


  try {
    await axios.post('citas/google', {
      titulo: `${titulo}`,
      descripcion: `${descripcion}`,
      fechaCita: `${fechaCita}`,
      horaCita: `${horaCita}`,
      email: `${email}`,
      calendarId: `${calendarId}`,
      nombres: `${nombres}`,
      apellidos: `${apellidos}`,
    });
    window.alert("Se ha registrado la cita con éxito.");
  } catch (error) {
    // window.alert("No fue posible registrar la cita.");
  }
}