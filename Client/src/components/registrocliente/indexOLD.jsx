import { useState } from "react";
import "../../App.css";
import "./registrocliente.css";
import { Button } from "../Mystyles.js";
import { useNavigate } from "react-router-dom";
import { registroCliente } from "../../handlers/registroCliente.jsx";
import { codigoCiudades } from "../../utils/codigoCiudades.js"; // Asegúrate de que la ruta sea correcta
import { registroClienteExcel } from "../../handlers/registroClienteExcel.jsx";

const RegistroCliente = () => {
  const [userDataRegistro, setUserDataRegistro] = useState({
    email: "",
    nombres: "",
    apellidos: "",
    cedulaCliente: "",
    celular: "",
    direccion: "",
    nombre_ciudad: "",
    tipo_usuario: "3",
    tipo_de_caso: "",
    forma_de_pago: "",
    honorarios: "",
    cuotas: "",
    // password: "",
    comentarios: "",
    valor_pretensiones: "",
  });

  const initCiudadFilt = {
    ciudades: [],
  };

  const [ciudadFilt, setCiudadFilt] = useState(initCiudadFilt);
  const navigate = useNavigate();

  const handleChangeRegistro = (e) => {
    setUserDataRegistro({
      ...userDataRegistro,
      [e.target.name]: e.target.value, // Sintaxis ES6 para actualizar la key correspondiente
    });
  };

  const submitHandlerRegistro = (e) => {
    e.preventDefault();
    registroCliente(userDataRegistro);
    navigate("/clientes");
  };

  const handleCiudadChange = (e) => {
    e.preventDefault();

    setUserDataRegistro({
      ...userDataRegistro,
      [e.target.name]: e.target.value,
    });

    const foundCiudad = codigoCiudades.filter((ciudad) =>
      ciudad.nombre_ciudad.toLowerCase().includes(e.target.value.toLowerCase())
    );
    // console.log("Ciudades encontradas:", foundCiudad);
    setCiudadFilt(foundCiudad);
  };


  const handlerCargarDatos = async () => {
    registroClienteExcel();
  };
  

  return (
    <div className="contenedorregistro">
      <form className="datos" method="post" onSubmit={submitHandlerRegistro}>
        <h1 className="titulo">Registro De Cliente</h1>
        <br />
        <div className="menu-registrocliente">
                <input type="file" id="docexcel" accept=".xlsx, .xls"  />
                <Button
                  className="botonesiniciosesion"
                  onClick={handlerCargarDatos}
                >
                  Cargar datos
                </Button>
              </div>
        <br />
        <div className="inforegistrocliente">
          <label htmlFor="nombre" className="labelregistrodecliente">
            Nombre(s):
          </label>
          <input
            type="text"
            name="nombres"
            id="name"
            className="cajaregistrocliente"
            value={userDataRegistro.nombres}
            onChange={handleChangeRegistro}
          />
          <label htmlFor="apellidos" className="labelregistrodecliente">
            Apellido(s):
          </label>
          <input
            type="text"
            className="cajaregistrocliente"
            name="apellidos"
            id="lastname"
            value={userDataRegistro.apellidos}
            onChange={handleChangeRegistro}
          />
        </div>
        <br />
        <br />
        <div className="inforegistrocliente">
          <label htmlFor="cedula" className="labelregistrodecliente">
            Numero de cédula:
          </label>
          <input
            type="number"
            className="cajaregistrocliente"
            name="cedulaCliente"
            id="cedula"
            value={userDataRegistro.cedula}
            onChange={handleChangeRegistro}
          />

          <label htmlFor="telefono" className="labelregistrodecliente">
            {" "}
            Celular:
          </label>
          <input
            type="number"
            name="celular"
            id="celular"
            className="cajaregistrocliente"
            value={userDataRegistro.celular}
            onChange={handleChangeRegistro}
          />
        </div>

        <br />
        <br />
        <div className="inforegistrocliente">
          <label htmlFor="email" className="labelregistrodecliente">
            Email:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="cajaregistrocliente"
            value={userDataRegistro.email}
            onChange={handleChangeRegistro}
          />
          <label htmlFor="direccion" className="labelregistrodecliente">
            Dirección:
          </label>
          <input
            type="text"
            name="direccion"
            id="direccion"
            className="cajaregistrocliente"
            value={userDataRegistro.direccion}
            onChange={handleChangeRegistro}
          />
        </div>
        <br />
        <br />
        <div className="inforegistrocliente">
          <label htmlFor="ciudad" className="labelregistrodecliente">
            Ciudad:
          </label>
          <input
            type="text"
            name="nombre_ciudad"
            id="ciudad"
            className="cajaregistrocliente"
            value={userDataRegistro.nombre_ciudad}
            onChange={handleCiudadChange}
            placeholder="Buscar ciudad..."
          />

          <select
            name="nombre_ciudad"
            id="ciudad"
            className="cajaregistrocliente"
            onChange={(event) => handleChangeRegistro(event)}
          >
            <option value="" className="opcionescuidades">
              Ciudades encontradas
            </option>
            {ciudadFilt.length > 0 &&
              ciudadFilt.map((ciudad) => (
                <option
                  key={ciudad.codigo_ciudad}
                  value={ciudad.nombre_ciudad}
                  className="opcionesciudades"
                >
                  {ciudad.nombre_ciudad}
                </option>
              ))}
          </select>
        </div>
        <div className="comentarios">
          <br />
          <label htmlFor="comentarios" className="labelregistrodecliente">
            Comentarios
          </label>
          <br />
          <br />
          <textarea
            name="comentarios"
            id="comentarios"
            cols="30"
            rows="5"
            value={userDataRegistro.comentarios}
            onChange={handleChangeRegistro}
          ></textarea>
        </div>
        <br />
        <div className="documentoagenerar">
          <Button
            onClick={submitHandlerRegistro}
            disabled={
              !userDataRegistro.email ||
              !userDataRegistro.cedulaCliente ||
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
export default RegistroCliente;
