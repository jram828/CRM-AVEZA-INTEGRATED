import "./calendar.css";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "dayjs/locale/es";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import {
  eliminarCita,
  getCitas,
  obtenerCitasCalendar,
} from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";

dayjs.locale("es");
dayjs.extend(utc);
dayjs.extend(timezone);

const Calendario = () => {
  const datos = JSON.parse(localStorage.getItem("loggedUser"));
  const source = useSelector((state) => state.source);
  const messages = {
    allDay: "Todo el día",
    previous: "Anterior",
    next: "Siguiente",
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    date: "Fecha",
    time: "Hora",
    event: "Evento",
  };

  const localizer = dayjsLocalizer(dayjs);
  const dispatch = useDispatch();
  const citas = useSelector((state) =>
    source === "google" ? state.citasCalendar : state.citas,
  );
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const calendarId = "aveza.asesoria@gmail.com";

  useEffect(() => {
    if (source !== "google") {
      dispatch(getCitas());
    } else {
      dispatch(obtenerCitasCalendar(calendarId));
    }
  }, [dispatch, source, datos.email]);
  console.log("Citas en calendario:", citas);
  const events = citas
    ?.map((cita) => {
      if (source === "google") {
        const startDateTime = new Date(cita.inicio);
        const endDateTime = new Date(cita.fin);

        return {
          idCitaGoogle: cita.id,
          start: startDateTime,
          end: endDateTime,
          title: cita.resumen,
          description: cita.descripcion || "No hay descripción",
          idCita: cita.extendedProperties?.private?.idCita,
        };
      } else {
        const fechaCita = dayjs(cita.fechaCita);
        const [hour, minute, second] = cita.horaCita.split(":").map(Number);

        if (
          !fechaCita.isValid() ||
          isNaN(hour) ||
          isNaN(minute) ||
          isNaN(second)
        ) {
          console.error(
            "Fecha o hora inválida:",
            cita.fechaCita,
            cita.horaCita,
          );
          return null;
        }

        const startDateTime = fechaCita
          .set("hour", hour)
          .set("minute", minute)
          .set("second", 0)
          .set("millisecond", 0)
          .toDate();

        const endDateTime = dayjs(startDateTime).add(30, "minute").toDate();

        return {
          idCita: cita.idCita,
          start: startDateTime,
          end: endDateTime,
          title: cita.resumen,
          description: cita.descripcion || "No hay descripción",
        };
      }
    })
    .filter((event) => event !== null);

  const handleNavigate = (newDate) => {
    setDate(newDate);
    if (source === "google") {
      const mes = dayjs(newDate).month() + 1;
      dispatch(obtenerCitasCalendar(calendarId, mes));
    } else {
      dispatch(getCitas());
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setEditTitle(event.title);
    setEditDescription(event.description);
  };

const handleDeleteEvent = (event) => {
  console.log("Eliminar evento:", event);
  if (source === "google") {
    dispatch(eliminarCita(event.idCitaGoogle, event.idCita, calendarId))
      .then(() => dispatch(obtenerCitasCalendar(calendarId))); // refrescar citas
  } else {
    dispatch(eliminarCita(event.idCita))
      .then(() => dispatch(getCitas())); // refrescar citas
  }
  setSelectedEvent(null);
};


  const handleEditEvent = () => {
    // Aquí despacharías la acción de edición con los nuevos valores
    console.log("Guardar cambios:", {
      ...selectedEvent,
      title: editTitle,
      description: editDescription,
    });
    setSelectedEvent(null);
  };

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <Calendar
        localizer={localizer}
        events={events}
        messages={messages}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        tooltipAccessor={(event) => event.description}
        onSelectEvent={handleSelectEvent}
        view={view}
        date={date}
        onNavigate={handleNavigate}
        onView={setView}
      />

      {selectedEvent && (
        <Dialog open={true} onClose={() => setSelectedEvent(null)} fullWidth>
          <DialogTitle>Detalle de la cita</DialogTitle>
          <DialogContent>
            <TextField
              label="Título"
              fullWidth
              margin="dense"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <TextField
              label="Descripción"
              fullWidth
              margin="dense"
              multiline
              rows={3}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <Typography variant="body2" sx={{ mt: 2 }}>
              <strong>Inicio:</strong> {selectedEvent.start.toString()}
            </Typography>
            <Typography variant="body2">
              <strong>Fin:</strong> {selectedEvent.end.toString()}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleEditEvent}
              variant="contained"
              color="primary"
            >
              Guardar cambios
            </Button>
            <Button
              onClick={() => handleDeleteEvent(selectedEvent)}
              variant="outlined"
              color="error"
            >
              Eliminar
            </Button>
            <Button onClick={() => setSelectedEvent(null)} variant="text">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Calendario;
