import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./searchBarProspectos.css";
import { filterProspecto } from "../../redux/actions";
import { Button } from "../Mystyles";
import { Link } from "react-router-dom";

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
    return value
  };

  return (

    <div className="searchbar">

      <input
        placeholder="Nombre"
        type="text"
        value={nombre}
        onKeyDown={handleKeyDown}
        onChange={(e) => handleInputChange(e, setNombre)}
        className="inputfiltrocliente"
      />
      <input
        placeholder="Apellido"
        type="text"
        value={apellido}
        onKeyDown={handleKeyDown}
        onChange={(e) => handleInputChange(e, setApellido)}
        className="inputfiltrocliente"
      />
      <input
        placeholder="Número de Cédula"
        type="text"
        value={cedula}
        onKeyDown={handleKeyDown}
        onChange={(e) => handleInputChange(e, setCedula)}
        className="inputfiltrocliente"
      />

      <Button onClick={handleSearch} className="buscar">
        Buscar
      </Button>

    </div>

  );
};

export default SearchBar;
