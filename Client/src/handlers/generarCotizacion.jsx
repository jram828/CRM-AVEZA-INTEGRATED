import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import { formatNumero } from "../utils/formatNumero";

export const generarCotizacion = (
  caso,
  ingreso,
  gasto,
  bienes,
  deudas,
  propuestas,
  cliente,
  honorarios,
  resultadosCotizacion
) => {
  // console.log("Datos cotizacion:", {
  //   caso,
  //   ingreso,
  //   gasto,
  //   bienes,
  //   deudas,
  //   propuestas,
  //   cliente,
  //   honorarios,
  //   resultadosCotizacion,
  // });
  const docs = document.getElementById("doc");

  const datoscotizacion = {
    caso,
    ingreso,
    gasto,
    bienes,
    deudas,
    propuestas,
    cliente,
    honorarios,
    resultadosCotizacion,
  };

  const reader = new FileReader();
  if (docs.files.length === 0) {
    alert("No files selected");
  }
  reader.readAsBinaryString(docs.files.item(0));

  reader.onerror = function (evt) {
    console.log("error reading file", evt);
    alert("error reading file" + evt);
  };
  reader.onload = function (evt) {
    const content = evt.target.result;
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    const newDeudas = deudas.map((deuda) => ({
      ...deuda,
      capital: formatNumero(deuda.capital),
    }));

    const newBienes = bienes.map((bien) => ({
      ...bien,
      valor: formatNumero(bien.valor),
    }));

    const newPropuestas = propuestas.map((propuesta) => ({
      ...propuesta,
      valorCuota: formatNumero(propuesta.valorCuota),
    }));

    // !Reemplazar contenido de array en una tabla
    doc.render({
      nombre: cliente.nombres,
      apellido: cliente.apellidos,
      celular: cliente.celular,
      cedula: cliente.cedula,
      direccion: cliente.direccion,
      ciudad: cliente.Ciudads[0].nombre_ciudad,
      fecha: new Date().toLocaleDateString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      ingresosMensuales: formatNumero(ingreso.Valor),
      bienes: newBienes,
      deudas: newDeudas,
      honorarios: formatNumero(honorarios.valorHonorarios),
      inicial: formatNumero(honorarios.inicial),
      numeroCuotas: honorarios.cuotasHonorarios,
      totalDeudas: formatNumero(resultadosCotizacion.totalDeudas),
      totalBienes: formatNumero(resultadosCotizacion.totalBienes),
      gastosMensuales: formatNumero(gasto.gastosmensuales),
      honorariosLiquidacion: formatNumero(honorarios.honorariosLiquidacion),
      propuestas: newPropuestas,
      registro:
        resultadosCotizacion.sujetoRegistro === "si"
          ? "Si (x) No ()"
          : "Si () No (x)",
    });

    const blob = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: "DEFLATE",
    });
    // Output the document using Data-URI
    saveAs(blob, `Cotización  ${cliente.nombres} ${cliente.apellidos}.docx`);
  };

  return datoscotizacion;
};
