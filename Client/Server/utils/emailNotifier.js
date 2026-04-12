import nodemailer from "nodemailer";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import moment from "moment";
import { fileURLToPath } from "url";

const {
  EMAIL,
  EMAIL_NOTIFICACION,
  CRON_GOOGLE_ID,
  CRON_GOOGLE_API_KEY,
  GOOGLE_REFRESH_TOKEN,
  EMAIL_CALENDAR,
} = process.env;

// Configuración OAuth2
const oAuth2Client = new google.auth.OAuth2(
  CRON_GOOGLE_ID,
  CRON_GOOGLE_API_KEY,
  "https://developers.google.com/oauthplayground" // redirect usado para obtener el refresh token
);

oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

// // Crear cliente JWT con delegación
// const jwtClient = new google.auth.JWT(
//   GOOGLE_CLIENT_EMAIL,
//   null,
//   GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//   ["https://www.googleapis.com/auth/gmail.send"],
//   GMAIL_USER // 👈 impersonación: correo del usuario real
// );

// // Inicializar Gmail API
// const gmail = google.gmail({ version: "v1", auth: jwtClient });

// Helper para cargar templates HTML
function loadTemplate(fileName) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const templatePath = path.join(__dirname, fileName);
  return fs.readFileSync(templatePath, "utf8");
}

// Función genérica para enviar correo vía Gmail API

async function sendMail({ to, subject, html, attachments = [] }) {
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;

  // Construir mensaje MIME con adjuntos
  let boundary = "boundary_" + Date.now();
  let messageParts = [
    `From: CRM AVEZA <${EMAIL}>`,
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=utf-8",
    "",
    html,
  ];

  // Adjuntar archivos
  for (const attachment of attachments) {
    const fileContent = fs.readFileSync(attachment.path);
    const encodedFile = fileContent
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    messageParts.push(
      `--${boundary}`,
      `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; name="${attachment.filename}"`,
      "Content-Transfer-Encoding: base64",
      `Content-Disposition: attachment; filename="${attachment.filename}"`,
      "",
      encodedFile,
    );
  }

  messageParts.push(`--${boundary}--`);

  const message = messageParts.join("\n");

  // Codificar en Base64URL
  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  // Enviar
  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: encodedMessage },
  });

  console.log("✅ Email enviado a:", to);
}
// async function sendMail({ to, subject, html }) {
//   const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

//   const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;

//   const message = [
//     `From: CRM AVEZA <${EMAIL}>`,
//     `To: ${to}`,
//     `Subject: ${encodedSubject}`,
//     "Content-Type: text/html; charset=utf-8",
//     "",
//     html,
//   ].join("\n");

//   // Codificar en Base64URL
//   const encodedMessage = Buffer.from(message)
//     .toString("base64")
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_")
//     .replace(/=+$/, "");

//   // Enviar
//   await gmail.users.messages.send({
//     userId: "me",
//     requestBody: { raw: encodedMessage },
//   });

//   console.log("✅ Email enviado a:", to);
// }


// ------------------ FUNCIONES DE ENVÍO ------------------

const sendEmailCliente = async ({ nombres, email }) => {
  const htmlTemplate = loadTemplate("templateCliente.html");
  const personalizedHtml = htmlTemplate
    .replace("{{nombre}}", nombres)
    .replace("{{correo}}", email);

  await sendMail({
    to: email,
    subject: "🚀 Bienvenido a CRM AVEZA!!",
    html: personalizedHtml,
  });
};

const sendEmailProspecto = async ({ nombres, email }) => {
  const htmlTemplate = loadTemplate("templateProspecto.html");
  const personalizedHtml = htmlTemplate
    .replace("{{nombre}}", nombres)
    .replace("{{correo}}", email);

  await sendMail({
    to: email,
    subject: "🚀 Bienvenido a CRM AVEZA!!",
    html: personalizedHtml,
  });
};

