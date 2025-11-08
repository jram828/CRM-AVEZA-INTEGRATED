import "./agendarcitas.css";
// import "../../App.css";
import Calendario from "../../components/calendar";
// import FormCita from "../formCrearCita/index";
import logo from "../../img/logoAveza.png";
import { Link, useNavigate } from "react-router-dom";
import { getCasos, getCasosTodos, setFiltro } from "../../redux/actions";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postCitaHandlers } from "../../handlers/crearCita";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "../Mystyles";
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
} from "@mui/material";
import moment from "moment";

function AgendarCitas() {
  const userData = JSON.parse(localStorage.getItem("loggedUser"));
  const [dataRegistro, setDataRegistro] = useState({
    titulo: "",
    descripcion: "",
    fechaCita: "",
    horaCita: "",
    idCaso: "",
    userEmail: userData?.email?.includes("@gmail.com") ? userData.email : "",
  });

  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la visualización del loading
  const [descripcion, setDescripcion] = useState("");

  console.log(dataRegistro);

  const dispatch = useDispatch();

  const casos = useSelector((state) => state.casos);
  const pages = useSelector((state) => state.pages);

  useEffect(() => {
    // if (filtro === "todos") {

    dispatch(getCasosTodos()).then(() => setIsLoading(false)); // Desactivar el loading después de cargar los casos
    // } else {

    // }
  }, []);

  // console.log("pages", pages);

  const submitHandlerRegistro = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true); // Activar el loading antes de enviar la solicitud
      // Guardar la cita en tu backend
      console.log("DataRegistro en submitHandlerRegistro:", dataRegistro);
      await postCitaHandlers({ ...dataRegistro, descripcion });
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
    // setErrors(
    //   validation({
    //     ...dataRegistro,
    //     [name]: value,
    //   })
    // );
  };

  if (isLoading || !pages || !pages.datosPagina) {
    return (
      <div className="loading-container">
        <img className="loading-image" src={loading} alt="loading" />
      </div>
    );
  }

  const handleDescripcionChange = (e) => {
    setDescripcion(e.target.value);
  };
  //  console.log("casos2", casos);

  // console.log("registro", dataRegistro);

  /* Añadir estos imports al inicio del archivo:
   */

  return (
    <Box sx={{ p: 2 }} className="containerDiary">
      <Typography variant="h5">Agendar Cita</Typography>

      <Grid
        container
        spacing={2}
        sx={{ mt: 2, flexWrap: "nowrap" }}
        className="calendario"
      >
        {/* <Grid item xs={12} md={6}> */}
        {/* <Box> */}
        <Calendario />
        {/* </Box> */}
        {/* </Grid> */}

        {/* <Grid item xs={12} md={6} > */}
        <Paper sx={{ p: 2 }} elevation={1} className="containerCita">
          <FormControl sx={{ minWidth: "250px" }}>
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
              gap: 2,
              alignItems: "center",
            }}
          >
            <Typography variant="h6" className="tituloCita">
              Crear Cita
            </Typography>

            <TextField
              // fullWidth
              label="Titulo"
              name="titulo"
              id="titulo"
              value={dataRegistro.titulo}
              onChange={handleChangeRegistro}
              // className="inputCrearCita"
              sx={{ minWidth: "250px" }}
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
                        value: date?.toDate() ?? null, // Convertir moment a Date
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
              // fullWidth
              label="Hora"
              type="time"
              name="horaCita"
              id="horaCita"
              value={dataRegistro.horaCita}
              onChange={handleChangeRegistro}
              InputLabelProps={{ shrink: true }}
              // className="inputCrearCita"
              sx={{ minWidth: "250px" }}
            />

            <FormControl>
              <InputLabel id="idCaso-label">Caso</InputLabel>
              <Select
                labelId="idCaso-label"
                id="idCaso"
                name="idCaso"
                value={dataRegistro.idCaso || ""}
                label="Caso"
                onChange={(event) => handleChangeRegistro(event)}
                // className="inputCrearCita"
                sx={{ minWidth: "250px" }}
              >
                <MenuItem value="">
                  <em>Seleccionar caso</em>
                </MenuItem>
                {pages.datosPagina?.map((caso) => (
                  <MenuItem key={caso.id} value={caso.id}>
                    {`${caso.tipoCaso} - ${caso.apellidosAbogado}/${caso.apellidosCliente}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Detalles"
              name="descripcion"
              id="descripcion"
              multiline
              rows={6}
              value={descripcion}
              onChange={handleDescripcionChange}
              className="inputCrearCita"
              sx={{ minWidth: "250px" }}
            />

            <Box className="botonescrearcita" sx={{ display: "flex", gap: 1 }}>
              <MuiButton
                type="submit"
                variant="contained"
                color="primary"
                onClick={submitHandlerRegistro}
              >
                Crear
              </MuiButton>

              <Link to="/" style={{ textDecoration: "none" }}>
                <MuiButton variant="outlined">Volver</MuiButton>
              </Link>
            </Box>
          </Box>
        </Paper>
        {/* </Grid> */}
      </Grid>
    </Box>
  );
}

export default AgendarCitas;
