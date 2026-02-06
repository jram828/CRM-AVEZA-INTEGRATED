import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  filterProspecto,
  getCitas,
  getNotas,
  getProspectos,
  getTareas,
  postCita,
  postNota,
  postTarea,
  prospectoActual,
  setSource,
  updateStatus,
  // updateProspectoStatus // ← Descomenta si tienes esta acción para backend
} from "../../redux/actions";
import { Button2, Button3 } from "../Mystyles";
import SearchBar from "../searchBarProspectos";
import loading from "../../assets/loading.gif";
import { Paper, Typography, Box, Popover, Button, Stack } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./prospectos.css";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TaskIcon from "@mui/icons-material/Task";
import TaskForm from "./taskForm";
import CitaForm from "./citaForm";
import WhatsappForm from "./whatsappForm";
import NotaForm from "./notaForm";
import ProspectoCard from "../prospectocard";

const Prospectos = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxProspectos = useSelector((state) => state.prospectos);
  const citas = useSelector((state) => state.citas);
  const tareas = useSelector((state) => state.tareas);
  const notas = useSelector((state) => state.notasDetail);
  // const pages = useSelector((state) => state.pages);

  console.log("Citas from Redux:", citas);
  console.log("Tareas from Redux:", tareas);
  console.log("Notas from Redux:", notas);
  console.log("Redux Prospectos:", reduxProspectos);
  const [filterApplied, setFilterApplied] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [prospectos, setProspectos] = useState([]);
  const [selectedProspecto, setSelectedProspecto] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // primer popover
  const [anchorNotaEl, setAnchorNotaEl] = useState(null); // Nota popover
  const [anchorTaskEl, setAnchorTaskEl] = useState(null); // Tarea popover
  const [anchorCitaEl, setAnchorCitaEl] = useState(null); // Cita popover
  const [anchorWhatsappEl, setAnchorWhatsappEl] = useState(null); // Cita popover

  const totalPages = Math.ceil(prospectos?.length / 12);

  // useEffect(() => {
  //   dispatch(getProspectoAllCasos());
  //   dispatch(setSource("prospecto"));
  // }, [dispatch]);

  // Cargar prospectos solo una vez al montar

  useEffect(() => {
    dispatch(getProspectos(currentPage));
    dispatch(setSource("prospecto"));
  }, [dispatch]);

  useEffect(() => {
    if (reduxProspectos && reduxProspectos.length > 0) {
      // cargar tareas y notas solo cuando haya prospectos
      dispatch(getTareas());
      dispatch(getCitas());
      dispatch(getNotas());
    }
  }, [dispatch, reduxProspectos.length]);

  useEffect(() => {
    if (reduxProspectos && Array.isArray(reduxProspectos)) {
      setProspectos(reduxProspectos);
    }
  }, [reduxProspectos]);

  const groupedProspectos = useMemo(() => {
    const groups = {
      sincontacto: [],
      contactoefectivo: [],
      contactonoefectivo: [],
      leadcalificado: [],
      leadnocalificado: [],
      nocaldescartado: [],
      cotizacionenevaluacion: [],
      contratoenevaluacion: [],
      cotizacionrechazada: [],
      documentacion: [],
      clienteactivo: [],
      remarketing: [],
      clienteprocesoactivo: [],
      fidelizacion: [],
      descartado: [],
    };

    prospectos.forEach((p) => {
      const key = p.status;
      if (groups[key]) {
        groups[key].push(p);
      }
    });

    return groups;
  }, [prospectos]);

  const handleVerTodosClick = () => {
    setCurrentPage(1);
    dispatch(getProspectos(1));
    setFilterApplied(false);
    setSearchPerformed(false);
  };

  const handleFilter = (filtro, inputValue) => {
    dispatch(filterProspecto(filtro, inputValue));
    setFilterApplied(true);
    setSearchPerformed(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleStatusChange = (idProspecto, newStatus) => {
    setProspectos((prev) =>
      prev.map((p) =>
        p.idProspecto === idProspecto ? { ...p, status: newStatus } : p,
      ),
    );
    dispatch(
      updateStatus({
        idProspecto: idProspecto,
        field: "status",
        value: newStatus,
      }),
    );
  };

  const handleOpenOverlay = (event, prospecto) => {
    setSelectedProspecto(prospecto);
    setAnchorEl(event.currentTarget); // el botón que disparó
  };

  const handleCloseOverlay = () => {
    setAnchorEl(null);
  };

  const handleOpenNotaPopover = (event) => {
    setAnchorNotaEl(event.currentTarget);
  };

  const handleOpenTaskPopover = (event) => {
    setAnchorTaskEl(event.currentTarget);
  };

  const handleOpenCitaPopover = (event) => {
    setAnchorCitaEl(event.currentTarget);
  };

  const handleOpenWhatsappPopover = (event) => {
    setAnchorWhatsappEl(event.currentTarget);
  };

  const handleCloseTaskForm = () => {
    setAnchorTaskEl(null);
  };
  const handleCloseNotaForm = () => {
    setAnchorNotaEl(null);
  };

  const handleCloseCitaForm = () => {
    setAnchorCitaEl(null);
  };

  const handleCloseWhatsappForm = () => {
    setAnchorWhatsappEl(null);
  };

  const handleSaveTask = (tarea) => {
    dispatch(postTarea(tarea)).then(() => {
      dispatch(getTareas());
      dispatch(getCitas());
    });
    handleCloseTaskForm();
  };

  const handleSaveNota = (nota) => {
    dispatch(postNota(nota)).then(() => {
      dispatch(getNotas());
    });
    handleCloseNotaForm();
  };

  const handleSaveCita = (cita) => {
    dispatch(postCita(cita)).then(() => {
      dispatch(getTareas());
      dispatch(getCitas());
    });
    handleCloseCitaForm();
  };

  const handleSaveWhatsapp = (cita) => {
    console.log("Enviando mensaje para prospecto:", selectedProspecto);
    // dispatch(postCita(cita));
    handleCloseWhatsappForm();
  };

  const onClickDetail = useCallback(
    (prospecto) => {
      dispatch(prospectoActual(prospecto));
      localStorage.setItem("prospecto", JSON.stringify(prospecto));
      navigate("/detail");
    },
    [dispatch, navigate],
  );

  const handleDragUpdate = (update) => {
    const container = document.querySelector(".divprospectos2");
    if (!container) return;

    const { destination } = update;
    if (!destination) return;

    const buffer = 100; // margen antes de activar scroll
    const scrollSpeed = 20;

    const { clientX } = update; // posición del mouse
    const { left, right } = container.getBoundingClientRect();

    if (clientX - left < buffer) {
      container.scrollLeft -= scrollSpeed; // scroll hacia la izquierda
    } else if (right - clientX < buffer) {
      container.scrollLeft += scrollSpeed; // scroll hacia la derecha
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const movedProspecto = prospectos.find(
      (p) => String(p.idProspecto) === draggableId,
    );
    if (!movedProspecto) return;

    if (movedProspecto.status === destination.droppableId) return; // ✅ evita updates innecesarios

    setProspectos((prev) =>
      prev.map((p) =>
        String(p.idProspecto) === draggableId
          ? { ...p, status: destination.droppableId }
          : p,
      ),
    );

    dispatch(
      updateStatus({
        idProspecto: draggableId,
        field: "status",
        value: destination.droppableId,
      }),
    );
  };

  const actividadPorProspecto = useMemo(() => {
    if (!prospectos || prospectos.length === 0) return {};

    const map = {};
    const now = new Date();

    prospectos.forEach((p) => {
      const pId = p.idProspecto;

      const citasP = (citas || [])
        .filter((c) => c?.Prospectos?.[0]?.idProspecto === pId)
        .map((c) => ({
          type: "cita",
          date: new Date(c.fechaCita),
          title: c.titulo,
        }));

      const tareasP = (tareas || [])
        .filter((t) => t?.Prospectos?.[0]?.idProspecto === pId)
        .map((t) => ({
          type: "tarea",
          date: new Date(t.fechaVencimiento),
          title: t.asunto,
        }));

      const combined = [...citasP, ...tareasP].filter((a) => !isNaN(a.date));

      if (combined.length === 0) return;

      const future = combined.filter((a) => a.date >= now);
      const past = combined.filter((a) => a.date < now);

      if (future.length > 0) {
        map[pId] = future.reduce((prev, curr) =>
          curr.date < prev.date ? curr : prev,
        );
      } else if (past.length > 0) {
        map[pId] = past.reduce((prev, curr) =>
          curr.date > prev.date ? curr : prev,
        );
      }
    });

    return map;
  }, [prospectos, citas, tareas]);

  const latestNoteByProspect = useMemo(() => {
    if (!prospectos || prospectos.length === 0) return {};
    if (!Array.isArray(notas) || notas.length === 0) return {};

    const map = {};
    notas.forEach((nota) => {
      const pId = nota?.Prospectos?.[0]?.idProspecto;
      if (!pId) return;

      // Solo considerar notas de prospectos cargados
      if (!prospectos.find((p) => p.idProspecto === pId)) return;

      const rawDate = nota.updatedAt || nota.createdAt;
      const date = new Date(rawDate);
      if (isNaN(date)) return;

      const ts = date.getTime();

      if (!map[pId] || ts > map[pId].ts) {
        map[pId] = { nota, date, ts };
      }
    });

    return map;
  }, [prospectos, notas]);

  // Propiedades del ícono según la fecha
  const getActivityIconProps = (activity) => {
    if (!activity)
      return { IconComp: null, color: "disabled", tooltip: "Sin actividad" };

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const activityStr = activity.date.toISOString().slice(0, 10);

    let color;
    if (activityStr < todayStr) {
      color = "error.main"; // rojo si ya pasó
    } else if (activityStr === todayStr) {
      color = "warning.main"; // amarillo si es hoy
    } else {
      color = "success.main"; // verde si es futura
    }

    if (activity.type === "cita") {
      return { IconComp: CalendarTodayIcon, color, tooltip: activity.title };
    }
    return { IconComp: TaskIcon, color, tooltip: activity.title };
  };

  const createAction = (type, event) => {
    if (!selectedProspecto) return;

    switch (type) {
      case "NOTA":
        handleCloseOverlay();
        handleOpenNotaPopover(event); // abre el segundo popover
        break;
      case "TAREA":
        handleCloseOverlay();
        handleOpenTaskPopover(event); // abre el segundo popover
        break;

      case "CITA":
        handleCloseOverlay();
        handleOpenCitaPopover(event); // abre el segundo popover
        break;

      case "WHATSAPP":
        // Si tienes un action específico, úsalo aquí.
        // Si no, puedes reutilizar postTarea con un tipo especial.
        handleCloseOverlay();
        handleOpenWhatsappPopover(event);
        break;

      default:
        break;
    }

    handleCloseOverlay();
  };

  // 👉 función que renderiza el popover del formulario

  const renderColumn = (title, statusKey) => (
    <div
      style={{
        minWidth: "300px",
        marginRight: "1rem",
        flexShrink: 0,
        flex: "0 0 320px",
      }}
    >
      <Paper
        elevation={3}
        style={{
          padding: "1rem",
          minHeight: "70vh",
          maxHeight: "70vh", // altura fija
          overflowY: "auto", // scroll vertical dentro de la columna
        }}
      >
        <Typography variant="h6" align="center" gutterBottom>
          {title}
        </Typography>
        <Droppable droppableId={statusKey}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ minHeight: "60vh" }}
            >
              {groupedProspectos[statusKey]?.map((prospecto, index) => {
                const latestActivity =
                  actividadPorProspecto[prospecto.idProspecto] ?? null;

                const { IconComp, color, tooltip } = getActivityIconProps(
                  latestActivity,
                );
                const notaReciente =
                  latestNoteByProspect[prospecto.idProspecto]?.nota;

                return (
                  <Draggable
                    key={String(prospecto.idProspecto)}
                    draggableId={String(prospecto.idProspecto)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          marginBottom: "1rem",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <ProspectoCard
                          prospecto={prospecto}
                          notaReciente={notaReciente}
                          IconComp={IconComp}
                          color={color}
                          tooltip={tooltip}
                          onClickDetail={onClickDetail}
                          handleStatusChange={handleStatusChange}
                          handleOpenOverlay={handleOpenOverlay}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Paper>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseOverlay}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2, bgcolor: "white" }}>
          <h3 style={{ marginTop: 0 }}>Crear actividad</h3>
          <Stack spacing={2}>
            <Button
              variant="contained"
              color="info"
              onClick={(e) => createAction("NOTA", e)}
            >
              Nota
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={(e) => createAction("TAREA", e)}
            >
              Tarea
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => createAction("CITA", e)}
            >
              Reunión
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={(e) => createAction("WHATSAPP", e)}
            >
              Mensaje por Whatsapp
            </Button>
          </Stack>
          <Box textAlign="right" mt={2}>
            <Button onClick={handleCloseOverlay}>Cerrar</Button>
          </Box>
        </Box>
      </Popover>
    </div>
  );

  return (
    <div className="contenedorlitigios">
      <div className="encabezado">
        <h1 className="titulo">Prospectos</h1>
      </div>
      <br />
      <div className="registroprospecto">
        <SearchBar onFilter={handleFilter} />
        <Link to="/registroprospecto">
          <Button sx={{ flex: 1 }} variant="contained">
            Crear Prospecto
          </Button>
        </Link>
        {filterApplied && (
          <Button onClick={handleVerTodosClick}>Ver todos</Button>
        )}
      </div>

      {!searchPerformed && (
        <div className="paginationprospectos">
          {currentPage > 1 && (
            <Button2 onClick={() => handlePageChange(currentPage - 1)}>
              &lt;&lt;
            </Button2>
          )}
          <Button3 className="paginaprospectos">Página {currentPage}</Button3>
          {currentPage < totalPages && (
            <Button2 onClick={() => handlePageChange(currentPage + 1)}>
              &gt;&gt;
            </Button2>
          )}
        </div>
      )}

      <div className="divprospectos2">
        {searchPerformed && prospectos.length === 0 && (
          <p>No hay coincidencias</p>
        )}
        {!searchPerformed && prospectos.length === 0 && (
          <div className="loading-container">
            <img className="loading-image" src={loading} alt="loading" />
          </div>
        )}

        {prospectos.length > 0 && (
          <DragDropContext
            onDragEnd={handleDragEnd}
            onDragUpdate={handleDragUpdate}
          >
            {/* contenedor con scroll horizontal */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
              }}
            >
              {renderColumn("1. Registrado sin contacto", "sincontacto")}
              {renderColumn("2. Contacto efectivo", "contactoefectivo")}
              {renderColumn("2. Contacto NO efectivo", "contactonoefectivo")}
              {renderColumn("3. Lead calificado", "leadcalificado")}
              {renderColumn(
                "3. Lead no calificado - Remarketing",
                "leadnocalificado",
              )}
              {renderColumn("4. No calificado - Descartado", "nocaldescartado")}
              {renderColumn(
                "5. Cotización en evaluación",
                "cotizacionenevaluacion",
              )}
              {renderColumn("5. Cotización rechazada", "cotizacionrechazada")}
              {renderColumn("6. Documentación", "documentacion")}
              {renderColumn(
                "7. Contrato en evaluación",
                "contratoenevaluacion",
              )}
              {renderColumn("8. Cliente activo", "clienteactivo")}
              {renderColumn("8. Remarketing", "remarketing")}
              {renderColumn(
                "8. Cliente con Proceso Activo",
                "clienteprocesoactivo",
              )}
              {renderColumn("9. Fidelización", "fidelizacion")}
              {renderColumn("10. Descartado", "descartado")}
            </div>
          </DragDropContext>
        )}
        <TaskForm
          open={Boolean(anchorTaskEl)}
          onClose={handleCloseTaskForm}
          onSave={handleSaveTask}
          selectedProspecto={selectedProspecto}
        />
        <NotaForm
          open={Boolean(anchorNotaEl)}
          onClose={handleCloseNotaForm}
          onSave={handleSaveNota}
          selectedProspecto={selectedProspecto}
        />

        <CitaForm
          open={Boolean(anchorCitaEl)}
          onClose={handleCloseCitaForm}
          onSave={handleSaveCita}
          selectedProspecto={selectedProspecto}
        />
        <WhatsappForm
          open={Boolean(anchorWhatsappEl)}
          onClose={handleCloseWhatsappForm}
          onSave={handleSaveWhatsapp}
          selectedProspecto={selectedProspecto}
        />
      </div>
    </div>
  );
};

export default Prospectos;
