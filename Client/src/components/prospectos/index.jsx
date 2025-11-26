import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  filterProspecto,
  getProspectoAllCasos,
  getProspectos,
  prospectoActual,
  setSource,
  updateStatus,
  // updateProspectoStatus // ← Descomenta si tienes esta acción para backend
} from "../../redux/actions";
import { Button, Button2, Button3 } from "../Mystyles";
import SearchBar from "../searchBarProspectos";
import loading from "../../assets/loading.gif";
import {
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  Card,
  CardContent,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./prospectos.css";
import "../../App.css";
import { useNavigate } from "react-router-dom";

const Prospectos = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxProspectos = useSelector((state) => state.prospectos);
  // const pages = useSelector((state) => state.pages);

  console.log("Redux Prospectos:", reduxProspectos);
  const [filterApplied, setFilterApplied] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [prospectos, setProspectos] = useState([]);

  const totalPages = Math.ceil(prospectos?.length / 12);

  // useEffect(() => {
  //   dispatch(getProspectoAllCasos());
  //   dispatch(setSource("prospecto"));
  // }, [dispatch]);

  useEffect(() => {
    dispatch(getProspectos(currentPage));
    dispatch(setSource("prospecto"));
  }, [dispatch, currentPage]);

  useEffect(() => {
    setProspectos(reduxProspectos);
  }, [reduxProspectos]);

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
        p.idProspecto === idProspecto ? { ...p, status: newStatus } : p
      )
    );
   dispatch(
      updateStatus({
        idProspecto: idProspecto,
        field: "status",
        value: newStatus,
      })
    )

  };

  const groupedProspectos = {
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
    if (groupedProspectos[p.status]) {
      groupedProspectos[p.status].push(p);
    }
  });

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
      (p) => String(p.idProspecto) === draggableId
    );
    if (!movedProspecto) return;

    const updatedProspectos = prospectos?.map((p) =>
      String(p.idProspecto) === draggableId
        ? { ...p, status: destination.droppableId }
        : p
    );

    // Si cambió de columna
    if (destination.droppableId !== source.droppableId) {
      dispatch(
        updateStatus({
          idProspecto: draggableId, // el id de la card
          field: "status",
          value: destination.droppableId, // la nueva columna
        })
      );
    }
    setProspectos(updatedProspectos);

    // dispatch(updateProspectoStatus(draggableId, destination.droppableId)); // ← Aquí iría la llamada al backend
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
              {groupedProspectos[statusKey]?.map((prospecto, index) => (
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
                        ...provided.draggableProps.style,
                      }}
                    >
                      <CardContent>
                        <Link
                          to={"/detail"}
                          onClick={() => onClickDetail(prospecto)}
                          className="link"
                        >
                          <Typography variant="subtitle1">
                            {prospecto.nombres} {prospecto.apellidos}
                          </Typography>
                          <Typography variant="subtitle2">
                            {prospecto.email}
                          </Typography>
                          <Typography variant="subtitle2">
                            {prospecto.celular}
                          </Typography>
                        </Link>
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
                                e.target.value
                              )
                            }
                          >
                            <MenuItem value="sininiciar">🔵 Sin iniciar</MenuItem>
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
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Paper>
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
          <Button>Crear Prospecto</Button>
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
                "nuevointentoseg1"
              )}
              {renderColumn(
                "Nuevo Intento - Seguimiento 2",
                "nuevointentoseg2"
              )}
              {renderColumn("Nunca hubo contacto", "nocontacto")}
              {renderColumn("Asesoría agendada", "asesoriaag")}
              {renderColumn("Asesoría en reagendamiento", "asesoriaenreag")}
              {renderColumn("No se logró primera asesoria", "noasesoria")}
              {renderColumn(
                "No calificado después de asesoría",
                "nocalificado"
              )}
              {renderColumn(
                "Calificado | En espera de documentos",
                "calificado"
              )}
              {renderColumn("Cotización o espera de contrato", "cotizacion")}
            </div>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default Prospectos;
