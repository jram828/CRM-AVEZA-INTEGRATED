import "./agendarcitaspriv.css";
import Calendario from "../calendar";
import logo from "../../img/logoAveza.png";
import { Link } from "react-router-dom";
import {
  getCitas,
  getProspectoAllCasos,
  obtenerCitasCalendar,
  setFiltro,
  setSource,
} from "../../redux/actions";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postCitaHandlers } from "../../handlers/crearCita";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import loading from "../../assets/loading.gif";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import {
  Box,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button as MuiButton,
  Autocomplete,
  createFilterOptions,
} from "@mui/material";
import moment from "moment";

function AgendarCitasPriv() {
  const userData = JSON.parse(localStorage.getItem("loggedUser"));
  const [dataRegistro, setDataRegistro] = useState({
    titulo: "",
    descripcion: "",
    fechaCita: "",
    horaCita: "",
    idCaso: "",
    idProspecto: "",
    userEmail: userData?.email?.includes("@gmail.com") ? userData.email : "",
    email: "",
    calendarId: userData?.calendarId || "jram828@gmail.com",
  });

  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la visualización del loading
  const [descripcion, setDescripcion] = useState("");

  console.log(dataRegistro);

  const dispatch = useDispatch();

  const reduxProspectos = useSelector((state) => state.pages);
  // const pages = useSelector((state) => state.pages);
  const filtro = useSelector((state) => state.filtro);

  useEffect(() => {
    dispatch(setSource("google"));
    dispatch(getProspectoAllCasos());
  }, [dispatch]);
  // console.log("pages", pages);

  const submitHandlerRegistro = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true); // Activar el loading antes de enviar la solicitud
      // Guardar la cita en tu backend
      console.log("DataRegistro en submitHandlerRegistro:", dataRegistro);
      await postCitaHandlers({ ...dataRegistro, descripcion });

        dispatch(obtenerCitasCalendar(userData.email));
      // window.alert("Cita creado con éxito");
      // window.location.reload();
    } catch (error) {
      console.error("Error al crear la cita:", error.message);
      // window.alert("No se pudo crear la cita");
    } finally {
      setIsLoading(false); // Desactivar el loading después de la solicitud
    }
  };

  const handleChangeSelect = (e) => {
    // e.preventDefault();

    const filtroCita = e.target.value;
    // console.log("Target value", filtroCita);
    // setFiltro(filtroCita);
    window.localStorage.setItem("filtroCita", JSON.stringify(filtroCita));
    // console.log("Filtro change: ", filtro);
    dispatch(setFiltro(filtroCita));
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

  // if (isLoading || !citas) {
  //   return (
  //     <div className="loading-container">
  //       <img className="loading-image" src={loading} alt="loading" />
  //     </div>
  //   );
  // }

  const handleDescripcionChange = (e) => {
    setDescripcion(e.target.value);
  };

  const filter = createFilterOptions({
    stringify: (option) =>
      `${option.nombres || ""} ${option.apellidos || ""}`.toLowerCase(),
  });

  return (
    <Box sx={{ p: 2 }} className="containerDiary">
      <Typography variant="h5">Agendar Cita</Typography>

      <Grid
        container
        spacing={2}
        sx={{
          mt: 2,
          height: "80vh", // 👈 altura fija o relativa
          width: "100%", // 👈 ocupa el ancho del padre
        }}
        wrap="nowrap"
      >
        <Grid item xs={12} md={7}>
          <Calendario />
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper
            sx={{ p: 2, height: "100%" }}
            elevation={1}
            className="containerCita"
          >
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="filtro-cita-label">Ver citas de</InputLabel>
              <Select
                labelId="filtro-cita-label"
                id="filtrocita"
                name="filtrocita"
                label="Ver citas de"
                onChange={(e) => handleChangeSelect(e)}
                defaultValue=""
              >
                <MenuItem value="">
                  <em>Ver citas de:</em>
                </MenuItem>
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="usuario">Usuario actual</MenuItem>
              </Select>
            </FormControl>

            <Box
              component="form"
              onSubmit={submitHandlerRegistro}
              className="formularioCita"
              noValidate
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                alignItems: "stretch",
                width: "100%",
              }}
            >
              <Typography variant="h6" className="tituloCita">
                Crear Cita
              </Typography>

              {/* Selector de prospecto */}
              <Autocomplete
                options={reduxProspectos || []}
                getOptionLabel={(option) =>
                  `${option.nombres || ""} ${option.apellidos || ""}`
                }
                filterOptions={filter}
                onChange={(event, value) => {
                  setDataRegistro((prev) => ({
                    ...prev,
                    idProspecto: value ? value.idProspecto : "",
                    email: value ? value.email : "",
                    nombres: value ? value.nombres : "",
                    apellidos: value ? value.apellidos : "",
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Prospecto"
                    placeholder="Buscar por nombre o apellido"
                    fullWidth
                  />
                )}
              />

              <TextField
                fullWidth
                label="Titulo"
                name="titulo"
                id="titulo"
                value={dataRegistro.titulo}
                onChange={handleChangeRegistro}
                // className="inputCrearCita"
                // sx={{ minWidth: "250px" }}
              />

              <Box>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Fecha"
                    value={
                      dataRegistro.fechaCita
                        ? moment(dataRegistro.fechaCita)
                        : null
                    }
                    onChange={(date) =>
                      handleChangeRegistro({
                        target: {
                          name: "fechaCita",
                          value: date ? moment(date).utc().toISOString() : null,
                        },
                      })
                    }
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        name: "fechaCita",
                        id: "fechaCita",
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>

              <TextField
                fullWidth
                label="Hora"
                type="time"
                name="horaCita"
                id="horaCita"
                value={dataRegistro.horaCita}
                onChange={handleChangeRegistro}
                InputLabelProps={{ shrink: true }}
                // className="inputCrearCita"
                // sx={{ minWidth: "250px" }}
              />
              <TextField
                fullWidth
                label="Detalles"
                name="descripcion"
                id="descripcion"
                multiline
                rows={6}
                value={descripcion}
                onChange={handleDescripcionChange}
                className="inputCrearCita"
                // sx={{ minWidth: "250px" }}
              />

              <Box
                className="botonescrearcita"
                sx={{ display: "flex", gap: 1 }}
              >
                <MuiButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={submitHandlerRegistro}
                >
                  Crear
                </MuiButton>

                <Link to="/agendarcitas" style={{ textDecoration: "none" }}>
                  <MuiButton variant="outlined">Volver</MuiButton>
                </Link>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AgendarCitasPriv;
