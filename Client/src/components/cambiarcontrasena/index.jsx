import "./cambiar.css";
import logo from "../../img/logoAveza.png";
import { Button } from "../Mystyles";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { cambiarPassword } from "../../redux/actions";

const CambiarContrasena = () => {
  const [queries, setQueries] = useState({});
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

  console.log("objeto queries: ", queries);

  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handlerPassword = async (e) => {
    e.preventDefault();

    const { newPassword } = userData;
    console.log("Datos recordar password:", newPassword);

    try {
      await cambiarPassword(newPassword, queries.cedula);
      // console.log("Respuesta password:", data);
      window.alert("Se ha cambiado la contraseña exitosamente");
      navigate("/");
    } catch (error) {
      window.alert("No fue posible cambiar la contraseña");
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
        <h1 className="titulo">Cambiar contraseña</h1>
        <br />
        <span>Ingrese su nueva contraseña</span>
      </div>
      <br />
      <div className="emailinput">
        <label className="label-password" htmlFor="correo">
          Nueva contraseña:
        </label>
        <input
          className="emailrecordatorio"
          type="password"
          name="newPassword"
          id="newPassword"
          onChange={handleChange}
        />
      </div>
      <div className="emailinput">
        <label className="label-password" htmlFor="correo">
          Repetir contraseña:
        </label>
        <input
          className="emailrecordatorio"
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          onChange={handleChange}
        />
      </div>
      <br />

      <div className="recordar-password">
        <Button onClick={handlerPassword}>Guardar</Button>
      </div>
    </div>
  );
};
export default CambiarContrasena;
