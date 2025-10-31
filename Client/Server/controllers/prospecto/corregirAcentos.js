import { models } from "../../DB.js";
import iconv from "iconv-lite";
import { Op } from "sequelize";
const { Prospecto} = models;

const corregirTexto = (texto) => {
  try {
    // Convierte el texto mal codificado (como si viniera en latin1)
    const buffer = Buffer.from(texto, "binary");
    return iconv.decode(buffer, "utf-8");
  } catch (err) {
    console.warn("⚠️ Error al decodificar:", texto);
    return texto;
  }
};

export const corregirAcentos = async () => {
  try {
    const prospectos = await Prospecto.findAll({
      where: {
        // Filtra por patrones comunes de codificación incorrecta
        [Op.or]: [
          { nombres: { [Op.like]: "%Ã%" } },
          { apellidos: { [Op.like]: "%Ã%" } },
        ],
      },
    });

    console.log(`🔍 Se encontraron ${prospectos.length} prospectos para corregir.`);

    for (const prospecto of prospectos) {
      const nombresCorregido = corregirTexto(prospecto.nombres);
      const apellidosCorregido = corregirTexto(prospecto.apellidos);

      await prospecto.update({
        nombres: nombresCorregido,
        apellidos: apellidosCorregido,
      });

      console.log(`✅ Prospecto ${prospecto.id} corregido: ${nombresCorregido} ${apellidosCorregido}`);
    }
    console.log("🎉 Corrección de acentos completada.");
  return  "🎉 Corrección de acentos completada."
    
  } catch (error) {
    console.error("❌ Error al corregir prospectos:", error.message);
    return "❌ Error al corregir prospectos:" + error.message;
  }
};