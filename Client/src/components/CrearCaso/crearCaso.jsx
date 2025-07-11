import { useState, useEffect } from "react";
import { postCaso } from "../../handlers/crearCaso";
import { getAbogados } from "../../handlers/todosAbogados";
import { getClientesCasos } from "../../handlers/todosClientes";
import "./crearCaso.css";
import { Link } from "react-router-dom";

import { getTiposCasos } from "../../handlers/todosTiposdecasos";
import { Button } from "../Mystyles";
import { useNavigate } from "react-router-dom";

function CrearCaso() {
  const [userDataRegistro, setUserDataRegistro] = useState({
    cedulaAbogado: "",
    cedulaCliente: "",
    fecha: "",
    fechaFin: "",
    descripcion: "",
    TipoDeCasoid: 1,
    porcentajeInicial: "",
    honorarios: "",
    valor_pretensiones: "",
    cuotas: "",
    forma_de_pago: "",
    radicado: "",
    juzgado: "",
  });
  // console.log(userDataRegistro);

  const [clientesFilt, setClientesFilt] = useState([]);
  const [abogados, setAbogados] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerAbogados = async () => {
      try {
        const listaAbogados = await getAbogados();
        setAbogados(listaAbogados);
      } catch (error) {
        console.error("Error al obtener los abogados:", error);
      }
    };

    obtenerAbogados();
  }, []);

  // console.log("abogados", abogados);

  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const listaClientes = await getClientesCasos();
        setClientes(listaClientes);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    obtenerClientes();
  }, []);

  const [tipos, setTipos] = useState({ allTipoDeCaso: [] });

  useEffect(() => {
    const obtenerTipos = async () => {
      try {
        const listaTipos = await getTiposCasos();
        if (listaTipos && Array.isArray(listaTipos.allTipoDeCaso)) {
          setTipos(listaTipos);
        } else {
          console.error(
            "Error: La respuesta no es un objeto esperado",
            listaTipos
          );
        }
      } catch (error) {
        console.error("Error al obtener los tipos de casos:", error);
      }
    };

    obtenerTipos();
  }, []);

  const handleChangeRegistro = (e) => {
    const { name, value } = e.target;
    setUserDataRegistro((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleClienteChange = (e) => {
    const { value } = e.target;

    const foundCliente = clientes.filter((cliente) =>
          cliente.apellidos.toLowerCase().includes(value.toLowerCase())
        );
        console.log("Clientes encontrados:", foundCliente);
        setClientesFilt(foundCliente.sort((a, b) => a.nombres.localeCompare(b.nombres)));
  };  

        
  const submitHandlerRegistro = async (e) => {
    e.preventDefault();
    try {
      await postCaso(userDataRegistro);

      // if (userDataRegistro.TipoDeCasoid === "1") {
      //   const isConfirmed = window.confirm(
      //     "¿Desea ingresar los datos para la solicitud de insolvencia?"
      //   );

      //   if (isConfirmed) {
      //     // dispatch(deleteCaso(id));
      //     // dispatch(getCasos());
      //     // console.log("id", id);
      //     navigate("/insolvencia");
      //   }
      // } else {
      //   navigate("/casos");
      // }
      // window.alert("Caso creado con éxito");
      navigate("/casos");
    } catch (error) {
      console.error("Error al crear el caso:", error.message);
      window.alert("No se pudo crear el caso");
    }
  };

  // console.log('Tipos de caso:', tipos)
  return (
    <div className="contenedorcrearcaso">
      <div className="encabezado">
        <h1 className="titulo">Crear caso</h1>
      </div>
      <form onSubmit={submitHandlerRegistro} className="datoscrearcaso">
        <div className="inputcrearcaso">
          <label htmlFor="TipoDeCasoid" className="labelcrearcaso">
            Selecciona el tipo de caso:
          </label>
          <select
            name="TipoDeCasoid"
            id="TipoDeCasoid"
            className="cajacrearcaso"
            onChange={(event) => handleChangeRegistro(event)}
          >
            <option value="" className="tipodecaso">
              Tipo de caso
            </option>
            {tipos.allTipoDeCaso.map((tipo) => (
              <option
                key={tipo.TipoDeCasoid}
                value={tipo.TipoDeCasoid}
                className="opcionestipodecaso"
              >
                {tipo.descripcion}
              </option>
            ))}
          </select>
          {userDataRegistro.TipoDeCasoid === 1 && (
            <>
              <label htmlFor="numerocedula" className="labelcrearcaso">
                Valor pretensiones:
              </label>
              <input
                type="number"
                className="cajacrearcaso"
                name="valor_pretensiones"
                id="valorpretensiones"
                value={userDataRegistro.valor_pretensiones}
                onChange={handleChangeRegistro}
              />
            </>
          )}
        </div>
        {userDataRegistro.TipoDeCasoid === 1 && (
          <>
            <div className="inputcrearcaso">
              <label htmlFor="fecha" className="labelcrearcaso">
                Fecha inicio:
              </label>
              <input
                className="cajacrearcaso"
                name="fecha"
                id="fecha"
                type="date"
                value={userDataRegistro.fecha}
                onChange={handleChangeRegistro}
              />
              <label htmlFor="honorarios" className="labelcrearcaso">
                Honorarios:
              </label>
              <input
                type="number"
                className="cajacrearcaso"
                name="honorarios"
                id="honorarios"
                value={userDataRegistro.honorarios}
                onChange={handleChangeRegistro}
              />
            </div>

            <div className="inputcrearcaso">
              <label htmlFor="fechaFin" className="labelcrearcaso">
                Fecha final:
              </label>
              <input
                className="cajacrearcaso"
                name="fechaFin"
                id="fechaFin"
                type="date"
                value={userDataRegistro.fechaFin}
                onChange={handleChangeRegistro}
              />
              <label htmlFor="tipodeusuario" className="labelcrearcaso">
                Forma de pago:
              </label>
              <select
                className="cajacrearcaso"
                name="forma_de_pago"
                id="idusuario"
                onChange={handleChangeRegistro}
                value={userDataRegistro.forma_de_pago}
              >
                <option value="">Elija una opcion</option>
                <option value="Contado">Contado</option>
                <option value="Crédito">Crédito</option>
              </select>
            </div>
          </>
        )}

        <div className="inputcrearcaso">
          <label htmlFor="Abogado" className="labelcrearcaso">
            Selecciona el abogado:
          </label>
          <select
            name="cedulaAbogado"
            id="cedulaAbogado"
            className="cajacrearcaso"
            onChange={(event) => handleChangeRegistro(event)}
          >
            <option value="" className="tipodecaso">
              Abogados
            </option>
            {abogados.map((abogado) => (
              <option
                key={abogado.cedulaAbogado}
                value={abogado.cedulaAbogado}
                className="opcionestipodecaso"
              >
                {abogado.nombres} {abogado.apellidos}
              </option>
            ))}
          </select>
          {userDataRegistro.TipoDeCasoid === 1 && (
            <>
              <label htmlFor="cuotas" className="labelcrearcaso">
                Numero de cuotas:
              </label>
              <input
                type="number"
                className="cajacrearcaso"
                name="cuotas"
                id="cuotas"
                value={userDataRegistro.cuotas}
                onChange={handleChangeRegistro}
              />
            </>
          )}
        </div>

        <div className="inputcrearcaso">
          <label htmlFor="cedulaCliente" className="labelcrearcaso">
            Selecciona el cliente:
          </label>
          <div className="buscarcliente">  
          {clientesFilt.length > 0 && (
          <select
            name="cedulaCliente"
            id="cedulaCliente"
            onChange={handleChangeRegistro}
            className="opcionestipodecaso"
          >
            <option value="" className="clientes">
              Clientes
            </option>
            {clientesFilt.map((cliente) => (
              <option
                key={cliente.cedulaCliente}
                value={cliente.cedulaCliente}
                className="opcionestipodecaso"
              >
                {cliente.nombres} {cliente.apellidos}
              </option>
            ))}
          </select>
          )}
          <input
              type="text"
              // value={cliente.cedulaCliente}
              name="cliente"
              id="buscarCliente"
              className="cajacrearcaso"
              placeholder="Buscar por apellido..."
              onChange={(event) => handleClienteChange(event)}
            />
            </div> 
          {userDataRegistro.TipoDeCasoid === 1 && (
            <>
              <label htmlFor="radicado" className="labelcrearcaso">
                N° Radicado juzgado:
              </label>
              <input
                type="number"
                className="cajacrearcaso"
                name="radicado"
                id="radicado"
                value={userDataRegistro.radicado}
                onChange={handleChangeRegistro}
              />
            </>
          )}
        </div>

        <div className="inputcrearcaso">
          <label htmlFor="descripcion" className="labelcrearcaso">
            Descripción
          </label>
          <textarea
            // className="cajacrearcaso"
            name="descripcion"
            id="descripcion"
            value={userDataRegistro.descripcion}
            onChange={handleChangeRegistro}
            placeholder="Descripción"
            cols="160"
            rows="8"
            className="textareacrear"
          ></textarea>
          {userDataRegistro.TipoDeCasoid === 1 && (
            <>
              <label htmlFor="juzgado" className="labelcrearcaso">
                Nombre juzgado:
              </label>
              <input
                type="text"
                className="cajacrearcaso"
                name="juzgado"
                id="juzgado"
                value={userDataRegistro.juzgado}
                onChange={handleChangeRegistro}
              />
            </>
          )}
          {userDataRegistro.TipoDeCasoid === 1 && (
            <>
              <label htmlFor="cuotas" className="labelcrearcaso">
                Porcentaje cuota inicial:
              </label>
              <input
                type="number"
                className="cajacrearcaso"
                name="porcentajeInicial"
                id="porcentajeInicial"
                value={userDataRegistro.porcentajeInicial}
                onChange={handleChangeRegistro}
              />
            </>
          )}
        </div>

        <div className="botonescrearcaso">
          <Button type="submit" value="Guardar">
            Guardar
          </Button>
          <Link to="/casos">
            <Button>Volver</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CrearCaso;
