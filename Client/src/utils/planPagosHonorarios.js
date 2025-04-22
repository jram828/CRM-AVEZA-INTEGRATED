import { formatearFecha } from "./formatFecha";
import { formatNumero } from "./formatNumero";

// Función para obtener la fecha del último día del mes
const ultimoDiaDelMes = (fecha) => {

  if (fecha.getMonth() === 1) {
    // Mes de febrero (0-indexed)
    const esBisiesto =
      (fecha.getFullYear() % 4 === 0 &&
        fecha.getFullYear() % 100 !== 0) ||
      fecha.getFullYear() % 400 === 0;
    const diaAjustado = esBisiesto ? 29 : 28;
    return new Date(fecha.getFullYear(), 1, diaAjustado);
  } else {
  return new Date(fecha.getFullYear(), fecha.getMonth(), 30);
  }
};

// Función para sumar días a una fecha
const sumarDias = (fecha, dias) => {
  const resultado = new Date(fecha);
  resultado.setDate(fecha.getDate() + dias);
  return resultado;
};

// Función para sumar meses a una fecha y ajustar al día correcto

const sumarMeses = (fecha, meses) => {
  const resultado = new Date(fecha);
  const diaOriginal = fecha.getDate(); // Mantener el día original
  resultado.setMonth(fecha.getMonth() + meses);

  // Si el mes resultante no tiene el mismo día, ajustarlo
  const ultimoDiaDelMes = new Date(
    resultado.getFullYear(),
    resultado.getMonth() + 1,
    0
  ).getDate(); // Obtener el último día del mes
  if (diaOriginal > ultimoDiaDelMes) {
    resultado.setDate(ultimoDiaDelMes);
  } else {
    resultado.setDate(diaOriginal);
  }

  return resultado;
};

// const sumarMeses = (fecha, meses) => {
//   const resultado = new Date(fecha);
//   resultado.setMonth(fecha.getMonth() + meses);
//   //console.log("Fecha de resultado:", resultado);
//   // Verificar si el mes resultante es febrero y ajustar correctamente
//   if (resultado.getMonth() === 2 && resultado.getDate()===2 || resultado.getDate()===1 ) {
//     // Mes de febrero (0-indexed)
//     const esBisiesto =
//       (resultado.getFullYear() % 4 === 0 &&
//         resultado.getFullYear() % 100 !== 0) ||
//       resultado.getFullYear() % 400 === 0;
//     const diaAjustado = esBisiesto ? 29 : 28;
//     resultado.setDate(diaAjustado);
//     resultado.setMonth(1);
//     //console.log("Fecha de resultado ajustada:", resultado);
//   } else {
//     resultado.setDate(30);
//   }
//   return resultado;
// }; //

// Función para calcular el plan de pagos
export const generarPlanPagosHonorarios = (
  valorHonorarios,
  numCuotas,
  inicial
) => {

  console.log("Valor Honorarios:", valorHonorarios);
  console.log("Número de Cuotas:", numCuotas);      
  console.log("Porcentaje Inicial:", inicial);
  const planPagos = [];
  let saldo = valorHonorarios-inicial;
  let fechaPago = sumarMeses(new Date(),0);

  const cuotaMensual=(Math.round((valorHonorarios-inicial)/numCuotas));
 console.log("Cuota Mensual:", cuotaMensual);
  for (let i = 0; i <= numCuotas; i++) {
    
    i!==0?saldo -= cuotaMensual:null;
    
    planPagos.push({
      numeroCuota: i,
      // cuotaMensual: formatNumero(cuotaMensual, 0),
      // saldo: formatNumero(saldo, 0),
      cuotaMensual: i===0?formatNumero(inicial):formatNumero(cuotaMensual),
      saldo: i===0?formatNumero(valorHonorarios-inicial):formatNumero(saldo),
      fechapago: i===0?formatearFecha(new Date()) :formatearFecha(fechaPago), // Copiar la fecha de pago actual
    });
    
    if(fechaPago.getMonth()===2 && fechaPago.getDate()===2){
      fechaPago.setDate(28);
      fechaPago.setMonth(1);
    } else {fechaPago = sumarMeses(fechaPago, 1);}

    

    //console.log("Plan de pagos:", planPagos);
  }
  return planPagos;
};
