import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import { formatNumero } from "../utils/formatNumero";

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

  const sumaCapitalDeudas = formatNumero(deudas.reduce((acumulador, deuda) => acumulador + deuda.capital, 0));
  const sumaGastos = formatNumero(Number(gastos.energia) + Number(gastos.gas) + Number(gastos.aguaAlcAseo) + Number(gastos.telecomunicaciones) + Number(gastos.television) + Number(gastos.arriendo) + Number(gastos.seguros) + Number(gastos.alimentacion) + Number(gastos.transporte) + Number(gastos.otros));
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
    sumaCapitalDeudas,
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
    
    const newDeudas= deudas.map(deuda => ({
      ...deuda,
      capital: formatNumero(deuda.capital)
    }));
    
    const newBienes= bienes.map(bien => ({
      ...bien,
      valor: formatNumero(bien.valor)
    }));

    const newIngresos= ingresos.map(ingreso => ({
      ...ingreso,
      Valor: formatNumero(ingreso.Valor)
    }));

    const newPropuestas= propuestas.map(propuesta => ({
      ...propuesta,
      valorCuota: formatNumero(propuesta.valorCuota)
    }));
    // !Reemplazar contenido de array en una tabla
    doc.render({
      nombre: cliente.nombres,
      apellido: cliente.apellidos,
      celular: cliente.celular,
      cedula: cliente.cedula,
      direccion: cliente.direccion,
      ciudad: cliente.Ciudads[0].nombre_ciudad,
      ingresos: newIngresos,
      motivos: motivos.motivos,
      bienes: newBienes,
      procesos: procesos,
      obligaciones: obligaciones,
      sociedades: sociedades,
      acreedores: newAcreedores,
      deudas: newDeudas,
      totaldeudas: sumaCapitalDeudas,
      totalgastos: sumaGastos,
      propuestas: newPropuestas,
      energia: formatNumero(Number(gastos[0].energia)),
      gas: formatNumero(Number(gastos[0].gas)),
      agua: formatNumero(Number(gastos[0].aguaAlcAseo)),
      telecomunicaciones: formatNumero(Number(gastos[0].telecomunicaciones)),
      television: formatNumero(Number(gastos[0].television)),
      arriendo: formatNumero(Number(gastos[0].arriendo)),
      seguros: formatNumero(Number(gastos[0].seguros)),
      alimentacion: formatNumero(Number(gastos[0].alimentacion)),
      transporte: formatNumero(Number(gastos[0].transporte)),
      otros: formatNumero(Number(gastos[0].otros)),
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
