import { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  Box,
} from "@mui/material";

const RegistroProspecto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    celular: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    // Aquí podrías enviar los datos a una API o procesarlos
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Formulario Básico
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Celular"
              name="celular"
              type="tel"
              value={formData.celular}
              onChange={handleChange}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!formData.nombre || !formData.email}
            >
              Enviar
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegistroProspecto;