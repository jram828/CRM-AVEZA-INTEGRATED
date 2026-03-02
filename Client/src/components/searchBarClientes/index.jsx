import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./searchBarClientes.css";
import { filterCliente } from "../../redux/actions";
import { Link } from "react-router-dom";
import { Box, TextField, Button} from "@mui/material";

const SearchBar = ({ onFilter }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const dispatch = useDispatch();

  const handleInputChange = (e, setValue) => {
    setValue(e.target.value);
  };

  const handleSearch = () => {
    const queryParts = [];
    if (nombre) queryParts.push(`nombres=${formatInputValue(nombre)}`);
    if (apellido) queryParts.push(`apellidos=${formatInputValue(apellido)}`);
    if (cedula) queryParts.push(`cedulaCliente=${cedula}`);
    const queryString = queryParts.join("&");

    if (queryString) {
      onFilter(queryString);
      dispatch(filterCliente(queryString));
    } else {
      console.log("Por favor ingrese al menos un valor de búsqueda");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatInputValue = (value) => {
    if (!value) return "";
    return value //.charAt(0).toUpperCase() + value.slice(1); //.toLowerCase();
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      display="flex"
      gap={2}
      alignItems="center"
      className="searchbar"
    >
      <TextField
        label="Nombre"
        placeholder="Nombre"
        variant="outlined"
        size="small"
        value={nombre}
        onKeyDown={handleKeyDown}
        onChange={(e) => handleInputChange(e, setNombre)}
        className="inputfiltrocliente"
        InputProps={{ "aria-label": "nombre" }}
      />

      <TextField
        label="Apellido"
        placeholder="Apellido"
        variant="outlined"
        size="small"
        value={apellido}
        onKeyDown={handleKeyDown}
        onChange={(e) => handleInputChange(e, setApellido)}
        className="inputfiltrocliente"
        InputProps={{ "aria-label": "apellido" }}
      />

      <TextField
        label="Número de Cédula"
        placeholder="Número de Cédula"
        variant="outlined"
        size="small"
        value={cedula}
        onKeyDown={handleKeyDown}
        onChange={(e) => handleInputChange(e, setCedula)}
        className="inputfiltrocliente"
        InputProps={{ "aria-label": "cedula" }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        type="submit"
        className="buscar"
        sx={{ whiteSpace: "nowrap", minWidth: "auto" }}
        size="small"
      >
        Buscar
      </Button>
    </Box>
  );
};

export default SearchBar;
