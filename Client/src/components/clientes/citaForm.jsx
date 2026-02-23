import PropTypes from "prop-types";
import {
  Popover,
  Box,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";

const CitaForm = ({open, onClose, onSave, selectedCliente }) => {
  const [dataCita, setDataCita] = useState({
    titulo: "",
    fechaCita: "",
    horaCita: "",
  });

  const handleChange = (field, value) => {
    setDataCita((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!selectedCliente) return;
    onSave({ ...dataCita, cedulaCliente: selectedCliente.cedulaCliente, source: "cliente" });
    onClose();
  };

  // Fecha mínima (hoy)
  const today = new Date().toISOString().split("T")[0];

  // Hora mínima si la fecha seleccionada es hoy
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // formato HH:MM

  const minTime =
    dataCita.fechaCita === today ? currentTime : "00:00";

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
          <TextField
            label="Hora"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={dataCita.horaCita}
            onChange={(e) => handleChange("horaCita", e.target.value)}
            fullWidth
            inputProps={{ min: minTime }} // 👈 no permite horas pasadas si la fecha es hoy
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