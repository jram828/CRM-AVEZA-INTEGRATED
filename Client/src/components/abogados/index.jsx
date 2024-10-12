import Cliente from "../cliente";
import {useEffect, useState } from "react";
import "../../App.css";
import "./abogados.css";
import { useDispatch, useSelector } from "react-redux";
import { filterAbogado, getAbogados, getAbogadosTodos, setSource} from "../../redux/actions";
import { Button, Button2, Button3 } from "../Mystyles";
import SearchBar from "../searchBarAbogados";
import loading from "../../assets/loading.gif";
// import OrderClientes from "../orderCliente/orderCliente";
import { Link } from "react-router-dom";

const Abogados = () => {
  const dispatch = useDispatch();
  const abogados = useSelector((state) => state.abogados);

  const pages = useSelector((state) => state.pages);
  const [filterApplied, setFilterApplied] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // const [order, setOrder] = useState("");

  useEffect(() => {
    dispatch(getAbogadosTodos());
  }, [dispatch]);

  const totalPages = Math.ceil(pages?.length / 12);
  console.log(totalPages);

  console.log("pages", pages);

  useEffect(() => {
    // if (order) {
    //   dispatch(orderAbogados(order, currentPage));
    //   const storedFilter = JSON.parse(localStorage.getItem("abogadoFilter"));
    //   if (storedFilter) {
    //     setFilterApplied(true);
    //   }
    // } else {
      dispatch(getAbogados(currentPage));
      const storedFilter = JSON.parse(localStorage.getItem("abogadoFilter"));
      if (storedFilter) {
        setFilterApplied(false);
      }
    // }
  }, [dispatch, currentPage]);

  console.log("currentpage", currentPage);

  useEffect(() => {
    dispatch(getAbogados());
     dispatch(setSource("abogado"));
  }, [dispatch]);


  console.log("Abogados: ", abogados);

  const handleVerTodosClick = () => {
    // setOrder("");
    setCurrentPage(1);
    dispatch(getAbogados(1));
    setFilterApplied(false);
    setSearchPerformed(false);
  };

  const handleFilter = (filtro, inputValue) => {
    dispatch(filterAbogado(filtro, inputValue));
    localStorage.setItem(
      "abogadoFilter",
      JSON.stringify({ filtro, inputValue })
    );
    setFilterApplied(true);
    setSearchPerformed(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleOrderChange = (newOrder) => {
    // setOrder(newOrder);
    // setCurrentPage(1);
  };
  
  return (
    <div className="contenedorlitigios">
      <div className="encabezado">
        <h1 className="titulo">Abogados</h1>
      </div>
      <br />
      <div className="registrocliente">
        <SearchBar onFilter={handleFilter} />
        <Link to="/registroabogado">
          <Button>
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
            >
              <path fill="black" d="M14 7H9V2H7v5H2v2h5v5h2V9h5z"></path>
            </svg>
            Registrar Abogado
          </Button>
        </Link>
        {filterApplied && (
          <Button onClick={handleVerTodosClick}>Ver todos</Button>
        )}
      </div>
      {searchPerformed ? undefined : (
        <div className="paginationabogados">
          {currentPage > 1 && (
            <Button2
              onClick={() => handlePageChange(currentPage - 1)}
              // className="join-item btn btn-xs btn-accent"
            >
              &lt;&lt;
            </Button2>
          )}
          <Button3 className="paginaabogados">Página {currentPage}</Button3>
          {currentPage < totalPages && (
            <Button2
              onClick={() => handlePageChange(currentPage + 1)}
              // className="join-item btn btn-xs btn-accent"
            >
              &gt;&gt;
            </Button2>
          )}
        </div>
      )}
      <br />
      <div className="divabogados">
        {searchPerformed && abogados.length === 0 && (
          <p>No hay coincidencias</p>
        )}
        {!searchPerformed && abogados.length === 0 && (
          <div className="loading-container">
            <img className="loading-image" src={loading} alt="loading" />
          </div>
        )}
        {abogados.length > 0 &&
          abogados.map((abogado) => {
            return (
              <div key={abogado.cedulaAbogado}>
                <Cliente cliente={abogado} />
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default Abogados;