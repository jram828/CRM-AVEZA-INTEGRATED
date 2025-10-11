import { models } from "../../DB.js";
import { codigoCiudades } from "../../utils/codigoCiudades.js";
import fs from "fs";
import path from "path";
import { models as models2 } from "../../DB2.js";


// Utilidad para exportar toda la información de la base de datos a un archivo JSON
export const dbBackUp = async () => {
  try {
    const tables = Object.keys(models);
    const exportData = {};

    for (const table of tables) {
      // Evita modelos internos de Sequelize
      if (typeof models[table].findAll === "function") {
        const rows = await models[table].findAll({ raw: true });
        exportData[table] = rows;
      }
    }

    const exportPath = path.resolve("database_export.json");
    fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2), "utf-8");
    console.log(`Datos exportados a ${exportPath}`);

    const importPath = path.resolve("database_export.json");
    if (!fs.existsSync(importPath)) {
      console.error("El archivo database_export.json no existe.");
      return;
    }

    const data = JSON.parse(fs.readFileSync(importPath, "utf-8"));
    const tablesImport = Object.keys(data);

    for (const table of tablesImport) {
      if (models2[table] && typeof models2[table].bulkCreate === "function") {
        // Limpia la tabla antes de importar (opcional, según necesidad)
        await models2[table].destroy({ where: {}, truncate: true });
        await models2[table].bulkCreate(data[table]);
        console.log(`Datos importados en la tabla ${table}`);
      } else {
        console.warn(`Modelo ${table} no encontrado en la nueva base de datos.`);
      }
    }
    console.log("Importación completada.");

  } catch (err) {
    console.error("Error exportando la base de datos:", err);
  }
};

// Descomenta la siguiente línea para ejecutar la exportación cuando se ejecute este archivo
// exportDatabase();
// Utilidad para importar información desde un archivo JSON y guardarla en la nueva base de datos
export const importDatabase = async () => {
  try {
    
  } catch (err) {
    console.error("Error importando la base de datos:", err);
  }
};

// Descomenta la siguiente línea para ejecutar la importación cuando se ejecute este archivo
// importDatabase();
