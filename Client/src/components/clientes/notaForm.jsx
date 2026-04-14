import PropTypes from "prop-types";
import { Popover, Box, Stack, TextField, Button } from "@mui/material";
import { useState } from "react";

const NotaForm = ({ open, onClose, onSave, selectedCliente }) => {
  const [dataNota, setDataNota] = useState({
    descripcion: "",
  });

  const handleChange = (field, value) => {
    setDataNota((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!selectedCliente) return;
    onSave({
      ...dataNota,
      cedulaCliente: selectedCliente.cedulaCliente,
      source: "cliente",
    });
    onClose();
  };

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition" // 👈 usa coordenadas absolutas
      anchorPosition={{
        top: 100,
        left: window.innerWidth / 2,
      }}
      PaperProps={{
        sx: {
          transform: "translate(-50%, -50%)", // 👈 centra respecto a las coordenadas
        },
      }}
    >
      <Box sx={{ p: 2, bgcolor: "white", minWidth: 300 }}>
        <h3 style={{ marginTop: 0, marginBottom: 2 }}>Nueva Nota</h3>
        <Stack spacing={2}>
          <TextField
            label="Descripción"
            value={dataNota.descripcion}
            onChange={(e) => handleChange("descripcion", e.target.value)}
            fullWidth
            multiline
            minRows={3} // altura mínima (3 renglones)
            maxRows={6} // altura máxima antes de que aparezca scroll
            variant="outlined"
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
  selectedCliente: PropTypes.object,
};

export default NotaForm;
