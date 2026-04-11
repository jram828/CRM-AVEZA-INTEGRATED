import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import {
  filterCliente,
  getCitas,
  getNotas,
  getClientes,
  getTareas,
  postCita,
  postNota,
  postTarea,
  clienteActual,
  setSource,
  updateClienteStatus,
  updateClienteFase,
} from "../../redux/actions";
import { Button2, Button3 } from "../Mystyles";
import SearchBar from "../searchBarClientes";
import loading from "../../assets/loading.gif";
import { Paper, Typography, Box, Popover, Button, Stack } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./clientes.css";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TaskIcon from "@mui/icons-material/Task";
import TaskForm from "./taskForm";
import CitaForm from "./citaForm";
import WhatsappForm from "./whatsappForm";
import NotaForm from "./notaForm";
import ClienteCard from "../clientecard";
import * as XLSX from "xlsx";

const Clientes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxClientes = useSelector((state) => state.clientes);
  const citas = useSelector((state) => state.citas);
  const tareas = useSelector((state) => state.tareas);
  const notas = useSelector((state) => state.notasDetail);
  // const pages = useSelector((state) => state.pages);

  console.log("Citas from Redux:", citas);
  console.log("Tareas from Redux:", tareas);
  console.log("Notas from Redux:", notas);
  console.log("Redux Clientes:", reduxClientes);
  const [filterApplied, setFilterApplied] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // primer popover
  const [anchorNotaEl, setAnchorNotaEl] = useState(null); // Nota popover
  const [anchorTaskEl, setAnchorTaskEl] = useState(null); // Tarea popover
  const [anchorCitaEl, setAnchorCitaEl] = useState(null); // Cita popover
  const [anchorWhatsappEl, setAnchorWhatsappEl] = useState(null); // Cita popover

  const totalPages = Math.ceil(clientes?.length / 12);

  // useEffect(() => {
  //   dispatch(getClienteAllCasos());
  //   dispatch(setSource("cliente"));
  // }, [dispatch]);

  // Cargar clientes solo una vez al montar

  useEffect(() => {
    dispatch(getClientes(currentPage));
    dispatch(setSource("cliente"));
  }, [dispatch]);

  useEffect(() => {
    if (reduxClientes && reduxClientes.length > 0) {
      // cargar tareas y notas solo cuando haya clientes
      dispatch(getTareas());
      dispatch(getCitas());
      dispatch(getNotas());
    }
  }, [dispatch, reduxClientes.length]);

  useEffect(() => {
    if (reduxClientes && Array.isArray(reduxClientes)) {
      setClientes(reduxClientes);
    }
  }, [reduxClientes]);

  const groupedClientes = useMemo(() => {
    const groups = {
      // cotizacionenevaluacion: [],
      // contratoenevaluacion: [],
      // cotizacionrechazada: [],
      // documentacion: [],
      // clienteactivo: [],
      // remarketing: [],
      // clienteprocesoactivo: [],
      // fidelizacion: [],
      // descartado: [],
      necesitaanalisis: [],
      propuestavalor: [],
      identificarresponsables: [],
      cotizacion: [],
      negociacion: [],
    };

    clientes.forEach((p) => {
      const key = p.fase;
      if (groups[key]) {
        groups[key].push(p);
      }
    });

    return groups;
  }, [clientes]);

  const handleVerTodosClick = () => {
    setCurrentPage(1);
    dispatch(getClientes(1));
    setFilterApplied(false);
    setSearchPerformed(false);
  };

  const handleFilter = (filtro, inputValue) => {
    dispatch(filterCliente(filtro, inputValue));
    setFilterApplied(true);
    setSearchPerformed(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleStatusChange = (cedulaCliente, newStatus) => {
    setClientes((prev) =>
      prev.map((p) =>
        p.cedulaCliente === cedulaCliente ? { ...p, status: newStatus } : p,
      ),
    );
    dispatch(
      updateClienteStatus({
        cedulaCliente: cedulaCliente,
        field: "status",
        value: newStatus,
      }),
    );
  };

  const handleResponsableChange = (cedulaCliente, newResponsable) => {
    setClientes((prev) =>
      prev.map((p) =>
        p.cedulaCliente === cedulaCliente
          ? { ...p, responsable: newResponsable }
          : p,
      ),
    );
    dispatch(
      updateClienteStatus({
        cedulaCliente: cedulaCliente,
        field: "responsable",
        value: newResponsable,
      }),
    );
  };

  const handleFaseChange = (cedulaCliente, newFase) => {
    setClientes((prev) =>
      prev.map((p) =>
        p.cedulaCliente === cedulaCliente ? { ...p, fase: newFase } : p,
      ),
    );
    dispatch(
      updateClienteFase({
        cedulaCliente: cedulaCliente,
        field: "fase",
        value: newFase,
      }),
    );
  };

  const handleOpenOverlay = (event, cliente) => {
    setSelectedCliente(cliente);
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
    console.log("Enviando mensaje para cliente:", selectedCliente);
    // dispatch(postCita(cita));
    handleCloseWhatsappForm();
  };

  const onClickDetail = useCallback(
    (cliente) => {
      dispatch(clienteActual(cliente));
      localStorage.setItem("cliente", JSON.stringify(cliente));
      navigate("/detail");
    },
    [dispatch, navigate],
  );

  const handleDragUpdate = (update) => {
    const container = document.querySelector(".divclientes2");
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

    const movedCliente = clientes.find(
      (p) => String(p.cedulaCliente) === draggableId,
    );
    if (!movedCliente) return;

    if (movedCliente.fase === destination.droppableId) return; // ✅ evita updates innecesarios

    setClientes((prev) =>
      prev.map((p) =>
        String(p.cedulaCliente) === draggableId
          ? { ...p, fase: destination.droppableId }
          : p,
      ),
    );

    dispatch(
      updateClienteFase({
        cedulaCliente: draggableId,
        field: "fase",
        value: destination.droppableId,
      }),
    );
  };

  const createAction = (type, event) => {
    if (!selectedCliente) return;

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
    // Seleccionar solo las propiedades requeridas y en el orden correcto
    const datos = reduxClientes.map((cliente) => {
      // Obtener la cita más próxima

      let reunionFecha = "";

      if (cliente.Citas && cliente.Citas.length > 0) {
        const ahora = new Date();
        const citaMasProxima = cliente.Citas.map((c) => ({
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

      if (cliente.Tareas && cliente.Tareas.length > 0) {
        const ahora = new Date();

        const tareaMasProxima = cliente.Tareas.map((t) => ({
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
        "Fecha Creación": cliente.fechaCreacion
          ? new Date(cliente.fechaCreacion).toLocaleDateString()
          : "",
        Estado: cliente.status,
        Cedula: cliente.cedulaCliente,
        Apellidos: cliente.apellidos,
        Nombres: cliente.nombres,
        Celular: cliente.celular,
        Email: cliente.email,
        Direccion: cliente.direccion,
        Ciudad: cliente.Ciudads?.[0]?.nombre_ciudad || "",
        Servicio: cliente.servicio || "",
        Fase: cliente?.fase || "",
        Pasivo: cliente?.totalDeudas || 0,
        Mora: cliente?.tiempoMora || 0,
        Entidades: cliente?.numeroEntidades || 0,
        Activos: cliente?.totalBienes || 0,
        Procesos: cliente?.tieneProcesos || "No se ha registrado",
        Responsable: cliente?.responsable || "",
        Fuente: cliente?.fuente || "",
        "Fecha reunión": reunionFecha,
        Tarea: tareaAsunto,
        "Fecha tarea": tareaFecha,
        "Fecha de cierre": "",
        Genero: cliente?.genero || "",
        Descripción: cliente.comentarios || "",
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
    XLSX.utils.book_append_sheet(libro, hoja, "Clientes");

    // Generar fecha en formato YYYY-MM-DD
    const fecha = new Date().toISOString().split("T")[0];

    // Descargar archivo
    XLSX.writeFile(libro, `clientes_${fecha}.xlsx`);
  };

  const renderColumn = (title, faseKey) => (
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
        <Droppable droppableId={faseKey}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ minHeight: "60vh" }}
            >
              {groupedClientes[faseKey]?.map((cliente, index) => {
                const { iconType, color, tooltip, notaReciente } = cliente;

                const IconComp = iconMap[iconType];

                return (
                  <Draggable
                    key={String(cliente.cedulaCliente)}
                    draggableId={String(cliente.cedulaCliente)}
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
                        <ClienteCard
                          cliente={cliente}
                          notaReciente={notaReciente}
                          IconComp={IconComp}
                          color={color}
                          tooltip={tooltip}
                          onClickDetail={onClickDetail}
                          handleStatusChange={handleStatusChange}
                          handleResponsableChange={handleResponsableChange}
                          handleFaseChange={handleFaseChange}
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
        <h1 className="titulo">Clientes</h1>
      </div>
      <br />

      <Box
        className="registrocliente"
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
          <Link to="/registrocliente" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary" size="small">
              Crear Cliente
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
        <div className="paginationclientes">
          {currentPage > 1 && (
            <Button2 onClick={() => handlePageChange(currentPage - 1)}>
              &lt;&lt;
            </Button2>
          )}
          <Button3 className="paginaclientes">Página {currentPage}</Button3>
          {currentPage < totalPages && (
            <Button2 onClick={() => handlePageChange(currentPage + 1)}>
              &gt;&gt;
            </Button2>
          )}
        </div>
      )}

      <div className="divclientes2">
        {searchPerformed && clientes.length === 0 && (
          <p>No hay coincidencias</p>
        )}
        {!searchPerformed && clientes.length === 0 && (
          <div className="loading-container">
            <img className="loading-image" src={loading} alt="loading" />
          </div>
        )}

        {clientes.length > 0 && (
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
              {renderColumn("1. Necesita análisis", "necesitaanalisis")}
              {renderColumn("2. Propuesta de valor", "propuestavalor")}
              {renderColumn(
                "3. Identificar responsables",
                "identificarresponsables",
              )}
              {renderColumn(
                "4. Cotización de propuesta / precio",
                "cotizacion",
              )}
              {renderColumn("5. Negociación / revisión", "negociacion")}
            </div>
          </DragDropContext>
        )}
        <TaskForm
          open={Boolean(anchorTaskEl)}
          onClose={handleCloseTaskForm}
          onSave={handleSaveTask}
          selectedCliente={selectedCliente}
        />
        <NotaForm
          open={Boolean(anchorNotaEl)}
          onClose={handleCloseNotaForm}
          onSave={handleSaveNota}
          selectedCliente={selectedCliente}
        />

        <CitaForm
          open={Boolean(anchorCitaEl)}
          onClose={handleCloseCitaForm}
          onSave={handleSaveCita}
          selectedCliente={selectedCliente}
        />
        <WhatsappForm
          open={Boolean(anchorWhatsappEl)}
          onClose={handleCloseWhatsappForm}
          onSave={handleSaveWhatsapp}
          selectedCliente={selectedCliente}
        />
      </div>
    </div>
  );
};

export default Clientes;
