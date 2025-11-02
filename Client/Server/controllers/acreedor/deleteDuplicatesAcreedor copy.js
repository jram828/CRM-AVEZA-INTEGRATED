import { models } from "../../DB.js";

/*
  deleteAcreedor(NIT?)
  - Si se pasa NIT: busca todos los registros con ese NIT y elimina los duplicados (mantiene el primero).
  - Si no se pasa NIT: revisa toda la tabla, agrupa por NIT y elimina duplicados por cada grupo (mantiene el primer registro por NIT).
*/
const deleteDuplicatesAcreedor = async (NIT) => {
  const Acreedor = models.Acreedor;

  try {
    // Obtener registros (si NIT está dado, solo los de ese NIT)
    const where = NIT ? { NIT } : {};
    const registros = await Acreedor.findAll({
      where,
      order: [["idAcreedor", "ASC"]], // mantener el de menor id
      attributes: ["idAcreedor", "NIT"],
      raw: true,
    });

    if (!registros.length) return "No se encontraron registros";

    // Agrupar por NIT y recolectar ids a borrar (mantener el primer id de cada grupo)
    const idsAEliminar = [];
    const grupos = new Map();
    for (const r of registros) {
      const key = r.NIT ?? "__NULL__";
      if (!grupos.has(key)) grupos.set(key, []);
      grupos.get(key).push(r.idAcreedor);
    }

    for (const ids of grupos.values()) {
      if (ids.length > 1) {
        // mantener el primero (por orden id asc), borrar el resto
        idsAEliminar.push(...ids.slice(1));
      }
    }

    if (!idsAEliminar.length) return "No hay duplicados para eliminar";

    const deletedCount = await Acreedor.destroy({
      where: { idAcreedor: idsAEliminar },
    });

    return `${deletedCount} registros duplicados eliminados`;
  } catch (error) {
    // Propagar error para manejo externo
    throw error;
  }
};

export { deleteDuplicatesAcreedor };