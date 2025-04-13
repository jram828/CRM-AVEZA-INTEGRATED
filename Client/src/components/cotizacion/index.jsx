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
    "Primera Clase": {
      tasa: "",
      cuotas: "",
      valorCuota: "",
    },
    "Segunda Clase": {
      tasa: "",
      cuotas: "",
      valorCuota: "",
    },
    "Tercera Clase": {
      tasa: "",
      cuotas: "",
      valorCuota: "",
    },
    "Cuarta Clase": {
      tasa: "",
      cuotas: "",
      valorCuota: "",
    },
    "Quinta Clase": {
      tasa: "",
      cuotas: "",
      valorCuota: "",
    },

    tasa: "",
    cuotas: "",
    valorCuota: "",
    sumaCuotas: "",
    sumaValorCuota: "",
  };

  const initHonorarios = {
    inicial: "",
    cuotasHonorarios: "",
    valorHonorarios: "",
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
    gastosmensuales: "",
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
  const [resultadosCotizacion, setResultadosCotizacion] = useState(
    initResultadosCotizacion
  );
  const [honorarios, setHonorarios] = useState(initHonorarios);
  const [formData, setFormData] = useState(
    resultadosCotizacion.totalesPorTipo &&
      Object.keys(resultadosCotizacion.totalesPorTipo).reduce((acc, tipo) => {
        acc[tipo] = { tasa: "", cuotas: "", valorCuota: "" };
        return acc;
      }, {})
  );

  console.log("FormData:", formData);

  const addPropuesta = () => {
    setPropuestas([...propuestas, initPropuesta]);
  };

  // useEffect(() => {

  // }, [deudas]);

  console.log("Deudas:", deudas);
  console.log("Datos deuda:", datosDeuda);

  console.log("Propuestas:", propuestas);
  console.log("Propuesta:", propuesta);

  console.log("Posible cuota:", posibleCuota);
  const handleDeudaChange = (index, event) => {
    const { name, value } = event.target;
    const updatedDeudas = [...deudas];
    updatedDeudas[index][name] = value;
    setDeudas(updatedDeudas);

    if (name === "capital") {
      // Cálculo de totales por tipo de deuda
      const totalesPorTipo = deudas.reduce((acc, deuda) => {
        acc[deuda.tipoDeuda] =
          (acc[deuda.tipoDeuda] || 0) + parseFloat(deuda.capital);
        return acc;
      }, {});
      console.log("Totales por tipo:", totalesPorTipo);

      // Cálculo del total general
      let totalDeudas = deudas.reduce(
        (acc, deuda) => acc + parseFloat(deuda.capital),
        0
      );
      console.log("Total de deudas:", totalDeudas);

      let derechoVotoPorTipo = {};

      // Calcular los porcentajes usando forEach
      Object.entries(totalesPorTipo).forEach(([key, valor]) => {
        derechoVotoPorTipo[key] = ((valor / totalDeudas) * 100).toFixed(2);
      });

      console.log("Derecho voto por tipo:", derechoVotoPorTipo);

      const votoClasePorTipo = deudas.reduce((acc, deuda) => {
        acc[deuda.tipoDeuda] =
          (acc[deuda.tipoDeuda] || 0) + parseFloat(deuda.votoClase);
        return acc;
      }, {});
      console.log("Voto clase por tipo:", votoClasePorTipo);

      const resultados = deudas.map((deuda) => {
        const derechoVoto =
          Math.floor((parseFloat(deuda.capital) / totalDeudas) * 100 * 100) /
          100;
        const votoClase =
          Math.floor(
            (parseFloat(deuda.capital) / totalesPorTipo[deuda.tipoDeuda]) *
              100 *
              100
          ) / 100;

        return {
          ...deuda,
          derechoVoto,
          votoClase,
        };
      });
      setDeudas(resultados);
      console.log("Resultados:", resultados);
      // Suma de porcentajes
      const sumaDerechoVoto = resultados.reduce(
        (acc, deuda) => acc + deuda.derechoVoto,
        0
      );

      console.log("Suma derecho de voto:", sumaDerechoVoto);
      let vHonorarios;
      console.log(
        "Total deudas para honorarios:",
        resultadosCotizacion.totalDeudas
      );

      
      if (0.1 * resultadosCotizacion.totalDeudas > 50000000) {
        vHonorarios = 50000000;
        setHonorarios({ ...honorarios, valorHonorarios: vHonorarios });
      } else {
        vHonorarios = 0.1 * resultadosCotizacion.totalDeudas;
        setHonorarios({ ...honorarios, valorHonorarios: vHonorarios });
      }

      console.log("vHonorarios:", vHonorarios);
      console.log("Honorarios:", honorarios);
      // Actualizar el estado con los resultados
      setResultadosCotizacion({
        ...resultadosCotizacion,
        totalDeudas,
        totalDerechoVoto: sumaDerechoVoto,
        derechoVotoPorTipo,
        totalesPorTipo,
      });
    }
    console.log("Resultados cotizacion:", resultadosCotizacion);
    console.log("index:", index);
    console.log("name:", name);
    console.log("value:", value);
    setEditingField(name);
    setAcreedorFilt(initAcreedorFilt);
  };

  const handleBienChange = (index, event) => {
    const { name, value } = event.target;
    console.log("Bienes handle bien change:", bienes);
    const updatedBienes = [...bienes];
    updatedBienes[index][name] = value;
    setBienes(updatedBienes);
    console.log("Bienes:", bienes);
    if (name === "valor") {
      // Cálculo del total
      let totalBienes = bienes.reduce(
        (acc, bien) => acc + parseFloat(bien.valor),
        0
      );
      console.log("Total de bienes:", totalBienes);
      // Actualizar el estado con los resultados
      setResultadosCotizacion({
        ...resultadosCotizacion,
        totalBienes,
      });
    }
    console.log("Resultados cotizacion:", resultadosCotizacion);
    console.log("index:", index);
    console.log("name:", name);
    console.log("value:", value);
    setEditingField(name);
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

  const handleAddBien = async (e) => {
    e.preventDefault();
    setBienes([...bienes, initBien]);
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

  const handleHonorarioChange = (e) => {
    setHonorarios({
      ...honorarios,
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

  const handleSubmitIngreso = async (e) => {
    e.preventDefault();
    addIngreso(ingreso);
  };

  const handleSubmitGasto = async (e) => {
    e.preventDefault();
    addGasto(gasto);
  };

  const handlerGenerarCotizacion = () => {
    const datoscotizacion = generarCotizacion(
      ingreso,
      gasto,
      bienes,
      deudas,
      propuestas,
      cliente,
      honorarios,
      resultadosCotizacion
    );

    console.log("Datos cotizacion:", datoscotizacion);
    // dispatch(crearCotizacion(datoscotizacion));
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

  const handleCuotasChange = (tipo, field, value) => {
    const updatedData = { ...resultadosCotizacion };
    console.log("Updated data:", updatedData);
    console.log("Tipo:", tipo);
    console.log("Field:", field);
    console.log("Value:", value);
    updatedData[tipo][field] = value;

    // Calcular el valor de la cuota
    if (field === "tasa" || field === "cuotas") {
      const tasa = parseFloat(updatedData[tipo].tasa) || 0;
      const cuotas = parseInt(updatedData[tipo].cuotas, 10) || 0;
      const totalPorTipo = resultadosCotizacion.totalesPorTipo[tipo];
      console.log("Total por tipo:", totalPorTipo);
      console.log("Tasa:", tasa);
      console.log("Cuotas:", cuotas);
      updatedData[tipo].valorCuota =
        cuotas > 0
          ? Math.round(totalPorTipo * (tasa / 100)) /
            (1 - Math.pow(1 + tasa / 100, -cuotas))
          : "";
    }
    // Calcular la suma de cuotas y valorCuota
    let totalCuotas = 0;
    let totalValorCuota = 0;

    Object.keys(updatedData).forEach((key) => {
      const data = updatedData[key];
      totalCuotas += parseInt(data.cuotas, 10) || 0;
      totalValorCuota += parseFloat(data.valorCuota) || 0;
    });

    updatedData.sumaCuotas = totalCuotas;
    updatedData.sumaValorCuota = totalValorCuota;
    console.log("Suma de cuotas:", totalCuotas);
    setResultadosCotizacion(updatedData);
  };
  console.log("Honorarios:", honorarios);
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
                      onChange={(event) => handleBienChange(index, event)}
                    />
                    <input
                      type="text"
                      className="cajaingresos"
                      name="valor"
                      id="valorBien"
                      onChange={(event) => handleBienChange(index, event)}
                      value={
                       bien.valor
                      }
                      onKeyDown={handleKeyPress}
                    />
                  </div>
                ))}
                <div className="encabezadopropuesta">
                  <h6 className="titulocotizacion">TOTAL BIENES</h6>
                  <h6 className="titulocotizacion">
                    {formatNumero(resultadosCotizacion.totalBienes)}
                  </h6>

                </div>
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
                          value={ingreso.Valor}
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
                        value={gasto.gastosmensuales}
                       
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
                        value={posibleCuota.mensual
                        }
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                  </div>
                </div>
                <div className="resumenresultados">
                  <div className="infoseccioncotizacion">
                    <div className="encabezadoingresos">
                      <h6 className="titulocotizacion">Honorarios</h6>
                    </div>

                    <div className="infodeudascotizacion">
                      <div className="infodetailingresos">
                        <h6 className="titulocotizacion">Valor</h6>
                        <h6 className="titulocotizacion">{
                            resultadosCotizacion.totalDeudas * 0.1 > 50000000
                              ? formatNumero(50000000)
                              : formatNumero(resultadosCotizacion.totalDeudas * 0.1)
                          }
                          </h6>
                      </div>
                    </div>

                    <div className="infodeudascotizacion">
                      <div className="infodetailingresos">
                        <h6 className="titulocotizacion">
                          Porcentaje inicial:
                        </h6>
                        <input
                          type="number"
                          className="cajaingresos"
                          name="inicial"
                          id="inicial"
                          onChange={(event) => handleHonorarioChange(event)}
                          value={honorarios.inicial}
                          onKeyDown={handleKeyPress}
                        />
                      </div>
                    </div>

                    <div className="infodeudascotizacion">
                      <div className="infodetailingresos">
                        <h6 className="titulocotizacion">Numero de cuotas:</h6>
                        <input
                          type="number"
                          className="cajaingresos"
                          name="cuotasHonorarios"
                          id="cuotasHonorarios"
                          onChange={(event) => handleHonorarioChange(event)}
                          value={ honorarios.cuotasHonorarios}
                          onKeyDown={handleKeyPress}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="formingresos">
              <div className="infoseccion">
                <div className="encabezadodeudas">
                  <h6 className="titulocotizacion">Propuesta de pago</h6>
                </div>
                <div className="encabezadopropuesta">
                  <h6 className="titulocotizacion">
                    Clasificación del crédito
                  </h6>
                  <h6 className="titulocotizacion">Subtotal clase</h6>
                  <h6 className="titulocotizacion">Derecho de voto</h6>
                  <h6 className="titulocotizacion">Tasa de interés</h6>
                  <h6 className="titulocotizacion">Número de cuotas</h6>
                  <h6 className="titulocotizacion">Valor de la cuota</h6>
                </div>
                {resultadosCotizacion.totalesPorTipo &&
                  Object.entries(resultadosCotizacion.totalesPorTipo).map(
                    (tipo, valor) => (
                      <div className="infodeudascotizacion" key={tipo}>
                        <h6 className="titulocotizacion">{tipo[0]}</h6>
                        <input
                          type="text"
                          value={resultadosCotizacion.totalesPorTipo[tipo[0]]}
                          className="inputDerechoVoto"
                          readOnly
                        />
                        <input
                          type="text"
                          value={
                            resultadosCotizacion.derechoVotoPorTipo[tipo[0]]
                          }
                          className="inputDerechoVoto"
                          readOnly
                        />
                        <input
                          type="number"
                          placeholder="Tasa (%)"
                          value={
                            (resultadosCotizacion &&
                              resultadosCotizacion[tipo[0]].tasa) ||
                            ""
                          }
                          onChange={(e) =>
                            handleCuotasChange(tipo[0], "tasa", e.target.value)
                          }
                          className="inputTasa"
                        />
                        <input
                          type="number"
                          placeholder="Cuotas"
                          value={resultadosCotizacion[tipo[0]].cuotas}
                          onChange={(e) =>
                            handleCuotasChange(
                              tipo[0],
                              "cuotas",
                              e.target.value
                            )
                          }
                          className="inputCuotas"
                        />
                        <input
                          type="text"
                          placeholder="Valor Cuota"
                          value={formatNumero(
                            Math.round(resultadosCotizacion[tipo[0]].valorCuota)
                          )}
                          readOnly
                          className="inputValorCuota"
                        />
                      </div>
                    )
                  )}
                <div className="encabezadopropuesta">
                  <h6 className="titulocotizacion">TOTAL</h6>
                  <h6 className="titulocotizacion">
                    {formatNumero(resultadosCotizacion.totalDeudas)}
                  </h6>
                  <h6 className="titulocotizacion">
                    {Math.round(resultadosCotizacion.totalDerechoVoto)}
                  </h6>
                  <h6 className="titulocotizacion">{"              "} </h6>
                  <h6 className="titulocotizacion">
                    {resultadosCotizacion.sumaCuotas}
                  </h6>
                  <h6 className="titulocotizacion">
                    {formatNumero(
                      Math.round(resultadosCotizacion.sumaValorCuota)
                    )}
                  </h6>
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
                      onChange={(event) => handleAcreedorChange(index, event)}
                    />

                    <input
                      type="number"
                      className="cajadeudas"
                      name="capital"
                      id={`capital-${index}`}
                      value={Number.parseFloat(deuda.capital)}
                      onChange={(event) => handleDeudaChange(index, event)}
                    />
                    <input
                      type="number"
                      className="cajadeudas"
                      name="derechoVoto"
                      id={`derechoVoto-${index}`}
                      value={Number.parseFloat(deuda.derechoVoto).toFixed(2)}
                      onChange={(event) => handleDeudaChange(index, event)}
                    />
                    <input
                      type="number"
                      className="cajadeudas"
                      name="votoClase"
                      id={`votoClase-${index}`}
                      value={Number.parseFloat(deuda.votoClase).toFixed(2)}
                      onChange={(event) => handleDeudaChange(index, event)}
                    />
                  </div>
                ))}
                <Button onClick={handleAddDeuda} value="Guardar">
                  Agregar deuda
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Cotizacion;
