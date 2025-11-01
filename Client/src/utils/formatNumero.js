export const formatNumero = (numero) => {
  if (!numero) return "";

  // Eliminar separadores de miles ('.') y reemplazar la coma decimal con un punto
  const numSinSeparador = numero.toString().replace(/\./g, "").replace(/,/g, ".");

  // Convertir a número flotante para manejar decimales
  const num = parseFloat(numSinSeparador);

  if (isNaN(num)) {
    console.error("El valor proporcionado no es un número válido.");
    return "";
  }

  // Formatear el número con separadores de miles y mantener dos decimales
  return num.toLocaleString("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};