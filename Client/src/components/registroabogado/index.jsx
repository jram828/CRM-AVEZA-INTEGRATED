import { useState } from "react";
import "../../App.css";
import "./registroabogado.css";
import { Button } from "../Mystyles";
import { registroAbogado } from "../../handlers/registroAbogado";
import { useNavigate } from "react-router-dom";

const RegistroAbogado = () => {
  const [userDataRegistro, setUserDataRegistro] = useState({
    email: "",
    nombres: "",
    apellidos: "",
    cedulaAbogado: "",
    celular: "",
    direccion: "",
    nombre_ciudad: "",
    tarjetaProf: "",
    password: "",
    administrador: false,
  });
  
  const navigate = useNavigate();
  const handleChangeRegistro = (e) => {
    setUserDataRegistro({
      ...userDataRegistro,
      [e.target.name]: e.target.value, // Sintaxis ES6 para actualizar la key correspondiente
    });
  };

  const submitHandlerRegistro = (e) => {
    e.preventDefault();
    registroAbogado(userDataRegistro);
    navigate("/abogados");
  };

    const handleChangeAdministrador = (e) => {
      if (e.target.checked) {
        setUserDataRegistro((prevState) => ({
          ...prevState,
          administrador: true,
        }));
      }
    };

  return (
    <div className="contenedorregistro">
      <form className="datos" method="post" onSubmit={submitHandlerRegistro}>
        {/* <div className="logo-aveza"> */}
        <h1 className="titulo">Registro de Abogado</h1>
        {/* <img src={logo} alt="logo-aveza" /> */}
        {/* </div> */}
        <br />
        <br />
        <div className="inforegistroabogado">
          <label htmlFor="nombre" className="labelregistroabogado">
            Nombre(s):
          </label>
          <input
            type="text"
            name="nombres"
            id="name"
            className="cajaregistroabogado"
            value={userDataRegistro.nombres}
            onChange={handleChangeRegistro}
          />
          <label htmlFor="apellidos" className="labelregistroabogado">
            Apellido(s):
          </label>
          <input
            type="text"
            className="cajaregistroabogado"
            name="apellidos"
            id="lastname"
            value={userDataRegistro.apellidos}
            onChange={handleChangeRegistro}
          />
        </div>
        <br />
        <br />
        <div className="inforegistroabogado">
          <label htmlFor="cedula" className="labelregistroabogado">
            Numero de cédula:
          </label>
          <input
            type="number"
            className="cajaregistroabogado"
            name="cedulaAbogado"
            id="cedula"
            value={userDataRegistro.cedulaAbogado}
            onChange={handleChangeRegistro}
          />

          <label htmlFor="telefono" className="labelregistroabogado">
            {" "}
            Celular:
          </label>
          <input
            type="number"
            name="celular"
            id="celular"
            className="cajaregistroabogado"
            value={userDataRegistro.celular}
            onChange={handleChangeRegistro}
          />
        </div>

        <br />
        <br />
        <div className="inforegistroabogado">
          <label htmlFor="correo" className="labelregistroabogado">
            Email:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="cajaregistroabogado"
            value={userDataRegistro.email}
            onChange={handleChangeRegistro}
          />

          <label htmlFor="direccion" className="labelregistroabogado">
            Dirección:
          </label>
          <input
            type="text"
            name="direccion"
            id="address"
            className="cajaregistroabogado"
            value={userDataRegistro.direccion}
            onChange={handleChangeRegistro}
          />
        </div>

        <br />
        <br />
        <div className="inforegistroabogado">
          <label htmlFor="ciudad" className="labelregistroabogado">
            Ciudad:
          </label>
          <input
            type="text"
            name="nombre_ciudad"
            id="city"
            className="cajaregistroabogado"
            value={userDataRegistro.nombre_ciudad}
            onChange={handleChangeRegistro}
          />
          <label htmlFor="tarjetaProf" className="labelregistroabogado">
            Tarjeta profesional:
          </label>
          <input
            type="number"
            className="cajaregistroabogado"
            name="tarjetaProf"
            id="tarjetaProf"
            value={userDataRegistro.tarjetaProf}
            onChange={handleChangeRegistro}
          />
        </div>
        <br />
        <div className="administrador">
          <label htmlFor="administrador" className="labeladministrador">
            Administrador ?
          </label>
          <br />
          <input
            type="checkbox"
            className="checkboxadministrador"
            name="administrador"
            id="administrador"
            // value={dataRegistro.administrador}
            onChange={handleChangeAdministrador}
          />
        </div>
        <br />
        <br />
        <div className="inforegistroabogado">
          <Button
            onClick={submitHandlerRegistro}
            disabled={
              !userDataRegistro.email ||
              !userDataRegistro.cedulaAbogado ||
              !userDataRegistro.nombres ||
              !userDataRegistro.apellidos
            }
          >
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
export default RegistroAbogado;
