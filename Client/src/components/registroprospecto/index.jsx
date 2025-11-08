import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Autocomplete,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { registroProspecto } from "../../handlers/registroProspecto.jsx";
import { registroProspectoExcel } from "../../handlers/registroProspectoExcel.jsx";
import { codigoCiudades } from "../../utils/codigoCiudades.js";
import { codigoDepartamentos } from "../../utils/codigoDepartamentos.js";
import "./registroprospecto.css";
import { useMemo } from "react";

const RegistroProspecto = () => {
  const [userDataRegistro, setUserDataRegistro] = useState({
    email: "",
    nombres: "",
    apellidos: "",
    cedulaProspecto: "",
    celular: "",
    direccion: "",
    nombre_ciudad: "",
    tipo_usuario: "3",
    tipo_de_caso: "",
    forma_de_pago: "",
    honorarios: "",
    cuotas: "",
    comentarios: "",
    valor_pretensiones: "",
  });

  const [ciudadFilt, setCiudadFilt] = useState([]);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (Array.isArray(codigoCiudades)) {
  //     const sorted = [...codigoCiudades].sort((a, b) =>
  //       a.nombre_ciudad.localeCompare(b.nombre_ciudad, "es", {
  //         sensitivity: "base",
  //       })
  //     );
  //     setCiudadFilt(sorted);
  //   } else {
  //     console.error("codigoCiudades no es un array:", codigoCiudades);
  //   }
  // }, []);
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
    const input = userDataRegistro.nombre_ciudad.toUpperCase();
    return ciudadOpciones.filter((c) =>
      c.etiqueta.toUpperCase().includes(input)
    );
  }, [userDataRegistro.nombre_ciudad, ciudadOpciones]);

  const handleChangeRegistro = (e) => {
    setUserDataRegistro({
      ...userDataRegistro,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandlerRegistro = async (e) => {
    e.preventDefault();

    // Si necesitas enviar el objeto completo de la ciudad:
    const ciudadObj = codigoCiudades.find(
      (c) => c.nombre_ciudad === userDataRegistro.nombre_ciudad
    );

    try {
      await registroProspecto({
        ...userDataRegistro,
        codigo_ciudad: ciudadObj?.codigo_ciudad || null,
        codigo_departamento: ciudadObj?.codigo_departamento || null,
      });
      navigate("/Prospectos");
    } catch (error) {
      console.error("Error al registrar prospecto:", error);
    }
  };

  const handlerCargarDatos = async () => {
    const fileInput = document.getElementById("docexcel");
    if (!fileInput.files.length) {
      alert("Por favor selecciona un archivo antes de cargar.");
      return;
    }
    try {
      await registroProspectoExcel(fileInput.files[0]);
    } catch (error) {
      console.error("Error al cargar datos desde Excel:", error);
    }
  };

  // Validaciones simples en render
  const isEmailValid = /^\S+@\S+\.\S+$/.test(userDataRegistro.email);
  const isCedulaValid = /^\d{6,10}$/.test(
    String(userDataRegistro.cedulaProspecto)
  );
  const isCelularValid = /^\+?\d{10,10}$/.test(
    String(userDataRegistro.celular)
  );
  const requiredFieldsFilled =
    userDataRegistro.email &&
    userDataRegistro.cedulaProspecto &&
    userDataRegistro.nombres &&
    userDataRegistro.apellidos;
  const isFormValid =
    requiredFieldsFilled && isEmailValid && isCedulaValid && isCelularValid;

  const ciudadNombres = (codigoCiudades || []).map((c) => c.nombre_ciudad);

  const filteredNombres = useMemo(() => {
    const input = userDataRegistro.nombre_ciudad.toUpperCase();
    return ciudadNombres.filter((nombre) => nombre.includes(input));
  }, [userDataRegistro.nombre_ciudad, ciudadNombres]);

  console.log("Input actual:", userDataRegistro.nombre_ciudad);
  return (
    // <Container maxWidth="md" sx={{ mt: 4 }}>
    //   <Paper
    //     className="contenedorregistro"
    //     sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}
    //   >
    <Box
      className="contenedorregistroprospecto"
      component="form"
      onSubmit={submitHandlerRegistro}
      noValidate
      sx={{
        p: { xs: 2, md: 4 },
        // bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Registro de Prospecto
      </Typography>
      <Stack spacing={2}>
        {/* Carga de archivo Excel */}
        <Stack direction="row" spacing={2} alignItems="center">
          <input
            id="docexcel"
            type="file"
            accept=".xlsx, .xls"
            style={{ display: "none" }}
          />
          <label htmlFor="docexcel">
            <Button variant="outlined" component="span">
              Seleccionar archivo
            </Button>
          </label>
          <Button variant="contained" onClick={handlerCargarDatos}>
            Cargar datos
          </Button>
        </Stack>

        {/* Datos personales */}
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Fila 1 */}

          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre(s)"
              name="nombres"
              value={userDataRegistro.nombres}
              onChange={handleChangeRegistro}
              fullWidth
              required
              sx={{bgcolor: "#fff",}}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido(s)"
              name="apellidos"
              value={userDataRegistro.apellidos}
              onChange={handleChangeRegistro}
              fullWidth
              required
              sx={{bgcolor: "#fff",}}
            />
          </Grid>
        </Stack>

        {/* Fila 2 */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              label="Número de cédula"
              name="cedulaProspecto"
              type="text"
              value={userDataRegistro.cedulaProspecto}
              onChange={handleChangeRegistro}
              fullWidth
              required
              error={
                Boolean(userDataRegistro.cedulaProspecto) && !isCedulaValid
              }
              helperText={
                Boolean(userDataRegistro.cedulaProspecto) && !isCedulaValid
                  ? "Cédula inválida (solo dígitos, 6-10 caracteres)"
                  : ""
              }
              inputProps={{ inputMode: "numeric", pattern: "\\d*" }}
              sx={{bgcolor: "#fff",}}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Celular"
              name="celular"
              type="tel"
              value={userDataRegistro.celular}
              onChange={handleChangeRegistro}
              fullWidth
              required
              error={Boolean(userDataRegistro.celular) && !isCelularValid}
              helperText={
                Boolean(userDataRegistro.celular) && !isCelularValid
                  ? "Celular inválido (10 dígitos, puede incluir +)"
                  : ""
              }
              inputProps={{ inputMode: "tel" }}
              sx={{bgcolor: "#fff",}}
            />
          </Grid>
        </Stack>
        {/* Fila 3 */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={userDataRegistro.email}
              onChange={handleChangeRegistro}
              fullWidth
              required
              error={Boolean(userDataRegistro.email) && !isEmailValid}
              helperText={
                Boolean(userDataRegistro.email) && !isEmailValid
                  ? "Formato de email inválido"
                  : ""
              }
              sx={{bgcolor: "#fff",}}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección"
              name="direccion"
              value={userDataRegistro.direccion}
              onChange={handleChangeRegistro}
              fullWidth
              sx={{bgcolor: "#fff",}}
            />
          </Grid>
        </Stack>

        {/* Fila 4 */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Autocomplete
              freeSolo
              fullWidth
              disableClearable
              autoHighlight
              options={ciudadFiltrada.map((c) => c.etiqueta)}
              inputValue={userDataRegistro.nombre_ciudad}
              onInputChange={(_event, value) => {
                setUserDataRegistro((prev) => ({
                  ...prev,
                  nombre_ciudad: value,
                }));
                }}
                onChange={(_event, value) => {
                const nombre = value ? String(value).split(",")[0].trim() : "";
                setUserDataRegistro((prev) => ({
                  ...prev,
                  nombre_ciudad: nombre,
                }));

                const ciudadObj = ciudadOpciones.find(
                  (c) => c.etiqueta === value
                );
                setCiudadSeleccionada(ciudadObj || null);
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
              </Grid>
              
          <Grid item xs={12}>
            <TextField
              label="Comentarios"
              name="comentarios"
              value={userDataRegistro.comentarios}
              onChange={handleChangeRegistro}
              multiline
              rows={5}
              fullWidth
              sx={{ minWidth: "220px", bgcolor: "#fff" }}
            />
          </Grid>
        </Stack>

        {/* Botón de guardar */}
        <Box display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isFormValid}
          >
            Guardar
          </Button>
        </Box>
      </Stack>
    </Box>
    //   </Paper>
    // </Container>
  );
};

export default RegistroProspecto;
