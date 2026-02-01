import axios from "axios";

export async function postCitaGoogleHandlers(data) {
  const {
    titulo,
    descripcion,
    fechaCita,
    horaCita,
    email,
    calendarId,
    nombres,
    apellidos,
    idProspecto,
  } = data;
  console.log("data del post", data);

  try {
    await axios.post("citas/google", {
      titulo,
      descripcion,
      fechaCita,
      horaCita,
      email,
      calendarId,
      nombres,
      apellidos,
      idProspecto,
    });

    // Crear contenedor
    const container = document.createElement("div");
    document.body.appendChild(container);

    const { createRoot } = await import("react-dom/client");
    const React = (await import("react")).default;
    const { Snackbar, Alert, Box, Typography } = await import("@mui/material");
    const CheckCircleIcon = (await import("@mui/icons-material/CheckCircle")).default;

    const root = createRoot(container);

    function SuccessUI() {
      const [open, setOpen] = React.useState(true);

      React.useEffect(() => {
        if (open) {
          const timer = setTimeout(() => {
            window.location.href = "https://aveza.co/cita_confirmada/";
          }, 4000);
          return () => clearTimeout(timer);
        }
      }, [open]);

      return (
        <>
          {/* Snackbar arriba */}
          <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={() => setOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setOpen(false)}
              severity="success"
              sx={{ width: "100%" }}
            >
              Se ha registrado la cita con éxito.
            </Alert>
          </Snackbar>

          {/* Overlay centrado */}
          {open && (
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                bgcolor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
            >
              <Box
                sx={{
                  bgcolor: "#fff",
                  p: 4,
                  borderRadius: 2,
                  textAlign: "center",
                  maxWidth: 400,
                  width: "90%",
                }}
              >
                <CheckCircleIcon
                  sx={{ fontSize: 60, color: "success.main", mb: 2 }}
                />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  ¡Gracias!
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Se ha confirmado su cita con Julián Avellaneda!
                </Typography>
                <Box sx={{ height: 16 }} />
                <Typography variant="h6">
                  Espere mientras le redirigimos...
                </Typography>
              </Box>
            </Box>
          )}
        </>
      );
    }

    // Renderizar JSX directamente
    root.render(<SuccessUI />);
  } catch (error) {
    console.error("Error al registrar la cita:", error.message);
  }
}