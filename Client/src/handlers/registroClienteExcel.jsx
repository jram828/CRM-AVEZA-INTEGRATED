import axios from "axios";

import * as XLSX from "xlsx";
import { codigoCiudades } from "../utils/codigoCiudades";

export async function registroClienteExcel() {
  // const {
  // email,
  // nombres,
  // apellidos,
  // cedulaCliente,
  // celular,
  // direccion,
  // nombre_ciudad,
  // comentarios,
  //   } = userDataRegistro;

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
    jsonData.forEach(async (row) => {

      const foundCiudad = codigoCiudades.filter((ciudad) =>
            ciudad.nombre_ciudad.toLowerCase().includes(row[6].toLowerCase())
          );
 console.log("Ciudades encontradas:", foundCiudad);
      const clienteData = {
        cedulaCliente: row[0],
        nombres: row[1],
        apellidos: row[2],
        celular: row[3],
        email: row[4],
        direccion: row[5],
        nombre_ciudad: foundCiudad.length > 0 ? foundCiudad[0].nombre_ciudad : "",

      };
      // console.log("Cliente data:", clienteData);
      const URL = "/clientes/registrocliente";
      try {
        await axios.post(URL, clienteData);
        window.alert("Se ha registrado el cliente con éxito.");
      } catch (error) {
        window.alert("No fue posible registrar el cliente.");
      }
    });
  };
  reader.readAsArrayBuffer(file);
  reader.onerror = (error) => {
    console.error("Error al leer el archivo:", error);
    alert("Error al leer el archivo. Por favor, inténtalo de nuevo.");
  };
}
