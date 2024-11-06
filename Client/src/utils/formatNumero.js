export const formatNumero = (numero) => {
    if (!numero) return "";

    // Convertir a número flotante para manejar decimales
    const num = parseFloat(numero.toString().replace(/,/g, "."));

    // Formatear el número con separadores de miles y mantener dos decimales
    return num.toLocaleString("es-CO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };