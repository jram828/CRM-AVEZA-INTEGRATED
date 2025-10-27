import { useState } from "react";
import "../../App.css";
import "./registroprospecto.css";
// removed unused Button import from Mystyles to avoid potential name conflicts
import { useNavigate } from "react-router-dom";
import { registroProspecto } from "../../handlers/registroProspecto.jsx";
import {codigoCiudades} from "../../utils/codigoCiudades.js"; // default import; component will guard against non-array values
import { registroProspectoExcel } from "../../handlers/registroProspectoExcel.jsx";
import {
  Container,
  Paper,
  Grid,
  TextField,
  Button as MUIButton,
  Autocomplete,
  Typography,
  Stack,
  Box,
} from "@mui/material";

const RegistroProspectoMUI = () => {
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
    // password: "",
    comentarios: "",
    valor_pretensiones: "",
  });

  // initialize ciudadFilt from codigoCiudades safely (fall back to empty array)
  const initCiudadFilt = Array.isArray(codigoCiudades) ? codigoCiudades : [];

  const [ciudadFilt, setCiudadFilt] = useState(initCiudadFilt);
  const navigate = useNavigate();

  const handleChangeRegistro = (e) => {
    setUserDataRegistro({
      ...userDataRegistro,
      [e.target.name]: e.target.value, // Sintaxis ES6 para actualizar la key correspondiente
    });
  };

  const submitHandlerRegistro = (e) => {
    e.preventDefault();
    registroProspecto(userDataRegistro);
    navigate("/Prospectos");
  };

  const handleCiudadChange = (e) => {
    e.preventDefault();

    // handleCiudadChange removed because the Autocomplete input uses onInputChange inline;
    // filtering is handled there and ciudadFilt is kept as an array.
  };

  const handlerCargarDatos = async () => {
    registroProspectoExcel();
  };

  // Nota: agrega estos imports arriba del archivo:

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Registro de Prospecto
        </Typography>

        <Box component="form" onSubmit={submitHandlerRegistro} noValidate>
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <input
                id="docexcel"
                type="file"
                accept=".xlsx, .xls"
                style={{ display: "none" }}
              />
              <label htmlFor="docexcel">
                <MUIButton variant="outlined" component="span">
                  Seleccionar archivo
                </MUIButton>
              </label>
              <MUIButton variant="contained" onClick={handlerCargarDatos}>
                Cargar datos
              </MUIButton>
            </Stack>

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

              <Grid item xs={12} sm={6}>
                <Autocomplete
                  freeSolo
                  options={ciudadFilt.map((c) =>
                    typeof c === "string" ? c : c?.nombre_ciudad || ""
                  )}
                  value={userDataRegistro.nombre_ciudad || ""}
                  onInputChange={(e, value) => {
                    // actualiza campo y filtra ciudades en línea
                    setUserDataRegistro({
                      ...userDataRegistro,
                      nombre_ciudad: value,
                    });
                    // guard against codigoCiudades not being an array (prevents runtime crashes)
                    if (!Array.isArray(codigoCiudades)) {
                      setCiudadFilt([]);
                      return;
                    }
                    const foundCiudad = codigoCiudades.filter((ciudad) =>
                      String(ciudad.nombre_ciudad || ciudad)
                        .toLowerCase()
                        .includes(String(value).toLowerCase())
                    );
                    setCiudadFilt(foundCiudad);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Ciudad" fullWidth />
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
                  rows={4}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="flex-end">
              <MUIButton
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
              </MUIButton>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};
export default RegistroProspectoMUI;
