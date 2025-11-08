import { formatearFecha } from "./formatFecha";
import { formatNumero } from "./formatNumero";

const sumarMeses = (fecha, meses) => {
  const dia = fecha.getDate();
  const nueva = new Date(fecha);
  nueva.setMonth(nueva.getMonth() + meses);
  const ultimoDia = new Date(nueva.getFullYear(), nueva.getMonth() + 1, 0).getDate();
  nueva.setDate(Math.min(dia, ultimoDia));
  return nueva;
};

export const generarPlanPagosHonorarios = (
  valorHonorarios,
  numCuotas,
  inicial,
  cuota6 = false,
  cuota12 = false
) => {
  // Normalizar entradas a números para evitar concatenaciones y errores en operaciones aritméticas
  const valorHonorariosNum = Number(valorHonorarios) || 0;
  const inicialNum = Number(inicial) || 0;

  const planPagos = [];
  const fechaInicio = new Date();
  let fechaPago = new Date(fechaInicio);

  // Paso 1: calcular unidades por cuota usando fechas reales
  const unidadesPorCuota = [];
  const fechasCuotas = [];
  for (let i = 0; i < numCuotas; i++) {
    fechaPago = sumarMeses(fechaPago, 1);
    fechasCuotas.push(new Date(fechaPago));
    const mes = fechaPago.getMonth();
    const esDoble = (mes === 5 && cuota6) || (mes === 11 && cuota12);
    unidadesPorCuota.push(esDoble ? 2 : 1);
  }

  const totalUnidades = unidadesPorCuota.reduce((a, b) => a + b, 0);
  // monto total a distribuir en cuotas (resta de inicial) — asegurar número y no negativo
  const totalCuotas = Math.max(0, valorHonorariosNum - inicialNum);

  // Evitar divisiones por cero en cálculos posteriores
  if (totalUnidades === 0) {
    // Si no hay unidades, devolver solo cuota inicial (saldo debe ser 0 o el remanente)
    const saldoInicial = Math.max(0, valorHonorariosNum - inicialNum);
    return [
      {
        numeroCuota: 0,
        cuotaMensual: formatNumero(inicialNum),
        saldo: formatNumero(saldoInicial),
        fechapago: formatearFecha(fechaInicio),
      },
    ];
  }

  // Paso 2: calcular valor por unidad con ajuste iterativo (múltiplos de 10,000)
  let valorPorUnidad = Math.ceil(totalCuotas / totalUnidades / 10000) * 10000;
  let cuotas = [];
  let totalPagado = inicialNum;

  while (true) {
    cuotas = unidadesPorCuota.map(u => u * valorPorUnidad);
    // normalizar cuotas a números enteros
    cuotas = cuotas.map(c => Math.round(Number(c) || 0));

    // sumar cuotas
    let sumaCuotas = cuotas.reduce((a, b) => a + b, 0);

    // ajustar última cuota si hay diferencia por redondeo (mantener múltiplos de 10.000)
    const diferencia = valorHonorariosNum - (inicialNum + sumaCuotas);
    if (diferencia !== 0) {
      const ajuste = Math.round(diferencia / 10000) * 10000;
      cuotas[cuotas.length - 1] += ajuste;
      sumaCuotas = cuotas.reduce((a, b) => a + b, 0);
    }
    totalPagado = inicialNum + sumaCuotas;

    if (totalPagado === valorHonorariosNum) break;

    if (totalPagado < valorHonorariosNum) {
      const remanente = valorHonorariosNum - totalPagado;
      const incremento = Math.ceil(remanente / totalUnidades / 10000) * 10000;
      valorPorUnidad += incremento;
    } else {
      let exceso = totalPagado - valorHonorariosNum;
      for (let i = cuotas.length - 1; i >= 0 && exceso > 0; i--) {
        const maxReducible = cuotas[i];
        const ajuste = Math.min(exceso, maxReducible);
        cuotas[i] -= ajuste;
        exceso -= ajuste;
      }
      totalPagado = valorHonorariosNum;
      break;
    }
  }

  // Paso 3: cuota inicial
  let saldo = valorHonorariosNum - inicialNum;
  planPagos.push({
    numeroCuota: 0,
    cuotaMensual: formatNumero(inicialNum),
    saldo: formatNumero(saldo),
    fechapago: formatearFecha(fechaInicio),
  });

  // Paso 4: registrar cuotas
  for (let i = 0; i < cuotas.length; i++) {
    const cuota = cuotas[i];
    if (typeof cuota !== "number" || isNaN(cuota)) {
      throw new Error(`Cuota inválida en el periodo ${i + 1}: ${cuota}`);
    }

    fechaPago = fechasCuotas[i];
    saldo -= cuota;

    planPagos.push({
      numeroCuota: i + 1,
      cuotaMensual: formatNumero(cuota),
      saldo: saldo <= 0 ? "0" : formatNumero(saldo),
      fechapago: formatearFecha(fechaPago),
    });
  }

  return planPagos;
};

