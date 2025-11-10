import Cliente from "../cliente";
import { useEffect, useState } from "react";
import "../../App.css";
import "./clientes.css";
import { useDispatch, useSelector } from "react-redux";
import {
  filterCliente,
  getClienteAll,
  getClienteAllCasos,
  getClientes,
  getClientesTodos,
  setSource,
} from "../../redux/actions";
import SearchBar from "../searchBarClientes/index.jsx";
import OrderClientes from "../orderCliente/orderCliente";
import { Link } from "react-router-dom";
import { Container, Box, Typography, Stack, Button as MUIButton, IconButton, Pagination, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import loading from "../../assets/loading.gif";

const Clientes = () => {
  const dispatch = useDispatch();
  const clientes = useSelector((state) => state.clientes);
  const pages = useSelector((state) => state.pages);

  useEffect(() => {
    // dispatch(getClienteAll());
    dispatch(getClienteAllCasos());
    dispatch(setSource("cliente"));
  }, [dispatch]);

  const [filterApplied, setFilterApplied] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [order, setOrder] = useState("");

  const totalPages = Math.max(0, Math.ceil((pages?.length || 0) / 12));

  useEffect(() => {
    dispatch(getClientes(currentPage));
  }, [dispatch, currentPage, order]);

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

  // optional handler for Pagination component
  const handlePaginationChange = (_event, value) => {
    handlePageChange(value);
  };

  const displayedClientes = clientes.slice(0, 12);

  return (
    <Container maxWidth="lg" className="contenedorlitigios" sx={{ py: 3 }}>
      <Box className="encabezado" sx={{ mb: 2 }}>
        <Typography variant="h5" component="h1" className="titulo">
          Clientes
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" className="registrocliente" sx={{ mb: 2 }}>
        <SearchBar onFilter={handleFilter} />
        <Box sx={{ flexGrow: 1 }} />
        <MUIButton
          variant="contained"
          color="primary"
          component={Link}
          to="/registrocliente"
          sx={{ whiteSpace: "nowrap", minWidth: "auto" }}
        >
          Crear cliente
        </MUIButton>

        {filterApplied && (
          <MUIButton
            variant="outlined"
            onClick={handleVerTodosClick}
            sx={{ whiteSpace: "nowrap", minWidth: "auto" }}
          >
            Ver todos
          </MUIButton>
        )}
      </Stack>

      {!searchPerformed && totalPages > 0 && (
        <Box className="paginationclientes" sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <IconButton
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            aria-label="prev"
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePaginationChange}
            color="primary"
            showFirstButton
            showLastButton
          />

          <IconButton
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            aria-label="next"
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      )}

      {/* Grid: 3 columnas x 4 filas (máx. 12 tarjetas) */}
      <Box
        className="divclientes"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
          gridTemplateRows: "repeat(4, auto)",
          gap: 2,
        }}
      >
        {searchPerformed && displayedClientes.length === 0 && (
          <Typography>No hay coincidencias</Typography>
        )}

        {!searchPerformed && displayedClientes.length === 0 && (
          <Box className="loading-container" sx={{ display: "flex", justifyContent: "center", py: 4, gridColumn: "1 / -1" }}>
            <CircularProgress />
          </Box>
        )}

        {displayedClientes.length > 0 &&
          displayedClientes.map((cliente) => (
            <Box key={cliente.cedula}>
              <Cliente cliente={cliente} />
            </Box>
          ))}
      </Box>
    </Container>
  );
};

export default Clientes;
