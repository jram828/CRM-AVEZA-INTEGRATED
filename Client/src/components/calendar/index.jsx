import "./calendar.css";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "dayjs/locale/es";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import {
  actualizarCitaGoogle,
  eliminarCita,
  getCitas,
  obtenerCitasCalendar,
  obtenerDisponibilidad,
} from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment";

dayjs.locale("es");
dayjs.extend(utc);
dayjs.extend(timezone);

const Calendario = () => {
  const datos = JSON.parse(localStorage.getItem("loggedUser"));
  const source = useSelector((state) => state.source);
  console.log("Fuente de datos para el calendario:", source);
  const horasDisponibles = useSelector((state) => state.horasDisponibles || []);
  const dispatch = useDispatch();
  const calendarId = import.meta.env.VITE_EMAIL_CALENDAR;

  const [cita, setCita] = useState({
    idCita: "",
    idCitaGoogle: "",
    titulo: "",
    descripcion: "",
    fechaCita: "",
    horaCita: "",
    idProspecto: "",
    cedulaCliente: "",
    // email: datos?.email || "",
    calendarID: calendarId,
  });

  // Traer disponibilidad desde Google cuando cambia la fecha
  useEffect(() => {
    if (source === "google" && cita.fechaCita !== "") {
      dispatch(obtenerDisponibilidad({ fecha: cita.fechaCita }));
    }
  }, [cita.fechaCita, dispatch, source]);

  console.log("Horas disponibles en Agendar Cita:", horasDisponibles);

  // Filtrar horas si la fecha seleccionada es hoy
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM
  const hoy = now.toISOString().split("T")[0];

  let horasFiltradas = horasDisponibles;

  if (cita.fechaCita && cita.fechaCita === hoy) {
    horasFiltradas = horasDisponibles.filter((hora) => {
      const horaMoment = moment(hora, "HH:mm");
      const currentMoment = moment(currentTime, "HH:mm");
      return horaMoment.isAfter(currentMoment);
    });
  }

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

  const citas = useSelector((state) =>
    source === "google" ? state.citasCalendar : state.citas,
  );
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (source !== "google") {
      dispatch(getCitas());
    } else {
      dispatch(obtenerCitasCalendar(calendarId));
    }
  }, [dispatch, source, calendarId]);
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
          idCita: cita?.extendedProperties?.private?.idCita,
          idProspecto: cita?.extendedProperties?.private?.idProspecto ||"",
          cedulaCliente: cita?.extendedProperties?.private?.cedulaCliente || "",
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
    setCita({
      ...cita,
      idCita: event.idCita || "",
      idCitaGoogle: event.idCitaGoogle || "",
      titulo: event.title,
      descripcion: event.description,
      fechaCita: dayjs(event.start).format("YYYY-MM-DD"),
      horaCita: dayjs(event.start).format("HH:mm"),
      email: datos?.email || "",
      calendarID: calendarId,
      idProspecto: event.idProspecto || "",
      cedulaCliente: event.cedulaCliente || "",  
    });
    setSelectedEvent(event);
  };

  const handleDeleteEvent = (event) => {
    console.log("Eliminar evento:", event);
    if (source === "google") {
      dispatch(
        eliminarCita(event.idCitaGoogle, event.idCita, calendarId),
      ).then(() => dispatch(obtenerCitasCalendar(calendarId))); // refrescar citas
    } else {
      dispatch(eliminarCita(event.idCita)).then(() => dispatch(getCitas())); // refrescar citas
    }
    setSelectedEvent(null);
  };

  const handleEditEvent = () => {
    const payload = { ...cita };
    console.log("Payload para actualizar:", payload);

    if (source === "google") {
      console.log("Actualizar evento en Google Calendar con payload:", payload);
      dispatch(actualizarCitaGoogle(payload)).then(() => dispatch(obtenerCitasCalendar(calendarId))); 
    } else {
      console.log("Actualizar evento en base de datos con payload:", payload);
      // dispatch(actualizarCita(payload));
    }

    setSelectedEvent(null);
  };
  console.log("Cita seleccionada para edición:", cita);
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
              value={cita.titulo}
              onChange={(e) => setCita({ ...cita, titulo: e.target.value })}
            />

            <TextField
              label="Descripción"
              fullWidth
              margin="dense"
              multiline
              rows={3}
              value={cita.descripcion}
              onChange={(e) =>
                setCita({ ...cita, descripcion: e.target.value })
              }
            />

            {/* Selector de fecha */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha"
                value={cita.fechaCita ? dayjs(cita.fechaCita) : null}
                onChange={(date) =>
                  setCita({
                    ...cita,
                    fechaCita: date ? dayjs(date).format("YYYY-MM-DD") : "",
                  })
                }
                format="DD/MM/YYYY"
              />
            </LocalizationProvider>

            {/* Selector de hora */}
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="hora-label">Hora</InputLabel>
              <Select
                value={cita.horaCita || ""}
                onChange={(e) =>
                  setCita({
                    ...cita,
                    horaCita: e.target.value,
                  })
                }
              >
                {/* Mostrar la hora actual de la cita como opción fija */}
                {cita.horaCita && (
                  <MenuItem value={cita.horaCita}>
                    {cita.horaCita} (actual)
                  </MenuItem>
                )}

                {/* Mostrar solo las horas filtradas disponibles */}
                {horasFiltradas?.map((hora) => (
                  <MenuItem key={hora} value={hora}>
                    {hora}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
              color="primary"
            >
              Eliminar
            </Button>
            <Button
              onClick={() => setSelectedEvent(null)}
              variant="contained"
              color="primary"
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Calendario;
