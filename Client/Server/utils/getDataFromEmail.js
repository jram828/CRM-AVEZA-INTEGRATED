import dotenv from "dotenv";
import imaps from "imap-simple";
import { postProspectoAut } from "../controllers/prospecto/postProspectoAut.js";
import qp from "quoted-printable";
import axios from "axios";

dotenv.config();

const config = {
  imap: {
    user: process.env.WEBMAIL_USER,
    password: process.env.WEBMAIL_PASS,
    host: process.env.WEBMAIL_HOST,
    port: 993,
    tls: true,
    authTimeout: 3000,
  },
};

const SUBJECT = "Lead pauta insolvencia";


export const keepAlivePing = async () => {
  try {
    await axios.get(process.env.VITE_URL);
    console.log('📡 Keep-alive enviado correctamente');
  } catch (err) {
    console.error('❌ Error en keep-alive:', err.message);
  }
};



export const buscarCorreos = async () => {
  try {
    const connection = await imaps.connect(config);
    await connection.openBox("INBOX");

    const searchCriteria = ["UNSEEN", ["HEADER", "SUBJECT", SUBJECT]];
    const fetchOptions = {
      bodies: ["TEXT"],
      markSeen: true,
    };

    const messages = await connection.search(searchCriteria, fetchOptions);
    console.log(`🟢 Se encontraron ${messages.length} correos filtrados.`);

    for (const message of messages) {
      console.log("🧩 Estructura completa del mensaje:", JSON.stringify(message, null, 2));

      const obtenerContenidoPlano = (parts) => {
        for (const part of parts) {
          if (part.which === "TEXT" || part.which === "BODY" || part.which === "1") {
            return part.body;
          }
          if (Array.isArray(part.parts)) {
            const nested = obtenerContenidoPlano(part.parts);
            if (nested) return nested;
          }
        }
        return "";
      };

      const encoded = obtenerContenidoPlano(message.parts);
      if (!encoded) continue;

      const decoded = qp.decode(encoded).toString("utf-8");

      const limpio = decoded
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/\r/g, "")
        .trim();

      const datos = extraerDatos(limpio);
      console.log("📩 Registro extraído:", datos);

      try {
        const respuesta = await postProspectoAut(datos);
        console.log("📤 Prospecto enviado:", respuesta);
      } catch (error) {
        console.error("❌ Error al enviar prospecto:", error.message);
      }
    }

    await connection.end();
  } catch (error) {
    console.error("❌ Error al procesar correos:", error);
  }
};

const extraerDatos = (texto) => {
  const lineas = texto
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const datos = {
    nombres: lineas[0] || "",
    apellidos: lineas[1] || "",
    celular: lineas[2] || "",
    nombre_ciudad: lineas[3] || "",
    email: lineas[4] || "",
    impuestoLaboral: "",
    vehiculoCooperativas: "",
    hipotecario: "",
    proveedores: "",
    bancoPersonas: "",
    familiares: "",
    tieneBienes: "",
    bienes: "",
    totalBienes: "",
    totalDeudas: "",
    modoContacto: "",
  };

  let idx = 5;
  const campos = [
    "impuestoLaboral",
    "vehiculoCooperativas",
    "hipotecario",
    "proveedores",
    "bancoPersonas",
    "familiares",
    "tieneBienes",
    "bienes",
    "totalBienes",
    "totalDeudas",
    "modoContacto",
  ];

  for (let i = 0; i < campos.length && idx < lineas.length; i++, idx++) {
    const partes = lineas[idx].split(":");
    datos[campos[i]] =
      partes.length > 1 ? partes.slice(1).join(":").trim() : "";
  }

  return datos;
};