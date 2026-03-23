import { models } from "../../DB.js";

const { Deuda2, Prospecto, Cliente } = models;

const copyDeudas = async (cedulaProspecto) => {

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

    // 3. Obtener deudas asociadas al prospecto desde Prospecto_Deuda
    var deudas = await prospecto.getDeuda2s(); // usa relación Prospecto <-> Deuda2

    if (deudas.length === 0) {
      console.log(`ℹ️ El prospecto no tiene deudas vinculadas`);
      return;
    }

    // 4. Asociar cada deuda al cliente usando Cliente_Deuda
    for (const deuda of deudas) {
      await cliente.addDeuda2(deuda); // usa relación Cliente <-> Deuda2 (tabla Cliente_Deuda)
    }

    console.log(`✅ Se asociaron ${deudas.length} deudas al cliente con cédula ${cedulaProspecto}`);
  } catch (error) {
    console.error('❌ Error al transferir deudas del prospecto al cliente:', error.message);
  }


  return deudas; //Devuelve el último registro creado

};
export { copyDeudas };
