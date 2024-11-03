import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";

export const generarSolicitud = (
  ingresos,
  gastos,
  bienes,
  procesos,
  obligaciones,
  sociedades,
  deudas,
  propuestas,
  motivos,
  cliente,
  listaAcreedores
) => {
  console.log("Datos solicitud:", {
    ingresos,
    gastos,
    bienes,
    procesos,
    obligaciones,
    sociedades,
    deudas,
    propuestas,
    motivos,
    cliente,
    ciudad: cliente.Ciudads[0].nombre_ciudad,
    listaAcreedores,
  });
  const docs = document.getElementById("doc");

  const newAcreedores = listaAcreedores.map((acreedor, index) => ({
    contador: index + 1,
    nombreAcreedor: acreedor.nombre,
    NIT: acreedor.NIT,
    direccionAcreedor: acreedor.direccion,
    ciudadAcreedor: acreedor.ciudad,
    telefono: acreedor.telefono,
    emailAcreedor: acreedor.email,
  }));

  const datosinsolvencia = {
    ingresos,
    gastos,
    bienes,
    procesos,
    obligaciones,
    sociedades,
    deudas,
    propuestas,
    motivos,
    cliente,
    ciudad: cliente.Ciudads[0].nombre_ciudad,
    acreedores: newAcreedores,
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

    // !Reemplazar contenido de array en una tabla
    doc.render({
      nombre: cliente.nombres,
      apellido: cliente.apellidos,
      celular: cliente.celular,
      cedula: cliente.cedula,
      direccion: cliente.direccion,
      ciudad: cliente.Ciudads[0].nombre_ciudad,
      ingresos: ingresos,
      motivos: motivos.motivos,
      bienes: bienes,
      procesos: procesos,
      obligaciones: obligaciones,
      sociedades: sociedades,
      acreedores: newAcreedores,
      deudas: deudas,
      propuestas: propuestas,
      energia: Number(gastos[0].energia).toLocaleString(),
      gas: Number(gastos[0].gas).toLocaleString(),
      agua: Number(gastos[0].aguaAlcAseo).toLocaleString(),
      telecomunicaciones: Number(gastos[0].telecomunicaciones).toLocaleString(),
      television: Number(gastos[0].television).toLocaleString(),
      arriendo: Number(gastos[0].arriendo).toLocaleString(),
      seguros: Number(gastos[0].seguros).toLocaleString(),
      alimentacion: Number(gastos[0].alimentacion).toLocaleString(),
      transporte: Number(gastos[0].transporte).toLocaleString(),
      otros: Number(gastos[0].otros).toLocaleString(),
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
    saveAs(blob, `Solicitud Insolvencia.docx`);
  };

  return datosinsolvencia;
};
