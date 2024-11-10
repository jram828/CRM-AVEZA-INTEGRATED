import { useEffect, useState } from "react";
import "./status.css";
import { useLocation } from "react-router-dom";
// import axios from "axios";
import { verificarPago } from "../../handlers/verificarPago";

import { printDivContent } from "../../utils/printDivContent";
import { Button } from "../Mystyles";
// const ACCESSTOKEN = import.meta.env.VITE_ACCESS_TOKEN;

function Status() {
  const [queries, setQueries] = useState({});
  const [datosPago, setDatosPago] = useState({});
  const { search } = useLocation();

  // console.log('Search: ', search)

  useEffect(() => {
    const replaceFirst = search.replace("?", "");
    const splitString = replaceFirst.split("&");
    console.log("array queries: ", splitString);

    const formattedQueries = {};

    splitString.forEach((query) => {
      const [key, value] = query.split("=");
      Object.assign(formattedQueries, { [key]: value });
    });

    setQueries(formattedQueries);
  }, []);

  // console.log("objeto queries: ", queries);
  console.log("Payment id: ", queries.payment_id);

  function generatePDF() {
    printDivContent("comprobante");
  }

  // if (queries.payment_id) {
  useEffect(() => {
    const datos = obtenerPago(queries.payment_id);
    console.log("Informacion del pago: ", datos);
    setDatosPago(datos);
  }, [queries.payment_id]);
  // }

  const obtenerPago = async (id) => {
    console.log("Payment id obtener pago: ", id);
    try {
      const paymentData = await verificarPago(id);
      console.log("Respuesta verificacion pago: ", paymentData);
      setDatosPago(paymentData);
      return paymentData;
    } catch (error) {
      window.alert("No se obtuvieron los datos del pago");
    }
  };

  return (
    <div  className="contenedorstatus">
      
      <div id="comprobante" className="infopago">
      <div className="encabezado">
        <h1 className="titulo">Estado de la transacción</h1>
      </div>
        <div className="pagoinput">
          <label className="label-pago">
            ID de pago:
          </label>
          <input
            value={datosPago.id}
            className="cajapago"
            disabled
          />
        </div>
        <div className="pagoinput">
          <label className="label-pago">
            Estado:
          </label>
          <input
            value={datosPago.status}
            className="cajapago"
            disabled
          />
        </div>
        <div className="pagoinput">
          <label className="label-pago">
            Valor:
          </label>
          <input
            value={datosPago.transaction_amount}
            className="cajapago"
            disabled
          />
        </div>
        <div className="pagoinput">
          <label className="label-pago">
            Método de pago:
          </label>
          <input
            value={datosPago.payment_type_id}
            className="cajapago"
            disabled
          />
        </div>
        <div className="pagoinput">
          <label className="label-pago">
            Fecha:
          </label>
          <input
            type="text"
            value={datosPago.date_approved}
            className="cajapago"
            disabled
          />
        </div>
        <div className="pagoinput">
          <label className="label-pago">Descripción:</label>
          <input
            value={datosPago.description}
            type="text"
            className="cajapago"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {/* <Link to="/home">
          <button className="btn btn-xs border border-accent bg-white hover:bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 512 512"><path fill="none" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth={50.5} d="M244 400L100 256l144-144M120 256h292"></path></svg>
              Volver
              </button>
            </Link> */}

        {/* <Link to="/home/payments">
          <button className="btn btn-xs bg-white text-black  border-error w-35 flex items-center justify-center">
            Reintentar pago
          </button>
        </Link> */}

        <Button
          onClick={generatePDF}
          className="btn btn-xs  bg-white text-black  border-success w-35 flex items-center justify-center"
        >
          Guardar comprobante
        </Button>
      </div>
    </div>
  );
}

export default Status;
