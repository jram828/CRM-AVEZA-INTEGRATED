// import "./agendarcitas.css";
import foto from "../../img/fotoPerfil.jpg";
import logo from "../../img/logoAveza.png";
import { Link } from "react-router-dom";
import {
  obtenerDisponibilidad,
  setFiltro,
  setSource,
} from "../../redux/actions";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import loading from "../../assets/loading.gif";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { registroProspecto } from "../../handlers/registroProspecto.jsx";
import { codigoCiudades } from "../../utils/codigoCiudades.js";
import { codigoDepartamentos } from "../../utils/codigoDepartamentos.js";

import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import moment from "moment";
import { postCitaGoogleHandlers } from "../../handlers/crearCitaGoogle.jsx";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { registroProspectoAuto } from "../../handlers/registroProspectoAuto.jsx";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PublicIcon from "@mui/icons-material/Public";
import { Avatar, Stack } from "@mui/material";

const AgendarCita = () => {
  const [dataRegistro, setDataRegistro] = useState({
    titulo: "",
    descripcion: "",
    fechaCita: "",
    horaCita: "",
    idCaso: "",
    email: "",
    nombres: "",
    apellidos: "",
    celular: "",
    nombre_ciudad: "",
    nombreEnviar: "",
    totalDeudas: "",
  });

  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la visualización del loading
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  // const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  console.log(dataRegistro);

  const dispatch = useDispatch();

  const horasDisponibles = useSelector((state) => state.horasDisponibles || []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(setSource("google"));
  }, [dispatch]);

  const abogado = "Julián Avellaneda";
  const duracion = "30 min";
  const zonaHoraria = "America/Bogota";

  useEffect(() => {
    if (fechaSeleccionada) {
      dispatch(
        obtenerDisponibilidad({
          fecha: moment(fechaSeleccionada).format("YYYY-MM-DD"),
        }),
      );
    }
  }, [fechaSeleccionada, dispatch]);

  const opcionesDeuda = [
    "$50 a $100 Millones",
    "$101 a $200 Millones",
    "$201 a $300 Millones",
    "$301 a $400 Millones",
    "$401 Millones en adelante",
  ];

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
    const input = dataRegistro.nombre_ciudad.toUpperCase();
    return ciudadOpciones.filter((c) =>
      c.etiqueta.toUpperCase().includes(input),
    );
  }, [dataRegistro.nombre_ciudad, ciudadOpciones]);

  // console.log("pages", pages);

  const submitHandlerRegistro = async (e) => {
    e.preventDefault();
    try {
      // setIsLoading(true); // Activar el loading antes de enviar la solicitud
      console.log("DataRegistro en submitHandlerRegistro:", dataRegistro);
      const newProspecto = await registroProspectoAuto(dataRegistro);
      console.log("Nuevo prospecto creado:", newProspecto);
      await postCitaGoogleHandlers({
        ...dataRegistro,
        titulo: `Primera Asesoría ${dataRegistro.nombres} ${dataRegistro.apellidos}`,
        calendarId: "jram828@gmail.com",
        fechaCita: fechaSeleccionada,
        horaCita: horaSeleccionada,
        idProspecto: newProspecto.idProspecto,
      });
      // Redirigir a la página de confirmación
      // window.location.href = "https://aveza.co/cita_confirmada/";

      // window.alert("Cita creado con éxito");
      // window.location.reload();
    } catch (error) {
      console.error("Error al crear la cita:", error.message);
      // window.alert("No se pudo crear la cita");
    } //finally {
    //   // setIsLoading(false); // Desactivar el loading después de la solicitud
    // }
  };

  const handleChangeRegistro = (e) => {
    const { name, value } = e.target
      ? e.target
      : { name: "fechaCita", value: e };
    setDataRegistro((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isEmailValid = /^\S+@\S+\.\S+$/.test(dataRegistro.email);

  const isCelularValid = /^\+?\d{10,10}$/.test(String(dataRegistro.celular));

  if (isLoading === true) {
    return (
      <div className="loading-container">
        <img className="loading-image" src={loading} alt="loading" />
      </div>
    );
  }

  return (
    <Box
      fullWidth
      sx={{
        minHeight: "100vh", // que ocupe toda la pantalla
        backgroundImage: `url(${logo})`, // tu imagen
        backgroundRepeat: "no-repeat", // repetir el logo
        backgroundSize: "contain",
        backgroundPosition: "left",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        width: "100vw",
        bgcolor: "rgba(255, 255, 255, 0.8)",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: mostrarFormulario ? "1fr 2fr" : "1fr 1fr 1fr",
          },
          gap: 4,
          p: 4,
          borderRadius: "10px", // borde redondeado
          bgcolor: "rgba(255, 255, 255, 0.95)",
          boxShadow: 3, // para que se vea un poco más adelante (elevado)
        }}
      >
        {/* Columna 1: Info de la cita */}
        <Box
          sx={{
            borderRight: { md: 1 },
            borderColor: "divider",
            pr: { md: 2 },
            mb: { xs: 3, md: 0 },
          }}
        >
          <Typography variant="h5" gutterBottom>
            Primera Asesoría Gratuita
          </Typography>
          {/* Foto del abogado */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Avatar
              alt={abogado}
              src={foto} // Asegúrate que esta ruta sea correcta
              sx={{ width: 56, height: 56 }}
            />
            <Typography variant="body1">{abogado}</Typography>
          </Stack>

          {/* Detalles de la cita con íconos */}
          {fechaSeleccionada && (
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CalendarTodayIcon fontSize="small" />
                <Typography variant="body2">
                  {moment(fechaSeleccionada).format("DD/MM/YYYY")}
                </Typography>
              </Stack>

              {horaSeleccionada && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AccessTimeIcon fontSize="small" />
                  <Typography variant="body2">{horaSeleccionada}</Typography>
                </Stack>
              )}

              <Stack direction="row" alignItems="center" spacing={1}>
                <ScheduleIcon fontSize="small" />
                <Typography variant="body2">{duracion}</Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                <PublicIcon fontSize="small" />
                <Typography variant="body2">{zonaHoraria}</Typography>
              </Stack>
            </Stack>
          )}
        </Box>

        {/* Columna 2: Calendario/Horas */}
        {!mostrarFormulario && (
          <>
            {isMobile ? (
              !fechaSeleccionada ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Selecciona una fecha
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateCalendar
                      value={fechaSeleccionada}
                      onChange={(newDate) => {
                        setFechaSeleccionada(newDate);
                        setHoraSeleccionada(null);
                      }}
                      shouldDisableDate={(date) => date.day() === 0} // 🚫 bloquea domingos
                      minDate={moment()} // 🔑 bloquea fechas anteriores a hoy
                      sx={{
                        color: "black", // color general
                        "& .MuiTypography-root": {
                          color: "black", // letras (meses, días de la semana)
                          fontWeight: "bold", // en negrita
                        },
                        "& .MuiDayCalendar-weekDayLabel": {
                          color: "black",
                          fontWeight: "bold",
                        },
                        "& .MuiDayCalendar-day": {
                          color: "black", // números de los días
                          fontWeight: "bold",
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Horas disponibles
                  </Typography>
                  {horasDisponibles.length === 0 ? (
                    <Typography variant="body2">
                      Selecciona una fecha para ver disponibilidad
                    </Typography>
                  ) : (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      {horasDisponibles.map((hora) =>
                        hora === horaSeleccionada ? (
                          <Box key={hora} sx={{ display: "flex", gap: 2 }}>
                            <Button
                              sx={{ flex: 1 }}
                              variant="contained"
                              onClick={() => setHoraSeleccionada(hora)}
                            >
                              {hora}
                            </Button>
                            <Button
                              sx={{ flex: 1 }}
                              variant="contained"
                              color="primary"
                              onClick={() => setMostrarFormulario(true)}
                            >
                              Siguiente
                            </Button>
                          </Box>
                        ) : (
                          <Button
                            key={hora}
                            fullWidth
                            variant="outlined"
                            onClick={() => setHoraSeleccionada(hora)}
                          >
                            {hora}
                          </Button>
                        ),
                      )}
                    </Box>
                  )}
                </Box>
              )
            ) : (
              <>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Selecciona una fecha
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateCalendar
                      shouldDisableDate={(date) => date.day() === 0} // 🚫 bloquea domingos
                      minDate={moment()} // 🔑 bloquea fechas anteriores a hoy
                      value={fechaSeleccionada}
                      onChange={(newDate) => {
                        setFechaSeleccionada(newDate);
                        setHoraSeleccionada(null);
                      }}
                    />
                  </LocalizationProvider>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Horas disponibles
                  </Typography>
                  {horasDisponibles.length === 0 ? (
                    <Typography variant="body2">
                      Selecciona una fecha para ver disponibilidad
                    </Typography>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        maxHeight: 320, // limita la altura del bloque de horas
                        overflowY: "auto", // habilita scroll solo en este bloque
                        pr: 1, // espacio para que no quede debajo del scrollbar
                        // opcional: estilos para la barra de scroll en webkit
                        "&::-webkit-scrollbar": { width: 8 },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "rgba(0,0,0,0.2)",
                          borderRadius: 2,
                        },
                      }}
                    >
                      {horasDisponibles.map((hora) =>
                        hora === horaSeleccionada ? (
                          <Box key={hora} sx={{ display: "flex", gap: 2 }}>
                            <Button
                              sx={{ flex: 1 }}
                              variant="contained"
                              onClick={() => setHoraSeleccionada(hora)}
                            >
                              {hora}
                            </Button>
                            <Button
                              sx={{ flex: 1 }}
                              variant="contained"
                              color="primary"
                              onClick={() => setMostrarFormulario(true)}
                            >
                              Siguiente
                            </Button>
                          </Box>
                        ) : (
                          <Button
                            key={hora}
                            fullWidth
                            variant="outlined"
                            onClick={() => setHoraSeleccionada(hora)}
                          >
                            {hora}
                          </Button>
                        ),
                      )}
                    </Box>
                  )}
                </Box>
              </>
            )}
          </>
        )}
        {mostrarFormulario && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Por favor, especifique sus detalles
            </Typography>
            <Box
              component="form"
              onSubmit={submitHandlerRegistro}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Nombre(s)"
                name="nombres"
                value={dataRegistro.nombres}
                onChange={handleChangeRegistro}
                fullWidth
                required
                sx={{ bgcolor: "#fff" }}
              />
              <TextField
                label="Apellido(s)"
                name="apellidos"
                value={dataRegistro.apellidos}
                onChange={handleChangeRegistro}
                fullWidth
                required
                sx={{ bgcolor: "#fff" }}
              />
              <TextField
                label="Celular"
                name="celular"
                type="tel"
                value={dataRegistro.celular}
                onChange={handleChangeRegistro}
                fullWidth
                required
                error={Boolean(dataRegistro.celular) && !isCelularValid}
                helperText={
                  Boolean(dataRegistro.celular) && !isCelularValid
                    ? "Celular inválido (10 dígitos, puede incluir +)"
                    : ""
                }
                inputProps={{ inputMode: "tel" }}
                sx={{ bgcolor: "#fff" }}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={dataRegistro.email}
                onChange={handleChangeRegistro}
                fullWidth
                required
                error={Boolean(dataRegistro.email) && !isEmailValid}
                helperText={
                  Boolean(dataRegistro.email) && !isEmailValid
                    ? "Formato de email inválido"
                    : ""
                }
                sx={{ bgcolor: "#fff" }}
              />
              <Autocomplete
                freeSolo
                fullWidth
                disableClearable
                autoHighlight
                options={ciudadFiltrada.map((c) => c.etiqueta)}
                inputValue={dataRegistro.nombre_ciudad}
                onInputChange={(_event, value) => {
                  setDataRegistro((prev) => ({
                    ...prev,
                    nombre_ciudad: value,
                  }));
                }}
                onChange={(_event, value) => {
                  const nombre = value
                    ? String(value).split(",")[0].trim()
                    : "";
                  setDataRegistro((prev) => ({
                    ...prev,
                    nombreEnviar: nombre,
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
              <FormControl fullWidth required>
                <InputLabel id="monto-deuda-label">
                  ¿Cuánto suman todas tus deudas?
                </InputLabel>
                <Select
                  labelId="monto-deuda-label"
                  name="totalDeudas"
                  value={dataRegistro.totalDeudas}
                  label="¿Cuánto suman todas tus deudas?"
                  onChange={handleChangeRegistro}
                >
                  {opcionesDeuda.map((opcion) => (
                    <MenuItem key={opcion} value={opcion}>
                      {opcion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" color="primary">
                Programar una cita
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default AgendarCita;
