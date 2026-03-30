// const eliminarCita = async (idCita, idSource, source) => {
//   const cita = await Cita.findByPk(idCita);
//   if (!cita) throw Error("Cita no encontrada");

//   if (source === "prospecto") {
//     const prospecto = await Prospecto.findByPk(idSource);
//     if (!prospecto) throw Error("Prospecto no encontrado");

//     // Elimina la asociación en la tabla intermedia
//     await cita.removeProspecto(prospecto);

//     return { mensaje: "Asociación cita-prospecto eliminada correctamente" };
//   }

//   if (source === "cliente") {
//     const cliente = await Cliente.findByPk(idSource);
//     if (!cliente) throw Error("Cliente no encontrado");

//     // Elimina la asociación en la tabla intermedia
//     await cita.removeCliente(cliente);

//     return { mensaje: "Asociación cita-cliente eliminada correctamente" };
//   }

//   return { mensaje: "Cita encontrada, pero sin asociación eliminada" };
// };
