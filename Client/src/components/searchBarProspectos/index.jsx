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
    return value //.charAt(0).toUpperCase() + value.slice(1); //.toLowerCase();
  };

  return (
    // <div className="flex gap-2 mb-4 ">
    <div className="searchbar">
      {/* <div className=""> */}
      <input
        placeholder="Nombre"
        type="text"
        value={nombre}
        onKeyDown={handleKeyDown}
        onChange={(e) => handleInputChange(e, setNombre)}
        className="inputfiltrocliente"
      />
      {/* </div> */}

      {/* <div className=""> */}
      <input
        placeholder="Apellido"
        type="text"
        value={apellido}
        onKeyDown={handleKeyDown}
        onChange={(e) => handleInputChange(e, setApellido)}
        className="inputfiltrocliente"
      />
      {/* </div> */}

      {/* <div className=""> */}
      <input
        placeholder="Número de Cédula"
        type="text"
        value={cedula}
        onKeyDown={handleKeyDown}
        onChange={(e) => handleInputChange(e, setCedula)}
        className="inputfiltrocliente"
      />
      {/* </div> */}
      {/* <div className="flex items-center gap-2"> */}
      <Button onClick={handleSearch} className="buscar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.2em"
          height="1.2em"
          viewBox="0 0 24 24"
        >
          <path
            fill="black"
            d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
          ></path>
        </svg>
        Buscar
      </Button>
      {/* </div> */}
    </div>
    // </div>
  );
};

export default SearchBar;
