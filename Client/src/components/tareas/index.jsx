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
  Divider
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
                <Typography variant="subtitle2">{tarea.fechaVencimiento}</Typography>
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
      {searchPerformed && tareas.length === 0 && (
        <p>No hay coincidencias</p>
      )}
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
          {renderColumn("Sin iniciar", "sininiciar")}
          {renderColumn("Intento de contacto", "intentodecontacto")}
          {renderColumn("Nuevo Intento - Seguimiento 1", "nuevointentoseg1")}
          {renderColumn("Nuevo Intento - Seguimiento 2", "nuevointentoseg2")}
          {renderColumn("Nunca hubo contacto", "nocontacto")}
          {renderColumn("Asesoría agendada", "asesoriaag")}
          {renderColumn("Asesoría en reagendamiento", "asesoriaenreag")}
          {renderColumn("No se logró primera asesoria", "noasesoria")}
          {renderColumn("No calificado después de asesoría", "nocalificado")}
          {renderColumn("Calificado | En espera de documentos", "calificado")}
          {renderColumn("Cotización o espera de contrato", "cotizacion")}
        </div>
      )}
    </div>
  </div>
);
};

export default Tareas;




// const Tareas = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const reduxTareas = useSelector((state) => state.tareas);
//   const citas = useSelector((state) => state.citas);
//   // const pages = useSelector((state) => state.pages);

//   console.log("Citas from Redux:", citas);
//   console.log("Tareas from Redux:", tareas);

//   console.log("Redux Tareas:", reduxTareas);
//   const [filterApplied, setFilterApplied] = useState(false);
//   const [searchPerformed, setSearchPerformed] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [tareas, setTareas] = useState([]);
//   const [selectedTarea, setSelectedTarea] = useState(null);

//   const totalPages = Math.ceil(tareas?.length / 12);

//   // useEffect(() => {
//   //   dispatch(getTareaAllCasos());
//   //   dispatch(setSource("tarea"));
//   // }, [dispatch]);

//   // Cargar tareas solo una vez al montar

//   useEffect(() => {
//     dispatch(getTareas());
//     dispatch(setSource("tareas"));
//   }, [dispatch]); // 👈 solo una vez

//   useEffect(() => {
//     if (reduxTareas && Array.isArray(reduxTareas)) {
//       setTareas(reduxTareas);
//     }
//   }, [reduxTareas]);

//   const groupedTareas = useMemo(() => {
//     const groups = {
//       sininiciar: [],
//       intentodecontacto: [],
//       nuevointentoseg1: [],
//       nuevointentoseg2: [],
//       asesoriaag: [],
//       asesoriaenreag: [],
//       noasesoria: [],
//       nocalificado: [],
//       calificado: [],
//       cotizacion: [],
//       nocontacto: [],
//     };

//     tareas.forEach((p) => {
//       const key = p.status;
//       if (groups[key]) {
//         groups[key].push(p);
//       }
//     });

//     return groups;
//   }, [tareas]);

//   const handleVerTodosClick = () => {
//     setCurrentPage(1);
//     dispatch(getTareas(1));
//     setFilterApplied(false);
//     setSearchPerformed(false);
//   };

//   const handleFilter = (filtro, inputValue) => {
//     dispatch(filterTarea(filtro, inputValue));
//     setFilterApplied(true);
//     setSearchPerformed(true);
//   };

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   // const onClickDetail = (prospecto) => {
//   //   dispatch(prospectoActual(prospecto));
//   //   window.localStorage.setItem("prospecto", JSON.stringify(prospecto));
//   //   navigate("/detail");
//   // };


//   const getActivityIconProps = (activity) => {
//     if (!activity)
//       return { IconComp: null, color: "disabled", tooltip: "Sin actividad" };

//     const now = new Date();
//     const isPastOrToday = activity.date <= now;
//     const color = isPastOrToday ? "error.main" : "success.main";

//     if (activity.type === "cita") {
//       return { IconComp: CalendarTodayIcon, color, tooltip: activity.title };
//     }
//     return { IconComp: TaskIcon, color, tooltip: activity.title };
//   };

//   const renderColumn = (title, statusKey) => (
//     <div
//       style={{
//         minWidth: "300px",
//         marginRight: "1rem",
//         flexShrink: 0,
//         flex: "0 0 320px",
//       }}
//     >
//       <Paper
//         elevation={3}
//         style={{
//           padding: "1rem",
//           minHeight: "70vh",
//           maxHeight: "70vh", // altura fija
//           overflowY: "auto", // scroll vertical dentro de la columna
//         }}
//       >
//         <Typography variant="h6" align="center" gutterBottom>
//           {title}
//         </Typography>
//         <Droppable droppableId={statusKey}>
//           {(provided) => (
//             <div
//               ref={provided.innerRef}
//               {...provided.droppableProps}
//               style={{ minHeight: "60vh" }}
//             >
//               {groupedTareas[statusKey]?.map((tarea, index) => {

//                 const { IconComp, color, tooltip } = getActivityIconProps(
//                   latestActivity
//                 );

