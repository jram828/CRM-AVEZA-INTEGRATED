import "../../App.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../cotizacion/cotizacion.css";
import { Button } from "../Mystyles.js";
import { listaacreedores } from "../../utils/acreedores.js";
import { generarCotizacion } from "../../handlers/generarCotizacion.jsx";
import { crearSolicitud } from "../../redux/actions.js";
import { formatNumero } from "../../utils/formatNumero.js";
import { use } from "react";

const Cotizacion = () => {
  const cliente = useSelector((state) => state.cliente);
  console.log("Cliente cotizacion:", cliente);

  const dispatch = useDispatch();

  const deudasObj = [];
  const propuestasObj = [];

  const initDeuda = {
    idDeuda: "",
    acreedor: "",
    acreedorBuscado: "",
    tipoDeuda: "",
    capital: "",
    clasificacion: "",
    votoClase: "",
    derechoVoto: "",
  };

  const initResultadosCotizacion = {
    totalDeudas: "",
    totalVotoClase: "",
    totalDerechoVoto: "",
  };
  const initPropuesta = {
    Clasificacion: "",
    tasaIntereses: "",
    valorCuota: "",
    numeroCuotas: "",
    subtotal: "",
  };

  const ingresosObj = [];
  const gastosObj = [];
  const bienesObj = [];
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

  const initPosibleCuota = {
    mensual: "",
  };

  const initBien = {
    tipoBien: "",
    valor: "",
    tipoAfectacion: "",
    descripcionBien: "",
  };

  const initAcreedorFilt = {
    acreedores: [],
  };

  const [ingreso, setIngreso] = useState(initIngreso);
  const [ingresos, setIngresos] = useState(ingresosObj);
  const [gasto, setGasto] = useState(initGastos);
  const [gastos, setGastos] = useState(gastosObj);
  const [bien, setBien] = useState(initBien);
  const [bienes, setBienes] = useState(bienesObj);
  const [deudas, setDeudas] = useState(deudasObj);
  const [propuestas, setPropuestas] = useState(propuestasObj);
  const [datosDeuda, setDatosDeuda] = useState(initDeuda);
  const [propuesta, setPropuesta] = useState(initPropuesta);
  const [acreedorFilt, setAcreedorFilt] = useState(initAcreedorFilt);
  const [listaAcreedores, setListaAcreedores] = useState(listaAcreedoresObj);
  const [editingField, setEditingField] = useState(null);
  const [posibleCuota, setPosibleCuota] = useState(initPosibleCuota);
  const [resultadosCotizacion, setResultadosCotizacion] = useState(initResultadosCotizacion);

  const addDeuda = (deuda) => {
    setDeudas([...deudas, deuda]);
    setDatosDeuda(initDeuda);
  };

  const addAcreedor = (acreedor) => {
    setListaAcreedores([...listaAcreedores, acreedor]);
  };

  const addPropuesta = () => {
    setPropuestas([...propuestas, initPropuesta]);
  };

  useEffect(() => {
    // Cálculo de totales por tipo de deuda
const totalesPorTipo = deudas.reduce((acc, deuda) => {
  acc[deuda.tipoDeuda] = (acc[deuda.tipoDeuda] || 0) + deuda.capital;
  return acc;
}, {});
 console.log("Totales por tipo:", totalesPorTipo);  
// Cálculo del total general
const totalDeudas = deudas.reduce((acc, deuda) => acc + deuda.capital, 0);
console.log("Total de deudas:", totalDeudas); 
// Cálculo de porcentajes 

const resultados = deudas.map(deuda => {
  const derechoVoto = (deuda.capital / totalDeudas) * 100;
  const votoClase = (deuda.capital / totalesPorTipo[deuda.tipoDeuda]) * 100;
  

  return {
    ...deuda,
    derechoVoto,
    votoClase,
  };
});

console.log("Resultados:", resultados);
// Suma de porcentajes
const sumaDerechoVoto = resultados.reduce((acc, deuda) => acc + deuda.derechoVoto, 0);
const sumaVotoClase = resultados.reduce((acc, deuda) => acc + deuda.votoClase, 0);

console.log("Suma derecho de voto:", sumaDerechoVoto);
console.log("Suma voto clase:", sumaVotoClase);

// Actualizar el estado con los resultados    
setResultadosCotizacion({...resultadosCotizacion, totalDeudas, totalDerechoVoto: sumaDerechoVoto, totalVotoClase: sumaVotoClase});


  }, [deudas]);

  console.log("Deudas:", deudas);
  console.log("Datos deuda:", datosDeuda);

  console.log("Propuestas:", propuestas);
  console.log("Propuesta:", propuesta);

  const handleDeudaChange = (index, event) => {
    const { name, value } = event.target;
    const updatedDeudas = [...deudas];
    updatedDeudas[index][name] = Number(value);
    setDeudas(updatedDeudas);
    setEditingField(name);
    setAcreedorFilt(initAcreedorFilt);
  };

  const handlePropuestaChange = (index, event) => {
    const { name, value } = event.target;
    const nuevasPropuestas = [...propuestas];
    nuevasPropuestas[index][name] = value;
    setPropuestas(nuevasPropuestas);
  };

  const handleAddDeuda = async (e) => {
    e.preventDefault();
    setDeudas([
      ...deudas,
      {
        tipoDeuda: "",
        acreedor: "",
        capital: "",
        derechoVoto: "",
        votoClase: "",
      },
    ]);
  };

  const handleAddPropuesta = async (e) => {
    e.preventDefault();
    addPropuesta();
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

  console.log("Gastos:", gastos);
  console.log("Datos gasto:", gasto);

  console.log("Ingresos:", ingresos);
  console.log("ingreso:", ingreso);

  console.log("bienes:", bienes);
  console.log("bien:", bien);

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

  const handleCuotaChange = (e) => {
    setPosibleCuota({
      ...posibleCuota,
      [e.target.name]: e.target.value,
    });
    setEditingField(e.target.name);
  };

  const handleBienChange = (event) => {
    const { name, value } = event.target;
    setBien({ ...bien, [name]: value });
    setEditingField(name);
  };

  const handleSubmitIngreso = async (e) => {
    e.preventDefault();
    addIngreso(ingreso);
  };

  const handleAddBien = async (e) => {
    e.preventDefault();
    addBien(bien);
  };

  const handleSubmitGasto = async (e) => {
    e.preventDefault();
    addGasto(gasto);
  };

  const handlerGenerarCotizacion = () => {
    const datoscotizacion = generarCotizacion(
      ingresos,
      gastos,
      bienes,
      deudas,
      propuestas,
      cliente,
      listaAcreedores
    );

    console.log("Datos cotizacion:", datoscotizacion);
    dispatch(crearSolicitud(datoscotizacion));
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
    <div className="contenedorcotizacion">
      <div className="encabezado">
        <span className="titulo">Datos para la Cotización</span>
      </div>
      <br />
      <div className="menu-cotizacion">
        <input type="file" id="doc" />
        <Button
          className="botonesiniciosesion"
          onClick={handlerGenerarCotizacion}
        >
          Generar cotización
        </Button>
      </div>
      <form
        onSubmit={handlerGenerarCotizacion}
        className="datoscotizacion"
        id="contcotizacion"
      >
        <div className="infotodoscotizacion">
          <div className="infocotizaciondatos">
            <div className="formdeudascotizacion">
              <div className="formbienes">
                <div className="encabezadoingresos">
                  <h6 className="titulocotizacion">Bienes</h6>
                </div>
                <div className="encabezadoingresos">
                  <h6 className="titulocotizacion">Tipo de bien</h6>
                  <h6 className="titulocotizacion">Valor comercial</h6>
                </div>
                {bienes.map((bien, index) => (
                  <div className="infodeudascotizacion" key={index}>
                    <input
                      type="text"
                      className="cajaingresos"
                      name="tipoBien"
                      id="tipoBien"
                      value={bien.tipoBien}
                      onChange={(event) => handleBienChange(event)}
                    />
                    <input
                      type="number"
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
                ))}
                <Button onClick={handleAddBien} value="Guardarbien">
                  Agregar bien
                </Button>
              </div>
              <div className="resumen">
                <div className="formgastos">
                  <div className="infoseccioncotizacion">
                    <div className="encabezadoingresos">
                      <h6 className="titulocotizacion">Ingresos mensuales</h6>
                    </div>
                    <div className="infodeudascotizacion">
                      <div className="infodetailingresos">
                        <input
                          type="number"
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
                    </div>
                  </div>
                  <div className="infoseccioncotizacion">
                    <div className="encabezadogastos">
                      <h6 className="titulocotizacion">Gastos mensuales</h6>
                    </div>

                    <div className="infodetailingresos">
                      <input
                        type="number"
                        className="cajaingresos"
                        name="gastosmensuales"
                        id="gastosmensuales"
                        onChange={(event) => handleGastoChange(event)}
                        value={
                          editingField === "gastosmensuales"
                            ? gasto.gastosmensuales
                            : formatNumero(gasto.gastosmensuales)
                        }
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                  </div>
                  <div className="infoseccioncotizacion">
                    <div className="encabezadogastos">
                      <h6 className="titulocotizacion">
                        Posible cuota mensual
                      </h6>
                    </div>

                    <div className="infodetailingresos">
                      <input
                        type="number"
                        className="cajaingresos"
                        name="mensual"
                        id="mensual"
                        onChange={(event) => handleCuotaChange(event)}
                        value={
                          editingField === "mensual"
                            ? posibleCuota.mensual
                            : formatNumero(posibleCuota.mensual)
                        }
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                  </div>
                </div>
                <div className="resumenresultados">
                  {/* <div className="infoseccion">
                    <div className="encabezadodeudas">
                      <h6 className="titulocotizacion">Deudas</h6>
                    </div>
                    <div className="encabezadopropuesta">
                      <h6 className="titulocotizacion">Tipo de Deuda</h6>
                      <h6 className="titulocotizacion">Subtotal Capital</h6>
                      <h6 className="titulocotizacion"> Subtotal Derecho de voto</h6>
                      <h6 className="titulocotizacion">
                         Subtotal Derecho de voto por clase
                      </h6>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="formingresos">
              <div className="infoseccion">
                <div className="encabezadodeudas">
                  <h6 className="titulocotizacion">Deudas</h6>
                </div>
                <div className="encabezadopropuesta">
                  <h6 className="titulocotizacion">Tipo de Deuda</h6>
                  <h6 className="titulocotizacion">Acreedor</h6>
                  <h6 className="titulocotizacion">Capital</h6>
                  <h6 className="titulocotizacion">Derecho de voto</h6>
                  <h6 className="titulocotizacion">
                    Derecho de voto por clase
                  </h6>
                </div>
                {deudas.map((deuda, index) => (
                  <div className="infodeudascotizacion" key={index}>
                    <select
                      name="tipoDeuda"
                      id={`tipodeuda-${index}`}
                      className="cajaingresos"
                      value={deuda.tipoDeuda}
                      onChange={(event) => handleDeudaChange(index, event)}
                    >
                      <option value="" className="cajaingresos">
                        Seleccione tipo de deuda
                      </option>
                      <option value="Primera Clase" className="cajaingresos">
                        Primera Clase
                      </option>
                      <option value="Segunda Clase" className="cajaingresos">
                        Segunda Clase
                      </option>
                      <option value="Tercera Clase" className="cajaingresos">
                        Tercera Clase
                      </option>
                      <option value="Cuarta Clase" className="cajaingresos">
                        Cuarta Clase
                      </option>
                      <option value="Quinta Clase" className="cajaingresos">
                        Quinta Clase
                      </option>
                    </select>

                    <input
                      type="text"
                      value={deuda.acreedor}
                      name="acreedor"
                      id={`acreedor-${index}`}
                      className="cajaingresos"
                      placeholder="Buscar acreedor..."
                      onChange={(event) => handleDeudaChange(index, event)}
                    />

                    <input
                      type="number"
                      className="cajadeudas"
                      name="capital"
                      id={`capital-${index}`}
                      value={Number(deuda.capital)}
                      onChange={(event) => handleDeudaChange(index, event)}
                    />
                    <input
                      type="number"
                      className="cajadeudas"
                      name="derechoVoto"
                      id={`derechoVoto-${index}`}
                      value={deuda.derechoVoto}
                      onChange={(event) => handleDeudaChange(index, event)}
                    />
                    <input
                      type="number"
                      className="cajadeudas"
                      name="votoClase"
                      id={`votoClase-${index}`}
                      value={deuda.votoClase}
                      onChange={(event) => handleDeudaChange(index, event)}
                    />
                  </div>
                ))}
                <Button onClick={handleAddDeuda} value="Guardar">
                  Agregar deuda
                </Button>
              </div>
            </div>
            <div className="formpropuesta">
              <div className="encabezadopropuesta">
                <h6 className="titulocotizacion">Propuesta de pago</h6>
              </div>
              <div className="encabezadopropuesta">
                <h6 className="titulocotizacion">Clasificación del crédito</h6>
                <h6 className="titulocotizacion">Subtotal clase</h6>
                <h6 className="titulocotizacion">Tasa de interés</h6>
                <h6 className="titulocotizacion">Número de cuotas </h6>
                <h6 className="titulocotizacion">Valor de la cuota</h6>
              </div>

              {propuestas.map((propuesta, index) => (
                <div key={index} className="infodeudascotizacion">
                  <select
                    name="Clasificacion"
                    id="Clasificacion"
                    className="cajaingresos"
                    onChange={(event) => handlePropuestaChange(index, event)}
                    value={propuesta.Clasificacion}
                  >
                    <option value="" className="cajaingresos">
                      Seleccione tipo de deuda
                    </option>
                    <option value="Primera Clase" className="cajaingresos">
                      Primera Clase
                    </option>
                    <option value="Segunda Clase" className="cajaingresos">
                      Segunda Clase
                    </option>
                    <option value="Tercera Clase" className="cajaingresos">
                      Tercera Clase
                    </option>
                    <option value="Cuarta Clase" className="cajaingresos">
                      Cuarta Clase
                    </option>
                    <option value="Quinta Clase" className="cajaingresos">
                      Quinta Clase
                    </option>
                  </select>
                  <input
                    type="number"
                    className="cajadeudas"
                    name="subtotal"
                    value={propuesta.subtotal}
                    onChange={(event) => handlePropuestaChange(index, event)}
                  />
                  <input
                    type="number"
                    className="cajadeudas"
                    name="tasaIntereses"
                    value={propuesta.tasaIntereses}
                    onChange={(event) => handlePropuestaChange(index, event)}
                  />
                  <input
                    type="number"
                    className="cajadeudas"
                    name="numeroCuotas"
                    value={propuesta.numeroCuotas}
                    onChange={(event) => handlePropuestaChange(index, event)}
                  />
                  <input
                    type="number"
                    className="cajadeudas"
                    name="valorCuota"
                    value={propuesta.valorCuota}
                    onChange={(event) => handlePropuestaChange(index, event)}
                  />
                </div>
              ))}
              <Button onClick={handleAddPropuesta} value="Guardarpropuesta">
                Agregar propuesta
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Cotizacion;
