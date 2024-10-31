import React, { useState} from "react";
import { validar } from "../../utils/validacion";
import "../../App.css";
import "./login.css";
import { Link } from "react-router-dom";
import {useNavigate } from "react-router-dom";
import logo from "../../img/logoAveza.png";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setAuth, setUserToken } from "../../redux/actions";
import photo from "../../assets/login.jpg";
import { Button } from "../Mystyles";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Form = ({ login, clickHandlerRecordatorio, clickHandlerCrear }) => {
  const [userData, setUserData] = useState({
    cedula: "",
    password: "",
  });

  const [errores, setErrores] = useState({
    cedula: "",
    password: "",
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setErrores(validar({ ...userData, [e.target.name]: e.target.value }));

    setUserData({
      ...userData,
      [e.target.name]: e.target.value, // Sintaxis ES6 para actualizar la key correspondiente
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    login(userData);
  };

  const responseMessage = async (response) => {
    const user = jwtDecode(response.credential);
    // Loginf();
    dispatch(setUserToken(user));
    const { rol } = userData;
    console.log("Datos login:", user.email, rol);
    try {
      const { data } = await axios(
        `/login/google/?email=${user.email}&rol=&${rol}`
      );

      console.log("Login 3:", data);

      const { access } = data;
      console.log("Access: ", access);

      window.localStorage.setItem("loggedUser", JSON.stringify(data.usuario));
      if (access === true) {
        dispatch(setAuth(access));

        if (data.usuario.administrador || data.usuario.cedulaAbogado) {
          navigate("/clientes");
        } else if (data.usuario.cedulaCliente) {
          navigate("/casos");
        } else {
          navigate("/home");
        }
      } else {
        window.alert("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      window.alert("Usuario o contraseña incorrectos");
    }
  };

  const errorMessage = (error) => {
    console.log(error);
    window.alert("Usuario o contraseña incorrectos");
  };

  // const { loginWithRedirect } = useAuth0();

  return (
    <div className="containerLogin-photo">
      <div className="containerLogin">
        <form onSubmit={submitHandler}>
          <table>
            <tr>
              <td></td>
              <td colSpan={2} className="celdas">
                <img
                  src={logo}
                  alt="Logo Aveza"
                  style={{ height: "90px", width: "90%" }}
                />
                <br />
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>
                <br />
              </td>
              <td>
                <label htmlFor="usuario" className="labellogin">
                  Usuario:
                </label>
              </td>
              <td>
                <input
                  type="number"
                  name="cedula"
                  id="username"
                  className="cajalogin"
                  placeholder="Ingrese su Usuario"
                  value={userData.cedula}
                  onChange={handleChange}
                />
              </td>
              <td></td>
            </tr>
            <tr>
              <td colSpan={4}>
                {errores.cedula !== "" && (
                  <h5 className="errores">{errores.cedula}</h5>
                )}
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td>
                <label className="labellogin" htmlFor="password">
                  Contraseña:
                </label>
              </td>
              <td>
                <input
                  name="password"
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={userData.password}
                  onChange={handleChange}
                  className="cajalogin"
                />
              </td>
              <td></td>
            </tr>
            <tr>
              <td colSpan={4}>
                {errores.password !== "" && (
                  <h5 className="errores">{errores.password}</h5>
                )}
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="celdas"></td>
              <td className="celdas">
                <Link to="/consultas">
                  <Button>Consultas</Button>
                </Link>
              </td>
              <td className="celdas">
                {" "}
                {errores.cedula || errores.password ? null : (
                  <Button type="submit">Ingresar</Button>
                )}
              </td>
              <td className="celdas"></td>
            </tr>
            <tr>
              <td></td>
              <td className="celdas">
                <Link to={"/crearusuario"} onClick={clickHandlerCrear}>
                  <Button>Crear usuario</Button>
                </Link>
              </td>
              <td className="celdas">
                <Link
                  to={"/recordatoriocontrasena"}
                  onClick={clickHandlerRecordatorio}
                >
                  <Button>¿Olvidó su contraseña?</Button>
                </Link>
              </td>
              <td></td>
            </tr>
          </table>
        </form>
        <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
      </div>
      <div className="containerPhoto">
        <img src={photo} alt="Foto login" className="imglogin" />
      </div>
    </div>
  );
};
export default Form;
