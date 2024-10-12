import Cliente from "../cliente";
import {useEffect, useState } from "react";
import "../../App.css";
import "./clientes.css";
import { useDispatch, useSelector } from "react-redux";
import { filterCliente, getClienteAll, getClientes, getClientesTodos, setSource } from "../../redux/actions";
import { Button, Button2, Button3 } from "../Mystyles";
import SearchBar from "../searchBarClientes";
import OrderClientes from "../orderCliente/orderCliente";
import { Link } from "react-router-dom";
import loading from "../../assets/loading.gif";

const Clientes = () => {
  const dispatch = useDispatch();
  const clientes = useSelector((state) => state.clientes);

  useEffect(() => {
    dispatch(getClienteAll());
    dispatch(setSource("cliente"));
  }, [dispatch]);

  console.log("Clientes conocimiento: ", clientes);

 
 const pages = useSelector((state) => state.pages);
 const [filterApplied, setFilterApplied] = useState(false);
 const [searchPerformed, setSearchPerformed] = useState(false);
 const [currentPage, setCurrentPage] = useState(1);
 const [order, setOrder] = useState("");

 useEffect(() => {
   dispatch(getClientesTodos()); // Obtener el total de clientes
 }, [dispatch]);

 const totalPages = Math.ceil(pages?.length / 12);
 console.log(totalPages);

 console.log("pages", pages);

 useEffect(() => {
  //  if (order) {
  //    dispatch(orderClientes(order, currentPage));
  //  } else {
     dispatch(getClientes(currentPage));
  //  }
 }, [dispatch, currentPage, order]);

 console.log("order", order, "currentpage", currentPage);
 const handleVerTodosClick = () => {
  //  setOrder("");
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

 const handleOrderChange = (newOrder) => {
  //  setOrder(newOrder);
  //  setCurrentPage(1);
 };
  
  return (
    <div className="contenedorlitigios">
      <div className="encabezado">
        <h1 className="titulo">Clientes</h1>
      </div>
      <br />
      <div className="registrocliente">
        <SearchBar onFilter={handleFilter} />
        <Link to="/registrocliente">
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
            Crear cliente
          </Button>
        </Link>
        {filterApplied && (
          <Button onClick={handleVerTodosClick}>Ver todos</Button>
        )}
      </div>
      {searchPerformed ? undefined : (
        <div className="paginationclientes">
          {currentPage > 1 && (
            <Button2 onClick={() => handlePageChange(currentPage - 1)}>
              &lt;&lt;
            </Button2>
          )}
          <Button3 className="paginaclientes">Página {currentPage}</Button3>
          {currentPage < totalPages && (
            <Button2
              onClick={() => handlePageChange(currentPage + 1)}
            >
              &gt;&gt;
            </Button2>
          )}
        </div>
      )}
      <div className="divclientes">
        {searchPerformed && clientes.length === 0 && (
          <p>No hay coincidencias</p>
        )}
        {!searchPerformed && clientes.length === 0 && (
          <div className="loading-container">
            <img className="loading-image" src={loading} alt="loading" />
          </div>
        )}
        {clientes.length > 0 &&
          clientes.map((cliente) => {
            return (
              <div>
                <Cliente key={cliente.cedula} cliente={cliente} />
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default Clientes;



// import logo from "../../img/logoAveza.png";

// import { Link } from "react-router-dom";
// import { Button } from "../Mystyles";


// const ConocimientoDeLitigios = () => {

  
//   return (
//     <div>
//       <div className="logo-aveza">
//         <img src={logo} alt="logo-aveza" title="AVEZA SAS" />
//       </div>
//       <h1 className="titulo">Conocimiento de Litigios</h1>
//       <br />

//       <form>
//         <br /><br /><br /><br /><br />
//         <div className="clientes">
//           <Link to={"/litigiosporcliente"} >
//             <Button className="botonesiniciosesion">
//               Litigios por cliente
//             </Button>
//           </Link>
//           <Link to={"/litigiostipocaso"} >
//             <Button className="botonesiniciosesion">
//               Litigios por tipo de caso
//             </Button>
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// };
// export default ConocimientoDeLitigios;
