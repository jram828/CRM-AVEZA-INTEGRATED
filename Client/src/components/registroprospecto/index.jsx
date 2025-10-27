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

  useEffect(() => {
    if (Array.isArray(codigoCiudades)) {
      setCiudadFilt(codigoCiudades);
    } else {
      console.error("codigoCiudades no es un array:", codigoCiudades);
    }
  }, []);

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

  const ciudadOptions = ciudadFilt
    .map((c) =>
      typeof c === "object" && c !== null ? c.nombre_ciudad : null
    )
    .filter((name) => typeof name === "string" && name.trim() !== "");

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Registro de Prospecto
        </Typography>

        <Box component="form" onSubmit={submitHandlerRegistro} noValidate>
          <Stack spacing={3}>
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nombre(s)"
                  name="nombres"
                  value={userDataRegistro.nombres}
                  onChange={handleChangeRegistro}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Apellido(s)"
                  name="apellidos"
                  value={userDataRegistro.apellidos}
                  onChange={handleChangeRegistro}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Número de cédula"
                  name="cedulaProspecto"
                  type="number"
                  value={userDataRegistro.cedulaProspecto}
                  onChange={handleChangeRegistro}
                  fullWidth
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={userDataRegistro.email}
                  onChange={handleChangeRegistro}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Dirección"
                  name="direccion"
                  value={userDataRegistro.direccion}
                  onChange={handleChangeRegistro}
                  fullWidth
                />
              </Grid>

              {/* Ciudad con Autocomplete */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  freeSolo
                  options={ciudadOptions}
                  inputValue={userDataRegistro.nombre_ciudad}
                  onInputChange={(e, value) => {
                    setUserDataRegistro({
                      ...userDataRegistro,
                      nombre_ciudad: value,
                    });

                    const foundCiudad = codigoCiudades.filter((ciudad) =>
                      ciudad.nombre_ciudad
                        .toLowerCase()
                        .includes(value.toLowerCase())
                    );
                    setCiudadFilt(foundCiudad);
                  }}
                  onChange={(event, newValue) => {
                    setUserDataRegistro({
                      ...userDataRegistro,
                      nombre_ciudad: newValue || "",
                    });

                    const ciudadObj = codigoCiudades.find(
                      (c) => c.nombre_ciudad === newValue
                    );
                    setCiudadSeleccionada(ciudadObj || null);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Ciudad" fullWidth />
                  )}
                />
              </Grid>

              {/* Comentarios */}
              <Grid item xs={12}>
                <TextField
                  label="Comentarios"
                  name="comentarios"
                  value={userDataRegistro.comentarios}
                  onChange={handleChangeRegistro}
                  multiline
                  rows={4}
                  fullWidth
                />
              </Grid>
            </Grid>

            {/* Botón de guardar */}
            <Box display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={
                  !userDataRegistro.email ||
                  !userDataRegistro.cedulaProspecto ||
                  !userDataRegistro.nombres ||
                  !userDataRegistro.apellidos
                }
              >
                Guardar
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegistroProspecto;