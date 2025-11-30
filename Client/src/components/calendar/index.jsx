import "./calendar.css";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "dayjs/locale/es";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import React, { useEffect, useState } from "react";
import { getCitas, obtenerCitasCalendar, setSource } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";

dayjs.locale("es");
dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_TIMEZONE = "America/Bogota";
dayjs.tz.setDefault(DEFAULT_TIMEZONE);

function Calendario() {
  const datos = JSON.parse(localStorage.getItem("loggedUser"));

  const filtroCita = JSON.parse(localStorage.getItem("filtroCita"));
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
    source === "google" ? state.citasCalendar : state.citas
  );
  const filtro = useSelector((state) => state.filtro);
  // const [citasId, setCitasId] = useState([]);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (source !== "google") {
      dispatch(getCitas());
    } else {
      console.log("Obteniendo citas de Google Calendar para:", datos.email);
      dispatch(obtenerCitasCalendar(datos.email) ); // mes actual
    }
  }, [dispatch, source, datos.email]);

  console.log("Citas: ", citas);

  // Adaptar eventos según el origen
  const events = citas
    ?.map((cita) => {
      if (source === "google") {
        // citas desde Google Calendar
        const startDateTime = dayjs.tz(cita.inicio, DEFAULT_TIMEZONE).toDate();
        const endDateTime = dayjs.tz(cita.fin, DEFAULT_TIMEZONE).toDate();

        return {
          start: startDateTime,
          end: endDateTime,
          title: cita.resumen,
          description: cita.descripcion || "No hay descripción",
        };
      } else {
        // citas desde tu backend local
        const fechaCita = dayjs.tz(cita.fechaCita, DEFAULT_TIMEZONE);
        const [hour, minute, second] = cita.horaCita.split(":").map(Number);

        if (
          !fechaCita.isValid() ||
          isNaN(hour) ||
          isNaN(minute) ||
          isNaN(second)
        ) {
          console.error("Fecha o hora inválida:", cita.fechaCita, cita.horaCita);
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
          start: startDateTime,
          end: endDateTime,
          title: cita.titulo,
          description: cita.descripcion || "No hay descripción",
        };
      }
    })
    .filter((event) => event !== null);

  // console.log("events", events);

  const handleSelectEvent = (event) => {
    setView("day");
    setDate(event.start);
  };

  const handleNavigate = (newDate) => {
  setDate(newDate);

  if (source === "google") {
    const mes = dayjs(newDate).month() + 1; // moment/dayjs usa 0-11
    console.log("Consultando citas de Google Calendar para mes:", mes);
    dispatch(obtenerCitasCalendar(datos.email, mes));
  } else {
    dispatch(getCitas());
  }
};

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <Calendar
        localizer={localizer}
        events={events}
        messages={messages}
        tooltipAccessor={(event) => event.description}
        onSelectEvent={handleSelectEvent}
        view={view}
        date={date}
        onNavigate={handleNavigate}
        onView={setView}
      />
    </div>
  );
}

export default Calendario;
