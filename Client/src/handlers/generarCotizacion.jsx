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
  resultadosCotizacion,
  totalDeudas_letras,
  totalBienes_letras,       
  honorarios_letras,
  valorRadicar_letras,
  honorariosLiquidacion_letras
) => {
  console.log("Datos cotizacion:", {
    caso,
    ingreso,
    gasto,
    bienes,
    deudas,
    propuestas,
    cliente,
    honorarios,
    resultadosCotizacion,

  });
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
    


    const newPropuestas = Object.keys(resultadosCotizacion)
    .filter(clase => resultadosCotizacion[clase].cuotas && resultadosCotizacion[clase].valorCuota) // Filtra las clases con valores válidos
    .map((clase, index) => ({ // Usa index como contador
        contador: index + 1, // Contador que inicia desde 1
        Clasificacion: clase,
        subtotal: formatNumero(resultadosCotizacion.totalesPorTipo[clase]) || 0, // Obtiene el subtotal, si existe
        numeroCuotas: parseInt(resultadosCotizacion[clase].cuotas, 10), // Número de cuotas
        valorCuota: formatNumero(Math.round(parseFloat(resultadosCotizacion[clase].valorCuota))) // Redondea el valor de la cuota
    }));

    console.log("Propuestas:", newPropuestas);
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
      saldoHonorarios: formatNumero(honorarios.saldoHonorarios),
      honorariosUnificado: formatNumero(honorarios.valorHonorariosUnificado),
      saldoHonorariosUnificado: formatNumero(honorarios.saldoHonorariosUnificado),
      valorRadicar: formatNumero(honorarios.valorRadicar),
      numeroCuotasUnificado: honorarios.cuotasHonorariosUnificado,
      inicial: formatNumero(honorarios.inicial),
      numeroCuotas: honorarios.cuotasHonorarios,
      totalDeudas: formatNumero(resultadosCotizacion.totalDeudas),
      totalDeudas_letras: totalDeudas_letras,
      totalBienes: formatNumero(resultadosCotizacion.totalBienes),
      totalBienes_letras: totalBienes_letras,
      gastosMensuales: formatNumero(gasto.gastosmensuales),
      honorariosLiquidacion: formatNumero(honorarios.honorariosLiquidacion),
      honorariosLiquidacion_letras: honorariosLiquidacion_letras,
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
