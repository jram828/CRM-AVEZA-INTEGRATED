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
  const reduxProspectos = useSelector((state) => state.pages); // ✅ Usar pages como fuente

  const [filterApplied, setFilterApplied] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [prospectos, setProspectos] = useState([]);

  const totalPages = Math.ceil(reduxProspectos?.length / 12);
const contarEstados = (lista) => {
  let contactado = 0;
  let tieneCotizacion = 0;
  let cotizacionAprobada = 0;

  lista.forEach((p) => {
    if (p.contactado === "Si") contactado++;
    if (p.tieneCotizacion === "Si") tieneCotizacion++;
    if (p.cotizacionAprobada === "Si") cotizacionAprobada++;
  });

  console.log("Conteo de prospectos por estado:");
  console.log("Contactado:", contactado);
  console.log("Tiene Cotización:", tieneCotizacion);
  console.log("Cotización Aprobada:", cotizacionAprobada);
};

  useEffect(() => {
    dispatch(getProspectoAllCasos());
    dispatch(setSource("prospecto"));
    // contarEstados(reduxProspectos);
  }, [dispatch]);

  useEffect(() => {
    dispatch(getProspectos(currentPage));
  }, [dispatch, currentPage]);

  useEffect(() => {
    // console.log("Prospectos recibidos desde Redux:", reduxProspectos); // ✅ Verifica que llegan datos
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

  const getStatus = (prospecto) => {
    if (prospecto.cotizacionAprobada === "Si") return "cotizacionAprobada";
    if (prospecto.tieneCotizacion === "Si") return "tieneCotizacion";
    if (prospecto.contactado === "Si") return "contactado";
    return "sinEstado";
  };

  const handleStatusChange = (idProspecto, newStatus) => {
    const updated = prospectos.map((p) => {
      if (p.idProspecto !== idProspecto) return p;
      return {
        ...p,
        contactado: newStatus === "contactado" ? "Si" : "No",
        tieneCotizacion: newStatus === "tieneCotizacion" ? "Si" : "No",
        cotizacionAprobada: newStatus === "cotizacionAprobada" ? "Si" : "No",
      };
    });
    setProspectos(updated);

    // dispatch(updateProspectoStatus(idProspecto, newStatus)); // ← Aquí iría la llamada al backend
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const updated = prospectos.map((p) => {
      if (p.idProspecto.toString() !== draggableId) return p;
      return {
        ...p,
        contactado: destination.droppableId === "contactado" ? "Si" : "No",
        tieneCotizacion: destination.droppableId === "tieneCotizacion" ? "Si" : "No",
        cotizacionAprobada: destination.droppableId === "cotizacionAprobada" ? "Si" : "No",
      };
    });
    setProspectos(updated);

    // dispatch(updateProspectoStatus(parseInt(draggableId), destination.droppableId)); // ← Aquí iría la llamada al backend
  };
contarEstados(reduxProspectos);
  const groupedProspectos = {
    contactado: [],
    tieneCotizacion: [],
    cotizacionAprobada: [],
  };

  prospectos.forEach((p) => {
    const status = getStatus(p);
    if (groupedProspectos[status]) {
      groupedProspectos[status].push(p);
    }
  });

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
                  key={prospecto.idProspecto}
                  draggableId={prospecto.idProspecto.toString()}
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
                            value={getStatus(prospecto)}
                            label="Status"
                            onChange={(e) =>
                              handleStatusChange(prospecto.idProspecto, e.target.value)
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
}

export default Prospectos;