import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  filterProspecto,
  getCitas,
  getProspectos,
  getTareas,
  postCita,
  postTarea,
  prospectoActual,
  setSource,
  updateStatus,
  // updateProspectoStatus // ← Descomenta si tienes esta acción para backend
} from "../../redux/actions";
import { Button2, Button3 } from "../Mystyles";
import SearchBar from "../searchBarProspectos";
import loading from "../../assets/loading.gif";
import {
  Paper,
  Typography,
  Select,
  MenuItem,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Tooltip,
  IconButton,
  Box,
  Popover,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./prospectos.css";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TaskIcon from "@mui/icons-material/Task";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TaskForm from "./taskForm";
import CitaForm from "./citaForm";
import WhatsappForm from "./whatsappForm";

const Prospectos = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxProspectos = useSelector((state) => state.prospectos);
  const citas = useSelector((state) => state.citas);
  const tareas = useSelector((state) => state.tareas);
  // const pages = useSelector((state) => state.pages);

  console.log("Citas from Redux:", citas);
  console.log("Tareas from Redux:", tareas);

  console.log("Redux Prospectos:", reduxProspectos);
  const [filterApplied, setFilterApplied] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [prospectos, setProspectos] = useState([]);
  const [selectedProspecto, setSelectedProspecto] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // primer popover
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
    dispatch(getTareas());
    dispatch(getCitas());
  }, [dispatch]); // 👈 solo una vez

  useEffect(() => {
    if (reduxProspectos && Array.isArray(reduxProspectos)) {
      setProspectos(reduxProspectos);
    }
  }, [reduxProspectos]);

  const groupedProspectos = useMemo(() => {
    const groups = {
      sininiciar: [],
      intentodecontacto: [],
      nuevointentoseg1: [],
      nuevointentoseg2: [],
      asesoriaag: [],
      asesoriaenreag: [],
      noasesoria: [],
      nocalificado: [],
      calificado: [],
      cotizacion: [],
      nocontacto: [],
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

  const onClickDetail = (prospecto) => {
    dispatch(prospectoActual(prospecto));
    window.localStorage.setItem("prospecto", JSON.stringify(prospecto));
    navigate("/detail");
  };
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

    const updatedProspectos = prospectos?.map((p) =>
      String(p.idProspecto) === draggableId
        ? { ...p, status: destination.droppableId }
        : p,
    );

    // Si cambió de columna
    if (destination.droppableId !== source.droppableId) {
      dispatch(
        updateStatus({
          idProspecto: draggableId, // el id de la card
          field: "status",
          value: destination.droppableId, // la nueva columna
        }),
      );
    }
    setProspectos(updatedProspectos);

    // dispatch(updateProspectoStatus(draggableId, destination.droppableId)); // ← Aquí iría la llamada al backend
  };

  // Get latest activity (cita or tarea) for this prospect
  const getLatestActivity = (prospecto, citas, tareas) => {
    const pId = prospecto.idProspecto;
    const now = new Date();

    const citasForProspect = citas
      .filter((c) => c?.Prospectos[0]?.idProspecto === pId)
      .map((c) => ({
        type: "cita",
        date: new Date(c.fechaCita),
        title: c.titulo,
      }));

    const tareasForProspect = tareas
      .filter((t) => t?.Prospectos[0]?.idProspecto === pId)
      .map((t) => ({
        type: "tarea",
        date: new Date(t.fechaVencimiento),
        title: t.asunto,
      }));

    const combined = [...citasForProspect, ...tareasForProspect].filter(
      (a) => !isNaN(a.date),
    );

    if (combined.length === 0) return null;

    // separar pasadas y futuras
    const past = combined.filter((a) => a.date < now);
    const future = combined.filter((a) => a.date >= now);

    if (future.length > 0) {
      // devolver la más cercana en el futuro
      future.sort((a, b) => a.date - b.date);
      return future[0];
    } else if (past.length > 0) {
      // devolver la más reciente en el pasado
      past.sort((a, b) => b.date - a.date);
      return past[0];
    }
    return null;
  };

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


  const createAction = (type) => {
    if (!selectedProspecto) return;

    switch (type) {
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
                const latestActivity = getLatestActivity(
                  prospecto,
                  citas,
                  tareas,
                );
                const { IconComp, color, tooltip } = getActivityIconProps(
                  latestActivity,
                );

                return (
                  <Draggable
                    key={String(prospecto.idProspecto)}
                    draggableId={String(prospecto.idProspecto)}
                    index={index}
                  >
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          marginBottom: "1rem",
                          backgroundColor: "#f9f9f9",
                          position: "relative",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <CardContent
                          sx={{ position: "relative", paddingTop: 4 }}
                        >
                          {/* Íconos esquina superior derecha */}
                          <Box
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              display: "flex",
                              gap: 1,
                            }}
                          >
                            {IconComp ? (
                              <Tooltip title={tooltip}>
                                <IconButton
                                  size="small"
                                  aria-label="actividad más reciente"
                                >
                                  <IconComp sx={{ color }} fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Sin actividad">
                                <IconButton
                                  size="small"
                                  aria-label="sin actividad"
                                  disabled
                                >
                                  <CalendarTodayIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Divider orientation="horizontal" flexItem />
                            <Tooltip title="Crear actividad">
                              <IconButton
                                size="small"
                                aria-label="crear actividad"
                                onClick={(e) => handleOpenOverlay(e, prospecto)}
                              >
                                <AddCircleOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>

                          {/* Link y datos */}
                          <Link
                            to={"/detail"}
                            onClick={() => onClickDetail(prospecto)}
                            className="link"
                          >
                            <Typography variant="subtitle1">
                              {prospecto.nombres} {prospecto.apellidos}
                            </Typography>
                          </Link>
                          <Typography variant="subtitle2">
                            {prospecto.email}
                          </Typography>
                          <Typography variant="subtitle2">
                            {prospecto.celular}
                          </Typography>

                          {/* Selector de status */}
                          <FormControl
                            fullWidth
                            size="small"
                            style={{ marginTop: "0.5rem" }}
                          >
                            <InputLabel>Status</InputLabel>
                            <Select
                              value={prospecto.status}
                              label="Status"
                              onChange={(e) =>
                                handleStatusChange(
                                  prospecto.idProspecto,
                                  e.target.value,
                                )
                              }
                            >
                              <MenuItem value="sininiciar">
                                🔵 Sin iniciar
                              </MenuItem>
                              <MenuItem value="intentodecontacto">
                                📞Intento de contacto
                              </MenuItem>
                              <MenuItem value="nuevointentoseg1">
                                📞🟡Nuevo Intento - Seguimiento 1
                              </MenuItem>
                              <MenuItem value="nuevointentoseg2">
                                📞🟠Nuevo Intento - Seguimiento 2
                              </MenuItem>
                              <MenuItem value="nocontacto">
                                ❌Nunca hubo contacto
                              </MenuItem>
                              <MenuItem value="asesoriaag">
                                🗓️Asesoría agendada
                              </MenuItem>
                              <MenuItem value="asesoriaenreag">
                                🔄Asesoría en reagendamiento
                              </MenuItem>
                              <MenuItem value="noasesoria">
                                ⚠️No se logró primera asesoria
                              </MenuItem>
                              <MenuItem value="nocalificado">
                                🚫No calificado después de asesoría
                              </MenuItem>
                              <MenuItem value="calificado">
                                📄Calificado | En espera de documentos
                              </MenuItem>
                              <MenuItem value="cotizacion">
                                💰Cotización o espera de contrato
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </CardContent>
                      </Card>
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
              color="primary"
              onClick={() => createAction("TAREA")}
            >
              Tarea
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => createAction("CITA")}
            >
              Reunión
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => createAction("WHATSAPP")}
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
              {renderColumn("Sin iniciar", "sininiciar")}
              {renderColumn("Intento de contacto", "intentodecontacto")}
              {renderColumn(
                "Nuevo Intento - Seguimiento 1",
                "nuevointentoseg1",
              )}
              {renderColumn(
                "Nuevo Intento - Seguimiento 2",
                "nuevointentoseg2",
              )}
              {renderColumn("Nunca hubo contacto", "nocontacto")}
              {renderColumn("Asesoría agendada", "asesoriaag")}
              {renderColumn("Asesoría en reagendamiento", "asesoriaenreag")}
              {renderColumn("No se logró primera asesoria", "noasesoria")}
              {renderColumn(
                "No calificado después de asesoría",
                "nocalificado",
              )}
              {renderColumn(
                "Calificado | En espera de documentos",
                "calificado",
              )}
              {renderColumn("Cotización o espera de contrato", "cotizacion")}
              {/* 👉 aquí se renderiza el formulario aislado */}
            </div>
          </DragDropContext>
        )}

        <TaskForm
          open={Boolean(anchorTaskEl)}
          onClose={handleCloseTaskForm}
          onSave={handleSaveTask}
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