//                 return (
//                   <Draggable
//                     key={String(tarea.idTarea)}
//                     draggableId={String(tarea.idTarea)}
//                     index={index}
//                   >
//                     {(provided) => (
//                       <Card
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         style={{
//                           marginBottom: "1rem",
//                           backgroundColor: "#f9f9f9",
//                           position: "relative",
//                           ...provided.draggableProps.style,
//                         }}
//                       >
//                         <CardContent
//                           sx={{ position: "relative", paddingTop: 4 }}
//                         >
//                           {/* Íconos esquina superior derecha */}
//                           <Box
//                             sx={{
//                               position: "absolute",
//                               top: 8,
//                               right: 8,
//                               display: "flex",
//                               gap: 1,
//                             }}
//                           >
//                             {IconComp ? (
//                               <Tooltip title={tooltip}>
//                                 <IconButton
//                                   size="small"
//                                   aria-label="actividad más reciente"
//                                 >
//                                   <IconComp sx={{ color }} fontSize="small" />
//                                 </IconButton>
//                               </Tooltip>
//                             ) : (
//                               <Tooltip title="Sin actividad">
//                                 <IconButton
//                                   size="small"
//                                   aria-label="sin actividad"
//                                   disabled
//                                 >
//                                   <CalendarTodayIcon fontSize="small" />
//                                 </IconButton>
//                               </Tooltip>
//                             )}
//                           </Box>

//                           <Divider orientation="horizontal" flexItem />
//                           {/* Link y datos */}
//                           {/* <Link
//                             to={"/detail"}
//                             onClick={() => onClickDetail(prospecto)}
//                             className="link"
//                           > */}
//                             <Typography variant="subtitle1">
//                               {tarea.asunto}
//                             </Typography>
//                           {/* </Link> */}
//                           <Typography variant="subtitle2">
//                             {tarea.fechaVencimiento}
//                           </Typography>
//                           <Typography variant="subtitle2">
//                             {tarea.Prospectos[0]?.nombres || "Sin prospecto"}
//                           </Typography>
//                           <Typography variant="subtitle2">
//                             {tarea.Abogados[0]?.nombres || "Sin abogado"}
//                           </Typography>

                         
//                         </CardContent>
//                       </Card>
//                     )}
//                   </Draggable>
//                 );
//               })}

//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       </Paper>
//     </div>
//   );

//   return (
//     <div className="contenedorlitigios">
//       <div className="encabezado">
//         <h1 className="titulo">Tareas</h1>
//       </div>
//       <br />
//       <div className="registroprospecto">
//         <SearchBar onFilter={handleFilter} />
//         {filterApplied && (
//           <Button onClick={handleVerTodosClick}>Ver todos</Button>
//         )}
//       </div>

//       {!searchPerformed && (
//         <div className="paginationprospectos">
//           {currentPage > 1 && (
//             <Button2 onClick={() => handlePageChange(currentPage - 1)}>
//               &lt;&lt;
//             </Button2>
//           )}
//           <Button3 className="paginaprospectos">Página {currentPage}</Button3>
//           {currentPage < totalPages && (
//             <Button2 onClick={() => handlePageChange(currentPage + 1)}>
//               &gt;&gt;
//             </Button2>
//           )}
//         </div>
//       )}

//       <div className="divprospectos2">
//         {searchPerformed && tareas.length === 0 && (
//           <p>No hay coincidencias</p>
//         )}
//         {!searchPerformed && tareas.length === 0 && (
//           <div className="loading-container">
//             <img className="loading-image" src={loading} alt="loading" />
//           </div>
//         )}

//         {tareas.length > 0 && (
//           <DragDropContext
//             onDragEnd={handleDragEnd}
//             onDragUpdate={handleDragUpdate}
//           >
//             {/* contenedor con scroll horizontal */}
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 flexWrap: "nowrap",
//               }}
//             >
//               {renderColumn("Sin iniciar", "sininiciar")}
//               {renderColumn("Intento de contacto", "intentodecontacto")}
//               {renderColumn(
//                 "Nuevo Intento - Seguimiento 1",
//                 "nuevointentoseg1"
//               )}
//               {renderColumn(
//                 "Nuevo Intento - Seguimiento 2",
//                 "nuevointentoseg2"
//               )}
//               {renderColumn("Nunca hubo contacto", "nocontacto")}
//               {renderColumn("Asesoría agendada", "asesoriaag")}
//               {renderColumn("Asesoría en reagendamiento", "asesoriaenreag")}
//               {renderColumn("No se logró primera asesoria", "noasesoria")}
//               {renderColumn(
//                 "No calificado después de asesoría",
//                 "nocalificado"
//               )}
//               {renderColumn(
//                 "Calificado | En espera de documentos",
//                 "calificado"
//               )}
//               {renderColumn("Cotización o espera de contrato", "cotizacion")}
//               {/* 👉 aquí se renderiza el formulario aislado */}
//             </div>
//           </DragDropContext>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Tareas;
