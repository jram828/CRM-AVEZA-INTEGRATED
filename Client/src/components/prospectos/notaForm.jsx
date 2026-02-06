import PropTypes from "prop-types";
import {
  Popover,
  Box,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";

const NotaForm = ({ open, onClose, onSave, selectedProspecto }) => {
  const [dataNota, setDataNota] = useState({
    descripcion: "",
  });

  const handleChange = (field, value) => {
    setDataNota((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!selectedProspecto) return;
    onSave({ ...dataNota, idProspecto: selectedProspecto.idProspecto });
    onClose();
  };

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
        <h3 style={{ marginTop: 0, marginBottom: 2 }}>Nueva Tarea</h3>
        <Stack spacing={2}>
          <TextField
            label="Descripción"
            value={dataNota.descripcion}
            onChange={(e) => handleChange("descripcion", e.target.value)}
            fullWidth
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

NotaForm.propTypes = {
  anchorEl: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  selectedProspecto: PropTypes.object,
};

export default NotaForm;
