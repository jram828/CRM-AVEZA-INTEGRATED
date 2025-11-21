// import "./agendarcitas.css";
// import logo from "../../img/logoAveza.png";
import { Link } from "react-router-dom";
import { obtenerDisponibilidad, setFiltro, setSource } from "../../redux/actions";
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
    montoDeuda: "",
  });

  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la visualización del loading
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  // const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  console.log(dataRegistro);

  const dispatch = useDispatch();

  const horasDisponibles = useSelector((state) => state.horasDisponibles|| []);

  useEffect(() => {
    dispatch(setSource("google"));
  }, [dispatch]);

  const abogado = "Julián Avellaneda";
  const duracion = "30 min";
  const zonaHoraria = "America/Bogota";

  useEffect(() => {
    if (fechaSeleccionada) {
dispatch(obtenerDisponibilidad({ fecha: moment(fechaSeleccionada).format("YYYY-MM-DD") }));
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
          (d) => d.codigo_departamento === c.codigo_departamento
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
      c.etiqueta.toUpperCase().includes(input)
    );
  }, [dataRegistro.nombre_ciudad, ciudadOpciones]);

  // console.log("pages", pages);

  const submitHandlerRegistro = async (e) => {
    e.preventDefault();
    try {
      // setIsLoading(true); // Activar el loading antes de enviar la solicitud
      console.log("DataRegistro en submitHandlerRegistro:", dataRegistro);
      await registroProspecto(dataRegistro);
      await postCitaGoogleHandlers({
        ...dataRegistro,
        titulo: `Primera Asesoría ${dataRegistro.nombres} ${dataRegistro.apellidos}`,
        calendarId: "jram828@gmail.com",
        fechaCita: fechaSeleccionada,
        horaCita: horaSeleccionada,
      });
      // window.alert("Cita creado con éxito");
      // window.location.reload();
    } catch (error) {
      console.error("Error al crear la cita:", error.message);
      // window.alert("No se pudo crear la cita");
    }//finally {
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

  if (isLoading===true) {
    return (
      <div className="loading-container">
        <img className="loading-image" src={loading} alt="loading" />
      </div>
    );
  }

  // console.log("registro", dataRegistro);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: mostrarFormulario ? "1fr 2fr" : "1fr 1fr 1fr",
        gap: 4,
        p: 4,
      }}
    >
      {/* Columna 1: Info de la cita */}
      <Box sx={{ borderRight: 1, borderColor: "divider", pr: 2 }}>
        <Typography variant="h5" gutterBottom>
          Primera Asesoría Gratuita
        </Typography>
        <Typography>
          <strong>Abogado:</strong> {abogado}
        </Typography>
        {fechaSeleccionada && (
          <>
            <Typography>
              <strong>Fecha:</strong>{" "}
              {moment(fechaSeleccionada).format("DD/MM/YYYY")}
            </Typography>
            {horaSeleccionada && (
              <Typography>
                <strong>Hora:</strong> {horaSeleccionada}
              </Typography>
            )}
            <Typography>
              <strong>Duración:</strong> {duracion}
            </Typography>
            <Typography>
              <strong>Zona horaria:</strong> {zonaHoraria}
            </Typography>
          </>
        )}
        {!mostrarFormulario && fechaSeleccionada && horaSeleccionada && (
          <Button
            variant="contained"
            sx={{ mt: 4 }}
            onClick={() => setMostrarFormulario(true)}
          >
            Continuar
          </Button>
        )}
      </Box>

      {/* Columna 2: Calendario y horas */}
      {!mostrarFormulario && (
        <>
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
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {horasDisponibles.map((hora) => (
                  <Button
                    key={hora}
                    variant={
                      hora === horaSeleccionada ? "contained" : "outlined"
                    }
                    onClick={() => setHoraSeleccionada(hora)}
                  >
                    {hora}
                  </Button>
                ))}
              </Box>
            )}
          </Box>
        </>
      )}

      {/* Columna 3: Formulario */}
      {mostrarFormulario && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Por favor ingresa tus datos
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
                const nombre = value ? String(value).split(",")[0].trim() : "";
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
                    // Asegura que el Input interno también tenga fondo blanco
                    "& .MuiInputBase-root": { bgcolor: "#fff" },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    sx: { bgcolor: "#fff" },
                  }}
                  xs={12}
                  sm={6}
                />
              )}
            />

            <FormControl fullWidth required>
              <InputLabel id="monto-deuda-label">
                ¿Cuánto suman todas tus deudas?
              </InputLabel>
              <Select
                labelId="monto-deuda-label"
                name="montoDeuda"
                value={dataRegistro.montoDeuda}
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
              Agendar cita
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AgendarCita;

