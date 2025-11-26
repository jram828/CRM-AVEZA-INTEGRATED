import Prospecto from "../prospecto";
import {useEffect, useState } from "react";
import "../../App.css";
import "./prospectos.css";
import { useDispatch, useSelector } from "react-redux";
import { filterProspecto, getProspectoAll, getProspectoAllCasos, getProspectos, getProspectosTodos, setSource } from "../../redux/actions";
import { Button, Button2, Button3 } from "../Mystyles";
import SearchBar from "../searchBarProspectos";
import OrderProspectos from "../orderProspecto/orderProspecto";
import { Link } from "react-router-dom";
import loading from "../../assets/loading.gif";
import { getProspectosCasos } from "../../handlers/todosProspectos";

const Prospectos = () => {
  const dispatch = useDispatch();
  const prospectos = useSelector((state) => state.prospectos);

  useEffect(() => {
    // dispatch(getProspectoAll());
    dispatch(getProspectoAllCasos());
    dispatch(setSource("prospecto"));
  }, [dispatch]);

  // console.log("Prospectos conocimiento: ", Prospectos);

 
 const pages = useSelector((state) => state.pages);
 const [filterApplied, setFilterApplied] = useState(false);
 const [searchPerformed, setSearchPerformed] = useState(false);
 const [currentPage, setCurrentPage] = useState(1);
 const [order, setOrder] = useState("");

//  useEffect(() => {
//   dispatch(getProspectoAllCasos()); // Obtener el total de Prospectos
//  }, [dispatch]);

 const totalPages = Math.ceil(pages?.length / 12); // Cambia 15 por el número de elementos por página que desees
//  console.log(totalPages);

//  console.log("pages", pages);

 useEffect(() => {
  //  if (order) {
  //    dispatch(orderProspectos(order, currentPage));
  //  } else {
     dispatch(getProspectos(currentPage));
  //  }
 }, [dispatch, currentPage, order]);

//  console.log("order", order, "currentpage", currentPage);
 const handleVerTodosClick = () => {
  //  setOrder("");
   setCurrentPage(1);
   dispatch(getProspectos(1));
   setFilterApplied(false);
   setSearchPerformed(false);
 };

 const handleFilter = (filtro, inputValue) => {
   dispatch(filterProspecto(filtro, inputValue));
   setFilterApplied(true);
   setSearchPerformed(true);
 };

 const handlePageChange = (newPage) => {
   setCurrentPage(newPage);
 };

 const handleOrderChange = (newOrder) => {
  //  setOrder(newOrder);
  //  setCurrentPage(1);
 };
  
  return (
    <div className="contenedorlitigios">
      <div className="encabezado">
        <h1 className="titulo">Prospectos</h1>
      </div>
      <br />
      <div className="registroprospecto">
        <SearchBar onFilter={handleFilter} />
        <Link to="/registroprospecto">
          <Button>
            {" "}
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
            >
              <path fill="black" d="M14 7H9V2H7v5H2v2h5v5h2V9h5z"></path>
            </svg> */}
            Crear Prospecto
          </Button>
        </Link>
        {filterApplied && (
          <Button onClick={handleVerTodosClick}>Ver todos</Button>
        )}
      </div>
      {searchPerformed ? undefined : (
        <div className="paginationprospectos">
          {currentPage > 1 && (
            <Button2 onClick={() => handlePageChange(currentPage - 1)}>
              &lt;&lt;
            </Button2>
          )}
          <Button3 className="paginaprospectos">Página {currentPage}</Button3>
          {currentPage < totalPages && (
            <Button2
              onClick={() => handlePageChange(currentPage + 1)}
            >
              &gt;&gt;
            </Button2>
          )}
        </div>
      )}
      <div className="divprospectos">
        {searchPerformed && prospectos.length === 0 && (
          <p>No hay coincidencias</p>
        )}
        {!searchPerformed && prospectos.length === 0 && (
          <div className="loading-container">
            <img className="loading-image" src={loading} alt="loading" />
          </div>
        )}
        {prospectos.length > 0 &&
          prospectos.map((prospecto) => {
            return (
              <div key={prospecto.cedula}>
                <Prospecto prospecto={prospecto} />
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default Prospectos;
