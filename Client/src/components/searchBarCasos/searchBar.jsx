import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./searchBar.css";
import { filterCasos, getCasos } from "../../redux/actions";
import { Button } from "../Mystyles";
import { getTiposCasos } from "../../handlers/todosTiposdecasos";

const SearchBar = ({ onFilter }) => {
  const [tipoCaso, setTipoCaso] = useState("");
  const [estado, setEstado] = useState("false");
  // const [select, setSelect] = useState("");
  const [apellidoAbogado, setApellidoAbogado] = useState("");
  const [apellidoCliente, setApellidoCliente] = useState("");
  const [tipos, setTipos] = useState({ allTipoDeCaso: [] });

  const dispatch = useDispatch();

  useEffect(() => {
    const obtenerTipos = async () => {
      try {
        const listaTipos = await getTiposCasos();
        if (listaTipos && Array.isArray(listaTipos.allTipoDeCaso)) {
          setTipos(listaTipos);
        } else {
          console.error(
            "Error: La respuesta no es un objeto esperado",
            listaTipos
          );
        }
      } catch (error) {
        console.error("Error al obtener los tipos de casos:", error);
      }
    };

    obtenerTipos();
  }, []);

  //  useEffect(() => {
  //    // Ejecuta la función handleSearch cuando cambie el valor del selector
  //    handleSearch(tipoCaso);
  //  }, [tipoCaso]);

  // const todos = pages?.datosPagina || [];
  // const totalPages = Math.ceil(todos.length / 9);

  // console.log(totalPages);

  // console.log("pages", pages);

  // useEffect(() => {
  //    dispatch(getCasos(currentPage));
  // }, [dispatch, currentPage]);

  // console.log("order", order, "currentpage", currentPage);

  const handleInputChange = (e, setValue) => {
    setValue(e.target.value);
  };

  const handleChangeSelect = (e) => {
    e.preventDefault();

    if (e.target.name === "estado") {
      const valueEstado = e.target.value;
      console.log("Target value", valueEstado);
      setEstado(valueEstado);
      window.localStorage.setItem("select", JSON.stringify("estado"));
      console.log("Estado change: ", estado);
      handleSearch(valueEstado);
    } else {
      const valueTipoCaso = e.target.value;
      console.log("Target value", valueTipoCaso);
      setTipoCaso(valueTipoCaso);
      window.localStorage.setItem("select", JSON.stringify("tipoCaso"));
      console.log("Tipo caso change: ", tipoCaso);
      handleSearch(valueTipoCaso);
    }
  };

  const handleSearch = (searchParam) => {
    const queryParts = [];

    console.log("Parametro search: ", searchParam);

    const select = JSON.parse(localStorage.getItem("select"));
    console.log("Select: ", select);

    switch (select) {
      case "estado":
        queryParts.push(`todos=${searchParam}`);
        break;
      case "tipoCaso":
        queryParts.push(`tipoCaso=${searchParam}`);
        break;
    }
    // if (select === "estado") {
    //   queryParts.push(`todos=${searchParam}`);
    // } else {
    //   queryParts.push(`tipoCaso=${searchParam}`);
    // }

    if (apellidoAbogado)
      queryParts.push(`apellidosAbogado=${formatInputValue(apellidoAbogado)}`);
    if (apellidoCliente)
      queryParts.push(`apellidosCliente=${formatInputValue(apellidoCliente)}`);

    console.log("Query parts:", queryParts);
    const queryString = queryParts.join("&");

    if (queryString) {
      onFilter(queryString);
      // dispatch(filterCasos(queryString));
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
    return value; //.charAt(0).toUpperCase() + value.slice(1); //.toLowerCase();
  };

  return (
    <div className="searchbar">
      <select
        name="TipoDeCasoid"
        id="TipoDeCasoid"
        className="inputfiltrocaso"
        onChange={(e) => handleChangeSelect(e)}
      >
        <option value="" className="tipodecaso">
          Tipo de caso
        </option>
        {tipos.allTipoDeCaso.map((tipo) => (
          <option
            key={tipo.TipoDeCasoid}
            value={tipo.descripcion}
            className="inputfiltrocaso"
          >
            {tipo.descripcion}
          </option>
        ))}
      </select>
      <select
        name="estado"
        id="estado"
        className="inputfiltrocaso"
        onChange={(e) => handleChangeSelect(e)}
      >
        <option value="" className="tipodecaso">
          Estado del caso
        </option>
        <option value="verdadero" className="inputfiltrocaso">
          Todos
        </option>
        <option value="false" className="inputfiltrocaso">
          Activos
        </option>
        <option value="deleted" className="inputfiltrocaso">
          Eliminados
        </option>
      </select>

      <input
        placeholder="Apellido abogado"
        type="text"
        value={apellidoAbogado}
        onKeyDown={handleKeyDown}
        onChange={(e) => handleInputChange(e, setApellidoAbogado)}
        className="inputfiltrocaso"
      />

      <input
        placeholder="Apellido cliente"
        type="text"
        value={apellidoCliente}
        onKeyDown={handleKeyDown}
        onChange={(e) => handleInputChange(e, setApellidoCliente)}
        className="inputfiltrocaso"
      />

      <Button onClick={handleSearch}>
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
    </div>
  );
};

export default SearchBar;
