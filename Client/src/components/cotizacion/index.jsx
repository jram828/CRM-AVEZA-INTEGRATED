import "../../App.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../cotizacion/cotizacion.css";
import { Button } from "../Mystyles.js";
import { listaacreedores } from "../../utils/acreedores.js";
import { generarCotizacion } from "../../handlers/generarCotizacion.jsx";
import {
  crearDeudas,
  crearSolicitud,
  modificarCasoCotizacion,
  postHonorarios,
} from "../../redux/actions.js";
import { formatNumero } from "../../utils/formatNumero.js";
import { use } from "react";
import { Link } from "react-router-dom";
import ReactModal from "react-modal";

const Cotizacion = () => {
  const prospecto = useSelector((state) => state.prospecto);
  const caso = useSelector((state) => state.caso);
  // console.log("Cliente cotizacion:", cliente);

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
    totalBienes: "",
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
    sujetoRegistro: "",
  };

  const initHonorarios = {
    inicial: "",
    cuotasHonorarios: "",
    valorHonorarios: "",
    valorRadicar: "",
    honorariosLiquidacion: "",
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
  // console.log("Bienes general:", bienes);
  // console.log("FormData:", formData);

  const addPropuesta = () => {
    setPropuestas([...propuestas, initPropuesta]);
  };

  // useEffect(() => {

  // }, [deudas]);
  const formatoNumero = (numero) => {
    return numero.toLocaleString("es-CO", { minimumFractionDigits: 2 });
  };

  console.log("Deudas:", deudas);
  // console.log("Datos deuda:", datosDeuda);

  // console.log("Propuestas:", propuestas);
  // console.log("Propuesta:", propuesta);

  // console.log("Posible cuota:", posibleCuota);
  const handleDeudaChange = (index, event) => {
    const { name, value } = event.target;
    const updatedDeudas = [...deudas];
    updatedDeudas[index][name] = value;
    setDeudas(updatedDeudas);

    if (name === "acreedor") {
      <input
        type="text"
        value={deuda.acreedor}
        name="acreedor"
        id={`acreedor-${index}`}
        className="cajacotizacion"
        placeholder="Buscar acreedor..."
        onChange={(event) => handleDeudaChange(index, event)}
      />;
    }
    if (name === "capital") {
      // Cálculo de totales por tipo de deuda
      const totalesPorTipo = deudas.reduce((acc, deuda) => {
        acc[deuda.tipoDeuda] =
          (acc[deuda.tipoDeuda] || 0) + parseFloat(deuda.capital);
        return acc;
      }, {});
      // console.log("Totales por tipo:", totalesPorTipo);

      // Cálculo del total general
      let totalDeudas = deudas.reduce(
        (acc, deuda) => acc + parseFloat(deuda.capital),
        0
      );
      // console.log("Total de deudas:", totalDeudas);

      let derechoVotoPorTipo = {};

      // Calcular los porcentajes usando forEach
      Object.entries(totalesPorTipo).forEach(([key, valor]) => {
        derechoVotoPorTipo[key] = ((valor / totalDeudas) * 100).toFixed(2);
      });

      // console.log("Derecho voto por tipo:", derechoVotoPorTipo);

      const votoClasePorTipo = deudas.reduce((acc, deuda) => {
        acc[deuda.tipoDeuda] =
          (acc[deuda.tipoDeuda] || 0) + parseFloat(deuda.votoClase);
        return acc;
      }, {});
      // console.log("Voto clase por tipo:", votoClasePorTipo);

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
      // console.log("Resultados:", resultados);
      // Suma de porcentajes
      const sumaDerechoVoto = resultados.reduce(
        (acc, deuda) => acc + deuda.derechoVoto,
        0
      );

      // console.log("Suma derecho de voto:", sumaDerechoVoto);
      // console.log(
      //   "Total deudas para honorarios:",
      //   resultadosCotizacion.totalDeudas
      // );

      // console.log("Honorarios:", honorarios);
      // Actualizar el estado con los resultados
      setResultadosCotizacion({
        ...resultadosCotizacion,
        totalDeudas,
        totalDerechoVoto: sumaDerechoVoto,
        derechoVotoPorTipo,
        totalesPorTipo,
      });
    }
    // console.log("Resultados cotizacion:", resultadosCotizacion);
    // console.log("index:", index);
    // console.log("name:", name);
    // console.log("value:", value);
    setEditingField(name);
    // setAcreedorFilt(initAcreedorFilt);
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
      // console.log("Total de bienes:", totalBienes);
      // Actualizar el estado con los resultados
      setResultadosCotizacion({
        ...resultadosCotizacion,
        totalBienes,
      });
    }
    // console.log("Resultados cotizacion:", resultadosCotizacion);
    // console.log("index:", index);
    // console.log("name:", name);
    // console.log("value:", value);
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
    setAcreedorFilt(initAcreedorFilt);
  };

  const handleSujetoChange = async (event) => {
    event.preventDefault();
    const { value } = event.target;
    setResultadosCotizacion({
      ...resultadosCotizacion,
      sujetoRegistro: value,
    });
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

  // console.log("Gastos:", gastos);
  // console.log("Datos gasto:", gasto);

  // console.log("Ingresos:", ingresos);
  // console.log("ingreso:", ingreso);

  // console.log("bienes:", bienes);
  // console.log("bien:", bien);

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
    console.log("Propuestas handler:", propuestas);

    const datoscotizacion = generarCotizacion(
      caso,
      ingreso,
      gasto,
      bienes,
      deudas,
      propuestas,
      prospecto,
      honorarios,
      resultadosCotizacion
    );

    // dispatch(modificarCasoCotizacion(datoscotizacion));
    console.log("Cedula:", prospecto.cedulaProspecto);
    dispatch(
      crearDeudas({ deudas, cedulaProspecto: prospecto.cedulaProspecto })
    );
    dispatch(
      postHonorarios({
        honorarios: honorarios,
        cedulaProspecto: prospecto.cedulaProspecto,
        totalDeudas: resultadosCotizacion.totalDeudas,
      })
    );
    // console.log("Datos cotizacion:", datoscotizacion);
    // dispatch(crearCotizacion(datoscotizacion));
  };

  const handleAcreedorChange = (event) => {
    event.preventDefault();

    setDatosDeuda({
      ...datosDeuda,
      [event.target.name]: event.target.value,
    });

    const foundAcreedor = listaacreedores.filter((acreedor) =>
      acreedor.nombre.toLowerCase().includes(event.target.value.toLowerCase())
    );
    // console.log("Acreedores encontrados:", foundAcreedor);
    setAcreedorFilt(foundAcreedor);
  };

  const parseNumero = (numeroFormateado) => {
    console.log("Numero formateado:", numeroFormateado);
    return Number(numeroFormateado.replace(/[^0-9,-]+/g, "").replace(",", "."));
  };

  const handleKeyPress = (e, index) => {
    if (e.key === "Enter") {
      const { name, value } = e.target;

      switch (editingField) {
        case "valor":
          setBien({
            ...bien,
            [name]: parseNumero(bien[name]), // Formatea el valor solo cuando se presiona Enter
          });
          break;
        case "capital": {
          const updatedDeudas = [...deudas];
          console.log("Deudas keypress:", updatedDeudas);
          // updatedDeudas[index][name] = Number(value.replace(/\./g, "").replace(/,/g, "."));
          updatedDeudas[index][name] = parseNumero(value);

          setDeudas(updatedDeudas);
          break;
        }
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
    // console.log("Updated data:", updatedData);
    // console.log("Tipo:", tipo);
    // console.log("Field:", field);
    // console.log("Value:", value);
    updatedData[tipo][field] = value;

    // Calcular el valor de la cuota
    if (field === "tasa" || field === "cuotas") {
      const tasa = parseFloat(updatedData[tipo].tasa) || 0;
      const cuotas = parseInt(updatedData[tipo].cuotas, 10) || 0;
      const totalPorTipo = resultadosCotizacion.totalesPorTipo[tipo];
      // console.log("Total por tipo:", totalPorTipo);
      // console.log("Tasa:", tasa);
      // console.log("Cuotas:", cuotas);
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
    // console.log("Suma de cuotas:", totalCuotas);
    setResultadosCotizacion(updatedData);
  };
  // console.log("Honorarios:", honorarios);
  // Importa useState y el componente Modal de tu librería preferida (ejemplo: react-modal)

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <Button
        className="botonesiniciosesion"
        onClick={() => setModalOpen(true)}
        type="button"
      >
        Abrir Cotización
      </Button>
      <ReactModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        ariaHideApp={false}
        className="modal-cotizacion"
        overlayClassName="modal-overlay"
      >
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
              type="button"
            >
              Generar cotización
            </Button>
            <Link to="/detail">
              <Button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="none"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={50.5}
                    d="M244 400L100 256l144-144M120 256h292"
                  ></path>
                </svg>
                Volver
              </Button>
            </Link>
            <Button
              className="botonesiniciosesion"
              onClick={() => setModalOpen(false)}
              type="button"
            >
              Cerrar
            </Button>
          </div>
          {/* El resto del formulario permanece igual */}
          <form
            // onSubmit={handlerGenerarCotizacion}
            className="datoscotizacion"
            id="contcotizacion"
          >
            {/* ...todo el contenido del formulario como estaba antes... */}
            {/* Puedes copiar aquí el contenido original del form */}
            {/* ... */}
            <div className="infotodoscotizacion">
              {/* ...resto del contenido igual... */}
              {/* Puedes pegar aquí todo el contenido del formulario original */}
              {/* ... */}
              {/* (El código del formulario no cambia, solo está dentro del modal) */}
              {/* ... */}
              {/* ... */}
            </div>
          </form>
        </div>
      </ReactModal>
    </div>
  );
};
export default Cotizacion;
