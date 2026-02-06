import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { Button } from "../Mystyles";
import "../detail/detail.css";
import {
  completarCita,
  completarTarea,
  copyDeudas,
  copyHonorarios,
  deleteAbogado,
  deleteCliente,
  deleteProspecto,
  getCitas,
  getCitasById,
  getTareas,
  getTareasById,
  modificarDatos,
  modificarDatosAbogado,
  modificarDatosProspecto,
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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

// import GooglePicker from "../../utils/googlePicker";
// import GoogleDriveFileUploader from "../../utils/googlePicker";

const Detail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const source = useSelector((state) => state.source);

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
      ? datos.cedulaAbogado
      : source === "prospecto"
      ? datos.cedulaProspecto
      : datos.cedulaCliente;
  console.log("Cedula:", Cedula);

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
    bienes: "",
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
    departamento: "",
    // password: "",
    comentarios: "",
    contactado: "No",
    tieneCotizacion: "No",
    cotizacionAprobada: "No",
    status: "",
  });
  console.log("User Data Detail:", userDataDetail);

  const [tabTareas, setTabTareas] = useState(0);
  const [tabCitas, setTabCitas] = useState(0);
  const [tareas, setTareas] = useState([]);
  const [citas, setCitas] = useState([]);

  const tareasPendientes = tareas.filter((t) => !t.completada);
  const tareasCompletadas = tareas.filter((t) => t.completada);

  const citasPendientes = citas.filter((c) => !c.completada);
  const citasCompletadas = citas.filter((c) => c.completada);
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
    if (source === "prospecto") {
      dispatch(getCitasById(datos.idProspecto));
      dispatch(getTareasById(datos.idProspecto));
    }
  }, [dispatch, source, datos.idProspecto]);

  useEffect(() => {
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
        comentarios: datos.comentarios,
        cedulanew: datos.cedulaCliente,
        cedula_anterior: datos.cedulaCliente,
      });
    } else {
      setUserDataDetail({
        ...userDataDetail,
        idProspecto: datos.idProspecto,
        email: datos.email,
        celular: datos.celular,
        ciudad: datos?.Ciudads[0]?.nombre_ciudad || "",
        ciudad_anterior: datos?.Ciudads[0]?.codigo_ciudad || "",
        departamento:
          datos?.Ciudads[0]?.Departamentos[0]?.nombre_departamento || "",
        nombres: datos.nombres,
        nombres_anterior: datos.nombres,
        tarjetaProf: "",
        apellidos: datos.apellidos,
        apellidos_anterior: datos.apellidos,
        direccion: datos.direccion,
        comentarios: datos.comentarios,
        cedulanew: datos.cedulaProspecto,
        cedula_anterior: datos.cedulaProspecto,
        impuestoLaboral: datos.impuestoLaboral || "",
        vehiculoCooperativas: datos.vehiculoCooperativas || "",
        hipotecario: datos.hipotecario || "",
        proveedores: datos.proveedores || "",
        bancoPersonas: datos.bancoPersonas || "",
        familiares: datos.familiares || "",
        tieneBienes: datos.tieneBienes || "",
        bienes: datos.bienes || "",
        totalBienes: datos.totalBienes || "",
        totalDeudas: datos.totalDeudas || "",
        modoContacto: datos.modoContacto || "",
        contactado: datos.contactado || "No",
        tieneCotizacion: datos.tieneCotizacion || "No",
        cotizacionAprobada: datos.cotizacionAprobada || "No",
      });
    }
  }, [dispatch, source]);

  console.log("Tareas:", tareas);
  console.log("Citas:", citas);
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
    setUserDataDetail({
      ...userDataDetail,
      [e.target.name]: e.target.value, // Sintaxis ES6 para actualizar la key correspondiente
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

  const submitHandlerRegistro = (e) => {
    e.preventDefault();
    registroCliente(userDataDetail);
    dispatch(copyDeudas({ cedulaProspecto: userDataDetail.cedulanew }));
    dispatch(copyHonorarios({ cedulaProspecto: userDataDetail.cedulanew }));
    navigate("/clientes");
  };
  // console.log("Nuevos Datos cliente:", userDataDetail);
  const handleStatusChange = (e) => {
    const { name, value } = e.target;
    setUserDataDetail({
      ...userDataDetail,
      [name]: value,
    });

    dispatch(
      updateStatus({
        idProspecto: userDataDetail.idProspecto,
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

    const hoyStr = hoy.toISOString().slice(0, 10);
    const fechaStr = fecha.toISOString().slice(0, 10);

    if (fechaStr < hoyStr) return "red"; // vencida
    if (fechaStr === hoyStr) return "gold"; // hoy
    return "green"; // futura
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

          {datos?.tarjetaProf ? (
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

      {datos.nombres && (
        <Typography variant="h6" sx={{ textTransform: "uppercase", mb: 1 }}>
          {datos.nombres} {datos.apellidos}
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
              sx={{ minWidth: "300px", bgcolor: "#fff" }}
            />
            <TextField
              label="Apellidos"
              name="apellidos"
              value={userDataDetail.apellidos}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "300px", bgcolor: "#fff" }}
            />
            <TextField
              label="Numero de cédula"
              name="cedulanew"
              type="number"
              value={userDataDetail.cedulanew}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "300px", bgcolor: "#fff" }}
            />
            <TextField
              label="Celular"
              name="celular"
              type="number"
              value={userDataDetail.celular}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "300px", bgcolor: "#fff" }}
            />
            <TextField
              label="Correo"
              name="email"
              type="email"
              value={userDataDetail.email}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "300px", bgcolor: "#fff" }}
            />
            <TextField
              label="Dirección"
              name="direccion"
              value={userDataDetail?.direccion?.toUpperCase()}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "300px", bgcolor: "#fff" }}
            />
            <TextField
              label="Ciudad"
              name="ciudad"
              value={userDataDetail?.ciudad?.toUpperCase()}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "300px", bgcolor: "#fff" }}
            />
            <TextField
              label="Departamento"
              name="departamento"
              value={userDataDetail?.departamento?.toUpperCase()}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "300px", bgcolor: "#fff" }}
            />
            <TextField
              label="Modo de contacto"
              name="modoContacto"
              value={userDataDetail.modoContacto}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingTop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "300px", bgcolor: "#fff" }}
            />
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
                sx={{ minWidth: "300px", bgcolor: "#fff" }}
              />
            )}

            {source === "prospecto" && (
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
                  sx={{ minWidth: "300px", bgcolor: "#fff" }}
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
            )}
          </Stack>

          {/* Columna derecha: reemplazo cuando es prospecto */}
          {source === "prospecto" && (
            <Stack spacing={2} flex={1}>
              {/* Sección Tareas */}
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Tareas
                </Typography>

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
                            {new Date(tarea.fechaVencimiento)
                              .toISOString()
                              .slice(0, 10)}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              </Box>

              {/* Sección Citas */}
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Reuniones
                </Typography>

                <Tabs value={tabCitas} onChange={(e, v) => setTabCitas(v)}>
                  <Tab label="Pendientes" />
                  <Tab label="Completadas" />
                </Tabs>
                <Box sx={{ maxHeight: 160, overflowY: "auto", mt: 1 }}>
                  <Stack spacing={1}>
                    {(tabCitas === 0 ? citasPendientes : citasCompletadas).map(
                      (cita, idx) => (
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
                              <CalendarTodayIcon
                                fontSize="small"
                                sx={{
                                  color: getFechaColor(cita.fechaCita),
                                }}
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
                            </Box>
                            <Typography variant="subtitle2">
                              {cita.titulo}
                            </Typography>
                            <Typography variant="body2">
                              {cita.descripcion}
                            </Typography>
                            <Typography variant="body2">
                              {new Date(cita.fechaCita)
                                .toISOString()
                                .slice(0, 10)}{" "}
                              {cita.horaCita}
                            </Typography>
                          </CardContent>
                        </Card>
                      ),
                    )}
                  </Stack>
                </Box>
              </Box>
            </Stack>
          )}
          {/* Sección Notas */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Notas
            </Typography>
            <Box sx={{ maxHeight: 400, overflowY: "auto", mt: 1 }}>
              <Stack spacing={1}>
                {notas
                  ?.filter(
                    (nota) =>
                      nota.Prospectos?.[0]?.idProspecto ===
                      prospecto.idProspecto,
                  )
                  .sort(
                    (a, b) =>
                      new Date(b.updatedAt).getTime() -
                      new Date(a.updatedAt).getTime(),
                  )
                  .map((nota, idx) => (
                    <Card key={idx}>
                      <CardContent sx={{ paddingTop: 1 }}>
                        {/* <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold" }}
        >
          {nota.titulo}
        </Typography> */}
                        <Typography variant="body2">
                          {nota.descripcion}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(nota.updatedAt).toISOString().slice(0, 10)}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* <Box component="form" noValidate autoComplete="off">
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={2}>
          <Stack spacing={2} flex={1}>
            <TextField
              label="Nombres"
              name="nombres"
              value={userDataDetail.nombres}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingtop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "300px", bgcolor: "#fff" }}
            />
            <TextField
              label="Apellidos"
              name="apellidos"
              value={userDataDetail.apellidos}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingtop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "300px", bgcolor: "#fff" }}
            />
            <TextField
              label="Numero de cédula"
              name="cedulanew"
              type="number"
              value={userDataDetail.cedulanew}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingtop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "300px", bgcolor: "#fff" }}
            />
            <TextField
              label="Celular"
              name="celular"
              type="number"
              value={userDataDetail.celular}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingtop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "300px", bgcolor: "#fff" }}
            />
            <TextField
              label="Correo"
              name="email"
              type="email"
              value={userDataDetail.email}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingtop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "300px", bgcolor: "#fff" }}
            />
            <TextField
              label="Dirección"
              name="direccion"
              value={userDataDetail?.direccion?.toUpperCase()}
              onChange={handleUpdateDetail}
              fullWidth
              small
              inputProps={{ style: { paddingtop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "300px", bgcolor: "#fff" }}
            />
            <TextField
              label="Ciudad"
              name="ciudad"
              value={userDataDetail?.ciudad?.toUpperCase()}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingtop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "300px", bgcolor: "#fff" }}
            />
            <TextField
              label="Departamento"
              name="departamento"
              value={userDataDetail?.departamento?.toUpperCase()}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingtop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "300px", bgcolor: "#fff" }}
            />
            <TextField
              label="Modo de contacto"
              name="modoContacto"
              value={userDataDetail.modoContacto}
              onChange={handleUpdateDetail}
              fullWidth
              inputProps={{ style: { paddingtop: 4, paddingBottom: 4 } }}
              sx={{ minWidth: "300px", bgcolor: "#fff" }}
            />
            {datos?.comentarios && (
              <TextField
                label="Comentarios"
                name="comentarios"
                value={userDataDetail.comentarios}
                onChange={handleUpdateDetail}
                fullWidth
                multiline
                minRows={3}
                inputProps={{ style: { paddingtop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "300px", bgcolor: "#fff" }}
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
                    sx={{ minWidth: "300px", bgcolor: "#fff" }}
                 
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
                inputProps={{ style: { paddingtop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "300px", bgcolor: "#fff" }}
              />
              <TextField
                label="Vehículo o cooperativas"
                name="vehiculoCooperativas"
                value={userDataDetail.vehiculoCooperativas}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingtop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "300px", bgcolor: "#fff" }}
              />
              <TextField
                label="Crédito hipotecario"
                name="hipotecario"
                value={userDataDetail.hipotecario}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingtop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "300px", bgcolor: "#fff" }}
              />
              <TextField
                label="Crédito proveedores"
                name="proveedores"
                value={userDataDetail.proveedores}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingtop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "300px", bgcolor: "#fff" }}
              />
              <TextField
                label="Crédito con Bancos o personas"
                name="bancoPersonas"
                value={userDataDetail.bancoPersonas}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingtop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "300px", bgcolor: "#fff" }}
              />
              <TextField
                label="Tiene bienes?"
                name="tieneBienes"
                value={userDataDetail.tieneBienes}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingtop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "300px", bgcolor: "#fff" }}
              />
              <TextField
                label="Bienes"
                name="bienes"
                value={userDataDetail.bienes}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingtop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "300px", bgcolor: "#fff" }}
              />
              <TextField
                label="Total bienes"
                name="totalBienes"
                value={userDataDetail.totalBienes}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingtop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "300px", bgcolor: "#fff" }}
              />
              <TextField
                label="Total deudas"
                name="totalDeudas"
                value={userDataDetail.totalDeudas}
                onChange={handleUpdateDetail}
                fullWidth
                inputProps={{ style: { paddingtop: 4, paddingBottom: 4 } }}
                sx={{ minWidth: "300px", bgcolor: "#fff" }}
              />
            </Stack>
          )}
        </Stack>
      </Box> */}
    </Paper>
  );
};

export default Detail;
