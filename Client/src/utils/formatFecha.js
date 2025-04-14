export const formatearFecha = (fecha) => {
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexados
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };
  