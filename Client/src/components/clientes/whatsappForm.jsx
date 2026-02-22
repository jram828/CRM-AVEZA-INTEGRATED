import PropTypes from "prop-types";
import { Popover, Box, Stack, TextField, Button } from "@mui/material";
import { useState } from "react";

const WhatsappForm = ({
  open,
  onClose,
  handleSaveWhatsapp,
  selectedProspecto,
}) => {
  const [dataMensaje, setDataMensaje] = useState({
    asunto: "",
  });

  const handleChange = (field, value) => {
    setDataMensaje((prev) => ({ ...prev, [field]: value }));
  };

  const handleSend = () => {
    if (!selectedProspecto?.celular || !dataMensaje.asunto) return;

    // Normalizar número (solo dígitos)
    let numero = selectedProspecto.celular.replace(/\D/g, "");

    // Validar prefijo internacional (Colombia = 57)
    if (!numero.startsWith("57")) {
      numero = "57" + numero;
    }

    const texto = encodeURIComponent(dataMensaje.asunto);

    // URL oficial de WhatsApp
    const url = `https://wa.me/${numero}?text=${texto}`;

    // Abrir WhatsApp Web / App
    window.open(url, "_blank");

    // Guardar usando dispatch y cerrar popover
    handleSaveWhatsapp({
      ...dataMensaje,
      idProspecto: selectedProspecto.idProspecto,
    });
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
        <h3 style={{ marginTop: 0, marginBottom: 2 }}>Nuevo Mensaje</h3>
        <Stack spacing={2}>
          <TextField
            label="Mensaje"
            value={dataMensaje.asunto}
            onChange={(e) => handleChange("asunto", e.target.value)}
            fullWidth
            multiline
            rows={5}
          />
        </Stack>
        <Box
          textAlign="right"
          mt={2}
          display="flex"
          gap={1}
          justifyContent="flex-end"
        >
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" color="success" onClick={handleSend}>
            Enviar mensaje
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

WhatsappForm.propTypes = {
  anchorEl: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleSaveWhatsapp: PropTypes.func.isRequired,
  selectedProspecto: PropTypes.object,
};

export default WhatsappForm;
