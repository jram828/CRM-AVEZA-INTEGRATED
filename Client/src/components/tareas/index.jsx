import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  // filterTarea,
  getTareas,
  // prospectoActual,
  setSource,
  completarTarea,
  // updateTareaStatus // ← Descomenta si tienes esta acción para backend
} from "../../redux/actions";
import { Button2, Button3 } from "../Mystyles";
import SearchBar from "../searchBarTareas";
import loading from "../../assets/loading.gif";
import {
  Paper,
  Typography,
  Card,
  CardContent,
  Tooltip,
  IconButton,
  Box,
  Button,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "./tareas.css";
import "../../App.css";
// import { useNavigate } from "react-router-dom";

const Tareas = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const reduxTareas = useSelector((state) => state.tareas);

  const [filterApplied, setFilterApplied] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tareas, setTareas] = useState([]);

  const totalPages = Math.ceil(reduxTareas?.length / 15);

  // Cargar tareas al montar
  useEffect(() => {
    dispatch(getTareas());
    dispatch(setSource("tareas"));
  }, [dispatch]);

  useEffect(() => {
    if (reduxTareas && Array.isArray(reduxTareas)) {
      setTareas(reduxTareas);
    }
  }, [reduxTareas]);

  // Agrupar tareas por status
  const groupedTareas = useMemo(() => {
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

    tareas
      .filter((t) => !t.completada) // 👈 solo tareas no completadas
      .forEach((t) => {
        // usamos el status del prospecto en la posición 0
        const key = t.Prospectos?.[0]?.status;
        if (groups[key]) {
          groups[key].push(t);
        }
      });

    return groups;
  }, [tareas]);

  console.log("Tareas from Redux:", reduxTareas);
  console.log("Tareas State:", tareas);
  console.log("Grouped Tareas:", groupedTareas);

  const handleCompletar = (idTarea) => {
    dispatch(completarTarea(idTarea));
    setTareas((prev) => prev.filter((t) => t.idTarea !== idTarea));
  };

  const handleVerTodosClick = () => {
    setCurrentPage(1);
    dispatch(getTareas(1));
    setFilterApplied(false);
    setSearchPerformed(false);
  };

  const handleFilter = (filtro, inputValue) => {
    // dispatch(filterTarea(filtro, inputValue));
    setFilterApplied(true);
    setSearchPerformed(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" align="center" gutterBottom>
          {title}
        </Typography>

        <div style={{ minHeight: "60vh" }}>
          {groupedTareas[statusKey]?.map((tarea) => (
            <Card
              key={String(tarea.idTarea)}
              style={{
                marginBottom: "1rem",
                backgroundColor: "#f9f9f9",
                position: "relative",
              }}
            >
              <CardContent sx={{ position: "relative", paddingTop: 4 }}>
                {/* Ícono de completar tarea */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                  }}
                >
                  <Tooltip title="Marcar como completada">
                    <IconButton
                      size="small"
                      aria-label="completar tarea"
                      onClick={() => handleCompletar(tarea.idTarea)}
                      disabled={tarea.completada} // 👈 feedback inmediato
                    >
                      <CheckCircleIcon
                        fontSize="small"
                        color={tarea.completada ? "disabled" : "success"}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Divider orientation="horizontal" flexItem />

                {/* Datos de la tarea */}
                <Typography variant="subtitle1">{tarea.asunto}</Typography>
                <Typography variant="subtitle2">
                  {tarea.fechaVencimiento}
                </Typography>
                <Typography variant="subtitle2">
                  {tarea.Prospectos?.[0]?.nombres || "Sin prospecto"}
                </Typography>
                <Typography variant="subtitle2">
                  {tarea.Abogados?.[0]?.nombres || "Sin abogado"}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </Paper>
    </div>
  );

  return (
    <div className="contenedorlitigios">
      <div className="encabezado">
        <h1 className="titulo">Tareas</h1>
      </div>
      <br />
      <div className="registroprospecto">
        <SearchBar onFilter={handleFilter} />
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
        {searchPerformed && tareas.length === 0 && <p>No hay coincidencias</p>}
        {!searchPerformed && tareas.length === 0 && (
          <div className="loading-container">
            <img className="loading-image" src={loading} alt="loading" />
          </div>
        )}

        {tareas.length > 0 && (
          // contenedor con scroll horizontal
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
            {renderColumn("7. Contrato en evaluación", "contratoenevaluacion")}
            {renderColumn("8. Cliente activo", "clienteactivo")}
            {renderColumn("8. Remarketing", "remarketing")}
            {renderColumn(
              "8. Cliente con Proceso Activo",
              "clienteprocesoactivo",
            )}
            {renderColumn("9. Fidelización", "fidelizacion")}
            {renderColumn("10. Descartado", "descartado")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tareas;
