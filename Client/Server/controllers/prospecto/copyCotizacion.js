import { models } from "../../DB.js";

const { Cotizacion, Prospecto, Cliente } = models;

const copyCotizacion = async (cedulaProspecto) => {

  console.log("cedulaProspecto controller:", cedulaProspecto);

  try {
    // 1. Buscar el cliente por cédula (PK)
    const cliente = await Cliente.findByPk(cedulaProspecto);
    if (!cliente) {
      console.warn(`❌ Cliente no encontrado: ${cedulaProspecto}`);
      return;
    }

    // 2. Buscar el prospecto por cédula
    const prospecto = await Prospecto.findOne({
      where: { cedulaProspecto }
    });
    if (!prospecto) {
      console.warn(`❌ Prospecto no encontrado: ${cedulaProspecto}`);
      return;
    }

    // 3. Obtener cotizaciones asociadas al prospecto desde Prospecto_Cotizacion
    var cotizaciones = await prospecto.getCotizacions(); // usa relación Prospecto <-> Cotizacion

    if (cotizaciones.length === 0) {
      console.log(`ℹ️ El prospecto no tiene cotizaciones vinculadas`);
      return;
    }

    // 4. Asociar cada cotizacion al cliente usando Cliente_Cotizacion
    for (const cotizacion of cotizaciones) {
      await cliente.addCotizacion(cotizacion); // usa relación Cliente <-> Cotizacion (tabla Cliente_Cotizacion)
    }

    console.log(`✅ Se asociaron ${cotizaciones.length} cotizaciones al cliente con cédula ${cedulaProspecto}`);
  } catch (error) {
    console.error('❌ Error al transferir cotizaciones del prospecto al cliente:', error.message);
  }


  return cotizaciones; //Devuelve el último registro creado

};
export { copyCotizacion };
