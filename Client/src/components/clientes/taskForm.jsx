import PropTypes from "prop-types";
import {
  Popover,
  Box,
  Stack,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState } from "react";

const TaskForm = ({ open, onClose, onSave, selectedProspecto }) => {
  const [dataTarea, setDataTarea] = useState({
    asunto: "",
    fechaVencimiento: "",
    recordatorio: false,
    repetir: false,
    frecuencia: "",
    repeticiones: 0,
  });

  const handleChange = (field, value) => {
    setDataTarea((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!selectedProspecto) return;
    onSave({ ...dataTarea, idProspecto: selectedProspecto.idProspecto });
    onClose();
  };

  // 👇 calcular fecha mínima (hoy) en formato YYYY-MM-DD
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
        <h3 style={{ marginTop: 0, marginBottom:2 }}>Nueva Tarea</h3>
        <Stack spacing={2}>
          <TextField
            label="Asunto"
            value={dataTarea.asunto}
            onChange={(e) => handleChange("asunto", e.target.value)}
            fullWidth
          />
          <TextField
            label="Fecha de Vencimiento"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dataTarea.fechaVencimiento}
            onChange={(e) => handleChange("fechaVencimiento", e.target.value)}
            fullWidth
            inputProps={{ min: today }} // 👈 evita fechas pasadas
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={dataTarea.recordatorio}
                onChange={(e) => handleChange("recordatorio", e.target.checked)}
              />
            }
            label="Recordatorio"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={dataTarea.repetir}
                onChange={(e) => handleChange("repetir", e.target.checked)}
              />
            }
            label="Repetir"
          />
          {dataTarea.repetir && (
            <>
              <FormControl fullWidth>
                <InputLabel>Frecuencia</InputLabel>
                <Select
                  value={dataTarea.frecuencia}
                  onChange={(e) => handleChange("frecuencia", e.target.value)}
                >
                  <MenuItem value="diaria">Diaria</MenuItem>
                  <MenuItem value="semanal">Semanal</MenuItem>
                  <MenuItem value="mensual">Mensual</MenuItem>
                  <MenuItem value="anual">Anual</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Repeticiones"
                type="number"
                value={dataTarea.repeticiones}
                onChange={(e) => handleChange("repeticiones", e.target.value)}
                fullWidth
              />
            </>
          )}
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

TaskForm.propTypes = {
  anchorEl: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  selectedProspecto: PropTypes.object,
};

export default TaskForm;
