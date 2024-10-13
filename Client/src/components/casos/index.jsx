import "./casos.css";
import { useState, useEffect } from "react";
import TarjetaCaso from "../../components/tarjetaCaso/tarjetaCaso";
import { useSelector, useDispatch } from "react-redux";
import {
  filterCasos,
  getCasos,
  // orderCasos,
  getCasosTodos,
} from "../../redux/actions";
import SearchBar from "../../components/searchBarCasos/searchBar";
// import OrderCasos from "../../components/orderCasos/orderCasos";
import { Link } from "react-router-dom";
import loading from "../../assets/loading.gif";
import { Button, Button2, Button3 } from "../Mystyles";

function Casos() {
  localStorage.removeItem("casosFilter");
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const dispatch = useDispatch();
  const casos = useSelector((state) => state.casos);
  const pages = useSelector((state) => state.pages);
  const [filterApplied, setFilterApplied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // const [searchPerformed, setSearchPerformed] = useState(false);
  const [order, setOrder] = useState("");

  useEffect(() => {
    dispatch(getCasosTodos());
  }, [dispatch]);

  const todos = pages?.datosPagina || [];
  const totalPages = Math.ceil(todos.length / 9);

  console.log(totalPages);

  console.log("pages", pages);

  useEffect(() => {
    // if (order) {
    //   dispatch(orderCasos(order, currentPage));
    // } else {
      const storedFilter = JSON.parse(localStorage.getItem("casosFilter"));
      console.log('Stored filter:', storedFilter)
      if (storedFilter) {
        setFilterApplied(true);
      }
      dispatch(getCasos(currentPage));
    // }
  }, [dispatch, currentPage, order]);

  console.log("order", order, "currentpage", currentPage);
  const handleVerTodosClick = () => {
    setOrder("");
    setCurrentPage(1);
    dispatch(getCasos(1));
    localStorage.removeItem("casosFilter");
    setFilterApplied(false);
    // setSearchPerformed(false);
  };

  const handleFilter = (filtro, inputValue) => {
    dispatch(filterCasos(filtro, inputValue));
    localStorage.setItem("casosFilter", JSON.stringify({ filtro, inputValue }));
    setFilterApplied(true);
    // setSearchPerformed(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // const handleOrderChange = (newOrder) => {
  //   setOrder(newOrder);
  //   setCurrentPage(1);
  // };

  const isLoading = !casos || !casos.datosPagina;

  const userCasos =
    !isLoading &&
    (user.administrador
      ? casos.datosPagina
      : casos.datosPagina.filter(
          (caso) =>
            (caso.nombresCliente === user.nombres &&
              caso.apellidosCliente === user.apellidos) ||
            (caso.nombresabogado === user.nombres &&
              caso.apellidosAbogado === user.apellidos)
        ));
  console.log('Casos: ', casos)
  
  console.log("Casos usuario: ", userCasos);
  return (
    <div className="contenedorcasos">
      <div className="encabezado">
        <h1 className="titulo">Casos</h1>
      </div>
      <br />
      <div className="menucasos">
        <SearchBar onFilter={handleFilter} />
        {user.administrador === true || user.cedulaAbogado ? (
          <Link to="/casos/crearcaso" className="botoncrearcaso">
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
              Crear caso
            </Button>
          </Link>
        ) : null}
        {filterApplied === true ? (
          <Button onClick={handleVerTodosClick}>Ver todos</Button>
        ) : null}
      </div>

      {isLoading ? (
        <div className="loading-container">
          <img className="loading-image" src={loading} alt="loading" />
        </div>
      ) : (
        <div className="casosconpagina">
          {/* {searchPerformed ? undefined : ( */}
            <div className="pagination">
              {currentPage > 1 && (
                <Button2 onClick={() => handlePageChange(currentPage - 1)}>
                  &lt;&lt;
                </Button2>
              )}
              <Button3>Página {currentPage}</Button3>
              {currentPage < casos.totalPaginas && (
                <Button2
                  className="botonpagsig"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  &gt;&gt;
                </Button2>
              )}
            </div>
          {/* )} */}
          <br />
          <div className="divcasos">
            {userCasos.map((caso) => (
              <TarjetaCaso caso={caso} key={caso.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Casos;
