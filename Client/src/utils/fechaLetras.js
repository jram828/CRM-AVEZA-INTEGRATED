export const fechaLetras = (fecha) => {
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  const numeroALetras = (numero) => {
    const numerosEnLetras = {
      1: "uno", 2: "dos", 3: "tres", 4: "cuatro", 5: "cinco",
      6: "seis", 7: "siete", 8: "ocho", 9: "nueve", 10: "diez",
      11: "once", 12: "doce", 13: "trece", 14: "catorce", 15: "quince",
      16: "dieciséis", 17: "diecisiete", 18: "dieciocho", 19: "diecinueve",
      20: "veinte", 21: "veintiuno", 22: "veintidós", 23: "veintitrés",
      24: "veinticuatro", 25: "veinticinco", 26: "veintiséis", 27: "veintisiete",
      28: "veintiocho", 29: "veintinueve", 30: "treinta", 31: "treinta y uno"
    };
    return numerosEnLetras[numero];
  };

  const anioALetras = (anio) => {
    const unidades = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    const decenas = ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
    const especiales = {
      11: "once", 12: "doce", 13: "trece", 14: "catorce", 15: "quince",
      16: "dieciséis", 17: "diecisiete", 18: "dieciocho", 19: "diecinueve",21: "veintiuno", 22: "veintidós", 23: "veintitrés",
      24: "veinticuatro", 25: "veinticinco", 26: "veintiséis", 27: "veintisiete",
      28: "veintiocho", 29: "veintinueve"
    };

    const mil = "dos mil";
    const resto = anio % 100;
    if (resto === 0) return mil;
    if (especiales[resto]) return `${mil} ${especiales[resto]}`;
    const decena = Math.floor(resto / 10);
    const unidad = resto % 10;
    return `${mil} ${decenas[decena]}${unidad ? " y " + unidades[unidad] : ""}`;
  };

  const dia = numeroALetras(fecha.getDate());
  const numeroDia = fecha.getDate();
  const mes = meses[fecha.getMonth()];
  const anio = fecha.getFullYear();
  const anioEnLetras = anioALetras(anio);

  return `${dia} (${numeroDia}) de ${mes} de ${anioEnLetras} (${anio})`;
};