// import "./agendarcitas.css";
// import Calendario from "../../components/calendar";
// import logo from "../../img/logoAveza.png";
// import { Link} from "react-router-dom";
// import { setFiltro, setSource } from "../../redux/actions";
// import { useState, useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import loading from "../../assets/loading.gif";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import { registroProspecto } from "../../handlers/registroProspecto.jsx";
// import { codigoCiudades } from "../../utils/codigoCiudades.js";
// import { codigoDepartamentos } from "../../utils/codigoDepartamentos.js";

// import {
//   Box,
//   Grid,
//   Paper,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   TextField,
//   Button as MuiButton,
//   Autocomplete,
// } from "@mui/material";
// import moment from "moment";
// import { calendar } from "googleapis/build/src/apis/calendar/index.js";
// import { postCitaGoogleHandlers } from "../../handlers/crearCitaGoogle.jsx";

// function AgendarCitas() {

//   const [dataRegistro, setDataRegistro] = useState({
//     titulo: "",
//     descripcion: "",
//     fechaCita: "",
//     horaCita: "",
//     idCaso: "",
//     email: "",
//     nombres: "",
//     apellidos: "",
//     celular: "",
//     nombre_ciudad: "",
//     nombreEnviar: "",
//   });

//   const [isLoading, setIsLoading] = useState(true); // Estado para controlar la visualización del loading

//   console.log(dataRegistro);

//   const dispatch = useDispatch();

//   const pages = useSelector((state) => state.pages);

//   useEffect(() => {
//     dispatch(setSource("google"));
//   }, [dispatch]);

//   const ciudadOpciones = useMemo(() => {
//     const nombresUnicos = new Set();

//     return codigoCiudades
//       .map((c) => {
//         const departamento = codigoDepartamentos.find(
//           (d) => d.codigo_departamento === c.codigo_departamento
//         );
//         const nombreDepto =
//           departamento?.nombre_departamento || "SIN DEPARTAMENTO";

//         const etiqueta = `${c.nombre_ciudad}, ${nombreDepto}`;

//         return {
//           etiqueta,
//           ciudad: c.nombre_ciudad,
//           departamento: nombreDepto,
//           codigo: c.codigo_ciudad,
//         };
//       })
//       .filter((c) => {
//         if (nombresUnicos.has(c.etiqueta)) return false;
//         nombresUnicos.add(c.etiqueta);
//         return true;
//       });
//   }, []);

//   const ciudadFiltrada = useMemo(() => {
//     const input = dataRegistro.nombre_ciudad.toUpperCase();
//     return ciudadOpciones.filter((c) =>
//       c.etiqueta.toUpperCase().includes(input)
//     );
//   }, [dataRegistro.nombre_ciudad, ciudadOpciones]);

//   // console.log("pages", pages);

//   const submitHandlerRegistro = async (e) => {
//     e.preventDefault();
//     try {
//       setIsLoading(true); // Activar el loading antes de enviar la solicitud
//       console.log("DataRegistro en submitHandlerRegistro:", dataRegistro);
//       await registroProspecto(dataRegistro);
//       await postCitaGoogleHandlers({
//         ...dataRegistro,
//         titulo: `Primera Asesoría ${dataRegistro.nombres} ${dataRegistro.apellidos}`,
//         calendarId: "jram828@gmail.com",
//       });
//       // window.alert("Cita creado con éxito");
//       // window.location.reload();
//     } catch (error) {
//       console.error("Error al crear la cita:", error.message);
//       // window.alert("No se pudo crear la cita");
//     } finally {
//       setIsLoading(false); // Desactivar el loading después de la solicitud
//     }
//   };

//   const handleChangeRegistro = (e) => {
//     const { name, value } = e.target
//       ? e.target
//       : { name: "fechaCita", value: e };
//     setDataRegistro((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const isEmailValid = /^\S+@\S+\.\S+$/.test(dataRegistro.email);

//   const isCelularValid = /^\+?\d{10,10}$/.test(String(dataRegistro.celular));

//   if (isLoading) {
//     return (
//       <div className="loading-container">
//         <img className="loading-image" src={loading} alt="loading" />
//       </div>
//     );
//   }

//   //  console.log("casos2", casos);

//   // console.log("registro", dataRegistro);

//   return (
//     <Box sx={{ p: 2 }} className="containerDiary">
//       <Typography variant="h5">Agendar Cita</Typography>

//       <Grid
//         container
//         spacing={2}
//         sx={{ mt: 2, flexWrap: "nowrap" }}
//         className="calendario"
//       >
//         <Calendario />
//         <Paper sx={{ p: 2 }} elevation={1} className="containerCita">
//           <Box
//             component="form"
//             onSubmit={submitHandlerRegistro}
//             className="formularioCita"
//             noValidate
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               gap: 1,
//               alignItems: "center",
//             }}
//           >
//             <Typography variant="h6" className="tituloCita">
//               Crear Cita
//             </Typography>

//             <Box>
//               <LocalizationProvider dateAdapter={AdapterMoment}>
//                 <DatePicker
//                   label="Fecha"
//                   value={
//                     dataRegistro.fechaCita
//                       ? moment(dataRegistro.fechaCita)
//                       : null
//                   }
//                   onChange={(date) =>
//                     handleChangeRegistro({
//                       target: {
//                         name: "fechaCita",
//                         value: date?.toDate() ?? null, // Convertir moment a Date
//                       },
//                     })
//                   }
//                   format="DD/MM/YYYY"
//                   slotProps={{
//                     textField: {
//                       name: "fechaCita",
//                       id: "fechaCita",
//                       fullWidth: true,
//                     },
//                   }}
//                 />
//               </LocalizationProvider>
//             </Box>

// <TextField
//   label="Nombre(s)"
//   name="nombres"
//   value={dataRegistro.nombres}
//   onChange={handleChangeRegistro}
//   fullWidth
//   required
//   sx={{ bgcolor: "#fff" }}
// />

// <TextField
//   label="Apellido(s)"
//   name="apellidos"
//   value={dataRegistro.apellidos}
//   onChange={handleChangeRegistro}
//   fullWidth
//   required
//   sx={{ bgcolor: "#fff" }}
// />
// <TextField
//   label="Celular"
//   name="celular"
//   type="tel"
//   value={dataRegistro.celular}
//   onChange={handleChangeRegistro}
//   fullWidth
//   required
//   error={Boolean(dataRegistro.celular) && !isCelularValid}
//   helperText={
//     Boolean(dataRegistro.celular) && !isCelularValid
//       ? "Celular inválido (10 dígitos, puede incluir +)"
//       : ""
//   }
//   inputProps={{ inputMode: "tel" }}
//   sx={{ bgcolor: "#fff" }}
// />
// <TextField
//   label="Email"
//   name="email"
//   type="email"
//   value={dataRegistro.email}
//   onChange={handleChangeRegistro}
//   fullWidth
//   required
//   error={Boolean(dataRegistro.email) && !isEmailValid}
//   helperText={
//     Boolean(dataRegistro.email) && !isEmailValid
//       ? "Formato de email inválido"
//       : ""
//   }
//   sx={{ bgcolor: "#fff" }}
// />
// <Autocomplete
//   freeSolo
//   fullWidth
//   disableClearable
//   autoHighlight
//   options={ciudadFiltrada.map((c) => c.etiqueta)}
//   inputValue={dataRegistro.nombre_ciudad}
//   onInputChange={(_event, value) => {
//     setDataRegistro((prev) => ({
//       ...prev,
//       nombre_ciudad: value,
//     }));
//   }}
//   onChange={(_event, value) => {
//     const nombre = value ? String(value).split(",")[0].trim() : "";
//     setDataRegistro((prev) => ({
//       ...prev,
//       nombreEnviar: nombre,
//     }));
//   }}
//   renderInput={(params) => (
//     <TextField
//       {...params}
//       id="ciudad"
//       label="Ciudad"
//       size="small"
//       placeholder="Buscar ciudad..."
//       fullWidth
//       sx={{
//         minWidth: 220,
//         bgcolor: "#fff",
//         // Asegura que el Input interno también tenga fondo blanco
//         "& .MuiInputBase-root": { bgcolor: "#fff" },
//       }}
//       InputProps={{
//         ...params.InputProps,
//         sx: { bgcolor: "#fff" },
//       }}
//       xs={12}
//       sm={6}
//     />
//   )}
// />

//             <Box className="botonescrearcita" sx={{ display: "flex", gap: 1 }}>
//               <MuiButton
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 onClick={submitHandlerRegistro}
//               >
//                 Crear
//               </MuiButton>

//               <Link to="/agendarcitas" style={{ textDecoration: "none" }}>
//                 <MuiButton variant="outlined">Volver</MuiButton>
//               </Link>
//             </Box>
//           </Box>
//         </Paper>
//       </Grid>
//     </Box>
//   );
// }

// export default AgendarCitas;
