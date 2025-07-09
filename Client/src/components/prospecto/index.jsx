import React from "react";
// import "../../App.css";
import "./prospecto.css";
import { Link } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  prospectoActual,
  getProspectoByCedula,
  setAbogado, clienteActual
} from "../../redux/actions";
import { useState, useEffect } from "react";
import { numeroALetras } from "../convertiraletras";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Prospecto = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //const cliente = useSelector((state) => state.cliente);
  const source = useSelector((state) => state.source);
 const cedula =
  source === "abogado"
    ? props.prospecto.cedulaAbogado
    : source === "prospecto"
    ? props.prospecto.cedulaProspecto
    : props.prospecto.cedulaCliente;
  

  const onClickDetail = () => {
    if (source === "prospecto") {
      dispatch(prospectoActual(props.prospecto));
      window.localStorage.setItem("prospecto", JSON.stringify(props.prospecto));
      navigate("/detail");
    } else if (source === "abogado"){
      window.localStorage.setItem("abogado", JSON.stringify(props.prospecto));
      dispatch(setAbogado(props.prospecto));
      navigate("/detail");
    } else {
      window.localStorage.setItem("cliente", JSON.stringify(props.prospecto));
      dispatch(clienteActual(props.prospecto));
      navigate("/detail");
    }
  };

  return (
    <div className="cardprospecto" key={cedula}>
      <Link to={"/detail"} onClick={onClickDetail} className="link">
        <h1 className="titulocard">
          {props.prospecto.nombres.toUpperCase()}{" "}
          {props.prospecto.apellidos.toUpperCase()}
        </h1>
      </Link>
    </div>
  );
};
Prospecto.propTypes = {
  prospecto: PropTypes.shape({
    cedulaAbogado: PropTypes.string,
    cedulaProspecto: PropTypes.string,
    cedulaCliente: PropTypes.string,
    nombres: PropTypes.string.isRequired,
    apellidos: PropTypes.string.isRequired,
  }).isRequired,
};

export default Prospecto;

