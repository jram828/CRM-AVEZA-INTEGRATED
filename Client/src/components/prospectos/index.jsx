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
  updateCalificacion,
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
import * as XLSX from "xlsx";

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
      lead: [],
      agendado: [],
      asesorado: [],
      cotizado: [],
      esperadocumentos: [],
      remarketing: [],
      descartado: [],
      contratoenviado: [],
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

  const handleResponsableChange = (idProspecto, newResponsable) => {
    setProspectos((prev) =>
      prev.map((p) =>
        p.idProspecto === idProspecto
          ? { ...p, responsable: newResponsable }
          : p,
      ),
    );
    dispatch(
      updateStatus({
        idProspecto: idProspecto,
        field: "responsable",
        value: newResponsable,
      }),
    );
  };

  const handleCalificacionChange = (idProspecto, newCalificacion) => {
    setProspectos((prev) =>
      prev.map((p) =>
        p.idProspecto === idProspecto
          ? { ...p, calificacion: newCalificacion }
          : p,
      ),
    );
    dispatch(
      updateCalificacion({
        idProspecto: idProspecto,
        field: "calificacion",
        value: newCalificacion,
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

  const iconMap = {
    calendar: CalendarTodayIcon,
    task: TaskIcon,
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

  const exportarExcel = () => {
    // Ordenar primero por fechaCreacion descendente (más reciente primero)
    const prospectosOrdenados = [...reduxProspectos].sort((a, b) => {
      const fechaA = new Date(a.fechaCreacion || 0);
      const fechaB = new Date(b.fechaCreacion || 0);
      return fechaB - fechaA; // descendente
    });

    const datos = prospectosOrdenados.map((prospecto) => {
      // Obtener la cita más próxima

      let reunionFecha = "";

      if (prospecto.Cita && prospecto.Cita.length > 0) {
        const ahora = new Date();
        const citaMasProxima = prospecto.Cita.map((c) => ({
          ...c,
          fecha: new Date(c.fechaCita),
          diff: Math.abs(new Date(c.fechaCita) - ahora),
        })).sort((a, b) => a.diff - b.diff)[0]; // la más cercana, pasada o futura

        if (citaMasProxima) {
          reunionFecha = citaMasProxima.fecha.toISOString().split("T")[0]; // formato aaaa-mm-dd
        }
      }

      // Obtener la tarea más próxima
      let tareaAsunto = "";
      let tareaFecha = "";

      if (prospecto.Tareas && prospecto.Tareas.length > 0) {
        const ahora = new Date();

        const tareaMasProxima = prospecto.Tareas.map((t) => ({
          ...t,
          fecha: new Date(t.fechaVencimiento),
          diff: Math.abs(new Date(t.fechaVencimiento) - ahora),
        })).sort((a, b) => a.diff - b.diff)[0]; // la más cercana en cualquier dirección

        if (tareaMasProxima) {
          tareaAsunto = tareaMasProxima.asunto;
          tareaFecha = tareaMasProxima.fecha.toISOString().split("T")[0];
        }
      }

      return {
        "Fecha Creación": prospecto.fechaCreacion
          ? new Date(prospecto.fechaCreacion).toLocaleDateString()
          : "",
        Estado: prospecto.status,
        Cedula: prospecto.cedulaProspecto,
        Apellidos: prospecto.apellidos,
        Nombres: prospecto.nombres,
        Celular: prospecto.celular,
        Email: prospecto.email,
        Direccion: prospecto.direccion,
        Ciudad: prospecto.Ciudads?.[0]?.nombre_ciudad || "",
        Servicio: prospecto.servicio || "",
        Fase: prospecto?.fase || "",
        Pasivo: prospecto?.totalDeudas || 0,
        Mora: prospecto?.tiempoMora || 0,
        Entidades: prospecto?.numeroEntidades || "",
        Activos: prospecto?.totalBienes || 0,
        Procesos: prospecto?.tieneProcesos || "No se ha registrado",
        Responsable: prospecto?.responsable || "",
        Fuente: prospecto?.fuente || "",
        "Fecha reunión": reunionFecha,
        Tarea: tareaAsunto,
        "Fecha tarea": tareaFecha,
        "Fecha de cierre": prospecto?.fechaCierre || "",
        Genero: prospecto?.genero || "",
        Descripción: prospecto.comentarios || "",
      };
    });

    const headers = [
      "Fecha Creación",
      "Estado",
      "Cedula",
      "Apellidos",
      "Nombres",
      "Celular",
      "Email",
      "Direccion",
      "Ciudad",
      "Servicio",
      "Fase",
      "Pasivo",
      "Mora",
      "Entidades",
      "Activos",
      "Procesos",
      "Responsable",
      "Fuente",
      "Fecha reunión",
      "Tarea",
      "Fecha tarea",
      "Fecha de cierre",
      "Genero",
      "Descripción",
    ];

    // Crear hoja de cálculo
    const hoja = XLSX.utils.json_to_sheet(datos, {
      header: headers,
    });

    hoja["!cols"] = headers.map((header) => {
      const maxLength = Math.max(
        header.length,
        ...datos.map((row) =>
          row[header] ? row[header].toString().length : 0,
        ),
      );
      return { wch: maxLength + 1 };
    });
    // Crear libro y añadir la hoja
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Prospectos");

    // Generar fecha en formato YYYY-MM-DD
    const fecha = new Date().toISOString().split("T")[0];

    // Descargar archivo
    XLSX.writeFile(libro, `prospectos_${fecha}.xlsx`);
  };

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
                const { iconType, color, tooltip, notaReciente } = prospecto;

                const IconComp = iconMap[iconType];

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
                          handleResponsableChange={handleResponsableChange}
                          handleCalificacionChange={handleCalificacionChange}
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
      <Box
        className="registroprospecto"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        {/* Lado izquierdo - SearchBar */}
        <Box flex="1 1 300px" minWidth={0}>
          <SearchBar onFilter={handleFilter} />
        </Box>

        {/* Lado derecho - Botones */}
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Link to="/registroprospecto" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary" size="small">
              Crear Prospecto
            </Button>
          </Link>

          <Button
            onClick={exportarExcel}
            variant="contained"
            color="primary"
            size="small"
          >
            Exportar
          </Button>

          {filterApplied && (
            <Button
              onClick={handleVerTodosClick}
              variant="outlined"
              size="small"
              color="primary"
            >
              Ver todos
            </Button>
          )}
        </Box>
      </Box>

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
              {renderColumn("1. Lead", "lead")}
              {renderColumn("2. Agendado", "agendado")}
              {renderColumn("3. Asesorado", "asesorado")}
              {renderColumn("4. Cotizado", "cotizado")}
              {renderColumn("5. Espera de documentos", "esperadocumentos")}
              {renderColumn("6. Contrato enviado", "contratoenviado")}
              {renderColumn("7. Remarketing", "remarketing")}
              {renderColumn("8. Descartado", "descartado")}
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
