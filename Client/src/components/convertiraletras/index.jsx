export const numeroALetras=(numero, opciones = {}) =>{
  const defaults = {
    plural: "pesos",
    singular: "peso",
    centPlural: "centavos",
    centSingular: "centavo",
  };

  const config = { ...defaults, ...opciones };

  const unidades = [
    "",
    "un",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
  ];

  const decenas = [
    "",
    "diez",
    "veinte",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
  ];

  const especiales = [
    "diez",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
  ];

  const centenas = [
    "",
    "ciento",
    "doscientos",
    "trescientos",
    "cuatrocientos",
    "quinientos",
    "seiscientos",
    "setecientos",
    "ochocientos",
    "novecientos",
  ];

  const miles = ["", "mil", "millones", "mil", "billón"];

  function convertirUnidades(numero) {
    return unidades[numero];
  }

  function convertirDecenas(numero) {
    if (numero < 10) {
      return convertirUnidades(numero);
    } else if (numero < 20) {
      return especiales[numero - 10];
    } else {
      const unidad = numero % 10;
      const decena = Math.floor(numero / 10);
      return (
        decenas[decena] + (unidad > 0 ? ` y ${convertirUnidades(unidad)}` : "")
      );
    }
  }

  function convertirCentenas(num) {
            if (num < 100) {
                return convertirDecenas(num);
            } else {
                const centena = Math.floor(num / 100);
                const resto = num % 100;
                return centenas[centena] + (resto > 0 ? " " + convertirDecenas(resto) : "");
            }
  }

  function convertirMiles(numero, indice) {
    if (numero === 1 && indice === 1) {
      return "mil";
    } else {
      return convertirCentenas(numero) + " " + miles[indice];
    }
  }

  function convertirNumeroALetras(numero) {
    if (numero === 0) {
      return "cero";
    }

    let resultado = "";
    let indice = 0;

    while (numero > 0) {
      const grupo = numero % 1000;
      if (grupo > 0) {
        resultado = convertirMiles(grupo, indice) + " " + resultado;
      }
      numero = Math.floor(numero / 1000);
      indice++;
    }

    return resultado.trim();
  }

  const parteEntera = Math.floor(numero);
  const parteDecimal = Math.round((numero - parteEntera) * 100);

  const letrasParteEntera = convertirNumeroALetras(parteEntera);
  const letrasParteDecimal = convertirNumeroALetras(parteDecimal);

  const moneda = parteEntera === 1 ? config.singular : config.plural;
  const centavos = parteDecimal === 1 ? config.centSingular : config.centPlural;

  return `${letrasParteEntera} ${moneda}`;
}
