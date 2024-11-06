import "../../App.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../insolvencia/insolvencia.css";
import { Button } from "../Mystyles";
import { listaacreedores } from "../../utils/acreedores.js";
import { generarSolicitud } from "../../handlers/generarSolicitud.jsx";
import { juzgados } from "../../utils/juzgados.js";
import { crearSolicitud } from "../../redux/actions.js";
import { formatNumero } from "../../utils/formatNumero.js";

const Insolvencia = () => {
  const cliente = useSelector((state) => state.cliente);
  console.log("Cliente insolvencia:", cliente);

  const dispatch = useDispatch();

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
  const listaAcreedoresObj = [];

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
    Valor: "",
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
    motivos: "",
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
  const [listaAcreedores, setListaAcreedores] = useState(listaAcreedoresObj);
  const [editingField, setEditingField] = useState(null);

  const addDeuda = (deuda) => {
    setDeudas([...deudas, deuda]);
    setDatosDeuda(initDeuda);
  };

  const addAcreedor = (acreedor) => {
    setListaAcreedores([...listaAcreedores, acreedor]);
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
    setEditingField(e.target.name);
  };

  const handlePropuestaChange = (e) => {
    setPropuesta({
      ...propuesta,
      [e.target.name]: e.target.value,
    });
    setEditingField(e.target.name);
  };

  const handleMotivosChange = (e) => {
    setMotivos({
      ...motivos,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitDeuda = async (e) => {
    e.preventDefault();
    addDeuda(datosDeuda);
    console.log("Acreedor buscado:", datosDeuda.acreedor);
    const filteredAcreedor = listaacreedores.filter(
      (acreedor) => acreedor.nombre === datosDeuda.acreedor
    );
    console.log("Acreedor encontrado:", filteredAcreedor);
    addAcreedor(filteredAcreedor[0]);
  };

  const handleSubmitPropuesta = async (e) => {
    e.preventDefault();
    addPropuesta(propuesta);
  };

  const handleSubmitMotivos = async (e) => {
    e.preventDefault();
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
    setEditingField(e.target.name);
  };

  const handleGastoChange = (e) => {
    setGasto({
      ...gasto,
      [e.target.name]: e.target.value,
    });
    setEditingField(e.target.name);
  };

  const handleBienChange = (e) => {
    setBien({
      ...bien,
      [e.target.name]: e.target.value,
    });
    setEditingField(e.target.name);
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
    addIngreso(ingreso);
  };

  const handleSubmitBien = async (e) => {
    e.preventDefault();
    addBien(bien);
  };

  const handleSubmitGasto = async (e) => {
    e.preventDefault();
    addGasto(gasto);
  };

  const handleSubmitProceso = async (e) => {
    e.preventDefault();
    addProceso(proceso);
  };

  const handleSubmitObligacion = async (e) => {
    e.preventDefault();
    addObligacion(obligacion);
  };

  const handleSubmitSociedad = async (e) => {
    e.preventDefault();
    addSociedad(sociedad);
  };

  const handlerGenerarSolicitud = () => {
    const datosinsolvencia = generarSolicitud(
      ingresos,
      gastos,
      bienes,
      procesos,
      obligaciones,
      sociedades,
      deudas,
      propuestas,
      motivos,
      cliente,
      listaAcreedores
    );

    console.log("Datos insolvencia para back:", datosinsolvencia);
    dispatch(crearSolicitud(datosinsolvencia));
  };

  const [filteredJuzgado, setFilteredJuzgado] = useState([]);

  const handleJuzgadoChange = (e) => {
    const value = e.target.value;

    console.log("Input name:", e.target.name);
    console.log("Input value:", e.target.value);
    setProceso({
      ...proceso,
      [e.target.name]: e.target.value,
    });

    const foundJuzgado = juzgados.filter((juzgado) =>
      juzgado.nombre.toLowerCase().includes(value.toLowerCase())
    );
    console.log("Juzgados encontrados:", foundJuzgado);
    setFilteredJuzgado(foundJuzgado);

    console.log("Juzgados filtrados:", filteredJuzgado);
  };

  const handleAcreedorChange = (e) => {
    e.preventDefault();

    setDatosDeuda({
      ...datosDeuda,
      [e.target.name]: e.target.value,
    });

    const foundAcreedor = listaacreedores.filter((acreedor) =>
      acreedor.nombre.toLowerCase().includes(e.target.value.toLowerCase())
    );
    console.log("Acreedores encontrados:", foundAcreedor);
    setAcreedorFilt(foundAcreedor);
  };

  const parseNumero = (numeroFormateado) => {
    return Number(numeroFormateado.replace(/[^0-9,-]+/g, "").replace(",", "."));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const { name } = e.target;

      switch (editingField) {
        case "valor":
          setBien({
            ...bien,
            [name]: parseNumero(bien[name]), // Formatea el valor solo cuando se presiona Enter
          });
          break;
        case "capital":
          setDatosDeuda({
            ...datosDeuda,
            [name]: parseNumero(datosDeuda[name]), // Formatea el valor solo cuando se presiona Enter
          });
          break;
        case "intereses":
          setDatosDeuda({
            ...datosDeuda,
            [name]: parseNumero(datosDeuda[name]), // Formatea el valor solo cuando se presiona Enter
          });
          break;
        case "Valor":
          setIngreso({
            ...ingreso,
            [name]: parseNumero(ingreso[name]), // Formatea el valor solo cuando se presiona Enter
          });
          break;
        case "valorCuota":
          setPropuesta({
            ...propuesta,
            [name]: parseNumero(propuesta[name]), // Formatea el valor solo cuando se presiona Enter
          });
          break;
        default:
          setGasto({
            ...gasto,
            [name]: parseNumero(gasto[name]), // Formatea el valor solo cuando se presiona Enter
          });
          break;
      }

      setEditingField(null);
    }
  };

  return (
    <div className="contenedorinsolvencia">
      <div className="encabezado">
        <span className="titulo">Datos para la Solicitud de Insolvencia</span>
      </div>
      <br />
      <div className="menu-insolvencia">
        <input type="file" id="doc" />
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
              <div className="infoseccion">
                <div className="encabezadodeudas">
                  <h6 className="titulo">Información de las deudas</h6>
                </div>
                <div className="infodetaildeudas">
                  <label htmlFor="acreedor" className="labeldetaildeudas">
                    Selecciona el acreedor:
                  </label>
                  <input
                    type="text"
                    value={datosDeuda.acreedor}
                    name="acreedor"
                    id="acreedor"
                    className="cajadeudas"
                    onChange={(event) => handleAcreedorChange(event)}
                    placeholder="Buscar Institución..."
                  />
                </div>
                <div className="infodetaildeudas">
                  <select
                    name="acreedor"
                    id="acreedor"
                    className="cajadeudas"
                    onChange={(event) => handleDeudaChange(event)}
                  >
                    <option value="" className="opcionesacreedor">
                      Instituciones encontradas
                    </option>
                    {acreedorFilt.length > 0 &&
                      acreedorFilt.map((acreedor) => (
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
                    type="text"
                    className="cajadeudas"
                    name="capital"
                    id="capital"
                    onChange={(event) => handleDeudaChange(event)}
                    value={
                      editingField === "capital"
                        ? datosDeuda.capital
                        : formatNumero(datosDeuda.capital)
                    }
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <div className="infodetaildeudas">
                  <label htmlFor="intereses" className="labeldetaildeudas">
                    Valor intereses:
                  </label>
                  <input
                    type="text"
                    className="cajadeudas"
                    name="intereses"
                    id="intereses"
                    onChange={(event) => handleDeudaChange(event)}
                    value={
                      editingField === "intereses"
                        ? datosDeuda.intereses
                        : formatNumero(datosDeuda.intereses)
                    }
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <div className="infodetaildeudas">
                  <label htmlFor="clasificacion" className="labeldetaildeudas">
                    Clasificación del Crédito:
                  </label>
                  <input
                    type="text"
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
                    type="text"
                    className="cajaingresos"
                    name="valor"
                    id="valorBien"
                    onChange={(event) => handleBienChange(event)}
                    value={
                      editingField === "valor"
                        ? bien.valor
                        : formatNumero(bien.valor)
                    }
                    onKeyDown={handleKeyPress}
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
                    value={proceso.juzgado}
                    name="juzgado"
                    id="juzgado"
                    className="cajaingresos"
                    onChange={(event) => handleJuzgadoChange(event)}
                    placeholder="Buscar juzgado..."
                  />
                </div>
                <div className="selectorjuzgado">
                  {filteredJuzgado.length > 0 && (
                    <select
                      name="juzgado"
                      id="juzgado"
                      className="cajaingresos"
                      onChange={(event) => handleProcesoChange(event)}
                    >
                      <option value="" className="cajaingresos">
                        Juzgados encontrados
                      </option>
                      {filteredJuzgado.map((juzgado, index) => (
                        <option
                          key={index}
                          value={juzgado.nombre}
                          className="cajaingresos"
                        >
                          {juzgado.nombre}
                        </option>
                      ))}
                    </select>
                  )}
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
                    type="text"
                    className="cajaingresos"
                    name="Valor"
                    id="valor"
                    onChange={(event) => handleIngresoChange(event)}
                    value={
                      editingField === "Valor"
                        ? ingreso.Valor
                        : formatNumero(ingreso.Valor)
                    }
                    onKeyDown={handleKeyPress}
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
                    type="text"
                    className="cajaingresos"
                    name="energia"
                    id="energia"
                    onChange={(event) => handleGastoChange(event)}
                    value={
                      editingField === "energia"
                        ? gasto.energia
                        : formatNumero(gasto.energia)
                    }
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="agua" className="labelingresos">
                    Agua, alcantarillado y aseo:
                  </label>
                  <input
                    type="text"
                    className="cajaingresos"
                    name="aguaAlcAseo"
                    id="agua"
                    onChange={(event) => handleGastoChange(event)}
                    value={
                      editingField === "aguaAlcAseo"
                        ? gasto.aguaAlcAseo
                        : formatNumero(gasto.aguaAlcAseo)
                    }
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="gas" className="labelingresos">
                    Gas:
                  </label>
                  <input
                    type="text"
                    className="cajaingresos"
                    name="gas"
                    id="gas"
                    onChange={(event) => handleGastoChange(event)}
                    value={
                      editingField === "gas"
                        ? gasto.gas
                        : formatNumero(gasto.gas)
                    }
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="telecomunicaciones" className="labelingresos">
                    Telecomunicaciones :
                  </label>
                  <input
                    type="text"
                    className="cajaingresos"
                    name="telecomunicaciones"
                    id="telecomunicaciones"
                    onChange={(event) => handleGastoChange(event)}
                    value={
                      editingField === "telecomunicaciones"
                        ? gasto.telecomunicaciones
                        : formatNumero(gasto.telecomunicaciones)
                    }
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="television" className="labelingresos">
                    Televisión:
                  </label>
                  <input
                    type="text"
                    className="cajaingresos"
                    name="television"
                    id="television"
                    onChange={(event) => handleGastoChange(event)}
                    value={
                      editingField === "television"
                        ? gasto.television
                        : formatNumero(gasto.television)
                    }
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="arriendo" className="labelingresos">
                    Arriendo:
                  </label>
                  <input
                    type="text"
                    className="cajaingresos"
                    name="arriendo"
                    id="arriendo"
                    onChange={(event) => handleGastoChange(event)}
                    value={
                      editingField === "arriendo"
                        ? gasto.arriendo
                        : formatNumero(gasto.arriendo)
                    }
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="seguros" className="labelingresos">
                    Seguros:
                  </label>
                  <input
                    type="text"
                    className="cajaingresos"
                    name="seguros"
                    id="seguros"
                    onChange={(event) => handleGastoChange(event)}
                    value={
                      editingField === "seguros"
                        ? gasto.seguros
                        : formatNumero(gasto.seguros)
                    }
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="alimentacion" className="labelingresos">
                    Alimentación:
                  </label>
                  <input
                    type="text"
                    className="cajaingresos"
                    name="alimentacion"
                    id="alimentacion"
                    onChange={(event) => handleGastoChange(event)}
                    value={
                      editingField === "alimentacion"
                        ? gasto.alimentacion
                        : formatNumero(gasto.alimentacion)
                    }
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="transporte" className="labelingresos">
                    Transporte:
                  </label>
                  <input
                    type="text"
                    className="cajaingresos"
                    name="transporte"
                    id="transporte"
                    onChange={(event) => handleGastoChange(event)}
                    value={
                      editingField === "transporte"
                        ? gasto.transporte
                        : formatNumero(gasto.transporte)
                    }
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <div className="infodetailingresos">
                  <label htmlFor="otros" className="labelingresos">
                    Otros gastos:
                  </label>
                  <input
                    type="text"
                    className="cajaingresos"
                    name="otros"
                    id="otros"
                    onChange={(event) => handleGastoChange(event)}
                    value={
                      editingField === "otros"
                        ? gasto.otros
                        : formatNumero(gasto.otros)
                    }
                    onKeyDown={handleKeyPress}
                  />
                </div>

                <Button onClick={handleSubmitGasto} value="Guardar">
                  Guardar gastos
                </Button>
              </div>
            </div>
            <div className="formpropuesta">
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
                    type="text"
                    className="cajadeudas"
                    name="valorCuota"
                    id="valorCuota"
                    onChange={(event) => handlePropuestaChange(event)}
                    value={
                      editingField === "valorCuota"
                        ? propuesta.valorCuota
                        : formatNumero(propuesta.valorCuota)
                    }
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <div className="infodetailpropuesta">
                  <label htmlFor="numeroCuotas" className="labeldetaildeudas">
                    Número de cuotas :
                  </label>
                  <input
                    type="number"
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
                        {formatNumero(deuda.capital)}
                      </td>
                      <td className="tableCell" key={index}>
                        {formatNumero(deuda.intereses)}
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
                    <tr key={index}>
                      <td className="tableCell">{bien.tipoBien}</td>
                      <td className="tableCell">{formatNumero(bien.valor)}</td>
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
                        {formatNumero(ingreso.valor)}
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
                    <tr key={index}>
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
                      {formatNumero(gasto.energia)}
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
                      {formatNumero(gasto.aguaAlcAseo)}
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
                      {formatNumero(gasto.gas)}
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
                      {formatNumero(gasto.television)}
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
                      {formatNumero(gasto.telecomunicaciones)}
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
                      {formatNumero(gasto.arriendo)}
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
                      {formatNumero(gasto.seguros)}
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
                      {formatNumero(gasto.alimentacion)}
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
                        {formatNumero(propuesta.valorCuota)}
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
                  <th className="tableCell">Nombres y Apellidos cónyuge</th>
                  <th className="tableCell">Identificación</th>
                </tr>
              </thead>
              <tbody>
                {sociedades.length > 0 ? (
                  sociedades.map((sociedad, index) => (
                    <tr key={index}>
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
                  <th className="tableCell">Nombres y Apellidos hijo(s)</th>
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
