import "../../App.css";
import logo from "../../img/logoAveza.png";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../insolvencia/insolvencia.css";
import { printDivContent } from "../../utils/printDivContent";
import { Link } from "react-router-dom";
import { Button } from "../Mystyles";
import { listaacreedores } from "../../utils/acreedores.js";
import { generarSolicitud } from "../../handlers/generarSolicitud.jsx";

const Insolvencia = () => {
  const cliente = useSelector((state) => state.cliente);
  const acreedores = useSelector((state) => state.acreedores);

  const deudasObj = [];
  const propuestasObj = [];

  const initDeuda = {
    idDeuda: "",
    acreedor: "",
    acreedorBuscado: "",
    tipoDeuda: "",
    tipoGarantia: "",
    documentoSoporte: "",
    capital: "",
    intereses: "",
    clasificacion: "",
    diasMora: "",
  };

  const initPropuesta = {
    Clasificacion: "",
    tasaIntereses: "",
    valorCuota: "",
    numeroCuotas: "",
  };

  const ingresosObj = [];
  const gastosObj = [];
  const bienesObj = [];
  const procesosObj = [];
  const sociedadesObj = [];
  const obligacionesObj = [];

  const initGastos = {
    energia: "",
    aguaAlcAseo: "",
    gas: "",
    telecomunicaciones: "",
    television: "",
    arriendo: "",
    seguros: "",
    alimentacion: "",
    transporte: "",
    otros: "",
  };

  const initIngreso = {
    concepto: "",
    valor: "",
  };

  const initBien = {
    tipoBien: "",
    valor: "",
    tipoAfectacion: "",
    descripcionBien: "",
  };

  const initProceso = {
    juzgado: "",
    radicado: "",
    demandante: "",
    tipoProceso: "",
  };

  const initSociedad = {
    nombresConyuge: "",
    idConyuge: "",
  };

  const initObligacion = {
    nombresHijo: "",
    idHijo: "",
  };

    const initAcreedorFilt = {
      acreedores: [],
    };
  
      const initMotivos = {
        motivos:"",
      };

  const [ingreso, setIngreso] = useState(initIngreso);
  const [ingresos, setIngresos] = useState(ingresosObj);
  const [gasto, setGasto] = useState(initGastos);
  const [gastos, setGastos] = useState(gastosObj);
  const [bien, setBien] = useState(initBien);
  const [bienes, setBienes] = useState(bienesObj);
  const [proceso, setProceso] = useState(initProceso);
  const [procesos, setProcesos] = useState(procesosObj);
  const [obligacion, setObligacion] = useState(initObligacion);
  const [obligaciones, setObligaciones] = useState(obligacionesObj);
  const [sociedad, setSociedad] = useState(initSociedad);
  const [sociedades, setSociedades] = useState(sociedadesObj);
  const [deudas, setDeudas] = useState(deudasObj);
  const [propuestas, setPropuestas] = useState(propuestasObj);
  const [datosDeuda, setDatosDeuda] = useState(initDeuda);
  const [propuesta, setPropuesta] = useState(initPropuesta);
  const [acreedorFilt, setAcreedorFilt] = useState(initAcreedorFilt);
   const [motivos, setMotivos] = useState(initMotivos);
   
  const addDeuda = (deuda) => {
    setDeudas([...deudas, deuda]);
    setDatosDeuda(initDeuda);
  };

  const addPropuesta = (propuesta) => {
    setPropuestas([...propuestas, propuesta]);
    setPropuesta(initPropuesta);
  };

  console.log("Deudas:", deudas);
  console.log("Datos deuda:", datosDeuda);

  console.log("Propuestas:", propuestas);
  console.log("Propuesta:", propuesta);

  const handleDeudaChange = (e) => {
    setDatosDeuda({
      ...datosDeuda,
      [e.target.name]: e.target.value,
    });
  };

  const handlePropuestaChange = (e) => {
    setPropuesta({
      ...propuesta,
      [e.target.name]: e.target.value,
    });
  };

    const handleMotivosChange = (e) => {
      setMotivos({
        ...motivos,
        [e.target.name]: e.target.value,
      });
    };

  const handleSubmitDeuda = async (e) => {
    e.preventDefault();
    // if (
    //   !userState.userFirstname ||
    //   !userState.userLastname ||
    //   !userState.userPhone
    // )
    //   return;
    addDeuda(datosDeuda);
    try {
      // await postDeuda(deudas);
    } catch (error) {
      console.error("Error al crear las deudas:", error.message);
    }
  };

  const handleSubmitPropuesta = async (e) => {
    e.preventDefault();
    addPropuesta(propuesta);
    try {
      // await postPropuesta(propuestas);
    } catch (error) {
      console.error("Error al crear las deudas:", error.message);
    }
  };

  const handleSubmitMotivos = async (e) => {
    e.preventDefault();
    // addPropuesta(propuesta);
    try {
      // await postPropuesta(propuestas);
    } catch (error) {
      console.error("Error al crear las deudas:", error.message);
    }
  };

  const addIngreso = (ingreso) => {
    setIngresos([...ingresos, ingreso]);
    setIngreso(initIngreso);
  };

  const addGasto = (gasto) => {
    setGastos([...gastos, gasto]);
    setGasto(initGastos);
  };

  const addBien = (bien) => {
    setBienes([...bienes, bien]);
    setBien(initBien);
  };

  const addProceso = (proceso) => {
    setProcesos([...procesos, proceso]);
    setProceso(initProceso);
  };

  const addSociedad = (sociedad) => {
    setSociedades([...sociedades, sociedad]);
    setSociedad(initSociedad);
  };

  const addObligacion = (obligacion) => {
    setObligaciones([...obligaciones, obligacion]);
    setObligacion(initObligacion);
  };
  console.log("Gastos:", gastos);
  console.log("Datos gasto:", gasto);

  console.log("Ingresos:", ingresos);
  console.log("ingreso:", ingreso);

  console.log("bienes:", bienes);
  console.log("bien:", bien);

  console.log("Procesos:", procesos);
  console.log("proceso:", proceso);

  console.log("Sociedades:", sociedades);
  console.log("sociedad:", sociedad);

  console.log("Obligaciones:", obligaciones);
  console.log("obligacion:", obligacion);

   console.log("motivos:", motivos);

  const handleIngresoChange = (e) => {
    setIngreso({
      ...ingreso,
      [e.target.name]: e.target.value,
    });
  };

  const handleGastoChange = (e) => {
    setGasto({
      ...gasto,
      [e.target.name]: e.target.value,
    });
  };

  const handleBienChange = (e) => {
    setBien({
      ...bien,
      [e.target.name]: e.target.value,
    });
  };

  const handleProcesoChange = (e) => {
    setProceso({
      ...proceso,
      [e.target.name]: e.target.value,
    });
  };

  const handleSociedadChange = (e) => {
    setSociedad({
      ...sociedad,
      [e.target.name]: e.target.value,
    });
  };

  const handleObligacionChange = (e) => {
    setObligacion({
      ...obligacion,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmitIngreso = async (e) => {
    e.preventDefault();
    // if (
    //   !userState.userFirstname ||
    //   !userState.userLastname ||
    //   !userState.userPhone
    // )
    //   return;
    addIngreso(ingreso);
    try {
      // await postgasto(deudas);
    } catch (error) {
      console.error("Error al crear los ingresos:", error.message);
    }
  };

  const handleSubmitBien = async (e) => {
    e.preventDefault();
    // if (
    //   !userState.userFirstname ||
    //   !userState.userLastname ||
    //   !userState.userPhone
    // )
    //   return;
    addBien(bien);
    try {
      // await postDeuda(deudas);
    } catch (error) {
      console.error("Error al crear los bienes:", error.message);
    }
  };

  const handleSubmitGasto = async (e) => {
    e.preventDefault();
    addGasto(gasto);
    try {
      // await postGasto(gasto);
    } catch (error) {
      console.error("Error al crear los gastos:", error.message);
    }
  };

  const handleSubmitProceso = async (e) => {
    e.preventDefault();
    addProceso(proceso);
    try {
      // await postGasto(gasto);
    } catch (error) {
      console.error("Error al crear el proceso:", error.message);
    }
  };

  const handleSubmitObligacion = async (e) => {
    e.preventDefault();
    addObligacion(obligacion);
    try {
      // await postObligacion(obligacion);
    } catch (error) {
      console.error("Error al crear el proceso:", error.message);
    }
  };

  const handleSubmitSociedad = async (e) => {
    e.preventDefault();
    addSociedad(sociedad);
    try {
      // await postSociedad(sociedad);
    } catch (error) {
      console.error("Error al crear el proceso:", error.message);
    }
  };

  const handleSearchAcreedor = (e) => {
    e.preventDefault();

    // const textoBuscado = "Banco Popular"; // Cambia esto al texto que deseas buscar

    const resultado = listaacreedores.find((acreedor) => {
      return acreedor.nombre.includes(datosDeuda.acreedorBuscado);
    });
    let resultados = listaacreedores.filter((acreedor) => {
      return acreedor.nombre.includes(datosDeuda.acreedorBuscado);
    });
    if (resultados) {
      console.log("Elemento encontrado:", resultado);
      setAcreedorFilt(resultados);
      // setDatosDeuda({
      //   ...datosDeuda,
      //   acreedor: resultado.nombre,
      // });
    } else {
      console.log("No se encontró ningún elemento con ese nombre.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatInputValue = (value) => {
    if (!value) return "";
    return value.toUpperCase(); //.charAt(0).toUpperCase() + value.slice(1); //.toLowerCase();
  };

  useEffect(() => {
    // const obtenerAcreedores = async () => {
    //   try {
    //     const listaAcreedores = await getAcreedores();
    //     setAcreedores(listaAcreedores);
    //   } catch (error) {
    //     console.error("Error al obtener las instituciones:", error);
    //   }
    // };
    // obtenerAcreedores();
  }, []);

  const handlerGenerarSolicitud = () => {
    generarSolicitud(
      ingresos,
      gastos,
      bienes,
      procesos,
      obligaciones,
      sociedades,
      deudas,
      propuestas,
      motivos
      
    );
  };

  return (
    <div className="contenedorinsolvencia">
      <div className="encabezado">
        <span className="titulo">Datos para la Solicitud de Insolvencia</span>
      </div>
      <br />
      <div className="menu-insolvencia">
        <input type="file" id="doc" />
        {/* <Link to={"/generardocumentos"}> */}
        <Button
          className="botonesiniciosesion"
          onClick={handlerGenerarSolicitud}
        >
          Generar solicitud
        </Button>
      </div>
      <form
        onSubmit={handleSubmitDeuda}
        className="datosinsolvencia"
        id="continsolvencia"
      >
        <div className="infotodosinsolvencia">
          <div className="infotodosingresos">
            <div className="formingresos">
              <div className="infoseccion">
                <div className="encabezadopropuesta">
                  <h6 className="titulo">Motivos para la solicitud</h6>
                </div>
                <br />
                <div className="infotextarea">
                  {/* <label
                htmlFor="clasificacionpropuesta"
                className="labeldetaildeudas"
              >
                Clasificación del Crédito:
              </label> */}
                  <textarea
                    name="motivos"
                    id="motivos"
                    value={propuesta.motivos}
                    onChange={(event) => handleMotivosChange(event)}
                    placeholder="Ingrese aquí los motivos para su solicitud de insolvencia"
                    cols="54"
                    rows="8"
                    className="textareainsolvencia"
                  />
                  <Button
                    onClick={handleSubmitMotivos}
                    value="Guardarpropuesta"
                  >
                    Guardar motivos
                  </Button>
                </div>
              </div>
              {/* <br /> */}
              <div className="infoseccion">
                <div className="encabezadodeudas">
                  <h6 className="titulo">Información de las deudas</h6>
                </div>
                <div className="infodetaildeudas">
                  <label htmlFor="acreedor" className="labeldetaildeudas">
                    Selecciona el acreedor:
                  </label>
                  {/* <select
                    name="acreedor"
                    id="acreedor"
                    className="cajadeudas"
                    onChange={(event) => handleDeudaChange(event)}
                  >
                    <option value="" className="opcionesacreedor">
                      Acreedor
                    </option>
                    {acreedores.map((acreedor) => (
                  <option
                    key={acreedor.idAcreedor}
                    value={acreedor.idAcreedor}
                    className="opcionesacreedor"
                  >
                    {acreedor.nombre}
                  </option>
                ))}
                  </select> */}

                  <input
                    placeholder="Nombre Institución"
                    type="text"
                    name="acreedorBuscado"
                    id="acreedorBuscado"
                    value={datosDeuda.acreedorBuscado}
                    onKeyDown={handleKeyDown}
                    onChange={(event) => handleDeudaChange(event)}
                    className="cajadeudas"
                  />
                </div>
                <div className="infodetaildeudas">
                  <Button onClick={handleSearchAcreedor} className="buscar">
                    Buscar Institución
                  </Button>

                  {/* <input
                    type="text"
                    className="cajadeudas"
                    name="acreedor"
                    id="acreedor"
                    value={datosDeuda.acreedor}
                    onChange={(event) => handleDeudaChange(event)}
                  /> */}

                  <select
                    name="acreedor"
                    id="acreedor"
                    className="cajadeudas"
                    onChange={(event) => handleDeudaChange(event)}
                  >
                    <option value="" className="opcionesacreedor">
                     Instituciones encontradas
                    </option>
                    {acreedorFilt.length>0&&acreedorFilt.map((acreedor) => (
                  <option
                    key={acreedor.idAcreedor}
                    value={acreedor.idAcreedor}
                    className="opcionesacreedor"
                  >
                    {acreedor.nombre}
                  </option>
                ))}
                  </select>
                </div>
                <div className="infodetaildeudas">
                  <label htmlFor="tipoDeuda" className="labeldetaildeudas">
                    Naturaleza del crédito::
                  </label>
                  <input
                    type="text"
                    className="cajadeudas"
                    name="tipoDeuda"
                    id="tipoDeuda"
                    value={datosDeuda.tipoDeuda}
                    onChange={(event) => handleDeudaChange(event)}
                  />
                </div>
                <div className="infodetaildeudas">
                  <label htmlFor="tipogarantia" className="labeldetaildeudas">
                    Tipo de garantía:
                  </label>
                  <input
                    type="text"
                    text
                    className="cajadeudas"
                    name="tipoGarantia"
                    id="tipogarantia"
                    value={datosDeuda.tipoGarantia}
                    onChange={(event) => handleDeudaChange(event)}
                  />
                </div>
                <div className="infodetaildeudas">
                  <label
                    htmlFor="documentosoporte"
                    className="labeldetaildeudas"
                  >
                    Documento que soporta la garantía:
                  </label>
                  <input
                    type="text"
                    text
                    className="cajadeudas"
                    name="documentoSoporte"
                    id="documentosoporte"
                    value={datosDeuda.documentoSoporte}
                    onChange={(event) => handleDeudaChange(event)}
                  />
                </div>

                <div className="infodetaildeudas">
                  <label htmlFor="capital" className="labeldetaildeudas">
                    Capital :
                  </label>
                  <input
                    type="number"
                    text
                    className="cajadeudas"
                    name="capital"
                    id="capital"
                    value={datosDeuda.capital}
                    onChange={(event) => handleDeudaChange(event)}
                  />
                </div>
                <div className="infodetaildeudas">
                  <label htmlFor="intereses" className="labeldetaildeudas">
                    Valor intereses:
                  </label>
                  <input
                    type="number"
                    text
                    className="cajadeudas"
                    name="intereses"
                    id="intereses"
                    value={datosDeuda.intereses}
                    onChange={(event) => handleDeudaChange(event)}
                  />
                </div>
                <div className="infodetaildeudas">
                  <label htmlFor="clasificacion" className="labeldetaildeudas">
                    Clasificación del Crédito:
                  </label>
                  <input
                    type="text"
                    text
                    className="cajadeudas"
                    name="clasificacion"
                    id="clasificacion"
                    value={datosDeuda.clasificacion}
                    onChange={(event) => handleDeudaChange(event)}
                  />
                </div>
                <div className="infodetaildeudas">
                  <label htmlFor="diasmora" className="labeldetaildeudas">
                    Número de días en mora:
                  </label>
                  <input
                    type="text"
                    text
                    className="cajadeudas"
                    name="diasMora"
                    id="diasmora"
                    value={datosDeuda.diasMora}
                    onChange={(event) => handleDeudaChange(event)}
                  />
                </div>
                <Button type="submit" value="Guardar">
                  Guardar deuda
                </Button>
              </div>
              <br />
              <br />
            </div>
            <div className="formdeudas">
              <div className="infoseccion">
                <div className="encabezadoingresos">
                  <h6 className="titulo">Bienes</h6>
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="tipoBien" className="labelingresos">
                    Tipo de bien:
                  </label>
                  <input
                    type="text"
                    className="cajaingresos"
                    name="tipoBien"
                    id="tipoBien"
                    value={bien.tipoBien}
                    onChange={(event) => handleBienChange(event)}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="valorBien" className="labelingresos">
                    Valor comercial:
                  </label>
                  <input
                    type="number"
                    className="cajaingresos"
                    name="valor"
                    id="valorBien"
                    value={bien.valor}
                    onChange={(event) => handleBienChange(event)}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="tipoafectacion" className="labelingresos">
                    Tipo de afectación:
                  </label>
                  <input
                    type="text"
                    className="cajaingresos"
                    name="tipoAfectacion"
                    id="tipoafectacion"
                    value={bien.tipoAfectacion}
                    onChange={(event) => handleBienChange(event)}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="decripcionBien" className="labelingresos">
                    Descripción:
                  </label>
                  <input
                    type="text"
                    className="cajaingresos"
                    name="descripcionBien"
                    id="descripcionBien"
                    value={bien.descripcionBien}
                    onChange={(event) => handleBienChange(event)}
                  />
                </div>
                <Button onClick={handleSubmitBien} value="Guardarbien">
                  Guardar bien
                </Button>
              </div>
              <div className="infoseccion">
                <div className="encabezadoingresos">
                  <h6 className="titulo">Procesos judiciales</h6>
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="juzgado" className="labelingresos">
                    Juzgado:
                  </label>
                  <input
                    type="text"
                    className="cajaingresos"
                    name="juzgado"
                    id="juzgado"
                    value={proceso.juzgado}
                    onChange={(event) => handleProcesoChange(event)}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="radicado" className="labelingresos">
                    Radicado:
                  </label>
                  <input
                    type="text"
                    className="cajaingresos"
                    name="radicado"
                    id="radicado"
                    value={proceso.radicado}
                    onChange={(event) => handleProcesoChange(event)}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="demandante" className="labelingresos">
                    Demandante:
                  </label>
                  <input
                    type="text"
                    className="cajaingresos"
                    name="demandante"
                    id="demandante"
                    value={proceso.demandante}
                    onChange={(event) => handleProcesoChange(event)}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="tipoProceso" className="labelingresos">
                    Tipo de proceso:
                  </label>
                  <input
                    type="text"
                    className="cajaingresos"
                    name="tipoProceso"
                    id="tipoProceso"
                    value={proceso.tipoProceso}
                    onChange={(event) => handleProcesoChange(event)}
                  />
                </div>
                <Button onClick={handleSubmitProceso} value="Guardarproceso">
                  Guardar proceso
                </Button>
              </div>
              <div className="infoseccion">
                <div className="encabezadoingresos">
                  <h6 className="titulo">Ingresos</h6>
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="concepto" className="labelingresos">
                    Concepto:
                  </label>
                  <input
                    type="text"
                    className="cajaingresos"
                    name="concepto"
                    id="concepto"
                    value={ingreso.concepto}
                    onChange={(event) => handleIngresoChange(event)}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="valor" className="labelingresos">
                    Valor :
                  </label>
                  <input
                    type="number"
                    className="cajaingresos"
                    name="valor"
                    id="valor"
                    value={ingreso.valor}
                    onChange={(event) => handleIngresoChange(event)}
                  />
                </div>

                <Button onClick={handleSubmitIngreso} value="Guardaringreso">
                  Guardar ingreso
                </Button>
              </div>
              <br />
              <br />
            </div>
          </div>
          <div className="infotodosingresos">
            <div className="formgastos">
              {/* <br /> */}
              <div className="infoseccion">
                <div className="encabezadogastos">
                  <h6 className="titulo">Gastos mensuales</h6>
                </div>

                <div className="infodetailingresos">
                  <label htmlFor="energia" className="labelingresos">
                    Energía:
                  </label>
                  <input
                    type="number"
                    className="cajaingresos"
                    name="energia"
                    id="energia"
                    value={gasto.energia}
                    onChange={(event) => handleGastoChange(event)}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="agua" className="labelingresos">
                    Agua, alcantarillado y aseo:
                  </label>
                  <input
                    type="number"
                    number
                    className="cajaingresos"
                    name="aguaAlcAseo"
                    id="agua"
                    value={gasto.aguaAlcAseo}
                    onChange={(event) => handleGastoChange(event)}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="gas" className="labelingresos">
                    Gas:
                  </label>
                  <input
                    type="number"
                    number
                    className="cajaingresos"
                    name="gas"
                    id="gas"
                    value={gasto.gas}
                    onChange={(event) => handleGastoChange(event)}
                  />
                </div>

                <div className="infodetailingresos">
                  <label htmlFor="telecomunicaciones" className="labelingresos">
                    Telecomunicaciones :
                  </label>
                  <input
                    type="number"
                    number
                    className="cajaingresos"
                    name="telecomunicaciones"
                    id="telecomunicaciones"
                    value={gasto.telecomunicaciones}
                    onChange={(event) => handleGastoChange(event)}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="television" className="labelingresos">
                    Televisión:
                  </label>
                  <input
                    type="number"
                    number
                    className="cajaingresos"
                    name="television"
                    id="television"
                    value={gasto.television}
                    onChange={(event) => handleGastoChange(event)}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="arriendo" className="labelingresos">
                    Arriendo:
                  </label>
                  <input
                    type="number"
                    number
                    className="cajaingresos"
                    name="arriendo"
                    id="arriendo"
                    value={gasto.arriendo}
                    onChange={(event) => handleGastoChange(event)}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="seguros" className="labelingresos">
                    Seguros:
                  </label>
                  <input
                    type="number"
                    number
                    className="cajaingresos"
                    name="seguros"
                    id="seguros"
                    value={gasto.seguros}
                    onChange={(event) => handleGastoChange(event)}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="alimentacion" className="labelingresos">
                    Alimentación:
                  </label>
                  <input
                    type="number"
                    number
                    className="cajaingresos"
                    name="alimentacion"
                    id="alimentacion"
                    value={gasto.alimentacion}
                    onChange={(event) => handleGastoChange(event)}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="transporte" className="labelingresos">
                    Transporte:
                  </label>
                  <input
                    type="number"
                    number
                    className="cajaingresos"
                    name="transporte"
                    id="transporte"
                    value={gasto.transporte}
                    onChange={(event) => handleGastoChange(event)}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="otros" className="labelingresos">
                    Otros gastos:
                  </label>
                  <input
                    type="number"
                    number
                    className="cajaingresos"
                    name="otros"
                    id="otros"
                    value={gasto.otros}
                    onChange={(event) => handleGastoChange(event)}
                  />
                </div>

                <Button onClick={handleSubmitGasto} value="Guardar">
                  Guardar gastos
                </Button>
              </div>
            </div>
            <div className="formpropuesta">
              {/* <br /> */}
              <div className="infoseccion">
                <div className="encabezadopropuesta">
                  <h6 className="titulo">Propuesta de pago</h6>
                </div>
                <div className="infodetailpropuesta">
                  <label
                    htmlFor="clasificacionpropuesta"
                    className="labeldetaildeudas"
                  >
                    Clasificación del Crédito:
                  </label>
                  <input
                    type="text"
                    text
                    className="cajadeudas"
                    name="Clasificacion"
                    id="clasificacionpropuesta"
                    value={propuesta.Clasificacion}
                    onChange={(event) => handlePropuestaChange(event)}
                  />
                </div>
                <div className="infodetailpropuesta">
                  <label htmlFor="tasainteres" className="labeldetaildeudas">
                    Tasa de interés :
                  </label>
                  <input
                    type="number"
                    text
                    className="cajadeudas"
                    name="tasaIntereses"
                    id="tasainteres"
                    value={propuesta.tasaIntereses}
                    onChange={(event) => handlePropuestaChange(event)}
                  />
                </div>
                <div className="infodetailpropuesta">
                  <label htmlFor="valorcuota" className="labeldetaildeudas">
                    Valor de la cuota :
                  </label>
                  <input
                    type="number"
                    text
                    className="cajadeudas"
                    name="valorCuota"
                    id="valorcuota"
                    value={propuesta.valorCuota}
                    onChange={(event) => handlePropuestaChange(event)}
                  />
                </div>
                <div className="infodetailpropuesta">
                  <label htmlFor="numeroCuotas" className="labeldetaildeudas">
                    Número de cuotas :
                  </label>
                  <input
                    type="number"
                    text
                    className="cajadeudas"
                    name="numeroCuotas"
                    id="numeroCuotas"
                    value={propuesta.numeroCuotas}
                    onChange={(event) => handlePropuestaChange(event)}
                  />
                </div>
                <Button
                  onClick={handleSubmitPropuesta}
                  value="Guardarpropuesta"
                >
                  Guardar propuesta
                </Button>
              </div>
              {/* <br /> */}
              <div className="infoseccion">
                <div className="encabezadopropuesta">
                  <h6 className="titulo">Sociedad conyugal</h6>
                </div>
                <div className="infodetailpropuesta">
                  <label
                    htmlFor="clasificacionpropuesta"
                    className="labeldetaildeudas"
                  >
                    Nombres y apellidos:
                  </label>
                  <input
                    type="text"
                    text
                    className="cajadeudas"
                    name="nombresConyuge"
                    id="nombresConyuge"
                    value={sociedad.nombresConyuge}
                    onChange={(event) => handleSociedadChange(event)}
                  />
                </div>
                <div className="infodetailpropuesta">
                  <label htmlFor="tasainteres" className="labeldetaildeudas">
                    Identificación :
                  </label>
                  <input
                    type="number"
                    text
                    className="cajadeudas"
                    name="idConyuge"
                    id="idConyuge"
                    value={sociedad.idConyuge}
                    onChange={(event) => handleSociedadChange(event)}
                  />
                </div>
                <Button onClick={handleSubmitSociedad} value="Guardarconyuge">
                  Guardar conyuge
                </Button>
              </div>
              {/* <br /> */}
              <div className="infoseccion">
                <div className="encabezadopropuesta">
                  <h6 className="titulo">Obligaciones alimentarias</h6>
                </div>
                <div className="infodetailpropuesta">
                  <label
                    htmlFor="clasificacionpropuesta"
                    className="labeldetaildeudas"
                  >
                    Nombres y apellidos:
                  </label>
                  <input
                    type="text"
                    text
                    className="cajadeudas"
                    name="nombresHijo"
                    id="nombresHijo"
                    value={obligacion.nombresHijo}
                    onChange={(event) => handleObligacionChange(event)}
                  />
                </div>
                <div className="infodetailpropuesta">
                  <label htmlFor="idHijo" className="labeldetaildeudas">
                    Identificación :
                  </label>
                  <input
                    type="number"
                    text
                    className="cajadeudas"
                    name="idHijo"
                    id="idHijo"
                    value={obligacion.idHijo}
                    onChange={(event) => handleObligacionChange(event)}
                  />
                </div>
                <Button
                  onClick={handleSubmitObligacion}
                  value="Guardarobligacion"
                >
                  Guardar obligación
                </Button>
              </div>
              {/* <br /> */}
            </div>
          </div>
        </div>
        <br />

        <div className="resultadostodos">
          <div className="resultadopropuesta"></div>
          <br />
          <br />
          <div className="resultadodeudas">
            <table className="informationTable">
              <thead>
                <tr>
                  <th className="tableCell">Nombre acreedor</th>
                  <th className="tableCell">Naturaleza del crédito</th>
                  <th className="tableCell">Tipo de garantía</th>
                  <th className="tableCell">
                    Documento que soporta la garantía
                  </th>
                  <th className="tableCell">Capital</th>
                  <th className="tableCell">Valor intereses</th>
                  <th className="tableCell">Clasificación del Crédito</th>
                  <th className="tableCell">Número de días en mora</th>
                </tr>
              </thead>
              <tbody>
                {deudas.length > 0 ? (
                  deudas.map((deuda, index) => (
                    <tr key={index}>
                      <td className="tableCell" key={index}>
                        {deuda.acreedor}
                      </td>
                      <td className="tableCell" key={index}>
                        {deuda.tipoDeuda}
                      </td>
                      <td className="tableCell" key={index}>
                        {deuda.tipoGarantia}
                      </td>
                      <td className="tableCell" key={index}>
                        {deuda.documentoSoporte}
                      </td>
                      <td className="tableCell" key={index}>
                        {deuda.capital}
                      </td>
                      <td className="tableCell" key={index}>
                        {deuda.intereses}
                      </td>
                      <td className="tableCell" key={index}>
                        {deuda.clasificacion}
                      </td>
                      <td className="tableCell" key={index}>
                        {deuda.diasMora}
                      </td>
                    </tr>
                  ))
                ) : (
                  <td>&nbsp;</td>
                )}
              </tbody>
            </table>
          </div>
          <br />
          <br />
          <div className="resultadoingresos">
            <table className="informationTable">
              <thead>
                <tr>
                  <th className="tableCell">Tipo de bien</th>
                  <th className="tableCell">Valor del bien</th>
                  <th className="tableCell">Tipo de afectación</th>
                  <th className="tableCell">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {bienes.length > 0 ? (
                  bienes.map((bien, index) => (
                    <tr>
                      <td className="tableCell">{bien.tipoBien}</td>
                      <td className="tableCell">{bien.valor}</td>
                      <td className="tableCell">{bien.tipoAfectacion}</td>
                      <td className="tableCell">{bien.descripcionBien}</td>
                    </tr>
                  ))
                ) : (
                  <td>&nbsp;</td>
                )}
              </tbody>
            </table>
            <table className="informationTable">
              <thead>
                <tr>
                  <th className="tableCell">Ingreso</th>
                  <th className="tableCell">Valor</th>
                </tr>
              </thead>
              <tbody>
                {ingresos.length > 0 ? (
                  ingresos.map((ingreso, index) => (
                    <tr key={index}>
                      <td className="tableCell" key={index}>
                        {ingreso.concepto}
                      </td>
                      <td className="tableCell" key={index}>
                        {ingreso.valor}
                      </td>
                    </tr>
                  ))
                ) : (
                  <td>&nbsp;</td>
                )}
              </tbody>
            </table>
          </div>
          <br />
          <br />
          <div className="resultadoingresos">
            <table className="informationTable">
              <thead>
                <tr>
                  <th className="tableCell">Juzgado</th>
                  <th className="tableCell">Radicado</th>
                  <th className="tableCell">Demandante</th>
                  <th className="tableCell">Tipo de proceso</th>
                </tr>
              </thead>
              <tbody>
                {procesos.length > 0 ? (
                  procesos.map((proceso, index) => (
                    <tr>
                      <td className="tableCell">{proceso.juzgado}</td>
                      <td className="tableCell">{proceso.radicado}</td>
                      <td className="tableCell">{proceso.demandante}</td>
                      <td className="tableCell">{proceso.tipoProceso}</td>
                    </tr>
                  ))
                ) : (
                  <td>&nbsp;</td>
                )}
              </tbody>
            </table>
          </div>
          <br />
          <br />
          <div className="resultadogastos">
            <table className="informationTable">
              <tr>
                <th className="tableCell">Energía:</th>
                {gastos.length > 0 ? (
                  gastos.map((gasto, index) => (
                    <td className="tableCell" key={index}>
                      {gasto.energia}
                    </td>
                  ))
                ) : (
                  <td>&nbsp;</td>
                )}
              </tr>
              <tr>
                <th className="tableCell">Agua, alcantarillado y aseo:</th>
                {gastos.length > 0 ? (
                  gastos.map((gasto, index) => (
                    <td className="tableCell" key={index}>
                      {gasto.aguaAlcAseo}
                    </td>
                  ))
                ) : (
                  <td>&nbsp;</td>
                )}
              </tr>
              <tr>
                <th className="tableCell">Gas:</th>
                {gastos.length > 0 ? (
                  gastos.map((gasto, index) => (
                    <td className="tableCell" key={index}>
                      {gasto.gas}
                    </td>
                  ))
                ) : (
                  <td>&nbsp;</td>
                )}
              </tr>
              <tr>
                <th className="tableCell">Televisión:</th>
                {gastos.length > 0 ? (
                  gastos.map((gasto, index) => (
                    <td className="tableCell" key={index}>
                      {gasto.television}
                    </td>
                  ))
                ) : (
                  <td>&nbsp;</td>
                )}
              </tr>
              <tr>
                <th className="tableCell">Telecomunicaciones :</th>
                {gastos.length > 0 ? (
                  gastos.map((gasto, index) => (
                    <td className="tableCell" key={index}>
                      {gasto.telecomunicaciones}
                    </td>
                  ))
                ) : (
                  <td>&nbsp;</td>
                )}
              </tr>
              <tr>
                <th className="tableCell">Arriendo:</th>
                {gastos.length > 0 ? (
                  gastos.map((gasto, index) => (
                    <td className="tableCell" key={index}>
                      {gasto.arriendo}
                    </td>
                  ))
                ) : (
                  <td>&nbsp;</td>
                )}
              </tr>
              <tr>
                <th className="tableCell">Seguros:</th>
                {gastos.length > 0 ? (
                  gastos.map((gasto, index) => (
                    <td className="tableCell" key={index}>
                      {gasto.seguros}
                    </td>
                  ))
                ) : (
                  <td>&nbsp;</td>
                )}
              </tr>
              <tr>
                <th className="tableCell">Alimentación:</th>
                {gastos.length > 0 ? (
                  gastos.map((gasto, index) => (
                    <td className="tableCell" key={index}>
                      {gasto.alimentacion}
                    </td>
                  ))
                ) : (
                  <td>&nbsp;</td>
                )}
              </tr>
            </table>
            <br />
            <br />
            <table className="informationTable">
              <thead>
                <tr>
                  <th className="tableCell">Clasificación del crédito</th>
                  <th className="tableCell">Tasa de interés</th>
                  <th className="tableCell">Valor cuota</th>
                  <th className="tableCell">Número de cuotas</th>
                </tr>
              </thead>
              <tbody>
                {propuestas.length > 0 ? (
                  propuestas.map((propuesta, index) => (
                    <tr key={index}>
                      <td className="tableCell" key={index}>
                        {propuesta.Clasificacion}
                      </td>
                      <td className="tableCell" key={index}>
                        {propuesta.tasaIntereses}
                      </td>
                      <td className="tableCell" key={index}>
                        {propuesta.valorCuota}
                      </td>
                      <td className="tableCell" key={index}>
                        {propuesta.numeroCuotas}
                      </td>
                    </tr>
                  ))
                ) : (
                  <td>&nbsp;</td>
                )}
              </tbody>
            </table>
          </div>
          <div className="resultadoingresos">
            <table className="informationTable">
              <thead>
                <tr>
                  <th className="tableCell">Nombres y Apellidos</th>
                  <th className="tableCell">Identificación</th>
                </tr>
              </thead>
              <tbody>
                {sociedades.length > 0 ? (
                  sociedades.map((sociedad, index) => (
                    <tr>
                      <td className="tableCell">{sociedad.nombresConyuge}</td>
                      <td className="tableCell">{sociedad.idConyuge}</td>
                    </tr>
                  ))
                ) : (
                  <td>&nbsp;</td>
                )}
              </tbody>
            </table>
            <table className="informationTable">
              <thead>
                <tr>
                  <th className="tableCell">Nombres y Apellidos</th>
                  <th className="tableCell">No. Identificación</th>
                </tr>
              </thead>
              <tbody>
                {obligaciones.length > 0 ? (
                  obligaciones.map((obligacion, index) => (
                    <tr key={index}>
                      <td className="tableCell" key={index}>
                        {obligacion.nombresHijo}
                      </td>
                      <td className="tableCell" key={index}>
                        {obligacion.idHijo}
                      </td>
                    </tr>
                  ))
                ) : (
                  <td>&nbsp;</td>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Insolvencia;
