import cron from 'node-cron';
import { buscarCorreos, keepAlivePing } from '../utils/getDataFromEmail.js'; // ← Ajusta la ruta según donde esté tu lógica actual
import { contarProspecto } from '../controllers/prospecto/contarProspecto.js';

console.log('📦 gmailCron.js cargado correctamente');

buscarCorreos();
// Ejecutar cada 12 minutos
cron.schedule('*/1 * * * *', () => {
  console.log('⏰ Ejecutando tarea automática de lectura de correos');
  // keepAlivePing();
  buscarCorreos();
});