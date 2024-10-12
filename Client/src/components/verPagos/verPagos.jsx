import "./verPagos.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPagos} from "../../redux/actions";
import loading from "../../assets/loading.gif";
import SearchBar from "../../components/searchBarPagos/searchBar";
import { Button, Button2, Button3 } from "../Mystyles";

function VerPagos() {
localStorage.removeItem("pagosFilter");
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const [loadingState, setLoadingState] = useState(true);
  const [filterApplied, setFilterApplied] = useState(false);

  const dispatch = useDispatch();
  const pagos = useSelector((state) => state.pagos);
  const pages = useSelector((state) => state.pages);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [order, setOrder] = useState("");

  const todos = pages?.datosPagina || [];
  const totalPages = Math.ceil(todos.length / 9);

  console.log(totalPages);

  console.log("pages", pages);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingState(true);
      await dispatch(getPagos());
      setLoadingState(false);
    };
    fetchData();
  }, [dispatch]);

  console.log("Pagos:", pagos);
  console.log('Pagos paginados:', pages)
  console.log('User:', user)

  function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Los meses son 0-11
    const año = fecha.getFullYear();
    return `${dia}-${mes}-${año}`;
  }

    const handleVerTodosClick = () => {
      setOrder("");
      setCurrentPage(1);
      dispatch(getCasos(1));
      localStorage.removeItem("casosFilter");
      setFilterApplied(false);
      setSearchPerformed(false);
    };

    const handleFilter = (filtro, inputValue) => {
      dispatch(filterCasos(filtro, inputValue));
      localStorage.setItem(
        "casosFilter",
        JSON.stringify({ filtro, inputValue })
      );
      setFilterApplied(true);
      setSearchPerformed(true);
    };
  
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };
  
  return (
    <div className="contenedorverpagos">
      <div className="menupagos">
        <SearchBar onFilter={handleFilter} />
        {filterApplied === true ? (
          <Button onClick={handleVerTodosClick}>Ver todos</Button>
        ) : null}
      </div>
      {loadingState ? (
        <div className="loading-container">
          <img className="loading-image" src={loading} alt="loading" />
        </div>
      ) : (
        <div className="pagosconpagina">
          <div className="pagination">
            {currentPage > 1 && (
              <Button2 onClick={() => handlePageChange(currentPage - 1)}>
                &lt;&lt;
              </Button2>
            )}
            <Button3>Página {currentPage}</Button3>
            {currentPage < pagos.totalPaginas && (
              <Button2
                className="botonpagsig"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                &gt;&gt;
              </Button2>
            )}
          </div>
          <div className="divpagos">
            {pagos.map((pago) => (
              <div key={pago?.pagoId} className="cardpagos">
                <span className="titulopago">
                  Caso N°: {pago?.idCaso} {pago?.Caso?.descripcion}
                </span>
                <div className="infopagotarjeta">
                  <span className="labelverpago">Cliente: </span>
                  <span className="textopago">
                    {pago?.Caso?.Cliente?.apellidos}{" "}
                    {pago?.Caso?.Cliente?.nombres}
                  </span>
                </div>
                <div className="infopagotarjeta">
                  <span className="labelverpago">Fecha: </span>
                  <span className="textopago">
                    {formatearFecha(pago?.fechaDeAprobacion)}
                  </span>
                </div>
                <div className="infopagotarjeta">
                  <span className="labelverpago">Valor: </span>
                  <span className="textopago">
                    {pago?.importeDeLaTransaccion}
                  </span>
                </div>
                <div className="infopagotarjeta">
                  <span className="labelverpago">Descripción: </span>
                  <span className="textopago">{pago?.descripcion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default VerPagos;
