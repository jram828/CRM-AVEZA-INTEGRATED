import axios from "axios";

export async function postTareaHandlers(data) {
  const {
    asunto,
    fechaVencimiento, 
    recordatorio,
    tipoRecordatorio,
    repetir,
    frecuencia,
    repeticiones,
  } = data;
  console.log("data del post", data);


  try {
    await axios.post('tareas', {
      asunto: `${asunto}`,
      fechaVencimiento: `${fechaVencimiento}`,
      recordatorio: `${recordatorio}`,
      tipoRecordatorio: `${tipoRecordatorio}`,
      repetir: `${repetir}`,
      frecuencia: `${frecuencia}`,
      repeticiones: `${repeticiones}`,
    });
    // mostrar un Snackbar de MUI en lugar de window.alert
    const container = document.createElement('div');
    document.body.appendChild(container);

    const { createRoot } = await import('react-dom/client');
    const React = (await import('react')).default;
    const { Snackbar, Alert } = await import('@mui/material');

    const root = createRoot(container);

    function AlertWrapper() {
      const [open, setOpen] = React.useState(true);

      React.useEffect(() => {
        if (!open) {
          // limpiar el DOM después de cerrar
          setTimeout(() => {
            try {
              root.unmount();
            } finally {
              container.remove();
            }
          }, 200);
        }
      }, [open]);

      return React.createElement(
        Snackbar,
        {
          open,
          autoHideDuration: 2000,
          onClose: () => setOpen(false),
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        },
        React.createElement(
          Alert,
          { onClose: () => setOpen(false), severity: 'success', sx: { width: '100%' } },
          'Se ha registrado la tarea con éxito.'
        )
      );
    }

    root.render(React.createElement(AlertWrapper));
  } catch (error) {
    // window.alert("No fue posible registrar la cita.");
  }
}