const sendEmailPassword = async (nombre, correo, cedula) => {
  const htmlTemplate = loadTemplate("templatePassword.html");
  const link = `https://crm-aveza-integrated.onrender.com/#/cambiarcontrasena?cedula=${cedula}&correo=${correo}`;

  const personalizedHtml = htmlTemplate
    .replace("{{nombre}}", nombre)
    .replace("{{link}}", link);

  await sendMail({
    to: correo,
    subject: "🚀 Recordatorio de contraseña, CRM AVEZA.",
    html: personalizedHtml,
  });
};

const sendEmailCita = async (data) => {
  const htmlTemplate = loadTemplate("templateCitas.html");
  const fechaStr =
    typeof data.fechaCita === "string"
      ? data.fechaCita.slice(0, 10)
      : moment(data.fechaCita).format("YYYY-MM-DD");

  const personalizedHtml = htmlTemplate
    .replace("{{cliente}}", data.nombres)
    .replace("{{abogado}}", "Julián Avellaneda")
    .replace("{{horaCita}}", data.horaCita)
    .replace("{{fechaCita}}", fechaStr)
    .replace("{{linkReunion}}", data.URLReunion);

  await sendMail({
    to: data.email,
    subject: `☕ ${data.nombres}, Tienes una nueva cita agendada con Julián Avellaneda`,
    html: personalizedHtml,
  });
};

const sendEmailCitaAveza = async (data) => {
  const htmlTemplate = loadTemplate("templateCitasAveza.html");
  const fechaStr =
    typeof data.fechaCita === "string"
      ? data.fechaCita.slice(0, 10)
      : moment(data.fechaCita).format("YYYY-MM-DD");

  const personalizedHtml = htmlTemplate
    .replace("{{cliente}}", `${data.nombres} ${data.apellidos}`)
    .replace("{{horaCita}}", data.horaCita)
    .replace("{{fechaCita}}", fechaStr)
    .replace("{{linkReunion}}", data.URLReunion);

  await sendMail({
    to: EMAIL_NOTIFICACION,
    subject: `☕ Primera Asesoría agendada con ${data.nombres} ${data.apellidos}`,
    html: personalizedHtml,
  });
};

const sendEmailActualizaCitaAveza = async (data) => {
  const htmlTemplate = loadTemplate("templateActualizaCitasAveza.html");
  const fechaStr =
    typeof data.fechaCita === "string"
      ? data.fechaCita.slice(0, 10)
      : moment(data.fechaCita).format("YYYY-MM-DD");

  const personalizedHtml = htmlTemplate
    .replace("{{cliente}}", `${data.nombres} ${data.apellidos}`)
    .replace("{{horaCita}}", data.horaCita)
    .replace("{{fechaCita}}", fechaStr)
    .replace("{{linkReunion}}", data.URLReunion);

  await sendMail({
    to: EMAIL_NOTIFICACION,
    subject: `☕ Actualización de cita con ${data.nombres} ${data.apellidos}`,
    html: personalizedHtml,
  });
};

const sendEmailActualizaCita = async (data) => {
  const htmlTemplate = loadTemplate("templateActualizaCitas.html");
  const fechaStr =
    typeof data.fechaCita === "string"
      ? data.fechaCita.slice(0, 10)
      : moment(data.fechaCita).format("YYYY-MM-DD");

  const personalizedHtml = htmlTemplate
    .replace("{{cliente}}", data.nombres)
    .replace("{{abogado}}", "Julián Avellaneda")
    .replace("{{horaCita}}", data.horaCita)
    .replace("{{fechaCita}}", fechaStr)
    .replace("{{linkReunion}}", data.URLReunion);

  await sendMail({
    to: data.email,
    subject: `☕ ${data.nombres}, Se ha actualizado la cita agendada con Julián Avellaneda`,
    html: personalizedHtml,
  });
};

// ------------------ EXPORTS ------------------

export {
  sendEmailCliente,
  sendEmailProspecto,
  sendEmailPassword,
  sendEmailCita,
  sendEmailCitaAveza,
  sendEmailActualizaCita,
  sendEmailActualizaCitaAveza,
  sendMail
};
