import { useState, useEffect } from "react";
import { postCaso } from "../../handlers/crearCaso";
import { getAbogados } from "../../handlers/todosAbogados";
import { getClientesCasos } from "../../handlers/todosClientes";
import "./crearCaso.css";
import { Link } from "react-router-dom";
import { getTiposCasos } from "../../handlers/todosTiposdecasos";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Grid,
  Typography,
  Button,
  Box,
} from "@mui/material";

function CrearCaso() {
  const [userDataRegistro, setUserDataRegistro] = useState({
    cedulaAbogado: "",
    cedulaCliente: "",
    fecha: "",
    fechaFin: "",
    descripcion: "",
    TipoDeCasoid: 1,
    porcentajeInicial: "",
    honorarios: "",
    valor_pretensiones: "",
    cuotas: "",
    forma_de_pago: "",
    radicado: "",
    juzgado: "",
  });

  const [clientes, setClientes] = useState([]);
  const [abogados, setAbogados] = useState([]);
  const [tipos, setTipos] = useState({ allTipoDeCaso: [] });
  const [selectedClient, setSelectedClient] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerAbogados = async () => {
      try {
        const listaAbogados = await getAbogados();
        setAbogados(listaAbogados);
      } catch (error) {
        console.error("Error al obtener los abogados:", error);
      }
    };

    obtenerAbogados();
  }, []);

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const listaClientes = await getClientesCasos();
        setClientes(listaClientes || []);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    obtenerClientes();
  }, []);

  useEffect(() => {
    const obtenerTipos = async () => {
      try {
        const listaTipos = await getTiposCasos();
        if (listaTipos && Array.isArray(listaTipos.allTipoDeCaso)) {
          setTipos(listaTipos);
        } else {
          console.error(
            "Error: La respuesta no es un objeto esperado",
            listaTipos
          );
        }
      } catch (error) {
        console.error("Error al obtener los tipos de casos:", error);
      }
    };

    obtenerTipos();
  }, []);

  const handleChangeRegistro = (e) => {
    const { name, value } = e.target;
    setUserDataRegistro((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitHandlerRegistro = async (e) => {
    e.preventDefault();
    try {
      await postCaso(userDataRegistro);
      navigate("/casos");
    } catch (error) {
      console.error("Error al crear el caso:", error.message);
      window.alert("No se pudo crear el caso");
    }
  };
  console.log("userDataRegistro:", userDataRegistro);
  return (
    <Box className="contenedorcrearcaso" sx={{ p: 2 }}>
      <Box className="encabezado" sx={{ mb: 2 }}>
        <Typography variant="h4" className="titulo">
          Crear caso
        </Typography>
      </Box>

      <form
        onSubmit={submitHandlerRegistro}
        className="datoscrearcaso"
        noValidate
      >
        <Grid
          container
          spacing={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid item xs={12} md={6} sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <FormControl variant="outlined">
                <InputLabel id="tipo-caso-label">Tipo de caso</InputLabel>
                <Select
                  labelId="tipo-caso-label"
                  name="TipoDeCasoid"
                  id="TipoDeCasoid"
                  value={userDataRegistro.TipoDeCasoid}
                  onChange={handleChangeRegistro}
                  label="Tipo de caso"
                  sx={{ bgcolor: "#fff", minWidth: "300px" }}
                >
                  <MenuItem value="">
                    <em>Tipo de caso</em>
                  </MenuItem>
                  {tipos.allTipoDeCaso.map((tipo) => (
                    <MenuItem key={tipo.TipoDeCasoid} value={tipo.TipoDeCasoid}>
                      {tipo.descripcion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {userDataRegistro.TipoDeCasoid !== 1 && (
                <Grid item xs={12} md={6} sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
                  <TextField
                    // fullWidth
                    margin="normal"
                    label="Fecha inicio"
                    type="date"
                    name="fecha"
                    value={userDataRegistro.fecha}
                    onChange={handleChangeRegistro}
                    InputLabelProps={{ shrink: true }}
                    sx={{ bgcolor: "#fff", minWidth: "300px" }}
                  />

                  <TextField
                    // fullWidth
                    margin="normal"
                    label="Fecha final"
                    type="date"
                    name="fechaFin"
                    value={userDataRegistro.fechaFin}
                    onChange={handleChangeRegistro}
                    InputLabelProps={{ shrink: true }}
                    sx={{ bgcolor: "#fff", minWidth: "300px" }}
                  />
                </Grid>
              )}

              <FormControl margin="normal">
                <InputLabel id="abogado-label">Abogado</InputLabel>
                <Select
                  labelId="abogado-label"
                  name="cedulaAbogado"
                  id="cedulaAbogado"
                  value={userDataRegistro.cedulaAbogado}
                  onChange={handleChangeRegistro}
                  label="Abogado"
                  sx={{ bgcolor: "#fff", minWidth: "300px" }}
                >
                  <MenuItem value="">
                    <em>Abogados</em>
                  </MenuItem>
                  {abogados.map((abogado) => (
                    <MenuItem
                      key={abogado.cedulaAbogado}
                      value={abogado.cedulaAbogado}
                    >
                      {abogado.nombres} {abogado.apellidos}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Autocomplete para cliente: busca por apellido y al seleccionar asigna cedulaCliente */}
              <Autocomplete
                // fullWidth
                options={clientes}
                getOptionLabel={(option) =>
                  option ? `${option.nombres} ${option.apellidos}` : ""
                }
                filterOptions={(options, { inputValue }) => {
                  const filtered = options.filter((c) =>
                    c.apellidos.toLowerCase().includes(inputValue.toLowerCase())
                  );
                  return filtered.sort((a, b) =>
                    a.nombres.localeCompare(b.nombres)
                  );
                }}
                onChange={(e, newValue) => {
                  setSelectedClient(newValue);
                  setUserDataRegistro((prev) => ({
                    ...prev,
                    cedulaCliente: newValue ? newValue.cedulaCliente : "",
                  }));
                }}
                
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Buscar cliente por apellido..."
                    placeholder="Buscar por apellido..."
                    margin="normal"
                    sx={{ bgcolor: "#fff", minWidth: "300px" }}
                  />
                )}
                value={selectedClient}
                isOptionEqualToValue={(option, value) =>
                  option &&
                  value &&
                  option.cedulaCliente === value.cedulaCliente
                }
              />
              <TextField
                // fullWidth
                margin="normal"
                label="Descripción"
                name="descripcion"
                value={userDataRegistro.descripcion}
                onChange={handleChangeRegistro}
                multiline
                rows={6}
                sx={{ bgcolor: "#fff", minWidth: "300px" }}
              />
            </Grid>

            {userDataRegistro.TipoDeCasoid !== 1 && (
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start"
                }}
              >
                <TextField
                  // fullWidth
                  // margin="normal"
                  label="Valor pretensiones"
                  type="number"
                  name="valor_pretensiones"
                  value={userDataRegistro.valor_pretensiones}
                  onChange={handleChangeRegistro}
                  sx={{ minWidth: "300px", bgcolor: "#fff"}}
                />
                <TextField
                  // fullWidth
                  margin="normal"
                  label="Honorarios"
                  type="number"
                  name="honorarios"
                  value={userDataRegistro.honorarios}
                  onChange={handleChangeRegistro}
                  sx={{ minWidth: "300px", bgcolor: "#fff" }}
                />
                <FormControl margin="normal">
                  <InputLabel id="forma-pago-label">Forma de pago</InputLabel>
                  <Select
                    labelId="forma-pago-label"
                    name="forma_de_pago"
                    value={userDataRegistro.forma_de_pago}
                    onChange={handleChangeRegistro}
                    label="Forma de pago"
                    sx={{ minWidth: "300px", bgcolor: "#fff" }}
                  >
                    <MenuItem value="">
                      <em>Elija una opción</em>
                    </MenuItem>
                    <MenuItem value="Contado">Contado</MenuItem>
                    <MenuItem value="Crédito">Crédito</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  // fullWidth
                  margin="normal"
                  label="Numero de cuotas"
                  type="number"
                  name="cuotas"
                  value={userDataRegistro.cuotas}
                  onChange={handleChangeRegistro}
                  sx={{ minWidth: "300px", bgcolor: "#fff" }}
                />
                <TextField
                  // fullWidth
                  margin="normal"
                  label="Porcentaje cuota inicial"
                  type="number"
                  name="porcentajeInicial"
                  value={userDataRegistro.porcentajeInicial}
                  onChange={handleChangeRegistro}
                  sx={{ minWidth: "300px", bgcolor: "#fff" }}
                />
                <TextField
                  // fullWidth
                  margin="normal"
                  label="Nombre juzgado"
                  name="juzgado"
                  value={userDataRegistro.juzgado}
                  onChange={handleChangeRegistro}
                  sx={{ minWidth: "300px", bgcolor: "#fff" }}
                />
                <TextField
                  // fullWidth
                  margin="normal"
                  label="N° Radicado juzgado"
                  type="number"
                  name="radicado"
                  value={userDataRegistro.radicado}
                  onChange={handleChangeRegistro}
                  sx={{ minWidth: "300px", bgcolor: "#fff" }}
                />
              </Grid>
            )}
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button variant="contained" color="primary" type="submit">
              Guardar
            </Button>
            <Link to="/casos" style={{ textDecoration: "none" }}>
              <Button variant="outlined">Volver</Button>
            </Link>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default CrearCaso;
