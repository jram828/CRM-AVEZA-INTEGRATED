import cron from "node-cron";
import { procesarProspectosDescartados } from "../utils/dbCleanUp.js";

console.log('📦 dbCleanUpCron.js cargado correctamente');

cron.schedule(
  "0 18 * * 5",
  async () => {
    console.log("⏰ Ejecutando limpieza de prospectos descartados...");
    try {
      const resultado = await procesarProspectosDescartados();
      console.log("✅ Limpieza de prospectos completada:", resultado);
    } catch (error) {
      console.error("❌ Error en limpieza de prospectos:", error);
    }
  },
  {
    scheduled: true,
    timezone: "America/Bogota",
  },
);
