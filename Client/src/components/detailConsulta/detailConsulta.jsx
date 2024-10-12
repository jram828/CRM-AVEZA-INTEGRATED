import "./detailConsulta.css";

import {  useNavigate} from "react-router-dom";
import { useDispatch} from "react-redux";
import { deleteConsulta} from "../../redux/actions";

function DetailConsulta({consulta}) {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("Consulta detail:", consulta);

  const handleComplete = (e) => {
    e.preventDefault();
    const isConfirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar esta consulta?"
    );

    if (isConfirmed) {
      dispatch(deleteConsulta(consulta.id));
      console.log("id", consulta.id);
      window.location.reload();
      // navigate("/verconsultas");
    }
  };



  return (
    <div className="contenedordetailconsulta">
      {consulta.activo ? (
        <button onClick={handleComplete} className="complete">
          ✅
        </button>
      ) : undefined}
      <span className="tituloconsulta">Consulta N° {consulta.id}</span>
      <div className="infoconsultatarjeta">
        <span className="labelconsulta">Remitente: </span>
        <span className="nombreconsulta">
          {consulta.nombre} {consulta.apellido}
        </span>
      </div>
      <div className="infoconsultatarjeta">
        <span className="labelconsulta">Fecha: </span>
        <span className="nombreconsulta">
          {consulta.createdAt.split("T")[0]}
        </span>
      </div>
      <div className="infoconsultatarjeta">
        <span className="labelconsulta">Correo electrónico: </span>
        <span className="nombreconsulta">{consulta.correo}</span>
      </div>
      <div className="infoconsultatarjeta">
        <span className="labelconsulta">Celular: </span>
        <span className="nombreconsulta">{consulta.telefono}</span>
      </div>
      <div className="infoconsultatarjeta">
        <span className="labelconsulta">Consulta: </span>
        <span className="nombreconsulta">{consulta.consulta}</span>
      </div>
    </div>
  );
}

export default DetailConsulta;
