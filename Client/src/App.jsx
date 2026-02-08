//Importar modulos necesarios
import { useState } from "react";
import Nav from "./components/nav/index.jsx";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "./img/logoAveza.png";
import { useDispatch } from "react-redux";
import { setAuth } from "./redux/actions.js";

// Componentes
import Form from "./components/login/index.jsx";
import CrearUsuario from "./components/crearusuario/index.jsx";
import RecordatorioContrasena from "./components/recordatoriocontrasena/index.jsx";
import CambiarContrasena from "./components/cambiarcontrasena/index.jsx";
import Consultas from "./components/consultas/consultas.jsx";
import { crearUsuario } from "./handlers/crearUsuario.jsx";

// Rutas protegidas (internas)
import PrevisualizarContrato from "./components/previsualizarcontrato/index.jsx";
import Detail from "./components/detail/index.jsx";
import GenerarFactura from "./components/generarfactura/index.jsx";
import DocumentosLegales from "./components/documentoslegales/index.jsx";
import Cotizacion from "./components/cotizacion/index.jsx";
import Clientes from "./components/clientes/index.jsx";
import Contrato from "./components/contrato/index.jsx";
import ConfigurarRecordatorios from "./components/configurarrecordatorios/index.jsx";
import AgendarCitas from "./components/agendarcitas/index.jsx";
import AgendarCitasPriv from "./components/agendarcitaspriv/index.jsx";
import RegistroCliente from "./components/registrocliente/index.jsx";
import PDF from "./components/PDF/index.jsx";
import Autorizacion from "./components/autorizacion/index.jsx";
import Insolvencia from "./components/insolvencia/index.jsx";
import Poder from "./components/poder/index.jsx";
import WordToHtml from "./components/wordtohtml/index.jsx";
import Abogados from "./components/abogados/index.jsx";
import RegistroAbogado from "./components/registroabogado/index.jsx";
import Casos from "./components/casos/index.jsx";
import DetailCasos from "./components/detailCasos/detailCasos.jsx";
import CrearCaso from "./components/CrearCaso/crearCaso.jsx";
import AllConsultas from "./components/allConsultas/allConsultas.jsx";
import Payments from "./components/payments/payments.component.jsx";
import Status from "./components/status/index.jsx";
import RegistroProspecto from "./components/registroprospecto/index.jsx";
import Prospectos from "./components/prospectos/index.jsx";
import SidebarDemo from "./components/sidebar/index.jsx";
import Tareas from "./components/tareas/index.jsx";
import Campaigns from "./components/campaigns/index.jsx";

// URL base
const URL = import.meta.env.VITE_URL;
axios.defaults.baseURL = URL;

function App() {
  const [access, setAccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const rutasSinSidebar = [
    "/",
    "/crearusuario",
    "/recordatoriocontrasena",
    "/cambiarcontrasena",
    "/consultas",
    "/AsesoriaGratuita",
  ];

  async function login(userData) {
    const { cedula, password } = userData;
    const URL = "/login";
    try {
      const { data } = await axios(URL + `?cedula=${cedula}&password=${password}`);
      const { access } = data;
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
    } catch {
      window.alert("Usuario o contraseña incorrectos");
    }
  }

  const logout = () => {
    window.localStorage.setItem("loggedUser", JSON.stringify({}));
    alert("Ha salido exitosamente");
    setAccess(false);
    navigate("/");
  };

  const clickHandlerCrear = (e) => {
    e.preventDefault();
    setAccess(true);
    navigate("/crearusuario");
  };

  const clickHandlerRecordatorio = (e) => {
    e.preventDefault();
    setAccess(true);
    navigate("/recordatoriocontrasena");
  };

  return (
    <div className="App">
      {/* Nav */}
      {/* {!rutasSinSidebar.includes(location.pathname) && <Nav logout={logout} />} */}

      {!rutasSinSidebar.includes(location.pathname) && <SidebarDemo logout={logout} />}

      {/* Pantalla de inicio */}
      {/* {location.pathname === "/home" && (
        <div className="logo-aveza2">
          <br /><br /><br />
          <img src={logo} alt="logo-aveza" title="AVEZA SAS" />
          <br /><br /><br />
          <h1 className="titulo">Bienvenido a CRM AVEZA</h1>
        </div>
      )} */}

      <Routes>
        {/* Rutas públicas */}
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
        <Route path="/crearusuario" element={<CrearUsuario crearUsuario={crearUsuario} />} />
        <Route path="/recordatoriocontrasena" element={<RecordatorioContrasena />} />
        <Route path="/cambiarcontrasena" element={<CambiarContrasena />} />
        <Route path="/consultas" element={<Consultas />} />
        <Route path="/AsesoriaGratuita" element={<AgendarCitas />} />

        {/* Rutas privadas (con layout/sidebar) */}
        <Route
          path="*"
          element={
           
              <Routes>
                <Route path="/home" element={
                  <div className="logo-aveza2 text-center">
                    <br /><br /><br />
                    <img src={logo} alt="logo-aveza" title="AVEZA SAS" />
                    <br /><br /><br />
                    <h1 className="titulo">Bienvenido a CRM AVEZA</h1>
                  </div>
                } />
                <Route path="/generar" element={<WordToHtml />} />
                <Route path="/generarfactura" element={<GenerarFactura />} />
                <Route path="/cotizacion" element={<Cotizacion />} />
                <Route path="/autorizacion" element={<Autorizacion />} />
                <Route path="/poder" element={<Poder />} />
                <Route path="/PDF" element={<PDF />} />
                <Route path="/insolvencia" element={<Insolvencia />} />
                <Route path="/registrocliente" element={<RegistroCliente />} />
                <Route path="/registroprospecto" element={<RegistroProspecto />} />
                <Route path="/registroabogado" element={<RegistroAbogado />} />
                <Route path="/detail" element={<Detail />} />
                <Route path="/previsualizarcontrato" element={<PrevisualizarContrato />} />
                <Route path="/configurarrecordatorios" element={<ConfigurarRecordatorios />} />
                <Route path="/agendarcitas" element={<AgendarCitasPriv />} />
                <Route path="/documentoslegales" element={<DocumentosLegales />} />
                <Route path="/contrato" element={<Contrato />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/prospectos" element={<Prospectos />} />
                <Route path="/casos" element={<Casos />} />
                <Route path="/casos/:id" element={<DetailCasos />} />
                <Route path="/casos/crearcaso" element={<CrearCaso />} />
                <Route path="/abogados" element={<Abogados />} />
                <Route path="/verconsultas" element={<AllConsultas />} />
                <Route path="/campanas" element={<Campaigns />} />
                <Route path="/pagos" element={<Payments />} />
                <Route path="/pagos/status" element={<Status />} />
                <Route path="/tareas" element={<Tareas />} />
              </Routes>
          
          }
        />

      </Routes>
    </div>
  );
}

export default App;
