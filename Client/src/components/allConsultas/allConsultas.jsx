import "./allConsultas.css";
import { deleteConsulta, getConsultas, getConsultasTodos } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loading from "../../assets/loading.gif";
import { Button2, Button3 } from "../Mystyles";
import DetailConsulta from "../detailConsulta/detailConsulta";

function AllConsultas() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const consultas = useSelector((state) => state.consultas);
  const pages = useSelector((state) => state.pages);
  const [loadingState, setLoadingState] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);



  useEffect(() => {
    dispatch(getConsultas());
  }, [dispatch]);

  const totalPages = Math.ceil(consultas?.length / 6);
  console.log('Total paginas:',totalPages);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingState(true);
      await dispatch(getConsultasTodos(currentPage));
      setLoadingState(false);
    };
    fetchData();
  }, [dispatch, currentPage]);

  console.log("consultas", consultas);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="contenedorconsultas">
      <div className="infoconsultas">
        <div className="encabezadoconsultas">
          <h1 className="titulo">Consultas</h1>
        </div>
        <div className="paginationconsultas">
          {currentPage > 1 && (
            <Button2 onClick={() => handlePageChange(currentPage - 1)}>
              &lt;&lt;
            </Button2>
          )}
          <Button3>Página {currentPage}</Button3>
          {currentPage < totalPages && (
            <Button2 onClick={() => handlePageChange(currentPage + 1)}>
              &gt;&gt;
            </Button2>
          )}
        </div>
        {loadingState ? (
          <div className="loading-container">
            <img className="loading-image" src={loading} alt="loading" />
          </div>
        ) : consultas && consultas.length > 0 ? (
          <div className="divconsultas">
              {pages.map((consulta) => {
                return (
                  <div>
                    <DetailConsulta key={consulta.id} consulta={consulta} />
                  </div>
                );
              })}
          </div>
        ) : (
          <p>No hay consultas disponibles</p>
        )}
      </div>
    </div>
  );
}

export default AllConsultas;