// export const generarPlanPagosHonorarios = (
//   valorHonorarios,
//   numCuotas,
//   inicial,
//   cuota6 = false,
//   cuota12 = false
// ) => {
//   const planPagos = [];
//   const fechaInicio = new Date();
//   let saldo = valorHonorarios;
//   let fechaPago = new Date(fechaInicio);

//   // Paso 1: calcular unidades de cuota

//   let cuotasDobles = [];

//   for (let i = 0; i < numCuotas; i++) {
//     const mes = fechaPago.getMonth();
//     if ((mes === 5 && cuota6) || (mes === 11 && cuota12)) {
//       cuotasDobles.push(i);
//     }
//     fechaPago = sumarMeses(fechaPago, 1);
//   }

//   // Reducir número de cuotas por cada cuota doble
//   const cuotasDoblesActivadas = cuotasDobles.length;
//   const cuotasFinales = numCuotas - cuotasDoblesActivadas;
//   const unidadesFinales = cuotasFinales + cuotasDoblesActivadas;

//   // Calcular valor por unidad
//   const valorPorUnidad = Math.round((valorHonorarios - inicial) / unidadesFinales);

//   // Agregar cuota inicial
//   fechaPago = new Date(fechaInicio);
//   saldo -= inicial;
//   planPagos.push({
//     numeroCuota: 0,
//     cuotaMensual: formatNumero(inicial),
//     saldo: formatNumero(saldo),
//     fechapago: formatearFecha(fechaPago),
//   });

//   // Generar cuotas restantes
//   fechaPago = sumarMeses(fechaPago, 1);
//   let totalCuotasPagadas = inicial;
//   const ajustes = [];

//   for (let i = 1; i <= cuotasFinales; i++) {
//     const mes = fechaPago.getMonth();
//     const esDoble = (mes === 5 && cuota6) || (mes === 11 && cuota12);
//     let cuotaActual = esDoble ? valorPorUnidad * 2 : valorPorUnidad;

//     // Si es la última cuota y queda saldo, ajustarla
//     if (i === cuotasFinales && saldo - cuotaActual !== 0) {
//       const ajusteFinal = saldo - cuotaActual;
//       cuotaActual += ajusteFinal;
//     }

//     const saldoProyectado = saldo - cuotaActual;

//     planPagos.push({
//       numeroCuota: i,
//       cuotaMensual: formatNumero(cuotaActual),
//       saldo: saldoProyectado <= 0 ? "0" : formatNumero(saldoProyectado),
//       fechapago: formatearFecha(fechaPago),
//     });

//     saldo -= cuotaActual;
//     totalCuotasPagadas += cuotaActual;
//     fechaPago = sumarMeses(fechaPago, 1);
//   }

//   const saldoFinal = valorHonorarios - totalCuotasPagadas;
//   if (saldoFinal !== 0) {
//     ajustes.push({
//       tipo: "desajuste total",
//       totalPagado: totalCuotasPagadas,
//       valorHonorarios,
//       diferencia: saldoFinal,
//     });
//   }

//   console.log("Auditoría de plan de pagos:");
//   console.table(ajustes);

//   return planPagos;
// };

//conservando el numero de cuotas