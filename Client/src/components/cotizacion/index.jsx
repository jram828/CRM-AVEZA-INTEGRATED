import "../../App.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../cotizacion/cotizacion.css";
import { Button } from "../Mystyles.js";
// import { listaacreedores } from "../../utils/acreedores.js";
import { generarCotizacion } from "../../handlers/generarCotizacion.jsx";
import { debounce } from "lodash";
import {
  buscarAcreedores,
  crearAcreedor,
  crearDeudas,
  crearSolicitud,
  modificarCasoCotizacion,
  postHonorarios,
} from "../../redux/actions.js";
import { formatNumero } from "../../utils/formatNumero.js";
import { Link } from "react-router-dom";
import { generarPlanPagosHonorarios } from "../../utils/planPagosHonorarios.js";
import { numeroALetras } from "../convertiraletras/index.jsx";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button as MUIButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Autocomplete,
  FormControlLabel,
} from "@mui/material";

const Cotizacion = () => {
  const prospecto = useSelector((state) => state.prospecto);
  const caso = useSelector((state) => state.caso);
  const listaacreedores = useSelector((state) => state.listaacreedores);
  console.log("Caso cotizacion:", caso);
  console.log("Lista acreedores:", listaacreedores);

  const [focusedIndex, setFocusedIndex] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Estado para el modal y los datos del nuevo acreedor
  const [showAcreedorModal, setShowAcreedorModal] = useState(false);
  const [newAcreedor, setNewAcreedor] = useState({
    nombre: "",
    NIT: "",
    direccion: "",
    ciudad: "",
    telefono: "",
    email: "",
    idProspecto: prospecto?.idProspecto || "",
  });

  // Handler para guardar acreedor (simulación, reemplazar con lógica real)
  const handleGuardarAcreedor = () => {
    // Aquí puedes enviar newAcreedor a la API o actualizar el estado global
    dispatch(crearAcreedor(newAcreedor));
    // Por ejemplo, cerrar el modal y limpiar el formulario
    setShowAcreedorModal(false);
    setNewAcreedor({
      nombre: "",
      NIT: "",
      direccion: "",
      ciudad: "",
      telefono: "",
      email: "",
    });
    // Opcional: mostrar mensaje de éxito o actualizar lista de acreedores
  };

  const dispatch = useDispatch();

  let deudasObj = {
    tipoDeuda: "",
    acreedor: "",
    capital: "",
    derechoVoto: 0,
    votoClase: 0,
  };

  useEffect(() => {
    dispatch(buscarAcreedores());
  }, [dispatch]);

  // Debounce input value

  // Filtrar acreedores con el valor debounced

  // if (caso?.Deuda2s?.length > 0) {
  //   deudasObj = caso.Deuda2s.map((item) => {
  //     const {
  //       acreedor = "",
  //       capital = "",
  //       derechoVoto = "",
  //       clasificacion = "",
  //       Cliente_Deuda = {},
  //     } = item;

  //     const { Deuda2IdDeuda = "" } = Cliente_Deuda;

  //     return {
  //       idDeuda: Deuda2IdDeuda,
  //       acreedor,
  //       acreedorBuscado: "",
  //       tipoDeuda: clasificacion,
  //       capital,
  //       votoClase: "",
  //       derechoVoto,
  //     };
  //   });
  // } else {
  deudasObj = [];
  // }

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
    totalDeudas_letras: "",
    totalBienes: "",
    totalBienes_letras: "",
    totalVotoClase: "",
    totalDerechoVoto: "",
    totalPagado: "",
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
  let initHonorarios;

  // if (caso?.Honorarios?.length > 0) {
  //   initHonorarios = {
  //   inicial: caso.Honorarios[0].inicial,
  //   cuotasHonorarios: caso.Honorarios[0].cuotasHonorarios,
  //   valorHonorarios: caso.Honorarios[0].valorHonorarios,
  //   valorRadicar: caso.Honorarios[0].valorRadicar,
  //   honorariosLiquidacion: caso.Honorarios[0].honorariosLiquidacion,
  // };
  // } else {

  initHonorarios = {
    inicial: "",
    cuotasHonorarios: "",
    valorHonorarios: "",
    valorRadicar: "",
    honorariosLiquidacion: "",
    cuotasHonorariosUnificado: "",
    valorHonorariosUnificado: "",
  };
  // }
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

  const initAcreedorFilt = [];

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
  const [editingIndex, setEditingIndex] = useState(null);
  const [posibleCuota, setPosibleCuota] = useState(initPosibleCuota);
  const [showBienesModal, setShowBienesModal] = useState(false);
  const [showHonorariosModal, setShowHonorariosModal] = useState(false);
  const [showIngresosModal, setShowIngresosModal] = useState(false);
  const [deleteDeudas, setDeleteDeudas] = useState(false);
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

  const formatoNumero = (numero) => {
    return numero.toLocaleString("es-CO", { minimumFractionDigits: 2 });
  };

  console.log("Deudas:", deudas);
  // console.log("Datos deuda:", datosDeuda);

  // console.log("Propuestas:", propuestas);
  // console.log("Propuesta:", propuesta);

  const handleDeudaChange = (index, event) => {
    const { name, value } = event.target;
    const updatedDeudas = [...deudas];
    updatedDeudas[index][name] = value;
    setDeudas(updatedDeudas);

    // if (name === "acreedor") {
    //   <input
    //     type="text"
    //     value={deuda.acreedor}
    //     name="acreedor"
    //     id={`acreedor-${index}`}
    //     className="cajacotizacion"
    //     placeholder="Buscar acreedor..."
    //     onChange={(event) => handleDeudaChange(index, event)}
    //   />;
    // }
    if (name === "capital") {
      // Cálculo de totales por tipo de deuda (usar 0 si parseFloat falla)
      // Ignorar deudas sin tipoDeuda para no crear claves vacías en totalesPorTipo
      const totalesPorTipo = deudas.reduce((acc, deuda) => {
        if (!deuda.tipoDeuda) return acc;
        const capitalNum = parseFloat(deuda.capital) || 0;
        acc[deuda.tipoDeuda] = (acc[deuda.tipoDeuda] || 0) + capitalNum;
        return acc;
      }, {});
      // console.log("Totales por tipo:", totalesPorTipo);

      // Cálculo del total general (usar 0 si parseFloat falla)
      let totalDeudas = deudas.reduce(
        (acc, deuda) => acc + (parseFloat(deuda.capital) || 0),
        0
      );
      // console.log("Total de deudas:", totalDeudas);

      let derechoVotoPorTipo = {};

      // Calcular los porcentajes usando forEach (evitar división por cero)
      Object.entries(totalesPorTipo).forEach(([key, valor]) => {
        derechoVotoPorTipo[key] =
          totalDeudas > 0 ? ((valor / totalDeudas) * 100).toFixed(2) : "0.00";
      });

      // console.log("Derecho voto por tipo:", derechoVotoPorTipo);

      // Ignorar deudas sin tipoDeuda al acumular votos por clase
      const votoClasePorTipo = deudas.reduce((acc, deuda) => {
        if (!deuda.tipoDeuda) return acc;
        acc[deuda.tipoDeuda] =
          (acc[deuda.tipoDeuda] || 0) + (parseFloat(deuda.votoClase) || 0);
        return acc;
      }, {});
      // console.log("Voto clase por tipo:", votoClasePorTipo);

      const resultados = deudas.map((deuda) => {
        const capNum = parseFloat(deuda.capital) || 0;
        const totalPorTipo = totalesPorTipo[deuda.tipoDeuda] || 0;
        const derechoVoto =
          totalDeudas > 0
            ? Math.floor((capNum / totalDeudas) * 100 * 100) / 100
            : 0;
        const votoClase =
          totalPorTipo > 0
            ? Math.floor((capNum / totalPorTipo) * 100 * 100) / 100
            : 0;

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
        (acc, deuda) => acc + (deuda.derechoVoto || 0),
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
    setEditingIndex(index);
  };
  const handleBienChange = (index, event) => {
    const { name, value } = event.target;
    console.log("Bienes handle bien change:", bienes);
    const updatedBienes = [...bienes];
    updatedBienes[index][name] = value;
    setBienes(updatedBienes);
    console.log("Bienes:", bienes);
    if (name === "valor") {
      // Cálculo del total (usar 0 si parseFloat falla)
      let totalBienes = bienes.reduce(
        (acc, bien) => acc + (parseFloat(bien.valor) || 0),
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
    setEditingIndex(index);
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
        derechoVoto: 0,
        votoClase: 0,
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
  const [planpagos, setPlanPagos] = useState([]);
  const [planpagosUnificado, setPlanPagosUnificado] = useState([]);

  const handleHonorarioChange = (e) => {
    const target = e?.target || {};
    const name = target.name;
    // Si no hay name, no procesar
    if (!name) return;

    // Para checkboxes usar checked, para el resto usar value
    const value = target.type === "checkbox" ? target.checked : target.value;
    console.log("Honorarios change:", name, value);
    const updatedHonorarios = {
      ...honorarios,
      [name]: value,
    };

    setHonorarios(updatedHonorarios);
    setEditingField(name);

    // Generar plan de pagos si hay los datos mínimos
    if (
      updatedHonorarios.valorHonorarios !== "" &&
      updatedHonorarios.cuotasHonorarios !== "" &&
      updatedHonorarios.inicial !== ""
    ) {
      const nuevoPlan = generarPlanPagosHonorarios(
        updatedHonorarios.valorHonorarios,
        updatedHonorarios.cuotasHonorarios,
        updatedHonorarios.inicial,
        !!updatedHonorarios.cuota6,
        !!updatedHonorarios.cuota12
      );
      setPlanPagos(nuevoPlan);
    } else {
      setPlanPagos([]);
    }

    if (
      updatedHonorarios.valorHonorariosUnificado !== "" &&
      updatedHonorarios.cuotasHonorariosUnificado !== "" &&
      updatedHonorarios.inicial !== ""
    ) {
      const nuevoPlanUnificado = generarPlanPagosHonorarios(
        updatedHonorarios.valorHonorariosUnificado,
        updatedHonorarios.cuotasHonorariosUnificado,
        updatedHonorarios.inicial,
        !!updatedHonorarios.cuota6,
        !!updatedHonorarios.cuota12
      );
      setPlanPagosUnificado(nuevoPlanUnificado);
    } else {
      setPlanPagosUnificado([]);
    }
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

  const totalDeudas_letras = numeroALetras(
    Number(resultadosCotizacion.totalDeudas)
  );
  const totalBienes_letras = numeroALetras(
    Number(resultadosCotizacion.totalBienes)
  );
  const honorarios_letras = numeroALetras(Number(honorarios.valorHonorarios));
  const valorRadicar_letras = numeroALetras(Number(honorarios.valorRadicar));
  const honorariosLiquidacion_letras = numeroALetras(
    Number(honorarios.honorariosLiquidacion)
  );
  const saldoHonorarios = honorarios.valorHonorarios - honorarios.inicial;
  const saldoHonorariosUnificado =
    honorarios.valorHonorariosUnificado - honorarios.inicial;

  const handlerGenerarCotizacion = () => {
    console.log("Propuestas handler:", propuestas);
    // Limpiar posiciones vacías en el array deudas antes de generar la cotización
    const deudasFiltradas = (deudas || []).filter((d) => {
      if (!d) return false;
      // Considerar que una deuda tiene datos si al menos una propiedad relevante no está vacía
      return Object.values(d).some((val) => {
        if (val === null || val === undefined) return false;
        if (typeof val === "string") return val.trim() !== "";
        if (typeof val === "number") return !isNaN(val); // número válido (0 se considera dato)
        return true; // otros tipos (boolean, objeto) se consideran datos
      });
    });

    if (deudasFiltradas.length !== (deudas || []).length) {
      console.log(
        "Se eliminaron posiciones vacías de deudas. Antes:",
        deudas.length,
        "Ahora:",
        deudasFiltradas.length
      );
      setDeudas(deudasFiltradas);
    }

    const datoscotizacion = generarCotizacion(
      caso,
      ingreso,
      gasto,
      bienes,
      deudasFiltradas,
      propuestas,
      prospecto,
      honorarios,
      resultadosCotizacion,
      totalDeudas_letras,
      totalBienes_letras,
      honorarios_letras,
      valorRadicar_letras,
      honorariosLiquidacion_letras,
      saldoHonorarios,
      saldoHonorariosUnificado
    );

    // dispatch(modificarCasoCotizacion(datoscotizacion));
    console.log("Cedula:", prospecto.cedulaProspecto);
    dispatch(
      crearDeudas({
        deudas: deudasFiltradas,
        cedulaProspecto: prospecto.cedulaProspecto,
        deleteDeudas: deleteDeudas,
      })
    );
    dispatch(
      postHonorarios({
        honorarios: honorarios,
        cedulaProspecto: prospecto.cedulaProspecto,
        totalDeudas: resultadosCotizacion.totalDeudas,
        totalBienes: resultadosCotizacion.totalBienes,
        deleteDeudas: deleteDeudas,
      })
    );
    // console.log("Datos cotizacion:", datoscotizacion);
    // dispatch(crearCotizacion(datoscotizacion));
  };

  const handleAcreedorChange = (index, event) => {
    event.preventDefault();

    const { name, value } = event.target;
    const updatedDeudas = [...deudas];
    updatedDeudas[index][name] = value;
    setDeudas(updatedDeudas);

    // setDatosDeuda({
    //   ...datosDeuda,
    //   [event.target.name]: event.target.value,
    // });

    const foundAcreedor = listaacreedores?.filter((acreedor) =>
      acreedor.nombre.toLowerCase().includes(event.target.value.toLowerCase())
    );
    console.log("Acreedores encontrados:", foundAcreedor);
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
    const updatedData = { ...resultadosCotizacion }; // console.log("Updated data:", updatedData); // console.log("Tipo:", tipo); // console.log("Field:", field); // console.log("Value:", value);
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
        cuotas > 0 && tasa > 0
          ? Math.round(totalPorTipo * (tasa / 100)) /
            (1 - Math.pow(1 + tasa / 100, -cuotas))
          : cuotas > 0 && tasa === 0
          ? totalPorTipo / cuotas
          : 0;
    }
    // Calcular la suma de cuotas y valorCuota
    let totalCuotas = 0;
    let totalValorCuota = 0;
    let totalPagado = 0;

    Object.keys(updatedData).forEach((key) => {
      const data = updatedData[key];
      totalCuotas += parseInt(data.cuotas, 10) || 0;
      totalValorCuota += parseFloat(data.valorCuota) || 0;
      totalPagado +=
        parseInt(data.cuotas, 10) * parseFloat(data.valorCuota) || 0;

      console.log("total pagado interim:", totalPagado);
    });

    updatedData.sumaCuotas = totalCuotas;
    updatedData.sumaValorCuota = totalValorCuota;
    updatedData.totalPagado = totalPagado;
    // console.log("Suma de cuotas:", totalCuotas);
    setResultadosCotizacion(updatedData);
  };

  // Modal open/close handlers
  const openBienesModal = () => setShowBienesModal(true);
  const closeBienesModal = () => setShowBienesModal(false);

  // Modal open/close handlers
  const openHonorariosModal = () => setShowHonorariosModal(true);
  const closeHonorariosModal = () => setShowHonorariosModal(false);

  const openIngresosModal = () => setShowIngresosModal(true);
  const closeIngresosModal = () => setShowIngresosModal(false);
  // Material UI container UI + dialogs (replace $PLACEHOLDER$ with this block)

  /*
    NOTE: this block returns a full Material-UI based layout early,
    keeping all existing handlers and state intact. The original return
    below the placeholder becomes unreachable (intentionally) so the
    new MUI UI replaces the old markup while preserving behaviour.
  */
  return (
    <Box
      className="contenedorcotizacion"
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDirection="column"
            gap="10px"
          >
            <Typography variant="h6">Datos para la Cotización</Typography>
            <Box display="flex" flexWrap="wrap" gap="10px">
              <MUIButton variant="outlined" onClick={openBienesModal}>
                Bienes
              </MUIButton>
              <MUIButton variant="outlined" onClick={openHonorariosModal}>
                Honorarios
              </MUIButton>
              <MUIButton variant="outlined" onClick={openIngresosModal}>
                Ingresos / Gastos / Cuota
              </MUIButton>
              <label htmlFor="doc">
                <MUIButton variant="outlined" component="span" sx={{ mr: 1 }}>
                  Seleccionar archivo
                </MUIButton>
              </label>
              <input id="doc" type="file" style={{ display: "none" }} />
              <MUIButton
                variant="contained"
                color="primary"
                onClick={handlerGenerarCotizacion}
                sx={{ mr: 1 }}
              >
                Generar cotización
              </MUIButton>
              <Link to="/detail" style={{ textDecoration: "none" }}>
                <MUIButton variant="outlined">Volver</MUIButton>
              </Link>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 2, gap: "3px" }}>
            <Typography variant="subtitle1" gutterBottom>
              Propuesta de pago
            </Typography>

            {/* Propuestas: iterate totalesPorTipo if present */}
            {resultadosCotizacion.totalesPorTipo &&
              Object.keys(resultadosCotizacion.totalesPorTipo).map(
                (tipoKey) => (
                  <Grid
                    container
                    spacing={1}
                    key={tipoKey}
                    alignItems="center"
                    sx={{ mt: 1, mb: 2 }}
                  >
                    <Grid item xs={12} sm={3} sx={{ minWidth: 180 }}>
                      <Typography>{tipoKey}</Typography>
                    </Grid>

                    <Grid item xs={4} sm={2}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Subtotal clase"
                        value={formatNumero(
                          Number.parseFloat(
                            resultadosCotizacion.totalesPorTipo[tipoKey]
                          )
                        )}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>

                    <Grid item xs={4} sm={2}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Derecho voto %"
                        value={
                          resultadosCotizacion.derechoVotoPorTipo &&
                          resultadosCotizacion.derechoVotoPorTipo[tipoKey]
                        }
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>

                    <Grid item xs={4} sm={2}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Tasa (%)"
                        type="number"
                        value={
                          (resultadosCotizacion &&
                            resultadosCotizacion[tipoKey].tasa) ||
                          ""
                        }
                        onChange={(e) =>
                          handleCuotasChange(tipoKey, "tasa", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={4} sm={2}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Cuotas"
                        type="number"
                        value={resultadosCotizacion[tipoKey].cuotas}
                        onChange={(e) =>
                          handleCuotasChange(tipoKey, "cuotas", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={4} sm={2}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Valor cuota"
                        value={formatNumero(
                          Math.round(
                            resultadosCotizacion[tipoKey].valorCuota || 0
                          )
                        )}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  </Grid>
                )
              )}

            <Box
              mt={2}
              display="flex"
              justifyContent="space-between"
              flexDirection="row"
            >
              <Typography variant="subtitle2">TOTAL</Typography>

              <Typography>
                {formatNumero(resultadosCotizacion.totalDeudas)}
              </Typography>
              <Typography>
                Derecho voto:{" "}
                {Math.round(resultadosCotizacion.totalDerechoVoto || 0)}
              </Typography>
              <Typography>
                Cuotas: {resultadosCotizacion.sumaCuotas || 0}
              </Typography>
              <Typography>
                Valor cuotas:{" "}
                {formatNumero(
                  Math.round(resultadosCotizacion.sumaValorCuota || 0)
                )}
              </Typography>
              <Typography>
                Total pagado:{" "}
                {formatNumero(
                  Math.round(resultadosCotizacion.totalPagado || 0)
                )}
              </Typography>
            </Box>
          </Paper>

          <Box mt={2}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Deudas
              </Typography>
              <FormControlLabel
                label="Sobre escribir deudas si ya existen"
                labelPlacement="start"
                control={
                  <input
                    type="checkbox"
                    name="deleteDeudas"
                    checked={!!deleteDeudas}
                    onChange={(e) =>
                      setDeleteDeudas && setDeleteDeudas(e.target.checked)
                    }
                    aria-label="delete-deudas-checkbox"
                  />
                }
              />
              {(deudas.length > 0
                ? deudas
                : [
                    {
                      tipoDeuda: "",
                      acreedor: "",
                      capital: "",
                      derechoVoto: 0,
                      votoClase: 0,
                    },
                  ]
              ).map((deuda, index) => (
                <Grid
                  container
                  spacing={3}
                  key={`deuda-mui-${index}`}
                  alignItems="center"
                  sx={{ mt: 1, mb: 2 }}
                >
                  <Grid item xs={12} sx={{ minWidth: 180 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id={`tipo-label-${index}`}>Tipo</InputLabel>
                      <Select
                        labelId={`tipo-label-${index}`}
                        label="Tipo"
                        value={deuda.tipoDeuda}
                        name="tipoDeuda"
                        onChange={(event) => handleDeudaChange(index, event)}
                      >
                        <MenuItem value="">
                          <em>Seleccione</em>
                        </MenuItem>
                        <MenuItem value="Primera Clase">Primera Clase</MenuItem>
                        <MenuItem value="Segunda Clase">Segunda Clase</MenuItem>
                        <MenuItem value="Tercera Clase">Tercera Clase</MenuItem>
                        <MenuItem value="Cuarta Clase">Cuarta Clase</MenuItem>
                        <MenuItem value="Quinta Clase">Quinta Clase</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    {/* Autocomplete para acreedor, mantiene búsqueda y permite crear */}

                    <Autocomplete
                      freeSolo
                      fullWidth
                      options={(listaacreedores || []).map((a) => a.nombre)}
                      inputValue={deuda.acreedor || ""}
                      onInputChange={(event, value, reason) => {
                        // actualizar el campo de la deuda con lo que escribe el usuario
                        const updated = [...deudas];
                        updated[index] = { ...updated[index], acreedor: value };
                        setDeudas(updated);

                        // filtrar lista de acreedores para mantener la lógica de búsqueda
                        const foundAcreedor = (
                          listaacreedores || []
                        ).filter((acreedor) =>
                          acreedor.nombre
                            .toLowerCase()
                            .includes(String(value || "").toLowerCase())
                        );
                        setAcreedorFilt(foundAcreedor);
                      }}
                      onChange={(event, value) => {
                        // cuando selecciona una opción existente
                        const updated = [...deudas];
                        updated[index] = {
                          ...updated[index],
                          acreedor: value || "",
                        };
                        setDeudas(updated);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id={`acreedor-${index}`}
                          label="Acreedor"
                          size="small"
                          placeholder="Buscar Acreedor..."
                          fullWidth
                          sx={{ minWidth: 240 }}
                          onFocus={() => setFocusedIndex(index)}
                          onBlur={() => setTimeout(() => setFocusedIndex(null), 150)}
                        />
                      )}
                    />

                    {/* Si no hay coincidencias y el input está enfocado, mostrar opción para crear acreedor */}
                    {acreedorFilt.length === 0 &&
                      focusedIndex === index &&
                      deuda.acreedor && (
                        <Box
                          sx={{
                            mt: 1,
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="caption">
                            No existe acreedor
                          </Typography>
                          <MUIButton
                            size="small"
                            type="button"
                            variant="outlined"
                            onClick={() => {
                              // pre-llenar nombre del nuevo acreedor con lo escrito
                              setNewAcreedor({
                                ...newAcreedor,
                                nombre: deuda.acreedor || "",
                                idProspecto: prospecto?.idProspecto || "",
                              });
                              setShowAcreedorModal(true);
                            }}
                          >
                            Crear Acreedor
                          </MUIButton>
                        </Box>
                      )}
                  </Grid>

                  <Grid item xs={4} sm={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Capital"
                      name="capital"
                      id={`capital-${index}`}
                      value={
                        editingField === "capital" && editingIndex === index
                          ? deuda.capital
                          : deuda.capital !== "" &&
                            !isNaN(Number(deuda.capital))
                          ? formatNumero(Number(deuda.capital))
                          : deuda.capital
                      }
                      onChange={(event) => handleDeudaChange(index, event)}
                      onKeyDown={(event) => handleKeyPress(event, index)}
                    />
                  </Grid>

                  <Grid item xs={4} sm={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Derecho voto"
                      type="number"
                      name="derechoVoto"
                      id={`derechoVoto-${index}`}
                      value={Number.parseFloat(deuda.derechoVoto).toFixed(2)}
                      onChange={(event) => handleDeudaChange(index, event)}
                    />
                  </Grid>

                  <Grid item xs={4} sm={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Voto clase"
                      type="number"
                      name="votoClase"
                      id={`votoClase-${index}`}
                      value={Number.parseFloat(deuda.votoClase).toFixed(0)}
                      onChange={(event) => handleDeudaChange(index, event)}
                    />
                  </Grid>
                </Grid>
              ))}

              <Box display="flex" justifyContent="flex-start" mt={1}>
                <MUIButton
                  variant="contained"
                  size="small"
                  onClick={handleAddDeuda}
                >
                  Agregar deuda
                </MUIButton>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* DIALOG: Bienes */}
      <Dialog
        open={showBienesModal}
        onClose={closeBienesModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Bienes
          <IconButton
            aria-label="close"
            onClick={closeBienesModal}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {bienes.map((bienItem, idx) => (
              <Grid item xs={12} sm={6} key={`bien-mui-${idx}`}>
                <TextField
                  fullWidth
                  size="small"
                  label="Tipo de bien"
                  name="tipoBien"
                  value={bienItem.tipoBien}
                  onChange={(e) => handleBienChange(idx, e)}
                />
                <Box mt={1}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Valor comercial"
                    name="valor"
                    value={bienItem.valor}
                    onChange={(e) => handleBienChange(idx, e)}
                    onKeyDown={(e) => handleKeyPress(e, idx)}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box
            mt={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>
              Total Bienes: {formatNumero(resultadosCotizacion.totalBienes)}
            </Typography>
            <Box>
              <FormControl component="fieldset" sx={{ mr: 2 }}>
                <InputLabel shrink>Sujeto a registro?</InputLabel>
                <Box mt={1} display="flex" gap={1}>
                  <MUIButton
                    size="small"
                    variant={
                      resultadosCotizacion.sujetoRegistro === "si"
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() =>
                      handleSujetoChange({
                        target: { value: "si" },
                        preventDefault: () => {},
                      })
                    }
                  >
                    Sí
                  </MUIButton>
                  <MUIButton
                    size="small"
                    variant={
                      resultadosCotizacion.sujetoRegistro === "no"
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() =>
                      handleSujetoChange({
                        target: { value: "no" },
                        preventDefault: () => {},
                      })
                    }
                  >
                    No
                  </MUIButton>
                </Box>
              </FormControl>

              <MUIButton
                sx={{ ml: 1 }}
                onClick={handleAddBien}
                variant="outlined"
              >
                Agregar bien
              </MUIButton>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showHonorariosModal}
        onClose={closeHonorariosModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Honorarios
          <IconButton
            aria-label="close"
            onClick={closeHonorariosModal}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2} sx={{ flexDirection: "column" }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Valor"
                width="180px"
                size="small"
                type="number"
                name="valorHonorarios"
                value={honorarios.valorHonorarios}
                onChange={handleHonorarioChange}
                onKeyDown={handleKeyPress}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Cuota inicial"
                width="180px"
                size="small"
                type="number"
                name="inicial"
                value={honorarios.inicial}
                onChange={handleHonorarioChange}
                onKeyDown={handleKeyPress}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Numero de cuotas"
                width="180px"
                size="small"
                type="number"
                name="cuotasHonorarios"
                value={honorarios.cuotasHonorarios}
                onChange={handleHonorarioChange}
                onKeyDown={handleKeyPress}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Valor para radicar"
                width="180px"
                size="small"
                type="number"
                name="valorRadicar"
                value={honorarios.valorRadicar}
                onChange={handleHonorarioChange}
                onKeyDown={handleKeyPress}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Mensualidad liquidación"
                width="180px"
                size="small"
                type="number"
                name="honorariosLiquidacion"
                value={honorarios.honorariosLiquidacion}
                onChange={handleHonorarioChange}
                onKeyDown={handleKeyPress}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Valor unificado"
                width="180px"
                size="small"
                type="number"
                name="valorHonorariosUnificado"
                value={honorarios.valorHonorariosUnificado}
                onChange={handleHonorarioChange}
                onKeyDown={handleKeyPress}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Numero de cuotas - Unificado"
                width="180px"
                size="small"
                type="number"
                name="cuotasHonorariosUnificado"
                value={honorarios.cuotasHonorariosUnificado}
                onChange={handleHonorarioChange}
                onKeyDown={handleKeyPress}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <input
                    type="checkbox"
                    name="cuota6"
                    checked={!!honorarios.cuota6}
                    onChange={handleHonorarioChange}
                    aria-label="cuota6-checkbox"
                  />
                }
                label="Cuota extra Junio"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <input
                    type="checkbox"
                    name="cuota12"
                    checked={!!honorarios.cuota12}
                    onChange={handleHonorarioChange}
                    aria-label="cuota12-checkbox"
                  />
                }
                label="Cuota extra Diciembre"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Plan de pagos</Typography>
              {planpagos && planpagos.length > 0 && (
                <Table size="small" sx={{ mt: 1 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Periodo</TableCell>
                      <TableCell>Cuota fija</TableCell>
                      <TableCell>Saldo</TableCell>
                      <TableCell>Fecha de pago</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {planpagos.map((p, i) => (
                      <TableRow key={`p-${i}`}>
                        <TableCell>{p.numeroCuota}</TableCell>
                        <TableCell>{formatNumero(p.cuotaMensual)}</TableCell>
                        <TableCell>{formatNumero(p.saldo)}</TableCell>
                        <TableCell>{p.fechapago}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {planpagosUnificado && planpagosUnificado.length > 0 && (
                <>
                  <Typography sx={{ mt: 2 }} variant="subtitle2">
                    Plan Unificado
                  </Typography>
                  <Table size="small" sx={{ mt: 1 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Periodo</TableCell>
                        <TableCell>Cuota fija</TableCell>
                        <TableCell>Saldo</TableCell>
                        <TableCell>Fecha de pago</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {planpagosUnificado.map((p, i) => (
                        <TableRow key={`pu-${i}`}>
                          <TableCell>{p.numeroCuota}</TableCell>
                          <TableCell>{formatNumero(p.cuotaMensual)}</TableCell>
                          <TableCell>{formatNumero(p.saldo)}</TableCell>
                          <TableCell>{p.fechapago}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* DIALOG: Ingresos / Gastos / Cuota */}
      <Dialog
        open={showIngresosModal}
        onClose={closeIngresosModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Ingresos / Gastos / Cuota
          <IconButton
            aria-label="close"
            onClick={closeIngresosModal}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Ingresos mensuales"
                name="Valor"
                type="number"
                value={ingreso.Valor}
                onChange={handleIngresoChange}
                onKeyDown={handleKeyPress}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Gastos mensuales"
                name="gastosmensuales"
                type="number"
                value={gasto.gastosmensuales}
                onChange={handleGastoChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Posible cuota mensual"
                name="mensual"
                type="number"
                value={posibleCuota.mensual}
                onChange={handleCuotaChange}
                onKeyDown={handleKeyPress}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* DIALOG: Crear Acreedor (reuses newAcreedor state & handleGuardarAcreedor) */}
      <Dialog
        open={showAcreedorModal}
        onClose={() => setShowAcreedorModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Crear Acreedor
          <IconButton
            aria-label="close"
            onClick={() => setShowAcreedorModal(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                fullWidth
                size="small"
                value={newAcreedor.nombre}
                onChange={(e) =>
                  setNewAcreedor({ ...newAcreedor, nombre: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="NIT"
                fullWidth
                size="small"
                value={newAcreedor.NIT}
                onChange={(e) =>
                  setNewAcreedor({ ...newAcreedor, NIT: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Dirección"
                fullWidth
                size="small"
                value={newAcreedor.direccion}
                onChange={(e) =>
                  setNewAcreedor({ ...newAcreedor, direccion: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Ciudad"
                fullWidth
                size="small"
                value={newAcreedor.ciudad}
                onChange={(e) =>
                  setNewAcreedor({ ...newAcreedor, ciudad: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Teléfono"
                fullWidth
                size="small"
                value={newAcreedor.telefono}
                onChange={(e) =>
                  setNewAcreedor({ ...newAcreedor, telefono: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                size="small"
                type="email"
                value={newAcreedor.email}
                onChange={(e) =>
                  setNewAcreedor({ ...newAcreedor, email: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <MUIButton onClick={() => setShowAcreedorModal(false)}>
            Cancelar
          </MUIButton>
          <MUIButton variant="contained" onClick={handleGuardarAcreedor}>
            Guardar
          </MUIButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default Cotizacion;
