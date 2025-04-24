import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import { generarPlanPagosHonorarios } from "../utils/planPagosHonorarios";
import { fechaLetras } from "../utils/fechaLetras";

export const generarDocumentos = (
  caso,
  valor_pretensiones_letras,
  honorarios_letras,
  honorariosLiquidacion_letras,
) => {

  const fecha = fechaLetras(new Date());

  // console.log("caso generar documentos", caso);
  const docs = document.getElementById("doc");


  const planpagos = generarPlanPagosHonorarios(caso.honorarios, caso.cuotas, caso.porcentajeInicial);
  // console.log("Plan de pagos:", planpagos);
  
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

    // !Reemplazar contenido de array en una tabla
    // doc.render({
    //   clientes: clientes,
    // });

    // !Reemplazar campos en una plantilla (Documentos legales)
    doc.render({
      nombre: caso.Cliente.nombres.toUpperCase(),
      apellido: caso.Cliente.apellidos.toUpperCase(),
      cedula: Number(caso.ClienteCedulaCliente).toLocaleString(),
      celular: caso.Cliente.celular,
      correo: caso.Cliente.email,
      ciudad: caso.Cliente.Ciudads[0].nombre_ciudad,
      direccion: caso.Cliente.direccion,
      fecha: fecha,
      pretensiones: Number(caso.valor_pretensiones).toLocaleString(),
      pretensiones_letras: valor_pretensiones_letras.toUpperCase(),
      honorarios: Number(caso.honorarios).toLocaleString(),
      honorarios_letras: honorarios_letras.toUpperCase(),
      honorariosLiquidacion: Number(caso.honorariosLiquidacion).toLocaleString(),
      honorariosLiquidacion_letras: honorariosLiquidacion_letras.toUpperCase(),
      planpagos: planpagos,
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
    saveAs(blob, `Documentos ${caso.Cliente.nombres} ${caso.Cliente.apellidos}.docx`);
  };
};
