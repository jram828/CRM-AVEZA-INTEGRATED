import "./payments.css";
import VerPagos from "../verPagos/verPagos";
import RealizarPago from "../realizarPago/realizarPago";

function Payments() {

  const user = JSON.parse(localStorage.getItem("loggedUser"));
  console.log("User:", user);

  return (
    <div className="contenedorpagos">
      <div className="encabezado">
        <h1 className="titulo">Pagos</h1>
      </div>
      {user.cedulaCliente ? (
        <RealizarPago></RealizarPago>
      ) : (
        <VerPagos></VerPagos>
      )}
    </div>
  );
}

export default Payments;
