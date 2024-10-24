
import "./recordatorio.css";
import logo from "../../img/logoAveza.png";
import { Button } from "../Mystyles";
import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";
import { recordarPassword } from "../../redux/actions";


const RecordatorioContrasena = () => {

    const navigate = useNavigate();

    const [userData, setUserData] = useState({
      email: "",
      cedula: ""
    });

    const handlerPassword = async (e) => {
      e.preventDefault();

      const { email,cedula } = userData;
      console.log("Datos recordar password:", email);

      try {
        await recordarPassword(email,cedula);
        window.alert("Se envió el recordatorio por email");
        window.close();
        // navigate("/");
      } catch (error) {
        window.alert("No se envió el recordatorio");
      }
    };
    const handleChange = (e) => {
      // setErrores(validar({ ...userData, [e.target.name]: e.target.value }));
      setUserData({
        ...userData,
        [e.target.name]: e.target.value, // Sintaxis ES6 para actualizar la key correspondiente
      });
  };
  
  return (
    <div className="contenedorrecordatorio">
      <div className="encabezado">
        <img src={logo} alt="logo-aveza" title="AVEZA SAS" />
        <br />
        <h1 className="titulo">Recordar contraseña</h1>
        <br />
        <span>Se enviará un link para cambiar la contraseña al correo que tienes registrado</span>
      </div>
      <br />
      <div className="emailinput">
        <label className="label-password" htmlFor="correo">
          Usuario:
        </label>
        <input className="emailrecordatorio" type="number" name="cedula" id="cedula" onChange={handleChange} />
      </div>
      <div className="emailinput">
        <label className="label-password" htmlFor="correo">
          Email:
        </label>
        <input className="emailrecordatorio" type="email" name="email" id="email" onChange={handleChange} />
      </div>
      <br />

      <div className="recordar-password">
        <Button onClick={handlerPassword} >Enviar</Button>
        <br />
        <br />
        <Link to="/">
          <Button>Volver</Button>
        </Link>
      </div>
    </div>
  );
};
export default RecordatorioContrasena;
