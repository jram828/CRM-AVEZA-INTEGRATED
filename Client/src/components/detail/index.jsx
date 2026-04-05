import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { Button } from "../Mystyles";
import "../detail/detail.css";
import { codigoCiudades } from "../../utils/codigoCiudades";
import {
  completarCita,
  completarTarea,
  copyBienes,
  copyCotizacion,
  copyDeudas,
  copyHonorarios,
  copyPropuestas,
  deleteAbogado,
  deleteCliente,
  deleteProspecto,
  eliminarCita,
  getCitas,
  getCitasById,
  getNotas,
  getTareas,
  getTareasById,
  modificarDatos,
  modificarDatosAbogado,
  modificarDatosProspecto,
  postCita,
  postNota,
  postTarea,
  setFechaCierre,
  updateCalificacion,
  updateClienteFase,
  updateClienteStatus,
  // setSource,
  // updateCotizacionData,
  updateStatus,
} from "../../redux/actions";
import { registroCliente } from "../../handlers/registroCliente";
import {
  Box,
  Paper,
  Typography,
  Button as MUIButton,
  TextField,
  // Checkbox,
  // FormControlLabel,
  // FormGroup,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Grid,
  Autocomplete,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import NotaForm from "./notaFormDetail";
import CitaForm from "./citaFormDetail";
import TaskForm from "./taskFormDetail";

import { generarDocumentos } from "../../handlers/generarDocumentos";
import { codigoDepartamentos } from "../../utils/codigoDepartamentos";

// import GooglePicker from "../../utils/googlePicker";
// import GoogleDriveFileUploader from "../../utils/googlePicker";

const Detail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const source = useSelector((state) => state.source);
  const calendarId = import.meta.env.VITE_EMAIL_CALENDAR;
  // const datos = useSelector((state) =>
  //   source === "abogado" ? state.abogado : state.cliente
  // );
  console.log("Source:", source);
  const cliente = JSON.parse(localStorage.getItem("cliente"));
  // console.log('Cliente local:', cliente)

  const abogado = JSON.parse(localStorage.getItem("abogado"));
  // console.log("Abogado local:", abogado);

  const prospecto = JSON.parse(localStorage.getItem("prospecto"));

  const datos =
    source === "abogado"
      ? abogado
      : source === "prospecto"
      ? prospecto
      : cliente;
  console.log("Datos cliente:", datos);
  const Cedula =
    source === "abogado"
      ? datos?.cedulaAbogado
      : source === "prospecto"
      ? datos?.cedulaProspecto
      : datos?.cedulaCliente;
  console.log("Cedula:", Cedula);

  const [tabTareas, setTabTareas] = useState(0);
  const [tabCitas, setTabCitas] = useState(0);
  const [tareas, setTareas] = useState([]);
  const [citas, setCitas] = useState([]);
  const reduxCitas = useSelector((state) => state.citasDetail);
  const notas = useSelector((state) => state.notasDetail);
  const reduxTareas = useSelector((state) => state.tareasDetail);
  const [userDataDetail, setUserDataDetail] = useState({
    idProspecto: "",
    cedula_anterior: "",
    ciudad_anterior: "",
    nombres_anterior: "",
    apellidos_anterior: "",
    cedula: "",
    cedulanew: "",
    impuestoLaboral: "",
    vehiculoCooperativas: "",
    hipotecario: "",
    proveedores: "",
    bancoPersonas: "",
    familiares: "",
    tieneBienes: "",
    bienes: [],
    totalBienes: "",
    totalDeudas: "",
    modoContacto: "",
    tarjetaProf: "",
    email: "",
    nombres: "",
    nombresnew: "",
    apellidos: "",
    apellidosnew: "",
    celular: "",
    direccion: "",
    ciudad: "",
    ciudadEnviar: "",
    departamento: "",
    // password: "",
    comentarios: "",
    contactado: "No",
    tieneCotizacion: "No",
    cotizacionAprobada: "No",
    status: "",
    tiempoMora: "",
    numeroEntidades: 0,
    calificacion: "",
    siguientePaso: "",
    ingresos: "",
    fase: "",
    honorarios: [],
    responsable: "",
    fuente: "",
    servicio: "",
    genero: "",
  });
  console.log("User Data Detail:", userDataDetail);

  const tareasPendientes = tareas.filter((t) => !t?.completada);
  const tareasCompletadas = tareas.filter((t) => t?.completada);

  const citasPendientes = citas.filter((c) => !c?.completada);
  const citasCompletadas = citas.filter((c) => c?.completada);

  useEffect(() => {
    if (source === "prospecto") {
      dispatch(getCitasById(datos?.idProspecto));
      dispatch(getTareasById(datos?.idProspecto));
    }
  }, [dispatch, source, datos?.idProspecto]);

  useEffect(() => {
    if (source === "prospecto") {
      setTareas(reduxTareas);
    }
  }, [reduxTareas, source]);

  useEffect(() => {
    if (source === "prospecto") {
      setCitas(reduxCitas);
    }
  }, [reduxCitas, source]);

  useEffect(() => {
    const datos =
      source === "abogado"
        ? abogado
        : source === "prospecto"
        ? prospecto
        : cliente;
    console.log("Datos cliente:", datos);
    if (source === "abogado") {
      setUserDataDetail({
        ...userDataDetail,
        email: datos.email,
        celular: datos.celular,
        ciudad: datos?.Ciudads[0]?.nombre_ciudad || "",
        ciudad_anterior: datos?.Ciudads[0]?.codigo_ciudad || "",
        departamento:
          datos?.Ciudads[0]?.Departamentos[0]?.nombre_departamento || "",
        tarjetaProf: datos.tarjetaProf,
        nombres: datos.nombres,
        apellidos: datos.apellidos,
        direccion: datos.direccion,
        comentarios: "",
        cedulanew: datos.cedulaAbogado,
        cedula_anterior: datos.cedulaAbogado,
      });
    } else if (source === "cliente") {
      setUserDataDetail({
        ...userDataDetail,
        email: datos.email,
        celular: datos.celular,
        ciudad: datos?.Ciudads[0]?.nombre_ciudad || "",
        ciudad_anterior: datos?.Ciudads[0]?.codigo_ciudad || "",
        departamento:
          datos?.Ciudads[0]?.Departamentos[0]?.nombre_departamento || "",
        nombres: datos.nombres,
        tarjetaProf: "",
        apellidos: datos.apellidos,
        direccion: datos.direccion,
        comentarios: datos.comentarios || "",
        cedulanew: datos?.cedulaCliente,
        cedula_anterior: datos?.cedulaCliente,
        modoContacto: datos?.modoContacto || "",
        status: datos?.status || "",
        bienes: datos?.Biens || [],
        deudas: datos?.Deuda2s || [],
        honorarios: datos?.Honorarios || [],
        fase: datos?.fase || "",
        ingresos: datos?.Cotizacions[0]?.ingresos || "",
        gastos: datos?.Cotizacions[0]?.gastos || "",
        posibleCuota: datos?.Cotizacions[0]?.posibleCuota || "",
        totalBienes: datos?.Cotizacions[0]?.totalBienes || "",
        totalDeudas: datos?.Cotizacions[0]?.totalDeudas || "",
        totalDeudas_letras: datos?.Cotizacions[0]?.totalDeudas_letras || "",
        totalBienes_letras: datos?.Cotizacions[0]?.totalBienes_letras || "",
        valorRadicar_letras: datos?.Cotizacions[0]?.valorRadicar_letras || "",
        responsable: datos?.responsable || "",
        fuente: datos?.fuente || "",
        servicio: datos?.servicio || "",
        genero: datos?.genero || "",
        fechaCierre: datos?.fechaCierre || "",
      });
    } else {
      setUserDataDetail({
        ...userDataDetail,
        idProspecto: datos?.idProspecto,
        email: datos?.email,
        celular: datos?.celular,
        ciudad: datos?.Ciudads[0]?.nombre_ciudad || "",
        ciudad_anterior: datos?.Ciudads[0]?.codigo_ciudad || "",
        departamento:
          datos?.Ciudads[0]?.Departamentos[0]?.nombre_departamento || "",
        nombres: datos?.nombres,
        nombres_anterior: datos?.nombres,
        tarjetaProf: "",
        apellidos: datos?.apellidos,
        apellidos_anterior: datos?.apellidos,
        direccion: datos?.direccion,
        comentarios: datos?.comentarios || "",
        cedulanew: datos?.cedulaProspecto,
        cedula_anterior: datos?.cedulaProspecto,
        impuestoLaboral: datos?.impuestoLaboral || "",
        vehiculoCooperativas: datos?.vehiculoCooperativas || "",
        hipotecario: datos?.hipotecario || "",
        proveedores: datos?.proveedores || "",
        bancoPersonas: datos?.bancoPersonas || "",
        familiares: datos?.familiares || "",
        tieneBienes: datos?.tieneBienes || "",
        totalDeudas:
          datos?.Cotizacions[0]?.totalDeudas || datos?.totalDeudas || "",
        modoContacto: datos?.modoContacto || "",
        contactado: datos?.contactado || "No",
        tieneCotizacion: datos?.tieneCotizacion || "No",
        cotizacionAprobada: datos?.cotizacionAprobada || "No",
        status: datos?.status || "",
        calificacion: datos?.calificacion || "",
        tiempoMora: datos?.tiempoMora || "",
        numeroEntidades: datos?.numeroEntidades || "",
        tieneProcesos: datos?.tieneProcesos || "",
        bienes: datos?.Biens || [],
        deudas: datos?.Deuda2s || [],
        honorarios: datos?.Honorarios || [],
        fase: datos?.fase || "",
        ingresos: datos?.Cotizacions[0]?.ingresos || "",
        gastos: datos?.Cotizacions[0]?.gastos || "",
        posibleCuota: datos?.Cotizacions[0]?.posibleCuota || "",
        totalBienes:
          datos?.Cotizacions[0]?.totalBienes || datos?.totalBienes || "",
        totalDeudas_letras: datos?.Cotizacions[0]?.totalDeudas_letras || "",
        totalBienes_letras: datos?.Cotizacions[0]?.totalBienes_letras || "",
        valorRadicar_letras: datos?.Cotizacions[0]?.valorRadicar_letras || "",
        responsable: datos?.responsable || "",
        fuente: datos?.fuente || "",
        servicio: datos?.servicio || "",
        genero: datos?.genero || "",
        fechaCierre: datos?.fechaCierre || "",
      });
    }
  }, [dispatch, source]);

  console.log("Tareas:", tareas);
  console.log("Citas:", citas);

  const ciudadOpciones = useMemo(() => {
    const nombresUnicos = new Set();

    return codigoCiudades
      .map((c) => {
        const departamento = codigoDepartamentos.find(
          (d) => d.codigo_departamento === c.codigo_departamento,
        );
        const nombreDepto =
          departamento?.nombre_departamento || "SIN DEPARTAMENTO";

        const etiqueta = `${c.nombre_ciudad}, ${nombreDepto}`;

        return {
          etiqueta,
          ciudad: c.nombre_ciudad,
          departamento: nombreDepto,
          codigo: c.codigo_ciudad,
        };
      })
      .filter((c) => {
        if (nombresUnicos.has(c.etiqueta)) return false;
        nombresUnicos.add(c.etiqueta);
        return true;
      });
  }, []);

  const ciudadFiltrada = useMemo(() => {
    const input = userDataDetail.ciudad.toUpperCase();
    return ciudadOpciones.filter((c) =>
      c.etiqueta.toUpperCase().includes(input),
    );
  }, [userDataDetail.ciudad, ciudadOpciones]);

  const handleDelete = () => {
    if (source === "abogado") {
      const isConfirmed = window.confirm(
        "¿Estás seguro de que deseas eliminar este registro?",
      );

      if (isConfirmed) {
        dispatch(deleteAbogado(Cedula));
        // console.log("cedula", Cedula);
        navigate("/abogados");
      }
    } else if (source === "prospecto") {
      const isConfirmed = window.confirm(
        "¿Estás seguro de que deseas eliminar este registro?",
      );

      if (isConfirmed) {
        dispatch(deleteProspecto(Cedula));
        navigate("/prospectos");
      }
    } else {
      const isConfirmed = window.confirm(
        "¿Estás seguro de que deseas eliminar este registro?",
      );

      if (isConfirmed) {
        dispatch(deleteCliente(Cedula));
        navigate("/clientes");
      }
    }
  };

  const handleUpdateDetail = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    // Caso: propiedades anidadas en deudas
    if (name.startsWith("deudas[")) {
      // Extraer índice y propiedad con regex
      const match = name.match(/deudas\[(\d+)\]\.(\w+)/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2];

        // Crear copia del array de deudas
        const updatedDeudas = [...userDataDetail.deudas];
        updatedDeudas[index] = {
          ...updatedDeudas[index],
          [field]: value,
        };

        setUserDataDetail({
          ...userDataDetail,
          deudas: updatedDeudas,
        });
        return;
      }
    }

    // Caso general: propiedades simples
    setUserDataDetail({
      ...userDataDetail,
      [name]: value,
    });
  };

  const submitUpdateDetail = (e) => {
    e.preventDefault();
    if (source === "abogado") {
      dispatch(modificarDatosAbogado(userDataDetail));
      window.localStorage.setItem("abogado", JSON.stringify(userDataDetail));
    } else if (source === "cliente") {
      dispatch(modificarDatos(userDataDetail));
      window.localStorage.setItem("cliente", JSON.stringify(userDataDetail));
    } else {
      dispatch(modificarDatosProspecto(userDataDetail));
      window.localStorage.setItem("prospecto", JSON.stringify(userDataDetail));
    }
  };

  const submitHandlerRegistro = async (e) => {
    e.preventDefault();

    if (userDataDetail.cedulanew !== "") {
      dispatch(
        setFechaCierre({
          idProspecto: userDataDetail?.idProspecto,
          fechaCierre: new Date().toLocaleDateString("sv-SE", {
            timeZone: "America/Bogota",
          }), // YYYY-MM-DD en GMT-5
        }),
      );
      await registroCliente(userDataDetail);
      dispatch(copyDeudas({ cedulaProspecto: userDataDetail.cedulanew }));
      dispatch(copyHonorarios({ cedulaProspecto: userDataDetail.cedulanew }));
      dispatch(copyBienes({ cedulaProspecto: userDataDetail.cedulanew }));
      dispatch(copyPropuestas({ cedulaProspecto: userDataDetail.cedulanew }));
      dispatch(copyCotizacion({ cedulaProspecto: userDataDetail.cedulanew }));
      window.alert("Se ha registrado el cliente con éxito.");
      navigate("/clientes");
    } else {
      window.alert(
        "Antes de convertir el Prospecto en Cliente debe actualizar el Número de Cédula",
      );
    }
  };
  // console.log("Nuevos Datos cliente:", userDataDetail);
  const handleStatusChange = (e) => {
    const { name, value } = e.target;
    setUserDataDetail({
      ...userDataDetail,
      [name]: value,
    });
    if (source === "cliente") {
      dispatch(
        updateClienteStatus({
          cedulaCliente: userDataDetail.cedulanew,
          field: name,
          value: value,
        }),
      );
    } else if (source === "prospecto") {
      dispatch(
        updateStatus({
          idProspecto: userDataDetail?.idProspecto,
          field: name,
          value: value,
        }),
      );
    }
  };
  // const handleCalificacionChange = (e) => {
  //   const { name, value } = e.target;
  //   setUserDataDetail({
  //     ...userDataDetail,
  //     [name]: value,
  //   });

  //   dispatch(
  //     updateCalificacion({
  //       cedulaCliente: userDataDetail.cedulanew,
  //       field: name,
  //       value: value,
  //     }),
  //   );
  // };

  const handleFaseChange = (e) => {
    const { name, value } = e.target;
    setUserDataDetail({
      ...userDataDetail,
      [name]: value,
    });

    dispatch(
      updateClienteFase({
        cedulaCliente: userDataDetail.cedulanew,
        field: name,
        value: value,
      }),
    );
  };

  const handleCompletar = (idTarea) => {
    dispatch(completarTarea(idTarea));
    setTareas((prev) =>
      prev.map((t) => (t.idTarea === idTarea ? { ...t, completada: true } : t)),
    );
  };

  const handleCompletarCita = (idCita) => {
    dispatch(completarCita(idCita));
    setCitas((prev) =>
      prev.map((c) => (c.idCita === idCita ? { ...c, completada: true } : c)),
    );
  };

  const getFechaColor = (fechaVencimiento) => {
    const hoy = new Date();
    const fecha = new Date(fechaVencimiento);

    if (isNaN(fecha.getTime())) return "gray"; // fecha inválida

    if (fecha < hoy) return "red"; // vencida
    if (
      fecha.getFullYear() === hoy.getFullYear() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getDate() === hoy.getDate()
    ) {
      return "gold"; // hoy
    }
    return "green"; // futura
  };

  const [openNotaForm, setOpenNotaForm] = useState(false);
  const [openCitaForm, setOpenCitaForm] = useState(false);
  const [openTareaForm, setOpenTareaForm] = useState(false);

  const handleOpenNotaForm = () => setOpenNotaForm(true);
  const handleCloseNotaForm = () => setOpenNotaForm(false);

  const handleOpenCitaForm = () => setOpenCitaForm(true);
  const handleCloseCitaForm = () => setOpenCitaForm(false);

  const handleOpenTareaForm = () => setOpenTareaForm(true);
  const handleCloseTareaForm = () => setOpenTareaForm(false);

  const handleSaveNota = (nota) => {
    dispatch(postNota(nota)).then(() => {
      dispatch(getNotas());
    });
    handleCloseNotaForm();
  };

  const handleSaveCita = (cita) => {
    dispatch(postCita(cita)).then((action) => {
      dispatch(getCitas());
      setCitas((prev) => [...prev, action.payload.data]);
    });
    handleCloseCitaForm();
  };

  const handleSaveTarea = (tarea) => {
    dispatch(postTarea(tarea)).then((action) => {
      dispatch(getTareas());
      setTareas((prev) => [...prev, action.payload.data]);
    });
    handleCloseTareaForm();
  };

  const handlerGenerarDocumentos = () => {
    generarDocumentos(userDataDetail);
  };

  const handleDeleteCita = (idCitaGoogle, idCita, calendarId, source) => {
    dispatch(eliminarCita(idCitaGoogle, idCita, calendarId, source)).then(
      () => {
        setCitas(
          (prev) => prev.filter((cita) => cita.idCita !== idCita), // 👈 elimina la cita del estado local
        );
      },
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        backgroundColor: "#e1eaee",
        padding: "5px",
        gap: "5px",
        height: "90vh",
      }}
      className="contenedordetail"
    >
      <Typography variant="h5">Detalles</Typography>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        mb={1}
      >
        <Stack direction="row" spacing={1}>
          <MUIButton
            variant="contained"
            color="primary"
            onClick={submitUpdateDetail}
          >
            Actualizar
          </MUIButton>

          {userDataDetail?.tarjetaProf ? (
            <Stack direction="row" spacing={1}>
              <MUIButton
                variant="outlined"
                color="primary"
                onClick={handleDelete}
              >
                Eliminar
              </MUIButton>
              <MUIButton component={Link} to="/abogados" variant="contained">
                Volver
              </MUIButton>
            </Stack>
          ) : source === "prospecto" ? (
            <Stack direction="row" spacing={1}>
              <MUIButton component={Link} to="/cotizacion" variant="contained">
                Cotizacion
              </MUIButton>
              <MUIButton
                variant="contained"
                color="primary"
                onClick={submitHandlerRegistro}
              >
                Convertir en Cliente
              </MUIButton>
              <MUIButton
                variant="outlined"
                color="primary"
                onClick={handleDelete}
              >
                Eliminar
              </MUIButton>
              <MUIButton component={Link} to="/prospectos" variant="contained">
                Volver
              </MUIButton>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1}>
              <label htmlFor="doc">
                <MUIButton variant="outlined" component="span" sx={{ mr: 1 }}>
                  Seleccionar archivo
                </MUIButton>
              </label>
              <input id="doc" type="file" style={{ display: "none" }} />

              <MUIButton
                variant="contained"
                onClick={handlerGenerarDocumentos}
                color="primary"
                sx={{ mr: 1 }}
              >
                Generar documentos
              </MUIButton>
              <MUIButton
                variant="outlined"
                color="primary"
                onClick={handleDelete}
              >
                Eliminar
              </MUIButton>
              <MUIButton component={Link} to="/clientes" variant="contained">
                Volver
              </MUIButton>
            </Stack>
          )}
        </Stack>
      </Stack>

      {userDataDetail.nombres && (
        <Typography variant="h6" sx={{ textTransform: "uppercase", mb: 1 }}>
          {userDataDetail.nombres} {userDataDetail.apellidos}
        </Typography>
      )}

      <Box component="form" noValidate autoComplete="off">
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={2}>
          {/* Columna izquierda: datos generales */}
          <Stack spacing={2} flex={1}>
            <TextField
              label="Nombres"
              name="nombres"
              value={userDataDetail.nombres}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "160px", bgcolor: "#fff" }}
            />

            <TextField
              label="Apellidos"
              name="apellidos"
              value={userDataDetail.apellidos}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "160px", bgcolor: "#fff" }}
            />

            <TextField
              label="Número de cédula"
              name="cedulanew"
              type="number"
              value={userDataDetail.cedulanew}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "160px", bgcolor: "#fff" }}
            />
            <TextField
              label="Celular"
              name="celular"
              type="number"
              value={userDataDetail.celular}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "160px", bgcolor: "#fff" }}
            />
            <TextField
              label="Correo"
              name="email"
              type="email"
              value={userDataDetail.email}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "160px", bgcolor: "#fff" }}
            />
            <TextField
              label="Dirección"
              name="direccion"
              value={userDataDetail?.direccion?.toUpperCase()}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "160px", bgcolor: "#fff" }}
            />

            <Autocomplete
              freeSolo
              fullWidth
              disableClearable
              autoHighlight
              options={ciudadFiltrada.map((c) => c.etiqueta)}
              inputValue={userDataDetail.ciudad}
              onInputChange={(_event, value) => {
                setUserDataDetail((prev) => ({
                  ...prev,
                  ciudad: value,
                }));
              }}
              onChange={(_event, value) => {
                console.log("Ciudad seleccionada:", value);
                const nombre = value ? String(value).split(",")[0].trim() : "";
                console.log("Nombre ciudad extraído:", nombre);
                setUserDataDetail((prev) => ({
                  ...prev,
                  ciudadEnviar: nombre,
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="ciudad"
                  label="Ciudad"
                  size="small"
                  placeholder="Buscar ciudad..."
                  fullWidth
                  sx={{
                    minWidth: 220,
                    bgcolor: "#fff",
                    "& .MuiInputBase-root": { bgcolor: "#fff" },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    sx: { bgcolor: "#fff" },
                  }}
                />
              )}
            />

            {/* <TextField
              label="Ciudad"
              name="ciudad"
              value={userDataDetail?.ciudad?.toUpperCase()}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "160px", bgcolor: "#fff" }}
            /> */}
            <TextField
              label="Departamento"
              name="departamento"
              value={userDataDetail?.departamento?.toUpperCase()}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "160px", bgcolor: "#fff" }}
            />
            <TextField
              label="Modo de contacto"
              name="modoContacto"
              value={userDataDetail.modoContacto}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "160px", bgcolor: "#fff" }}
            />

            {/* {userDataDetail?.comentarios && ( */}
              <TextField
                label="Comentarios"
                name="comentarios"
                value={userDataDetail.comentarios}
                onChange={handleUpdateDetail}
                fullWidth
                multiline
                minRows={5}
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />
            {/* )} */}
          </Stack>

          {source === "prospecto" && (
            <Stack spacing={2} flex={1}>
              {/* <FormControl fullWidth size="small">
                  <InputLabel>Calificación</InputLabel>
                  <Select
                    name="calificacion"
                    value={userDataDetail.calificacion}
                    label="Calificacion"
                    onChange={handleCalificacionChange}
                  >
                    <MenuItem value="sincontacto">
                      ❌ 1. Registrado sin contacto
                    </MenuItem>
                    <MenuItem value="contactoefectivo">
                      📞 2. Contacto efectivo
                    </MenuItem>
                    <MenuItem value="contactonoefectivo">
                      🟠 2. Contacto NO efectivo
                    </MenuItem>
                    <MenuItem value="leadcalificado">
                      ✅ 3. Lead calificado
                    </MenuItem>
                    <MenuItem value="leadnocalificado">
                      🔄 3. Lead no calificado - Remarketing
                    </MenuItem>
                    <MenuItem value="nocaldescartado">
                      🗑️ 4. No calificado - Descartado
                    </MenuItem>
                    <MenuItem value="cotizacionenevaluacion">
                      💰 5. Cotización en evaluación
                    </MenuItem>
                    <MenuItem value="cotizacionrechazada">
                      ⚠️ 5. Cotización rechazada
                    </MenuItem>
                  </Select>
                </FormControl> */}

              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={userDataDetail.status}
                  label="Status"
                  onChange={handleStatusChange}
                >
                  <MenuItem value="lead">👤 1. Lead</MenuItem>
                  <MenuItem value="agendado">📅 2. Agendado</MenuItem>
                  <MenuItem value="asesorado">📞 3. Asesorado</MenuItem>
                  <MenuItem value="cotizado">✅ 4. Cotizado</MenuItem>
                  <MenuItem value="esperadocumentos">
                    📄 5. Espera de documentos
                  </MenuItem>
                  <MenuItem value="contratoenviado">
                    📤 5. Contrato enviado
                  </MenuItem>
                  <MenuItem value="remarketing">🔄 6. Remarketing</MenuItem>
                  <MenuItem value="descartado">🗑️ 7. Descartado</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel>Género</InputLabel>
                <Select
                  value={userDataDetail.genero}
                  label="Género"
                  size="small"
                  onChange={handleUpdateDetail}
                  name="genero"
                  sx={{ minWidth: "160px", bgcolor: "#fff" }}
                >
                  <MenuItem value="masculino">Masculino</MenuItem>
                  <MenuItem value="femenino">Femenino</MenuItem>
                  <MenuItem value="otro">Otro</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                size="small"
                style={{ marginTop: "0.5rem" }}
              >
                <InputLabel>Responsable</InputLabel>
                <Select
                  value={userDataDetail.responsable}
                  label="Responsable"
                  onChange={handleStatusChange}
                  name="responsable"
                  sx={{ minWidth: "160px", bgcolor: "#fff" }}
                >
                  <MenuItem value="mercadeo">Mercadeo</MenuItem>
                  <MenuItem value="julianavellaneda">
                    Julián Avellaneda
                  </MenuItem>
                  <MenuItem value="esperanzazambrano">
                    Luz Esperanza Zambrano
                  </MenuItem>
                  <MenuItem value="yazminarias">
                    Yazmín Angélica Arias O.
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                size="small"
                style={{ marginTop: "0.5rem" }}
              >
                <InputLabel>Fuente</InputLabel>
                <Select
                  value={userDataDetail.fuente}
                  label="Fuente"
                  onChange={handleUpdateDetail}
                  name="fuente"
                  sx={{ minWidth: "160px", bgcolor: "#fff" }}
                >
                  <MenuItem value="noseleccionado">No seleccionado</MenuItem>
                  <MenuItem value="cpweb">CPWEB</MenuItem>
                  <MenuItem value="waps">WAPS</MenuItem>
                  <MenuItem value="cfbook">CFBOOK</MenuItem>
                  <MenuItem value="reservaonline">Reserva online</MenuItem>
                  <MenuItem value="crreferenciado">CRREFERENCIADO</MenuItem>
                  <MenuItem value="crladfi">CRLADFI</MenuItem>
                  <MenuItem value="crar">CRAR</MenuItem>
                  <MenuItem value="clienteexistente">
                    CLIENTE EXISTENTE
                  </MenuItem>
                  <MenuItem value="crflm">CRFLM</MenuItem>
                  <MenuItem value="crlpp">CRLPP</MenuItem>
                  <MenuItem value="crpazpacifico">CRPAZPACIFICO</MenuItem>
                  <MenuItem value="cremates">CREMATES</MenuItem>
                  <MenuItem value="tayc">TAYC</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                size="small"
                style={{ marginTop: "0.5rem" }}
              >
                <InputLabel>Servicio</InputLabel>
                <Select
                  value={userDataDetail.servicio}
                  label="Servicio"
                  onChange={handleUpdateDetail}
                  name="servicio"
                  sx={{ minWidth: "160px", bgcolor: "#fff" }}
                >
                  <MenuItem value="ipn">IPN</MenuItem>
                  <MenuItem value="liqpatrimonial">Liq. Patrimonial</MenuItem>
                  <MenuItem value="acuerdodepago">Acuerdo de Pago</MenuItem>
                  <MenuItem value="ley1116">Ley 1116</MenuItem>
                  <MenuItem value="reformaacuerdo">
                    Reforma acuerdo de pago
                  </MenuItem>
                  <MenuItem value="reduccreditohip">
                    Reduc. Crédito Hip
                  </MenuItem>
                  <MenuItem value="asesorialegalintegral">
                    Asesoría Legal Integral
                  </MenuItem>
                  <MenuItem value="asesoriaempresas">
                    Asesoría Empresas
                  </MenuItem>
                  <MenuItem value="sucesion">Sucesión</MenuItem>
                  <MenuItem value="familia">Familia</MenuItem>
                  <MenuItem value="contratacionestatal">
                    Contratación Estatal
                  </MenuItem>
                  <MenuItem value="divorcio">Divorcio</MenuItem>
                  <MenuItem value="reclamacionlaboral">
                    Reclamación Laboral
                  </MenuItem>
                  <MenuItem value="recaudodecartera">
                    Recaudo de Cartera
                  </MenuItem>
                  <MenuItem value="notarial">Notarial</MenuItem>
                  <MenuItem value="tutelas">Tutelas</MenuItem>
                  <MenuItem value="rdd">RDD</MenuItem>
                  <MenuItem value="ejecutivos">Ejecutivos</MenuItem>
                  <MenuItem value="reclamacionseguro">
                    Reclamación Seguro
                  </MenuItem>
                  <MenuItem value="extraprocesal">Extraprocesal</MenuItem>
                  <MenuItem value="divisorios">Divisorios</MenuItem>
                  <MenuItem value="otros">Otros</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Total deudas"
                name="totalDeudas"
                value={userDataDetail.totalDeudas}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />
              <TextField
                label="Tiempo en mora"
                name="tiempoMora"
                value={userDataDetail.tiempoMora}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />
              <TextField
                label="Numero de entidades"
                name="numeroEntidades"
                value={userDataDetail.numeroEntidades}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />

              <TextField
                label="Activos"
                name="totalBienes"
                value={userDataDetail.totalBienes}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />
              <TextField
                label="Procesos activos"
                name="tieneProcesos"
                value={userDataDetail.tieneProcesos}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />
            </Stack>
          )}
          {source === "cliente" && (
            <Stack spacing={2} flex={1}>
              <FormControl
                fullWidth
                size="small"
                style={{ marginTop: "0.5rem" }}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  value={userDataDetail.status}
                  label="Status"
                  onChange={handleStatusChange}
                  name="status"
                  sx={{ minWidth: "160px", bgcolor: "#fff" }}
                >
                  <MenuItem value="cotizacionenevaluacion">
                    💰 5. Cotización en evaluación
                  </MenuItem>
                  <MenuItem value="cotizacionrechazada">
                    ⚠️ 5. Cotización rechazada
                  </MenuItem>
                  <MenuItem value="documentacion">📄 6. Documentación</MenuItem>
                  <MenuItem value="contratoenevaluacion">
                    📑 7. Contrato en evaluación
                  </MenuItem>
                  <MenuItem value="clienteactivo">
                    🟢 8. Cliente activo
                  </MenuItem>
                  <MenuItem value="remarketing">📢 8. Remarketing</MenuItem>
                  <MenuItem value="clienteprocesoactivo">
                    ⚙️ 8. Cliente con Proceso Activo
                  </MenuItem>
                  <MenuItem value="fidelizacion">🤝 9. Fidelización</MenuItem>
                  <MenuItem value="descartado">🚫 10. Descartado</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel>Género</InputLabel>
                <Select
                  value={userDataDetail.genero}
                  label="Género"
                  size="small"
                  onChange={handleUpdateDetail}
                  name="genero"
                  sx={{ minWidth: "160px", bgcolor: "#fff" }}
                >
                  <MenuItem value="masculino">Masculino</MenuItem>
                  <MenuItem value="femenino">Femenino</MenuItem>
                  <MenuItem value="otro">Otro</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                size="small"
                style={{ marginTop: "0.5rem" }}
              >
                <InputLabel>Responsable</InputLabel>
                <Select
                  value={userDataDetail.responsable}
                  label="Responsable"
                  onChange={handleStatusChange}
                  name="responsable"
                  sx={{ minWidth: "160px", bgcolor: "#fff" }}
                >
                  <MenuItem value="mercadeo">Mercadeo</MenuItem>
                  <MenuItem value="julianavellaneda">
                    Julián Avellaneda
                  </MenuItem>
                  <MenuItem value="esperanzazambrano">
                    Luz Esperanza Zambrano
                  </MenuItem>
                  <MenuItem value="yazminarias">
                    Yazmín Angélica Arias O.
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                size="small"
                style={{ marginTop: "0.5rem" }}
              >
                <InputLabel>Fuente</InputLabel>
                <Select
                  value={userDataDetail.fuente}
                  label="Fuente"
                  onChange={handleUpdateDetail}
                  name="fuente"
                  sx={{ minWidth: "160px", bgcolor: "#fff" }}
                >
                  <MenuItem value="noseleccionado">No seleccionado</MenuItem>
                  <MenuItem value="cpweb">CPWEB</MenuItem>
                  <MenuItem value="waps">WAPS</MenuItem>
                  <MenuItem value="cfbook">CFBOOK</MenuItem>
                  <MenuItem value="reservaonline">Reserva online</MenuItem>
                  <MenuItem value="crreferenciado">CRREFERENCIADO</MenuItem>
                  <MenuItem value="crladfi">CRLADFI</MenuItem>
                  <MenuItem value="crar">CRAR</MenuItem>
                  <MenuItem value="clienteexistente">
                    CLIENTE EXISTENTE
                  </MenuItem>
                  <MenuItem value="crflm">CRFLM</MenuItem>
                  <MenuItem value="crlpp">CRLPP</MenuItem>
                  <MenuItem value="crpazpacifico">CRPAZPACIFICO</MenuItem>
                  <MenuItem value="cremates">CREMATES</MenuItem>
                  <MenuItem value="tayc">TAYC</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Ingresos actuales"
                name="ingresos"
                value={userDataDetail?.ingresos}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />
              <FormControl fullWidth size="small">
                <InputLabel>Siguiente paso</InputLabel>
                <Select
                  value={userDataDetail?.siguientePaso}
                  label="Siguiente paso"
                  onChange={handleFaseChange}
                  name="siguientePaso"
                  sx={{ minWidth: "160px", bgcolor: "#fff" }}
                >
                  <MenuItem value="necesitaanalisis">
                    💰 1. Necesita análisis
                  </MenuItem>
                  <MenuItem value="propuestavalor">
                    ⚠️ 2. Propuesta de valor
                  </MenuItem>
                  <MenuItem value="identificarresponsables">
                    📄 3. Identificar responsables
                  </MenuItem>
                  <MenuItem value="cotizacion">
                    📑 4. Cotización de propuesta / precio
                  </MenuItem>
                  <MenuItem value="negociacion">
                    🔄 5. Negociación / revisión
                  </MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Valor total endeudamiento"
                name="totalDeudas"
                value={userDataDetail?.totalDeudas}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />
              <TextField
                label="Activos"
                name="totalBienes"
                value={userDataDetail?.totalBienes}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />

              <FormControl fullWidth size="small">
                <InputLabel>Fase</InputLabel>
                <Select
                  value={userDataDetail?.fase}
                  label="Fase"
                  onChange={handleFaseChange}
                  name="fase"
                  sx={{ minWidth: "160px", bgcolor: "#fff" }}
                >
                  <MenuItem value="necesitaanalisis">
                    💰 1. Necesita análisis
                  </MenuItem>
                  <MenuItem value="propuestavalor">
                    ⚠️ 2. Propuesta de valor
                  </MenuItem>
                  <MenuItem value="identificarresponsables">
                    📄 3. Identificar responsables
                  </MenuItem>
                  <MenuItem value="cotizacion">
                    📑 4. Cotización de propuesta / precio
                  </MenuItem>
                  <MenuItem value="negociacion">
                    🔄 5. Negociación / revisión
                  </MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Valor honorarios"
                name="valorHonorarios"
                value={userDataDetail?.honorarios[0]?.valorHonorarios}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />
              <TextField
                label="Cuotas"
                name="cuotasHonorarios"
                value={userDataDetail?.honorarios[0]?.cuotasHonorarios}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />
              <TextField
                label="Valor primer pago"
                name="inicial"
                value={userDataDetail?.honorarios[0]?.inicial}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />
            </Stack>
          )}
          {/* NUEVA COLUMNA: Relación de deudas */}
          {source === "cliente" && (
            <Stack spacing={2} flex={1}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Relación de Deudas
              </Typography>
              {userDataDetail?.deudas?.map((deuda, index) => (
                <Box
                  key={index}
                  display="flex"
                  gap={2}
                  sx={{ minWidth: "160px", bgcolor: "#fff" }}
                >
                  <TextField
                    label="Acreedor"
                    name={`deudas[${index}].acreedor`}
                    value={deuda.acreedor}
                    onChange={handleUpdateDetail}
                    sx={{ width: "50%" }}
                    inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                  />
                  <TextField
                    label="Capital"
                    name={`deudas[${index}].capital`}
                    value={deuda.capital}
                    onChange={handleUpdateDetail}
                    sx={{ width: "50%" }}
                    inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                  />
                </Box>
              ))}
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Relación de Bienes
              </Typography>
              {userDataDetail?.bienes?.map((bien, index) => (
                <Box
                  key={index}
                  display="flex"
                  gap={2}
                  sx={{ minWidth: "160px", bgcolor: "#fff" }}
                >
                  <TextField
                    label="Bien"
                    name={`bienes[${index}].bien`}
                    value={bien.tipoBien}
                    onChange={handleUpdateDetail}
                    sx={{ width: "50%" }}
                    inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                  />
                  <TextField
                    label="Valor"
                    name={`bienes[${index}].valor`}
                    value={bien.valor}
                    onChange={handleUpdateDetail}
                    sx={{ width: "50%" }}
                    inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                  />
                </Box>
              ))}
            </Stack>
          )}

          {/* Columna derecha: reemplazo cuando es prospecto */}
          {(source === "prospecto" || source === "cliente") && (
            <Stack spacing={2} flex={1}>
              {/* Sección Tareas */}
              <Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    Tareas
                  </Typography>
                  <Tooltip title="Crear tarea">
                    <IconButton size="small" onClick={handleOpenTareaForm}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Tabs value={tabTareas} onChange={(e, v) => setTabTareas(v)}>
                  <Tab label="Pendientes" />
                  <Tab label="Completadas" />
                </Tabs>
                <Box sx={{ maxHeight: 160, overflowY: "auto", mt: 1 }}>
                  <Stack spacing={1}>
                    {(tabTareas === 0
                      ? tareasPendientes
                      : tareasCompletadas
                    ).map((tarea, idx) => (
                      <Card key={idx}>
                        <CardContent
                          sx={{ position: "relative", paddingTop: 1 }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              top: 2,
                              right: 2,
                            }}
                          >
                            <AssignmentIcon
                              fontSize="small"
                              sx={{
                                color: getFechaColor(tarea.fechaVencimiento),
                              }}
                            />
                            <Tooltip title="Marcar como completada">
                              <IconButton
                                size="small"
                                aria-label="completar tarea"
                                onClick={() => handleCompletar(tarea.idTarea)}
                                disabled={tarea.completada} // 👈 feedback inmediato
                              >
                                <CheckCircleIcon
                                  fontSize="small"
                                  color={
                                    tarea.completada ? "success" : "disabled"
                                  }
                                />
                              </IconButton>
                            </Tooltip>
                          </Box>
                          <Typography variant="subtitle2">
                            {tarea.asunto}
                          </Typography>
                          <Typography variant="body2">
                            Vence:{" "}
                            {tarea.fechaVencimiento
                              ? new Date(tarea.fechaVencimiento)
                                  .toISOString()
                                  .slice(0, 10)
                              : " "}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
                {/* Formulario de creación de tareas */}
                <TaskForm
                  open={openTareaForm}
                  onClose={handleCloseTareaForm}
                  onSave={handleSaveTarea}
                  selected={source === "prospecto" ? prospecto : cliente}
                  source={source}
                />
              </Box>

              {/* Sección Citas */}
              <Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    Reuniones
                  </Typography>
                  <Tooltip title="Crear reunión">
                    <IconButton size="small" onClick={handleOpenCitaForm}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Tabs value={tabCitas} onChange={(e, v) => setTabCitas(v)}>
                  <Tab label="Pendientes" />
                  <Tab label="Completadas" />
                </Tabs>
                <Box sx={{ maxHeight: 160, overflowY: "auto", mt: 1 }}>
                  <Stack spacing={1}>
                    {(tabCitas === 0 ? citasPendientes : citasCompletadas).map(
                      (cita, idx) => (
                        <Card key={idx}>
                          <CardContent sx={{ paddingTop: 1 }}>
                            {/* Cabecera con título e iconos */}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1, // margen inferior para separar del resto
                              }}
                            >
                              <Typography variant="subtitle2">
                                {cita.titulo}
                              </Typography>

                              <Box sx={{ display: "flex", gap: 1 }}>
                                <CalendarTodayIcon
                                  fontSize="small"
                                  sx={{ color: getFechaColor(cita.fechaCita) }}
                                />

                                <Tooltip title="Marcar como completada">
                                  <IconButton
                                    size="small"
                                    aria-label="completar cita"
                                    onClick={() =>
                                      handleCompletarCita(cita.idCita)
                                    }
                                    disabled={cita.completada}
                                  >
                                    <CheckCircleIcon
                                      fontSize="small"
                                      color={
                                        cita.completada ? "success" : "disabled"
                                      }
                                    />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Eliminar cita">
                                  <IconButton
                                    size="small"
                                    aria-label="eliminar cita"
                                    onClick={() =>
                                      handleDeleteCita(
                                        cita.idCitaGoogle,
                                        cita.idCita,
                                        calendarId,
                                        source,
                                      )
                                    }
                                  >
                                    <DeleteIcon
                                      fontSize="small"
                                      color="error"
                                    />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>

                            {/* Contenido debajo */}
                            <Typography variant="body2">
                              {cita.descripcion}
                            </Typography>
                            <Typography variant="body2">
                              {cita.fechaCita
                                ? new Date(cita.fechaCita)
                                    .toISOString()
                                    .split("T")[0]
                                : "Sin fecha"}{" "}
                              {cita.horaCita}
                            </Typography>
                          </CardContent>
                        </Card>
                      ),
                    )}
                  </Stack>
                </Box>
                {/* Formulario de creación de citas */}
                <CitaForm
                  open={openCitaForm}
                  onClose={handleCloseCitaForm}
                  onSave={handleSaveCita}
                  selected={source === "prospecto" ? prospecto : cliente}
                  source={source}
                />
              </Box>
            </Stack>
          )}
          {/* Sección Notas */}
          {(source === "prospecto" || source === "cliente") && (
            <Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Notas
                </Typography>
                <Tooltip title="Crear nota">
                  <IconButton size="small" onClick={handleOpenNotaForm}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ maxHeight: 400, overflowY: "auto", mt: 1 }}>
                <Stack spacing={1}>
                  {notas
                    ?.filter((nota) =>
                      source === "prospecto"
                        ? nota.Prospectos?.[0]?.idProspecto ===
                          prospecto?.idProspecto
                        : nota.Clientes?.[0]?.cedulaCliente ===
                          cliente.cedulaCliente,
                    )
                    .sort(
                      (a, b) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime(),
                    )
                    .map((nota, idx) => (
                      <Card key={idx}>
                        <CardContent sx={{ paddingTop: 1 }}>
                          <Typography variant="body2">
                            {nota.descripcion}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {nota.updatedAt
                              ? new Date(nota.updatedAt)
                                  .toISOString()
                                  .slice(0, 10)
                              : "Sin fecha"}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                </Stack>
              </Box>

              {/* Formulario de creación de nota */}
              <NotaForm
                open={openNotaForm}
                onClose={handleCloseNotaForm}
                onSave={handleSaveNota}
                selected={source === "prospecto" ? prospecto : cliente}
                source={source}
              />
            </Box>
          )}
        </Stack>
      </Box>
    </Paper>
  );
};

