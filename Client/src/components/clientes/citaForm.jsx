import PropTypes from "prop-types";
import {
  Popover,
  Box,
  Stack,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { obtenerDisponibilidad } from "../../redux/actions";
import moment from "moment-timezone";

const CitaForm = ({ open, onClose, onSave, selectedCliente }) => {
  const [dataCita, setDataCita] = useState({
    titulo: "",
    fechaCita: "",
    horaCita: "",
    descripcion: "",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (dataCita.fechaCita !== "") {
      dispatch(
        obtenerDisponibilidad({
          fecha: moment(dataCita.fechaCita).format("YYYY-MM-DD"),
        }),
      );
    }
  }, [dataCita.fechaCita, dispatch]);

  const horasDisponibles = useSelector((state) => state.horasDisponibles || []);
  console.log("Horas disponibles en CitaForm:", horasDisponibles);

  const hoy = moment().tz("America/Bogota").format("YYYY-MM-DD");
  const currentTime = moment().tz("America/Bogota").format("HH:mm");

  console.log("Fecha seleccionada:", dataCita.fechaCita);
  console.log("Fecha de hoy:", hoy);
  
  let horasFiltradas = horasDisponibles;

  // Solo filtrar si dataCita no está vacío y ES la fecha actual
  if (dataCita.fechaCita && dataCita.fechaCita === hoy) {
    horasFiltradas = horasDisponibles.filter((hora) => {
      const horaMoment = moment(hora, "HH:mm");
      const currentMoment = moment(currentTime, "HH:mm");
      return horaMoment.isAfter(currentMoment);
    });
  }

  const handleChange = (field, value) => {
    setDataCita((prev) => ({ ...prev, [field]: value }));

    if (field === "fechaCita") {
      const day = new Date(dataCita.fechaCita).getDay(); // 0 = domingo, 6 = sábado
      if (day === 0 || day === 6) {
        alert(
          "Reuniones no disponibles los fines de semana. Por favor, elige un día entre lunes y viernes.",
        );
        return; // no actualiza el estado
      }
    }
  };

  const handleSave = () => {
    if (!selectedCliente) return;
    onSave({
      ...dataCita,
      cedulaCliente: selectedCliente.cedulaCliente,
      email: selectedCliente.email,
      source: "cliente",
      nombres: selectedCliente.nombres,
      apellidos: selectedCliente.apellidos,
    });
    setDataCita({
      titulo: "",
      fechaCita: "",
      horaCita: "",
      descripcion: "",
    });
    onClose();
  };

  // Fecha mínima (hoy)
  const today = new Date().toISOString().split("T")[0];

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorReference="none" // 👈 ignora el anchorEl
      PaperProps={{
        sx: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", // 👈 centra vertical y horizontal
        },
      }}
    >
      <Box sx={{ p: 2, bgcolor: "white", minWidth: 300 }}>
        <h3 style={{ marginTop: 0, marginBottom: 2 }}>Nueva Cita</h3>
        <Stack spacing={2}>
          <TextField
            label="Título"
            value={dataCita.titulo}
            onChange={(e) => handleChange("titulo", e.target.value)}
            fullWidth
          />
          <TextField
            label="Fecha"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dataCita.fechaCita}
            onChange={(e) => handleChange("fechaCita", e.target.value)}
            fullWidth
            inputProps={{ min: today }} // 👈 no permite fechas pasadas
          />
          {/* <TextField
            label="Hora"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={dataCita.horaCita}
            onChange={(e) => handleChange("horaCita", e.target.value)}
            fullWidth
            inputProps={{ min: minTime }} // 👈 no permite horas pasadas si la fecha es hoy
          /> */}
          <FormControl fullWidth>
            <InputLabel id="hora-label">Hora</InputLabel>
            <Select
              labelId="hora-label"
              value={dataCita.horaCita || ""}
              onChange={(e) => handleChange("horaCita", e.target.value)}
            >
              {horasFiltradas.map((hora) => (
                <MenuItem key={hora} value={hora}>
                  {hora}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Detalles"
            name="descripcion"
            id="descripcion"
            multiline
            rows={6}
            value={dataCita.descripcion}
            onChange={(e) => handleChange("descripcion", e.target.value)}
            className="inputCrearCita"
            // sx={{ minWidth: "250px" }}
          />
        </Stack>
        <Box textAlign="right" mt={2}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Guardar
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

CitaForm.propTypes = {
  anchorEl: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  selectedCliente: PropTypes.object,
};

export default CitaForm;
