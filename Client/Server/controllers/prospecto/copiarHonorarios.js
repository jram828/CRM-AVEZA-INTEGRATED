import { models } from "../../DB.js";

const { Honorario, Prospecto, Cliente } = models;

const copiarHonorarios = async (cedulaProspecto) => {

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

    // 3. Obtener honorarios asociadas al prospecto desde Prospecto_Honorario
    const honorarios = await prospecto.getHonorarios(); // usa relación Prospecto <-> Honorario

    if (honorarios.length === 0) {
      console.log(`ℹ️ El prospecto no tiene honorarios vinculadas`);
      return;
    }

    // 4. Asociar cada honorario al cliente usando Cliente_honorario
    for (const honorario of honorarios) {
      await cliente.addHonorario(honorario); // usa relación Cliente <-> Honorario (tabla Cliente_Honorario)
    }

    console.log(`✅ Se asociaron ${honorarios.length} honorarios al cliente con cédula ${cedulaProspecto}`);
    return honorarios; 

  } catch (error) {
    console.error('❌ Error al transferir honorarios del prospecto al cliente:', error.message);
  }



};
export { copiarHonorarios };
