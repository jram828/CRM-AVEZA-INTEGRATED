import "./realizarPago.css";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { useEffect, useState } from "react";
import { crearPago } from "../../handlers/crearPago";

import { useDispatch, useSelector } from "react-redux";
import { getPagos, getCasosTodos } from "../../redux/actions";
import loading from "../../assets/loading.gif";
import { Button } from "../Mystyles";

function RealizarPago() {
  // initMercadoPago(PUBLIC_KEY);
  initMercadoPago("APP_USR-7ccd39cc-ace8-49a9-a987-b73021893c3b", {
    locale: "es-CO",
  });

  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const [userPreference, setUserPreference] = useState({
    quantity: "1",
    unit_price: "",
    idCaso: "",
    description: "Honorarios",
  });

  const [loadingState, setLoadingState] = useState(true);

  const handlePay = async () => {
    try {
      // Realizar la llamada a la API para crear la orden de pago en MercadoPago
      console.log("Datos crear usuario: ", userPreference);
      const paymentData = await crearPago(userPreference);
      console.log("Respuesta creacion pago: ", paymentData);

      // Redirigir a la página de pago de MercadoPago
      window.open(paymentData.init_point, "_self");
    } catch (error) {
      console.error(error);
      // Manejo de errores
    }
  };

  const handleChangePagos = (e) => {
    setUserPreference({
      ...userPreference,
      [e.target.name]: e.target.value, // Sintaxis ES6 para actualizar la key correspondiente
    });
  };

  const dispatch = useDispatch();
  const pages = useSelector((state) => state.pages);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingState(true);
      await dispatch(getCasosTodos());
      setLoadingState(false);
    };
    fetchData();
  }, [dispatch]);

  console.log('Casos para pagos:', pages)
  console.log('User:', user)
  
  if (pages.datosPagina) {
    
    var userCasos = pages.datosPagina.filter(
      (caso) =>
        caso.nombresCliente === user.nombres &&
        caso.apellidosCliente === user.apellidos
    );
  } else {
    var userCasos = pages.filter(
      (caso) =>
        caso.nombresCliente === user.nombres &&
        caso.apellidosCliente === user.apellidos
    );
  }

  return (
    <div className="">
        <h1 className="encabezadopagos">
          Realizar un pago
        </h1>
        <p>Ingresa el valor de los honorarios que deseas pagar.</p>
        <br />
        <div className="inputpago">
          <label htmlFor="unit_price" className="labelpagos">
            Valor a pagar:
            </label>
            {/* <br /> */}
          <input
            name="unit_price"
            type="number"
            value={userPreference.unit_price}
            onChange={handleChangePagos}
            id="unit_price"
            className="cajaspago"
          />
        </div>
        <br />
        <div className="selectcaso">
          <p>
            Selecciona el caso al cual se va a aplicar el pago
          </p>
          {pages.datosPagina ? (
              <select
                name="idCaso"
                id="idCaso"
                onChange={(event) => handleChangePagos(event)}
                className="cajaspago"
              >
                <option value="" className="cajaspago">
                  Seleccionar caso
                </option>
                {userCasos.map((caso) => (
                  <option key={caso.id} value={caso.id} className="cajaspago">
                    {`${caso.descripcion} - ${caso.apellidosAbogado}/${caso.apellidosCliente}`}
                  </option>
                ))}
              </select>
           
          ) : (
            <label className="w-full text-black text-md">
              No se encontraron casos para asociar al pago.
            </label>
          )}
          <br />
        </div>
        <Button onClick={handlePay}>
          Pagar
        </Button>
        <div id="wallet_container"></div>
        <br />
    </div>
  );
}

export default RealizarPago;
