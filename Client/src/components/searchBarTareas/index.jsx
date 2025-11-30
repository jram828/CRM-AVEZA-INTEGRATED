import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./searchBarTareas.css";
import { filterProspecto } from "../../redux/actions";
import { Link } from "react-router-dom";
import { Box, TextField, Button } from "@mui/material";
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
    if (cedula) queryParts.push(`cedulaProspecto=${cedula}`);
    const queryString = queryParts.join("&");

    if (queryString) {
      onFilter(queryString);
      dispatch(filterProspecto(queryString));
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
    return value;
  };

  return (
    <div
      className="searchbar"
      style={{ display: "flex", gap: 8, alignItems: "center" }}
    >
      <TextField
        label="Nombre"
        placeholder="Nombre"
        value={nombre}
        onKeyDown={handleKeyDown}
        onChange={(e) => handleInputChange(e, setNombre)}
        size="small"
        variant="outlined"
        className="inputfiltrocliente"
        InputProps={{ "aria-label": "nombre" }}
      />

      <TextField
        label="Apellido"
        placeholder="Apellido"
        value={apellido}
        onKeyDown={handleKeyDown}
        onChange={(e) => handleInputChange(e, setApellido)}
        size="small"
        variant="outlined"
        className="inputfiltrocliente"
        InputProps={{ "aria-label": "apellido" }}
      />
      <TextField
        label="Número de Cédula"
        placeholder="Número de Cédula"
        value={cedula}
        onKeyDown={handleKeyDown}
        onChange={(e) => handleInputChange(e, setCedula)}
        size="small"
        variant="outlined"
        className="inputfiltrocliente"
        InputProps={{ "aria-label": "cedula" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        className="buscar"
        size="medium"
      >
        Buscar
      </Button>
    </div>
  );
};

export default SearchBar;
