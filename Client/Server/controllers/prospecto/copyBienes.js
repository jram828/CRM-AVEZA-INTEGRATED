import { models } from "../../DB.js";

const { Bien, Prospecto, Cliente } = models;

const copyBienes = async (cedulaProspecto) => {

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

    // 3. Obtener bienes asociados al prospecto desde Prospecto_Bien
    var bienes = await prospecto.getBiens(); // usa relación Prospecto <-> Bien

    if (bienes.length === 0) {
      console.log(`ℹ️ El prospecto no tiene bienes vinculados`);
      return;
    }

    // 4. Asociar cada bien al cliente usando Cliente_Bien
    for (const bien of bienes) {
      await cliente.addBien(bien); // usa relación Cliente <-> Bien (tabla Cliente_Bien)
    }

    console.log(`✅ Se asociaron ${bienes.length} bienes al cliente con cédula ${cedulaProspecto}`);
  } catch (error) {
    console.error('❌ Error al transferir bienes del prospecto al cliente:', error.message);
  }


  return bienes; //Devuelve el último registro creado

};
export { copyBienes };
