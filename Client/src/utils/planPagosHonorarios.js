import { formatearFecha } from "./formatFecha";
import { formatNumero } from "./formatNumero";
const sumarMeses = (fecha, meses) => {
  const diaOriginal = fecha.getDate();
  const resultado = new Date(fecha);
  resultado.setDate(1);
  resultado.setMonth(resultado.getMonth() + meses);
  const ultimoDiaDelMes = new Date(
    resultado.getFullYear(),
    resultado.getMonth() + 1,
    0
  ).getDate();
  resultado.setDate(Math.min(diaOriginal, ultimoDiaDelMes));
  return resultado;
};

export const generarPlanPagosHonorarios = (
  valorHonorarios,
  numCuotas,
  inicial,
  cuota6 = false,
  cuota12 = false
) => {
  const planPagos = [];
  const fechaInicio = new Date();
  let saldo = valorHonorarios;
  let fechaPago = new Date(fechaInicio);

  // Paso 1: calcular unidades de cuota

  let cuotasDobles = [];

  for (let i = 0; i < numCuotas; i++) {
    const mes = fechaPago.getMonth();
    if ((mes === 5 && cuota6) || (mes === 11 && cuota12)) {
      cuotasDobles.push(i);
    }
    fechaPago = sumarMeses(fechaPago, 1);
  }

  // Reducir número de cuotas por cada cuota doble
  const cuotasDoblesActivadas = cuotasDobles.length;
  const cuotasFinales = numCuotas - cuotasDoblesActivadas;
  const unidadesFinales = cuotasFinales + cuotasDoblesActivadas;

  // Calcular valor por unidad
  const valorPorUnidad = Math.round((valorHonorarios - inicial) / unidadesFinales);

  // Agregar cuota inicial
  fechaPago = new Date(fechaInicio);
  saldo -= inicial;
  planPagos.push({
    numeroCuota: 0,
    cuotaMensual: formatNumero(inicial),
    saldo: formatNumero(saldo),
    fechapago: formatearFecha(fechaPago),
  });

  // Generar cuotas restantes
  fechaPago = sumarMeses(fechaPago, 1);
  let totalCuotasPagadas = inicial;
  const ajustes = [];

  for (let i = 1; i <= cuotasFinales; i++) {
    const mes = fechaPago.getMonth();
    const esDoble = (mes === 5 && cuota6) || (mes === 11 && cuota12);
    let cuotaActual = esDoble ? valorPorUnidad * 2 : valorPorUnidad;

    // Si es la última cuota y queda saldo, ajustarla
    if (i === cuotasFinales && saldo - cuotaActual !== 0) {
      const ajusteFinal = saldo - cuotaActual;
      cuotaActual += ajusteFinal;
    }

    const saldoProyectado = saldo - cuotaActual;

    planPagos.push({
      numeroCuota: i,
      cuotaMensual: formatNumero(cuotaActual),
      saldo: saldoProyectado <= 0 ? "0" : formatNumero(saldoProyectado),
      fechapago: formatearFecha(fechaPago),
    });

    saldo -= cuotaActual;
    totalCuotasPagadas += cuotaActual;
    fechaPago = sumarMeses(fechaPago, 1);
  }

  const saldoFinal = valorHonorarios - totalCuotasPagadas;
  if (saldoFinal !== 0) {
    ajustes.push({
      tipo: "desajuste total",
      totalPagado: totalCuotasPagadas,
      valorHonorarios,
      diferencia: saldoFinal,
    });
  }

  console.log("Auditoría de plan de pagos:");
  console.table(ajustes);

  return planPagos;
};

//conservando el numero de cuotas

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
//   let unidadesCuota = numCuotas;
//   let cuotasDobles = [];

//   for (let i = 0; i < numCuotas; i++) {
//     const mes = fechaPago.getMonth();
//     if ((mes === 5 && cuota6) || (mes === 11 && cuota12)) {
//       unidadesCuota++; // cada cuota doble cuenta como 2 unidades
//       cuotasDobles.push(i);
//     }
//     fechaPago = sumarMeses(fechaPago, 1);
//   }

//   // Paso 2: calcular valor por unidad (sin descontar inicial)
//   const valorPorUnidad = Math.round((valorHonorarios - inicial) / unidadesCuota);

//   // Paso 3: agregar cuota inicial
//   fechaPago = new Date(fechaInicio);
//   saldo -= inicial;
//   planPagos.push({
//     numeroCuota: 0,
//     cuotaMensual: formatNumero(inicial),
//     saldo: formatNumero(saldo),
//     fechapago: formatearFecha(fechaPago),
//   });

//   // Paso 4: generar cuotas restantes
//   fechaPago = sumarMeses(fechaPago, 1);
//   let totalCuotasPagadas = inicial;
//   const ajustes = [];

//   for (let i = 1; i <= numCuotas; i++) {
//     const mes = fechaPago.getMonth();
//     const esDoble = (mes === 5 && cuota6) || (mes === 11 && cuota12);
//     const cuotaActual = esDoble ? valorPorUnidad * 2 : valorPorUnidad;
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