export default Detail;

//? Esta es la presentación de la información adicional que se lee desde el correo
/*{ <Box component="form" noValidate autoComplete="off">
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={2}>
          
            {datos?.comentarios && (
              <TextField
                label="Comentarios"
                name="comentarios"
                value={userDataDetail.comentarios}
                onChange={handleUpdateDetail}
                fullWidth
                multiline
                minRows={3}
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />
            )}

            {source === "prospecto" && (
              <Box>
                <FormControl
                  fullWidth
                  size="small"
                  style={{ marginTop: "0.5rem" }}
                >
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={userDataDetail.status || ""}
                    label="Status"
                    onChange={handleStatusChange}
                    name="status"
                    sx={{ minWidth: "160px", bgcolor: "#fff" }}
                 
                  >
                    <MenuItem value="sininiciar">Sin iniciar</MenuItem>
                    <MenuItem value="intentodecontacto">
                      Intento de contacto
                    </MenuItem>
                    <MenuItem value="nuevointentoseg1">
                      Nuevo Intento - Seguimiento 1
                    </MenuItem>
                    <MenuItem value="nuevointentoseg2">
                      Nuevo Intento - Seguimiento 2
                    </MenuItem>
                    <MenuItem value="nocontacto">Nunca hubo contacto</MenuItem>
                    <MenuItem value="asesoriaag">Asesoría agendada</MenuItem>
                    <MenuItem value="asesoriaenreag">
                      Asesoría en reagendamiento
                    </MenuItem>
                    <MenuItem value="noasesoria">
                      No se logró primera asesoria
                    </MenuItem>
                    <MenuItem value="nocalificado">
                      No calificado después de asesoría
                    </MenuItem>
                    <MenuItem value="calificado">
                      Calificado | En espera de documentos
                    </MenuItem>
                    <MenuItem value="cotizacion">
                      Cotización o espera de contrato
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </Stack>

          {source === "prospecto" && (
            <Stack spacing={2} flex={1}>
              <TextField
                label="Impuestos o laborales"
                name="impuestoLaboral"
                value={userDataDetail.impuestoLaboral}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />
              <TextField
                label="Vehículo o cooperativas"
                name="vehiculoCooperativas"
                value={userDataDetail.vehiculoCooperativas}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />
              <TextField
                label="Crédito hipotecario"
                name="hipotecario"
                value={userDataDetail.hipotecario}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />
              <TextField
                label="Crédito proveedores"
                name="proveedores"
                value={userDataDetail.proveedores}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />
              <TextField
                label="Crédito con Bancos o personas"
                name="bancoPersonas"
                value={userDataDetail.bancoPersonas}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />
              <TextField
                label="Tiene bienes?"
                name="tieneBienes"
                value={userDataDetail.tieneBienes}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />
              <TextField
                label="Bienes"
                name="bienes"
                value={userDataDetail.bienes}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />
              <TextField
                label="Total bienes"
                name="totalBienes"
                value={userDataDetail.totalBienes}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />
              <TextField
                label="Total deudas"
                name="totalDeudas"
                value={userDataDetail.totalDeudas}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "160px", bgcolor: "#fff" }}
              />
            </Stack>
          )}
        </Stack>
      </Box> }*/
