import nodemailer from 'nodemailer';
const { EMAIL_PASSWORD,EMAIL } = process.env
import fs from 'fs'
import path from 'path';

import { fileURLToPath } from 'url';



// Obtener el nombre de este archivo
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

console.log('Email', EMAIL, 'Password:', EMAIL_PASSWORD)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD
    }
});



// const templatePath = path.join(__dirname, "templateCliente.html");
// const htmlTemplate = fs.readFileSync(templatePath, "Utf8");

const sendEmailCliente = ({nombres, email}) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const templatePath = path.join(__dirname, '', "templateCliente.html");
    const htmlTemplate = fs.readFileSync(templatePath, "Utf8");

       const personalizedHtml = htmlTemplate
         .replace("{{nombre}}", nombres)
         .replace("{{correo}}", email);

       const mailOptions = {
         from: `CRM AVEZA <${EMAIL}>`,
         to: email,
         subject: "🚀 Bienvenido a CRM AVEZA!!",
         html: personalizedHtml,
       };

       transporter.sendMail(mailOptions, function (error) {
         if (error) {
           console.log("⚠️" + error);
         } else {
           console.log("✅ Email sent: " + nombres);
         }
       });
} 




    // const templatePath = path.join(__dirname, "templateCliente.html");
    // const htmlTemplate = fs.readFileSync(templatePath, "Utf8");

    // const mailOptions = {
    //     from: EMAIL,
    //     to: correo,
    //     subject: '🚀 Bienvenido a Legaltech!!',
    //     text: 'Te han registrado en LegalTech.'
    // };

    // transporter.sendMail(mailOptions, function(error){
    //     if (error) {
    //         console.log('⚠️' + error)
    //     } else {
    //         console.log('✅ Email sent: '+ nombre)
    //     }
    // })


const sendEmailPassword = (nombre, correo, cedula) => {
    console.log("Datos email:", nombre, correo, cedula);
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const templatePath = path.join(__dirname, "", "templatePassword.html");
    const htmlTemplate = fs.readFileSync(templatePath, "Utf8");

    console.log("Datos email password:", nombre, correo, cedula);

    const link= `https://crm-aveza-integrated.onrender.com/#/cambiarcontrasena?cedula=${cedula}&correo=${correo}`
    var personalizedHtml = htmlTemplate
      .replace("{{nombre}}", nombre)
      .replace("{{link}}", link);

  const mailOptions = {
    from: ` CRM AVEZA ${EMAIL}`,
    to: correo,
      subject: "🚀 Recordatorio de contraseña, CRM AVEZA.",
    html: personalizedHtml
    // text: `${nombre}. Bienvenido a Legal Tech! Nos has solicitado recordar tu contraseña, aquí la tienes: ${password}`,
  };

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      console.log("⚠️" + error);
    } else {
      console.log("✅ Email sent: " + nombre);
    }
  });
};

const sendEmailCita = (cliente, abogado, newCita)=>{

    // const templatePath = path.join(__dirname, 'templateCitas.html');
    // const htmlTemplate = fs.readFileSync(templatePath, 'Utf8')

    const personalizedHtml = htmlTemplate
    .replace('{{cliente}}', cliente.nombre)
    .replace('{{abogado}}', abogado.nombre)
    .replace('{{horaCita}}', newCita.horaCita)
    .replace('{{fechaCita}}', newCita.fechaCita);

    const mailOptions = {
        from: EMAIL,
        to: correo,
        subject: `☕ Tienes una nueva cita ${cliente.nombre}`,
        html: personalizedHtml
    };

    transporter.sendMail(mailOptions, function(error){
        if (error) {
            console.log('⚠️' + error)
        } else {
            console.log('✅ Email sent: '+ nombre)
        }
    })
}

export {
    sendEmailCliente,
    sendEmailCita,
    sendEmailPassword
}
