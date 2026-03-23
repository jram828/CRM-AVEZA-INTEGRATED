import { models } from "../../DB.js";

const { PropuestaPago, Prospecto, Cliente } = models;

const copyPropuestas = async (cedulaProspecto) => {

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

    // 3. Obtener propuestas asociadas al prospecto desde Prospecto_Propuesta
    var propuestas = await prospecto.getPropuestaPagos(); // usa relación Prospecto <-> PropuestaPago

    if (propuestas.length === 0) {
      console.log(`ℹ️ El prospecto no tiene propuestas vinculadas`);
      return;
    }

    // 4. Asociar cada propuesta al cliente usando Cliente_Propuesta
    for (const propuesta of propuestas) {
      await cliente.addPropuestaPago(propuesta); // usa relación Cliente <-> PropuestaPago (tabla Cliente_Propuesta)
    }

    console.log(`✅ Se asociaron ${propuestas.length} propuestas al cliente con cédula ${cedulaProspecto}`);
  } catch (error) {
    console.error('❌ Error al transferir propuestas del prospecto al cliente:', error.message);
  }


  return propuestas; //Devuelve el último registro creado

};
export { copyPropuestas };
