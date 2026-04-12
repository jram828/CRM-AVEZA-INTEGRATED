import { models } from "../DB.js";
import { Op } from "sequelize";
import moment from "moment";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { sendMail } from "./emailNotifier.js";
const { EMAIL_NOTIFICACION } = process.env;

const { Prospecto } = models;

export const procesarProspectosDescartados = async () => {
  const ahora = moment();

  // 1. Buscar prospectos descartados y activos
  const descartados = await Prospecto.findAll({
    where: {
      status: "descartado",
      activo: true,
    },
  });

  // 2. Generar archivo Excel con prospectos desactivados
  if (descartados.length > 0) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Prospectos desactivados");

    // Cabeceras dinámicas según propiedades del modelo
    const columnas = Object.keys(descartados[0].toJSON()).map((key) => ({
      header: key,
      key,
      width: 20,
    }));
    worksheet.columns = columnas;

    // Agregar filas
    descartados.forEach((prospecto) => {
      worksheet.addRow(prospecto.toJSON());
    });

    // Guardar temporalmente el archivo
    const filePath = path.join(process.cwd(), "prospectos_desactivados.xlsx");
    await workbook.xlsx.writeFile(filePath);

    for (const prospecto of descartados) {
      prospecto.activo = false;
      await prospecto.save();
    }

    // 3. Enviar correo con el archivo adjunto
    const html = `<p>Se han eliminado ${antiguos.length} prospectos inactivos.</p>`;
    await sendMail({
      to: EMAIL_NOTIFICACION, 
      subject: "Reporte de Prospectos Eliminados",
      html,
      attachments: [
        {
          filename: "prospectos_desactivados.xlsx",
          path: filePath,
        },
      ],
    });

    fs.unlinkSync(filePath);
  }

  // 4. Buscar prospectos inactivos sin actualización en 60 días
  const limite = ahora.subtract(60, "days").toDate();

  const antiguos = await Prospecto.findAll({
    where: {
      activo: false,
      fechaActualizacion: { [Op.lt]: limite },
    },
  });

  // 5. Generar archivo Excel con prospectos eliminados
  if (antiguos.length > 0) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Prospectos Eliminados");

    // Cabeceras dinámicas según propiedades del modelo
    const columnas = Object.keys(antiguos[0].toJSON()).map((key) => ({
      header: key,
      key,
      width: 20,
    }));
    worksheet.columns = columnas;

    // Agregar filas
    antiguos.forEach((prospecto) => {
      worksheet.addRow(prospecto.toJSON());
    });

    // Guardar temporalmente el archivo
    const filePath2 = path.join(process.cwd(), "prospectos_eliminados.xlsx");
    await workbook.xlsx.writeFile(filePath2);

    // 6. Enviar correo con el archivo adjunto
    const html = `<p>Se han eliminado ${antiguos.length} prospectos inactivos.</p>`;
    await sendMail({
      to: EMAIL_NOTIFICACION, // ajusta destinatario
      subject: "Reporte de Prospectos Eliminados",
      html,
      attachments: [
        {
          filename: "prospectos_eliminados.xlsx",
          path: filePath2,
        },
      ],
    });

    // Eliminar archivo temporal después de enviar

    fs.unlinkSync(filePath2);

    // Finalmente eliminar de la BD
    for (const prospecto of antiguos) {
      await prospecto.destroy();
    }
  }

  return {
    actualizados: descartados.map((p) => p.idProspecto),
    eliminados: antiguos.map((p) => p.idProspecto),
  };
};
