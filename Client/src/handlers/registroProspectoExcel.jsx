import axios from "axios";

import * as XLSX from "xlsx";
import { codigoCiudades } from "../utils/codigoCiudades";

export async function registroProspectoExcel() {


  const fileInput = document.getElementById("docexcel");
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor, selecciona un archivo.");
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    console.log("Datos del archivo:", jsonData);
    jsonData.shift(); // Eliminar la primera fila (encabezados)
    try {
      jsonData.forEach(async (row) => {
        const foundCiudad = codigoCiudades.filter((ciudad) =>
          // console.log("Comparando:", ciudad.nombre_ciudad.toLowerCase(), "con", row[6])
          ciudad.nombre_ciudad.toLowerCase().includes(row[8].toLowerCase()),
        );
        console.log("Ciudades encontradas:", foundCiudad);
        const prospectoData = {
          status: row[1],
          apellidos: row[3],
          nombres: row[4],
          celular: row[5],
          email: row[6],
          nombre_ciudad:
            foundCiudad.length > 0 ? foundCiudad[0].nombre_ciudad : "",
          servicio: row[9],
          totalDeudas: row[10],
          tiempoMora: row[11],
          numeroEntidades: row[12],
          totalBienes: row[13],
          tieneProcesos: row[14],
          responsable: row[15],
          fuente: row[16],
          genero: row[21],
          comentarios: row[22],
        };
        // console.log("Prospecto data:", ProspectoData);
        const URL = "/prospectos/registroProspecto";

        await axios.post(URL, prospectoData);
      });
      window.alert("Archivo procesado con éxito.");
    } catch (error) {
      window.alert(
        "Error al procesar el archivo. Por favor, inténtalo de nuevo.",
      );
    }
  };
  reader.readAsArrayBuffer(file);
  reader.onerror = (error) => {
    console.error("Error al leer el archivo:", error);
    alert("Error al leer el archivo. Por favor, inténtalo de nuevo.");
  };
}
