//Importar modulos necesarios
import { useState } from "react";
import "./App.css";
import Nav from "./components/nav/index.jsx";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import PrevisualizarContrato from "./components/previsualizarcontrato/index.jsx";
import Detail from "./components/detail/index.jsx";
import Form from "./components/login/index.jsx";
import GenerarFactura from "./components/generarfactura/index.jsx";
import DocumentosLegales from "./components/documentoslegales/index.jsx";
import Cotizacion from "./components/cotizacion/index.jsx";
import Clientes from "./components/clientes/index.jsx";
import Contrato from "./components/contrato/index.jsx";
import ConfigurarRecordatorios from "./components/configurarrecordatorios/index.jsx";
import AgendarCitas from "./components/agendarcitas/index.jsx";
import RegistroCliente from "./components/registrocliente/index.jsx";
import CrearUsuario from "./components/crearusuario/index.jsx";
import RecordatorioContrasena from "./components/recordatoriocontrasena/index.jsx";
import axios from "axios";
import logo from "./img/logoAveza.png";
import PDF from "./components/PDF/index.jsx";
import Autorizacion from "./components/autorizacion/index.jsx";
import Insolvencia from "./components/insolvencia/index.jsx";
import Poder from "./components/poder/index.jsx";
import WordToHtml from "./components/wordtohtml/index.jsx";
import { useDispatch } from "react-redux";
import { setAuth } from "./redux/actions.js";
import Abogados from "./components/abogados/index.jsx";
import RegistroAbogado from "./components/registroabogado/index.jsx";
import Casos from "./components/casos/index.jsx";
import DetailCasos from "./components/detailCasos/detailCasos.jsx";
import CrearCaso from "./components/CrearCaso/crearCaso.jsx";
import Consultas from "./components/consultas/consultas.jsx";
import AllConsultas from "./components/allConsultas/allConsultas.jsx";
import Payments from "./components/payments/payments.component.jsx";
import { crearUsuario } from "./handlers/crearUsuario.jsx";
import Status from "./components/status/index.jsx";
import CambiarContrasena from "./components/cambiarcontrasena/index.jsx";

const URL = import.meta.env.VITE_URL;
// const { URL } = process.env;
// axios.defaults.baseURL = "https://crm-aveza.onrender.com/crmAveza";

axios.defaults.baseURL = URL;

function App() {
  const [access, setAccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const isAuthenticated = useSelector((state) => state.isAuthenticated);

  //Funcion para verificar datos de ingreso
  async function login(userData) {
    const { cedula, password, rol } = userData;
    const URL = "/login";
    console.log("Datos login:", { cedula, password, rol });
    try {
      const { data } = await axios(
        URL + `?cedula=${cedula}&password=${password}`
      );
      console.log("Login propio:", data);
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
  }

  const logout = () => {
    window.localStorage.setItem("loggedUser", JSON.stringify({}));
    alert("Ha salido exitosamente");
    setAccess(false);
    navigate("/");
  };

  // const sendSMS = () => {
  //   // setAccess(false);
  //   navigate("/sms");
  // };

  // const onClose = (id) => {
  //   const charactersFilter = characters.filter(
  //     (character) => character.id !== id
  //   );
  //   setCharacters(charactersFilter);
  // };

  //Acceder al modulo de crear usuario
  const clickHandlerCrear = (e) => {
    e.preventDefault();
    setAccess(true);
    navigate("/crearusuario");
  };

  //Acceder al modulo de recordar contraseñas
  const clickHandlerRecordatorio = (e) => {
    e.preventDefault();
    setAccess(true);

    navigate("/recordatoriocontrasena");
  };

  return (
    //Renderizar menu principal en las rutas correspondientes
    <div className="App">
      {location.pathname !== "/" &&
      location.pathname !== "/crearusuario" &&
      location.pathname !== "/recordatoriocontrasena" &&
      location.pathname !== "/cambiarcontrasena" &&
      location.pathname !== "/consultas" ? (
        <Nav logout={logout} />
      ) : undefined}

      {location.pathname === "/home" ? (
        <div className="logo-aveza2">
          <br></br>
          <br></br>
          <br></br>
          <img src={logo} alt="logo-aveza" title="AVEZA SAS" />
          <br></br>
          <br></br>
          <br></br>
          <h1 className="titulo">Bienvenido a CRM AVEZA</h1>
        </div>
      ) : undefined}

      <Routes>
        <Route
          path="/"
          element={
            <Form
              login={login}
              clickHandlerRecordatorio={clickHandlerRecordatorio}
              clickHandlerCrear={clickHandlerCrear}
            />
          }
        />
        <Route
          path="/crearusuario"
          element={<CrearUsuario crearUsuario={crearUsuario} />}
        />
        <Route path="/consultas" element={<Consultas />} />
        <Route path="generar" element={<WordToHtml />} />
        <Route path="generarfactura" element={<GenerarFactura />} />
        <Route path="cotizacion" element={<Cotizacion />} />
        <Route path="autorizacion" element={<Autorizacion />} />
        <Route path="poder" element={<Poder />} />
        <Route path="PDF" element={<PDF />} />
        <Route path="insolvencia" element={<Insolvencia />} />
        <Route path="registrocliente" element={<RegistroCliente />} />
        <Route path="registroabogado" element={<RegistroAbogado />} />
        <Route path="detail" element={<Detail />} />
        <Route
          path="previsualizarcontrato"
          element={<PrevisualizarContrato />}
        />
        <Route
          path="configurarrecordatorios"
          element={<ConfigurarRecordatorios />}
        />
        <Route path="agendarcitas" element={<AgendarCitas />} />
        <Route
          path="/recordatoriocontrasena"
          element={<RecordatorioContrasena />}
        />
        <Route path="/cambiarcontrasena" element={<CambiarContrasena />} />
        <Route path="documentoslegales" element={<DocumentosLegales />} />
        <Route path="contrato" element={<Contrato />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="casos" element={<Casos />} />
        <Route path="casos/:id" element={<DetailCasos />} />
        <Route path="casos/crearcaso" element={<CrearCaso />} />
        <Route path="abogados" element={<Abogados />} />
        <Route path="verconsultas" element={<AllConsultas />} />
        <Route path="pagos" element={<Payments />} />
        <Route path="pagos/status" element={<Status />} />
      </Routes>
    </div>
  );
}

export default App;
