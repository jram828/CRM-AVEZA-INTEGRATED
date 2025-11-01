import { formatearFecha } from "./formatFecha";
import { formatNumero } from "./formatNumero";

// Función robusta para sumar meses manteniendo el día original
const sumarMeses = (fecha, meses) => {
  const diaOriginal = fecha.getDate();
  const resultado = new Date(fecha);
  resultado.setDate(1); // Evita desbordes
  resultado.setMonth(resultado.getMonth() + meses);

  const ultimoDiaDelMes = new Date(
    resultado.getFullYear(),
    resultado.getMonth() + 1,
    0
  ).getDate();

  resultado.setDate(Math.min(diaOriginal, ultimoDiaDelMes));
  return resultado;
};

// Función principal con auditoría integrada
export const generarPlanPagosHonorarios = (
  valorHonorarios,
  numCuotas,
  inicial
) => {
  const planPagos = [];
  const fechaInicio = new Date();
  let saldo = valorHonorarios - inicial;
  let fechaPago = new Date(fechaInicio);
  const cuotaMensual = Math.round(saldo / numCuotas);

  // Auditoría
  let totalCuotasPagadas = inicial;
  const ajustes = [];

  for (let i = 0; i <= numCuotas; i++) {
    let cuotaActual;

    if (i === 0) {
      cuotaActual = inicial;
    } else if (i === numCuotas) {
      cuotaActual = saldo < cuotaMensual ? Math.max(saldo, 0) : cuotaMensual;
      if (cuotaActual !== cuotaMensual) {
        ajustes.push({
          tipo: "ajuste última cuota",
          cuotaOriginal: cuotaMensual,
          cuotaAjustada: cuotaActual,
          diferencia: cuotaMensual - cuotaActual,
        });
      }
    } else {
      cuotaActual = cuotaMensual;
    }

    planPagos.push({
      numeroCuota: i,
      cuotaMensual: formatNumero(cuotaActual),
      saldo: formatNumero(saldo),
      fechapago: formatearFecha(fechaPago),
    });

    if (i > 0) saldo -= cuotaActual;
    totalCuotasPagadas += cuotaActual;
    fechaPago = sumarMeses(fechaPago, 1);
  }

  // Verificación final
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