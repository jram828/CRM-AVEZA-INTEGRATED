import React from "react";
// import "../../App.css";
import "./cliente.css";
import { Link } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  clienteActual,
  getClienteByCedula,
  setAbogado,
} from "../../redux/actions";
import { useState, useEffect } from "react";
import { numeroALetras } from "../convertiraletras";
import { useNavigate } from "react-router-dom";

const Cliente = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //const cliente = useSelector((state) => state.cliente);
  const source = useSelector((state) => state.source);
  const cedula =
    source === "abogado"
      ? props.cliente.cedulaAbogado
      : props.cliente.cedulaCliente;
  // const cedula = source === "abogado" ? datos.nombres : datos.cedulaCliente;
  // const {
  //   cedulaCliente,
  //   email,
  //   nombres,
  //   apellidos,
  //   direccion,
  //   codigo_ciudad,
  //   celular,
  //   Ciudads,
  //   comentarios,
  // } = props.cliente;

  console.log("Props cliente:", props.cliente);

  //  const newCliente = {
  //    cedulaCliente,
  //    email,
  //    nombres,
  //    apellidos,
  //    direccion,
  //    codigo_ciudad,
  //    celular,
  //    Ciudads,
  //    comentarios,
  //  };

  const onClickDetail = () => {
    if (source === "cliente") {
      dispatch(clienteActual(props.cliente));
      window.localStorage.setItem("cliente", JSON.stringify(props.cliente));
      navigate("/detail");
    } else {
      window.localStorage.setItem("abogado", JSON.stringify(props.cliente));
      dispatch(setAbogado(props.cliente));
      navigate("/detail");
    }
  };

  return (
    <div className="cardcliente" key={cedula}>
      <Link to={"/detail"} onClick={onClickDetail} className="link">
        <h1 className="titulocard">
          {props.cliente.nombres.toUpperCase()}{" "}
          {props.cliente.apellidos.toUpperCase()}
        </h1>
      </Link>
    </div>
  );
};

export default Cliente;
