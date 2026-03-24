import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import { generarPlanPagosHonorarios } from "../utils/planPagosHonorarios";
import { fechaLetras } from "../utils/fechaLetras";

export const generarDocumentos = (cliente) => {

  const fecha = fechaLetras(new Date());

  console.log("Cliente generar documentos", cliente);
  const docs = document.getElementById("doc");


  const planpagos = generarPlanPagosHonorarios(cliente?.honorarios[0].valorHonorarios, cliente?.honorarios[0].cuotasHonorarios, cliente?.honorarios[0].inicial);
  // console.log("Plan de pagos:", planpagos);
  const deudasmod = cliente.deudas.map((deuda) => ({
    ...deuda,
    capital: Number(deuda.capital).toLocaleString(),
  }));
  console.log("Deudas del cliente generar:", deudasmod);
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

    // !Reemplazar campos en una plantilla (Documentos legales)
    doc.render({
      nombre: cliente.nombres.toUpperCase(),
      apellido: cliente.apellidos.toUpperCase(),
      cedula: Number(cliente.cedulanew).toLocaleString(),
      celular: cliente.celular,
      correo: cliente.email,
      ciudad: cliente.ciudad,
      direccion: cliente.direccion,
      fecha: fecha,
      pretensiones: Number(cliente.totalDeudas).toLocaleString(),
      pretensiones_letras: cliente.totalDeudas_letras.toUpperCase(),
      honorarios: Number(cliente.honorarios[0].valorHonorarios).toLocaleString(),
      honorarios_letras: cliente.honorarios[0].honorarios_letras.toUpperCase(),
      valorRadicar: Number(cliente.honorarios[0].valorRadicar).toLocaleString(),
      valorRadicar_letras: cliente.valorRadicar_letras.toUpperCase(),
      honorariosLiquidacion: Number(cliente.honorarios[0].honorariosLiquidacion).toLocaleString(),
      honorariosLiquidacion_letras: cliente.honorarios[0].honorariosLiquidacion_letras.toUpperCase(),
      planpagos: planpagos,
      deudas: deudasmod,
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
    saveAs(blob, `Documentos ${cliente.nombres} ${cliente.apellidos}.docx`);
  };
};
