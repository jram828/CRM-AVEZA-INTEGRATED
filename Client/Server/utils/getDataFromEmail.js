import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CRON_GOOGLE_ID,
  process.env.CRON_GOOGLE_API_KEY,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN});
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

const label = 'UNREAD';
const query = 'is:unread subject:"un nuevo registro desde tu web"';

export const buscarCorreos = async () => {
  try {
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 20,
    });

    const mensajes = res.data.messages || [];
    console.log(`🟢 Se encontraron ${mensajes.length} correos filtrados.`);

    for (const { id } of mensajes) {
      const { data: mensaje } = await gmail.users.messages.get({
        userId: 'me',
        id,
      });

      const cuerpoCodificado = mensaje.payload.parts?.[0]?.body?.data;
      if (!cuerpoCodificado) continue;

      const cuerpoTexto = Buffer.from(cuerpoCodificado, 'base64').toString('utf-8');

      console.log('Cuerpo del correo:', cuerpoTexto);
      const datos = extraerDatos(cuerpoTexto);
      console.log('📩 Registro extraído:', datos);
    }
  } catch (error) {
    console.error('❌ Error al procesar correos:', error);
  }
};

const extraerDatos = (texto) => {
  const campos = {
    nombres: '',
    apellidos: '',
    correo: '',
    ciudad: ''
  };

  const mapa = {
    'Nombre (s):': 'nombres',
    'Apellidos:': 'apellidos',
    'Correo electrónico:': 'correo',
    'Ciudad:': 'ciudad'
  };

  const lineas = texto.split('\n');
  for (let i = 0; i < lineas.length; i++) {
    const linea = lineas[i].trim();
    if (mapa[linea]) {
      campos[mapa[linea]] = lineas[i + 1]?.trim() || '';
    }
  }

  return campos;
};

