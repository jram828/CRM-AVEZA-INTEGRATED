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
} = process.env;

// Configuración OAuth2
const oAuth2Client = new google.auth.OAuth2(
  CRON_GOOGLE_ID,
  CRON_GOOGLE_API_KEY,
  "https://developers.google.com/oauthplayground" // redirect usado para obtener el refresh token
);

oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });


// Helper para cargar templates HTML
function loadTemplate(fileName) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const templatePath = path.join(__dirname, fileName);
  return fs.readFileSync(templatePath, "utf8");
}

// Función genérica para enviar correo vía Gmail API
async function sendMail({ to, subject, html }) {
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

  // Construir mensaje MIME
  const message = [
    `From: CRM AVEZA <${EMAIL}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/html; charset=utf-8",
    "",
    html,
  ].join("\n");

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
    to: data.invitados[0],
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


// ------------------ EXPORTS ------------------

export {
  sendEmailCliente,
  sendEmailProspecto,
  sendEmailPassword,
  sendEmailCita,
  sendEmailCitaAveza,
};

// import nodemailer from "nodemailer";
// const { EMAIL_PASSWORD, EMAIL, EMAIL_NOTIFICACION } = process.env;
// import fs from "fs";
// import path from "path";
// import moment from "moment";

// import { fileURLToPath } from "url";

// // Obtener el nombre de este archivo
// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // console.log("Email", EMAIL, "Password:", EMAIL_PASSWORD);
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: EMAIL,
//     pass: EMAIL_PASSWORD,
//   },
// });

// // const templatePath = path.join(__dirname, "templateCliente.html");
// // const htmlTemplate = fs.readFileSync(templatePath, "Utf8");

// const sendEmailCliente = ({ nombres, email }) => {
//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);

//   const templatePath = path.join(__dirname, "", "templateCliente.html");
//   const htmlTemplate = fs.readFileSync(templatePath, "Utf8");

//   const personalizedHtml = htmlTemplate
//     .replace("{{nombre}}", nombres)
//     .replace("{{correo}}", email);

//   const mailOptions = {
//     from: `CRM AVEZA <${EMAIL}>`,
//     to: email,
//     subject: "🚀 Bienvenido a CRM AVEZA!!",
//     html: personalizedHtml,
//   };

//   transporter.sendMail(mailOptions, function (error) {
//     if (error) {
//       console.log("⚠️" + error);
//     } else {
//       console.log("✅ Email sent: " + nombres);
//     }
//   });
// };

// const sendEmailProspecto = ({ nombres, email }) => {
//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);

//   const templatePath = path.join(__dirname, "", "templateProspecto.html");
//   const htmlTemplate = fs.readFileSync(templatePath, "Utf8");

//   const personalizedHtml = htmlTemplate
//     .replace("{{nombre}}", nombres)
//     .replace("{{correo}}", email);

//   const mailOptions = {
//     from: `CRM AVEZA <${EMAIL}>`,
//     to: email,
//     subject: "🚀 Bienvenido a CRM AVEZA!!",
//     html: personalizedHtml,
//   };

//   transporter.sendMail(mailOptions, function (error) {
//     if (error) {
//       console.log("⚠️" + error);
//     } else {
//       console.log("✅ Email sent: " + nombres);
//     }
//   });
// };

// // const templatePath = path.join(__dirname, "templateCliente.html");
// // const htmlTemplate = fs.readFileSync(templatePath, "Utf8");

// // const mailOptions = {
// //     from: EMAIL,
// //     to: correo,
// //     subject: '🚀 Bienvenido a Legaltech!!',
// //     text: 'Te han registrado en LegalTech.'
// // };

// // transporter.sendMail(mailOptions, function(error){
// //     if (error) {
// //         console.log('⚠️' + error)
// //     } else {
// //         console.log('✅ Email sent: '+ nombre)
// //     }
// // })

// const sendEmailPassword = (nombre, correo, cedula) => {
//   console.log("Datos email:", nombre, correo, cedula);

//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);

//   const templatePath = path.join(__dirname, "", "templatePassword.html");
//   const htmlTemplate = fs.readFileSync(templatePath, "Utf8");

//   console.log("Datos email password:", nombre, correo, cedula);

//   const link = `https://crm-aveza-integrated.onrender.com/#/cambiarcontrasena?cedula=${cedula}&correo=${correo}`;
//   var personalizedHtml = htmlTemplate
//     .replace("{{nombre}}", nombre)
//     .replace("{{link}}", link);

//   const mailOptions = {
//     from: ` CRM AVEZA ${EMAIL}`,
//     to: correo,
//     subject: "🚀 Recordatorio de contraseña, CRM AVEZA.",
//     html: personalizedHtml,
//     // text: `${nombre}. Bienvenido a Legal Tech! Nos has solicitado recordar tu contraseña, aquí la tienes: ${password}`,
//   };

//   transporter.sendMail(mailOptions, function (error) {
//     if (error) {
//       console.log("⚠️" + error);
//     } else {
//       console.log("✅ Email sent: " + nombre);
//     }
//   });
// };

// const sendEmailCita = (data) => {
//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);

//   console.log("Data email cita:", data);

//   const templatePath = path.join(__dirname, "templateCitas.html");
//   const htmlTemplate = fs.readFileSync(templatePath, "Utf8");

//       const fechaStr = typeof data.fechaCita === "string"
//         ? data.fechaCita.slice(0, 10)
//         : moment(data.fechaCita).format("YYYY-MM-DD");

//   const personalizedHtml = htmlTemplate
//     .replace("{{cliente}}", data.nombres)
//     .replace("{{abogado}}", "Julián Avellaneda")
//     .replace("{{horaCita}}", data.horaCita)
//     .replace("{{fechaCita}}", fechaStr)
//     .replace("{{linkReunion}}", data.URLReunion);

//   const mailOptions = {
//     from: EMAIL,
//     to: data.invitados[0],
//     subject: `☕ ${data.nombres}, Tienes una nueva cita agendada con Julián Avellaneda`,
//     html: personalizedHtml,
//   };

//   transporter.sendMail(mailOptions, function (error) {
//     if (error) {
//       console.log("⚠️" + error);
//     } else {
//       console.log("✅ Email sent: " + data.nombres);
//     }
//   });
// };

// const sendEmailCitaAveza = (data) => {
//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);
  
//   const templatePath = path.join(__dirname, "templateCitasAveza.html");
//   const htmlTemplate = fs.readFileSync(templatePath, "Utf8");
//  const fechaStr = typeof data.fechaCita === "string"
//         ? data.fechaCita.slice(0, 10)
//         : moment(data.fechaCita).format("YYYY-MM-DD");
//   const personalizedHtml = htmlTemplate
//     .replace("{{cliente}}", `${data.nombres} ${data.apellidos}`)
//     .replace("{{horaCita}}", data.horaCita)
//     .replace("{{fechaCita}}", fechaStr)
//     .replace("{{linkReunion}}", data.URLReunion);

//   const mailOptions = {
//     from: EMAIL,
//     to: EMAIL_NOTIFICACION,
//     subject: `☕ Primera Asesoría agendada con ${data.nombres} ${data.apellidos}`,
//     html: personalizedHtml,
//   };

//   transporter.sendMail(mailOptions, function (error) {
//     if (error) {
//       console.log("⚠️" + error);
//     } else {
//       console.log(`✅ Email sent to ${EMAIL_NOTIFICACION}`);
//     }
//   });
// };
// export {
//   sendEmailCliente,
//   sendEmailProspecto,
//   sendEmailCita,
//   sendEmailCitaAveza,
//   sendEmailPassword,
// };
