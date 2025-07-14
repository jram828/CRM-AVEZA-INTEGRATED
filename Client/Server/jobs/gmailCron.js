import cron from 'node-cron';
import { buscarCorreos } from '../utils/getDataFromEmail.js'; // ← Ajusta la ruta según donde esté tu lógica actual

// Ejecutar cada 12 minutos
cron.schedule('*/12 * * * *', () => {
  console.log('⏰ Ejecutando tarea automática de lectura de correos');
  buscarCorreos();
});