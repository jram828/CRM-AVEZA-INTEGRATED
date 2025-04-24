import React, { useState } from "react";

const FormularioNumerico = () => {
  const [numero, setNumero] = useState("");

  const manejarCambio = (e) => {
    const valor = e.target.value.replace(/\./g, "").replace(/,/g, ".");
    if (!isNaN(valor)) {
      setNumero(Number(valor));
    }
  };

  const formatoNumero = (numero) => {
    return numero.toLocaleString("es-CO", { minimumFractionDigits: 2 });
  };

  return (
    <div>
      <label htmlFor="numero">Ingrese un número:</label>
      <input
        id="numero"
        type="text"
        value={numero ? formatoNumero(numero) : ""}
        onChange={manejarCambio}
      />
      <p>Estado actual: {numero}</p>
    </div>
  );
};

export default FormularioNumerico;