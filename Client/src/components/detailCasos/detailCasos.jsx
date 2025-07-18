import "./detailCasos.css";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  casoActual,
  clienteActual,
  deleteCaso,
  finCaso,
  modificarCaso,
} from "../../redux/actions";
import { Button, Buttonf } from "../Mystyles";
import { getCasoById } from "../../handlers/detailCaso";
import { numeroALetras } from "../convertiraletras";
import { generarDocumentos } from "../../handlers/generarDocumentos";
import { formatNumero } from "../../utils/formatNumero";
// import { generarSolicitud } from "../../handlers/generarSolicitud";

function DetailCasos() {
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const { id } = useParams(); // Obtener el id de los parámetros de la ruta
  // console.log("Id detail:", id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [casoDetail, setCasoDetail] = useState({
    TipoDeCaso: "",
    tipoDeCasoFlat: "",
    TipoDeCasoTipoDeCasoid: "",
    etapa: "",
    fecha: "",
    fechaFin: "",
    idCaso: "",
    valor_pretensiones: "",
    honorarios: "",
    honorariosLiquidacion: "",
    cuotas: "",
    aceptacion_cotizacion: "",
    tiene_contrato: "",
    forma_de_pago: "",
    descripcion: "",
    ClienteCedulaCliente: "",
    AbogadoCedulaAbogado: "",
    Cliente: "",
    Abogado: "",
    radicado: "",
  });

  const [editingField, setEditingField] = useState(null);
  // const caso = useSelector((state) => state.caso); // Asumimos que el detalle del caso se almacena en 'caso'

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Devuelve una cadena vacía si dateString es nulo o indefinido
    const date = new Date(dateString);
    if (isNaN(date)) return ""; // Devuelve una cadena vacía si la fecha no es válida
    return date.toISOString().split("T")[0]; //.toLocaleDateString("es-CO"); // Convierte al formato YYYY-MM-DD
  };

  useEffect(() => {
    const obtenerCaso = async (id) => {
      try {
        const caso = await getCasoById(id);
        setCasoDetail(caso);
        dispatch(casoActual(caso));
      } catch (error) {
        console.error("Error al obtener el caso:", error);
      }
    };

    obtenerCaso(id);
  }, [id]);

  // console.log("Caso detail:", casoDetail);
  // ciudad: datos.Ciudads[0].nombre_ciudad,
  // departamento: datos.Ciudads[0].Departamentos[0].nombre_departamento,

  const valor_pretensiones_letras = numeroALetras(
    Number(casoDetail.valor_pretensiones)
  );
  // const valor_pretensiones = Number(casoDetail.valor_pretensiones).toLocaleString();
  const honorarios_letras = numeroALetras(Number(casoDetail.honorarios));
  const valorRadicar_letras = numeroALetras(Number(casoDetail.valorRadicar));
  const honorariosLiquidacion_letras = numeroALetras(Number(casoDetail.honorariosLiquidacion));
  // const honorarios = Number(casoDetail.honorarios).toLocaleString();

  const parseNumero = (numeroFormateado) => {
    return Number(numeroFormateado.replace(/[^0-9,-]+/g, "").replace(",", "."));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const { name } = e.target;
      setCasoDetail({
        ...casoDetail,
        [name]: parseNumero(casoDetail[name]), // Formatea el valor solo cuando se presiona Enter
      });
      setEditingField(null);
    }
  };

  const handleFinalizar = () => {
    // const isConfirmed = window.confirm(
    //   "¿Estás seguro de que deseas finalizar este caso?"
    // );

    // if (isConfirmed) {
    const fechaFin = new Date().toISOString().split("T")[0]; // Obtener la fecha actual en formato YYYY-MM-DD
    dispatch(finCaso(id, fechaFin));
    // dispatch(getCasos());
    // console.log("id", id, "fechaFin", fechaFin);
    navigate("/casos");
    // }
  };

  const handleDelete = () => {
    const isConfirmed = window.confirm(
      "¿Estás seguro de que deseas finalizar este caso?"
    );

    if (isConfirmed) {
      dispatch(deleteCaso(id));
      // console.log("id", id);
      navigate("/casos");
    }
  };

  const handleUpdateCaso = (e) => {
    e.preventDefault();
    dispatch(modificarCaso(casoDetail));
    window.localStorage.setItem("caso", JSON.stringify(casoDetail));
  };

  const handlerGenerarDocumentos = () => {
    generarDocumentos(casoDetail, valor_pretensiones_letras, honorarios_letras, valorRadicar_letras,honorariosLiquidacion_letras);
  };

  const handlerSolicitud = () => {
    dispatch(
      clienteActual({
        ...casoDetail.Cliente,
        cedula: casoDetail.ClienteCedulaCliente,
      })
    );
    navigate("/insolvencia");
  };

  const handlerCotizacion = () => {
    dispatch(
      clienteActual({
        ...casoDetail.Cliente,
        cedula: casoDetail.ClienteCedulaCliente,
      })
    );
    navigate("/cotizacion");
  };

  const handleUpdateDetailCaso = (e) => {

    if (e.target.name === "valor_pretensiones") {
      const valor = parseNumero(e.target.value);
      
      setCasoDetail({
        ...casoDetail,
        [e.target.name]: e.target.value,
        honorarios: valor*0.1 > 50000000 ? 50000000 : valor * 0.1,
      });
    } else {
      setCasoDetail({
        ...casoDetail,
        [e.target.name]: e.target.value,
      });
    }
 

    setEditingField(e.target.name);
  };

  return (
    <div className="contenedordetailcaso">
      <div className="detailcaso">
        <div className="encabezado">
          <h5 className="titulo">Detalles del caso</h5>
        </div>

        {user.cedulaCliente ? (
          <div className="menu-detail">
            <Link to="/casos">
              <Button className="btn btn-sm w-35 border border-accent bg-white hover:bg-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="none"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={50.5}
                    d="M244 400L100 256l144-144M120 256h292"
                  ></path>
                </svg>
                Volver
              </Button>
            </Link>
          </div>
        ) : (
          <div className="menu-detail">
            <input type="file" id="doc" />
            <Button
              className="botonesiniciosesion"
              onClick={handlerGenerarDocumentos}
            >
              Generar documentos
            </Button>
            <Button onClick={handleUpdateCaso} className="botonesiniciosesion">
              Actualizar
            </Button>
            <Button
              className="btn btn-sm w-35 border border-error bg-white hover:bg-white"
              onClick={handleDelete}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.2em"
                height="1.2em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="black"
                  d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"
                ></path>
              </svg>
              Eliminar
            </Button>
            <Link to="/casos">
              <Button className="btn btn-sm w-35 border border-accent bg-white hover:bg-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="none"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={50.5}
                    d="M244 400L100 256l144-144M120 256h292"
                  ></path>
                </svg>
                Volver
              </Button>
            </Link>
          </div>
        )}

        <div className="infotodos">
          <div className="infocaso">
            <br />
            <div className="infodetailcaso">
              <label htmlFor="idCaso" className="labeldetailcaso">
                Consecutivo de caso:
              </label>
              <input
                type="number"
                className="cajadetail"
                name="idCaso"
                id="idCaso"
                value={casoDetail.idCaso}
                onChange={handleUpdateDetailCaso}
                disabled
              />
            </div>
            {casoDetail.TipoDeCaso.descripcion !== "Insolvencia" && (
              <div className="infodetailcaso">
                <label htmlFor="radicado" className="labeldetailcaso">
                  N° Radicado Juzgado:
                </label>
                <input
                  type="text"
                  className="cajadetail"
                  name="radicado"
                  id="radicado"
                  value={casoDetail.radicado}
                  onChange={handleUpdateDetailCaso}
                />
              </div>
            )}
            <div className="infodetailcaso">
              <label htmlFor="nombres" className="labeldetailcaso">
                Tipo de caso:
              </label>
              <input
                type="text"
                className="cajadetail"
                name="tipoDeCasoFlat"
                id="tipoDeCasoFlat"
                value={casoDetail.TipoDeCaso.descripcion}
                onChange={handleUpdateDetailCaso}
              />
            </div>
            {casoDetail.TipoDeCaso.descripcion === "Insolvencia" && (
              <div className="botonescotizacion">
                <div className="infodetailcaso">
                  <Buttonf onClick={handlerSolicitud}>Solicitud</Buttonf>
                </div>
                <div className="infodetailcaso">
                  <Buttonf onClick={handlerCotizacion}> Cotización</Buttonf>
                </div>
              </div>
            )}
            <div className="infodetailcaso">
              <label htmlFor="etapa" className="labeldetailcaso">
                Etapa:
              </label>
              <input
                type="text"
                className="cajadetail"
                name="etapa"
                id="etapa"
                value={casoDetail.etapa}
                onChange={handleUpdateDetailCaso}
              />
            </div>
            <div className="infodetailcaso">
              <label htmlFor="fecha" className="labeldetailcaso">
                Fecha:
              </label>
              <input
                type="text"
                className="cajadetail"
                name="fecha"
                id="fecha"
                value={formatDate(casoDetail.fecha)}
                onChange={handleUpdateDetailCaso}
              />
            </div>
            {casoDetail.fechaFin ? (
              <div className="infodetailcaso">
                <label htmlFor="fechaFin" className="labeldetailcaso">
                  Fecha de finalización:
                </label>
                <input
                  type="text"
                  className="cajadetail"
                  name="fechaFin"
                  id="fechaFin"
                  value={formatDate(casoDetail.fechaFin)}
                  onChange={handleUpdateDetailCaso}
                />
              </div>
            ) : (
              <div className="infodetailcaso">
                <label htmlFor="fechaFin" className="labeldetailcaso">
                  Fecha de finalización:
                </label>
                <div className="cajadetail">
                  <Buttonf onClick={handleFinalizar}>Finalizar</Buttonf>
                </div>
              </div>
            )}

            <div className="infodetailcaso">
              <label htmlFor="valor_pretensiones" className="labeldetailcaso">
                Valor pretensiones: $
              </label>
              <input
                type="text"
                className="cajadetail"
                name="valor_pretensiones"
                id="valor_pretensiones"
                onChange={handleUpdateDetailCaso}
                value={
                  editingField === "valor_pretensiones"
                    ? casoDetail.valor_pretensiones
                    : (casoDetail.valor_pretensiones)
                }
                onKeyDown={handleKeyPress}
              />
            </div>
            <div className="infodetailcaso">
              <label htmlFor="honorarios" className="labeldetailcaso">
                Valor honorarios: $
              </label>
              <input
                type="number"
                className="cajadetail"
                name="honorarios"
                id="honorarios"
                onChange={handleUpdateDetailCaso}
                value={
                  casoDetail.honorarios
                }
                onKeyDown={handleKeyPress}
              />
            </div>
            <div className="infodetailcaso">
              <label htmlFor="cuotas" className="labeldetailcaso">
                Número de cuotas:
              </label>
              <input
                type="text"
                className="cajadetail"
                name="cuotas"
                id="cuotas"
                onChange={handleUpdateDetailCaso}
                value={
                  editingField === "cuotas"
                    ? casoDetail.cuotas
                    : (casoDetail.cuotas)
                }
                onKeyDown={handleKeyPress}
              />
            </div>
            <div className="infodetailcaso">
              <label htmlFor="porcentajeInicial" className="labeldetailcaso">
                Cuota inicial:
              </label>
              <input
                type="text"
                className="cajadetail"
                name="porcentajeInicial"
                id="porcentajeInicial"
                onChange={handleUpdateDetailCaso}
                value={
                  editingField === "porcentajeInicial"
                    ? casoDetail.porcentajeInicial
                    : (casoDetail.porcentajeInicial)
                }
                onKeyDown={handleKeyPress}
              />
            </div>
                        <div className="infodetailcaso">
              <label htmlFor="porcentajeInicial" className="labeldetailcaso">
                Valor para radicar:
              </label>
              <input
                type="text"
                className="cajadetail"
                name="valorRadicar"
                id="valorRadicar"
                onChange={handleUpdateDetailCaso}
                value={
                  editingField === "valorRadicar"
                    ? casoDetail.valorRadicar
                    : (casoDetail.valorRadicar)
                }
                onKeyDown={handleKeyPress}
              />
            </div>
            <div className="infodetailcaso">
              <label htmlFor="honorariosLiquidacion" className="labeldetailcaso">
                Mensualidad liquidación:
              </label>
              <input
                type="text"
                className="cajadetail"
                name="honorariosLiquidacion"
                id="honorariosLiquidacion"
                onChange={handleUpdateDetailCaso}
                value={
                  editingField === "honorariosLiquidacion"
                    ? casoDetail.honorariosLiquidacion
                    : (casoDetail.honorariosLiquidacion)
                }
                onKeyDown={handleKeyPress}
              />
            </div>
            <div className="infodetailcaso">
              <label
                htmlFor="aceptacion_cotizacion"
                className="labeldetailcaso"
              >
                Aceptación de cotización:
              </label>
              <input
                type="text"
                className="cajadetail"
                name="aceptacion_cotizacion"
                id="aceptacion_cotizacion"
                value={casoDetail.aceptacion_cotizacion}
                onChange={handleUpdateDetailCaso}
              />
            </div>
            <div className="infodetailcaso">
              <label htmlFor="tiene_contrato" className="labeldetailcaso">
                Tiene contrato?
              </label>
              <input
                type="text"
                className="cajadetail"
                name="tiene_contrato"
                id="tiene_contrato"
                value={casoDetail.tiene_contrato}
                onChange={handleUpdateDetailCaso}
              />
            </div>
            <div className="infodetailcaso">
              <label htmlFor="descripcion" className="labeldetailcaso">
                Descripcion:
              </label>

              <input
                type="text"
                cols="80"
                rows="6"
                className="cajadetail"
                name="descripcion"
                id="descripcion"
                value={casoDetail.descripcion}
              />
            </div>
          </div>
          <div className="infocliente">
            <div className="encabezadoAbogado">
              <h6 className="titulo">Cliente</h6>
            </div>
            <div className="infodetailcaso">
              <label htmlFor="ClienteCedulaCliente" className="labeldetailcaso">
                Número de cédula:
              </label>
              <input
                type="number"
                className="cajadetail"
                name="ClienteCedulaCliente"
                id="ClienteCedulaCliente"
                value={casoDetail.ClienteCedulaCliente}
                disabled
              />
            </div>
            <div className="infodetailcaso">
              <label htmlFor="nombresCliente" className="labeldetailcaso">
                Nombre (s):
              </label>
              <input
                type="text"
                className="cajadetail"
                name="nombresCliente"
                id="nombresCliente"
                value={casoDetail.Cliente.nombres}
                disabled
              />
            </div>
            <div className="infodetailcaso">
              <label htmlFor="apellidosCliente" className="labeldetailcaso">
                Apellido (s):
              </label>
              <input
                type="text"
                className="cajadetail"
                name="apellidosCliente"
                id="apellidosCliente"
                value={casoDetail.Cliente.apellidos}
                disabled
              />
            </div>
            <div className="infodetailcaso">
              <label htmlFor="celularCliente" className="labeldetailcaso">
                Número de celular:
              </label>
              <input
                type="number"
                className="cajadetail"
                name="celularCliente"
                id="celularCliente"
                value={casoDetail.Cliente.celular}
                disabled
              />
            </div>
            <div className="infodetailcaso">
              <label htmlFor="emailCliente" className="labeldetailcaso">
                Correo electrónico:
              </label>
              <input
                type="email"
                className="cajadetail"
                name="emailCliente"
                id="emailCliente"
                value={casoDetail.Cliente.email}
                disabled
              />
            </div>
            <div className="infodetailcaso">
              <label htmlFor="direccionCliente" className="labeldetailcaso">
                Dirección:
              </label>
              <input
                type="text"
                className="cajadetail"
                name="direccionCliente"
                id="direccionCliente"
                value={casoDetail.Cliente.direccion}
                disabled
              />
            </div>
            <br />
            <br />
            <div className="encabezadoAbogado">
              <h6 className="titulo">Abogado</h6>
            </div>
            <div className="infodetailcaso">
              <label htmlFor="AbogadoCedulaAbogado" className="labeldetailcaso">
                Número de cédula:
              </label>
              <input
                type="number"
                className="cajadetail"
                name="AbogadoCedulaAbogado"
                id="AbogadoCedulaAbogado"
                value={casoDetail.AbogadoCedulaAbogado}
                disabled
              />
            </div>
            <div className="infodetailcaso">
              <label htmlFor="nombresAbogado" className="labeldetailcaso">
                Nombre (s):
              </label>
              <input
                type="text"
                className="cajadetail"
                name="nombresAbogado"
                id="nombresAbogado"
                value={casoDetail.Abogado.nombres}
                disabled
              />
            </div>
            <div className="infodetailcaso">
              <label htmlFor="apellidosAbogado" className="labeldetailcaso">
                Apellido (s):
              </label>
              <input
                type="text"
                className="cajadetail"
                name="apellidosAbogado"
                id="apellidosAbogado"
                value={casoDetail.Abogado.apellidos}
                disabled
              />
            </div>
            <div className="infodetailcaso">
              <label htmlFor="celularAbogado" className="labeldetailcaso">
                Número de celular:
              </label>
              <input
                type="number"
                className="cajadetail"
                name="celularAbogado"
                id="celularAbogado"
                value={casoDetail.Abogado.celular}
                disabled
              />
            </div>
            <div className="infodetailcaso">
              <label htmlFor="emailAbogado" className="labeldetailcaso">
                Correo electrónico:
              </label>
              <input
                type="email"
                className="cajadetail"
                name="emailAbogado"
                id="emailAbogado"
                value={casoDetail.Abogado.email}
                disabled
              />
            </div>
            <div className="infodetailcaso">
              <label htmlFor="direccionAbogado" className="labeldetailcaso">
                Dirección:
              </label>
              <input
                type="text"
                className="cajadetail"
                name="direccionAbogado"
                id="direccionAbogado"
                value={casoDetail.Abogado.direccion}
                disabled
              />
            </div>
          </div>
          {/* <div className="infoabogado">
            
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default DetailCasos;
