import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  filterProspecto,
  getProspectoAllCasos,
  getProspectos,
  setSource,
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
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import "./prospectos.css";
import "../../App.css";

const Prospectos = () => {
  const dispatch = useDispatch();
  const reduxProspectos = useSelector((state) => state.prospectos);
  const pages = useSelector((state) => state.pages);

  const [filterApplied, setFilterApplied] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [prospectos, setProspectos] = useState([]);

  const totalPages = Math.ceil(pages?.length / 12);

  useEffect(() => {
    dispatch(getProspectoAllCasos());
    dispatch(setSource("prospecto"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getProspectos(currentPage));
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

  const handleStatusChange = (cedula, newStatus) => {
    setProspectos((prev) =>
      prev.map((p) =>
        p.cedula === cedula ? { ...p, status: newStatus } : p
      )
    );
    // dispatch(updateProspectoStatus(cedula, newStatus)); // ← Aquí iría la llamada al backend
  };

  const groupedProspectos = {
    contactado: [],
    tieneCotizacion: [],
    cotizacionAprobada: [],
  };

  prospectos.forEach((p) => {
    if (groupedProspectos[p.status]) {
      groupedProspectos[p.status].push(p);
    }
  });

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const movedProspecto = prospectos.find((p) => p.cedula === draggableId);
    if (!movedProspecto) return;

    const updatedProspectos = prospectos.map((p) =>
      p.cedula === draggableId ? { ...p, status: destination.droppableId } : p
    );
    setProspectos(updatedProspectos);

    // dispatch(updateProspectoStatus(draggableId, destination.droppableId)); // ← Aquí iría la llamada al backend
  };

  const renderColumn = (title, statusKey) => (
    <Grid item xs={12} md={4}>
      <Paper elevation={3} style={{ padding: "1rem", minHeight: "70vh" }}>
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
              {groupedProspectos[statusKey].map((prospecto, index) => (
                <Draggable
                  key={prospecto.cedula}
                  draggableId={prospecto.cedula}
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
                        <Typography variant="subtitle1">
                          {prospecto.nombres} {prospecto.apellidos}
                        </Typography>
                        <FormControl fullWidth size="small" style={{ marginTop: "0.5rem" }}>
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={prospecto.status}
                            label="Status"
                            onChange={(e) =>
                              handleStatusChange(prospecto.cedula, e.target.value)
                            }
                          >
                            <MenuItem value="contactado">Contactado</MenuItem>
                            <MenuItem value="tieneCotizacion">Tiene Cotización</MenuItem>
                            <MenuItem value="cotizacionAprobada">Cotización Aprobada</MenuItem>
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
    </Grid>
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

      <div className="divprospectos">
        {searchPerformed && prospectos.length === 0 && (
          <p>No hay coincidencias</p>
        )}
        {!searchPerformed && prospectos.length === 0 && (
          <div className="loading-container">
            <img className="loading-image" src={loading} alt="loading" />
          </div>
        )}
        {prospectos.length > 0 && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Grid container spacing={2}>
              {renderColumn("Contactado", "contactado")}
              {renderColumn("Tiene Cotización", "tieneCotizacion")}
              {renderColumn("Cotización Aprobada", "cotizacionAprobada")}
            </Grid>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default Prospectos;