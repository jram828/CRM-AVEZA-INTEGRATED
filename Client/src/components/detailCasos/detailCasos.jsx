import "./detailCasos.css";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  casoActual,
  clienteActual,
  deleteCaso,
  finCaso,
  modificarCaso,
} from "../../redux/actions";

import {
  Box,
  Grid,
  TextField,
  Typography,
  Button as MuiButton,
  Paper,
  Divider,
} from "@mui/material";

import { getCasoById } from "../../handlers/detailCaso";
import { numeroALetras } from "../convertiraletras";
import { generarDocumentos } from "../../handlers/generarDocumentos";
import { formatNumero } from "../../utils/formatNumero";

function DetailCasos() {
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const Caso = useSelector((state) => state.caso);

  const { id } = useParams(); // Obtener el id de los parámetros de la ruta
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
    Honorarios: [],
    Deuda2s: [],
    porcentajeInicial: "",
    valorRadicar: "",
  });

  const [editingField, setEditingField] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Devuelve una cadena vacía si dateString es nulo o indefinido
    const date = new Date(dateString);
    if (isNaN(date)) return ""; // Devuelve una cadena vacía si la fecha no es válida
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const obtenerCaso = async (id) => {
      try {
        const caso = await getCasoById(id);
        const casoTransformado = {
          idCaso: caso.idCaso ?? "",
          radicado: caso.radicado ?? "",
          juzgado: caso.juzgado ?? "",
          fecha: caso.fecha ?? "",
          fechaFin: caso.fechaFin ?? "",
          descripcion: caso.descripcion ?? "",
          valor_pretensiones: caso.Cliente?.Honorarios?.[0]?.totalDeudas ?? "",
          aceptacion_cotizacion: caso.aceptacion_cotizacion ?? "",
          honorarios: caso.Cliente?.Honorarios?.[0]?.valorHonorarios ?? "",
          honorariosLiquidacion:
            caso.Cliente?.Honorarios?.[0]?.honorariosLiquidacion ?? "",
          cuotas: caso.Cliente?.Honorarios?.[0]?.cuotasHonorarios ?? "",
          porcentajeInicial: caso.Cliente?.Honorarios?.[0]?.inicial ?? "",
          valorRadicar: caso.Cliente?.Honorarios?.[0]?.valorRadicar ?? "",
          forma_de_pago: caso.forma_de_pago ?? "",
          etapa: caso.etapa ?? "",
          tiene_contrato: caso.tiene_contrato ?? "",
          activo: caso.activo ?? true,
          ClienteCedulaCliente: caso.ClienteCedulaCliente ?? "",
          AbogadoCedulaAbogado: caso.AbogadoCedulaAbogado ?? "",
          TipoDeCasoTipoDeCasoid: caso.TipoDeCasoTipoDeCasoid ?? "",
          TipoDeCaso: caso.TipoDeCaso ?? "",
          tipoDeCasoFlat: caso.TipoDeCaso?.descripcion ?? "",
          Cliente: caso.Cliente ?? {},
          Abogado: caso.Abogado ?? {},
          Honorarios: caso.Cliente?.Honorarios ?? [],
          Deuda2s: caso.Cliente?.Deuda2s ?? [],
        };

        setCasoDetail(casoTransformado);
        dispatch(casoActual(casoTransformado));
      } catch (error) {
        console.error("Error al obtener el caso:", error);
      }
    };

    obtenerCaso(id);
  }, [id, dispatch]);

  const valor_pretensiones_letras = numeroALetras(
    Number(casoDetail.valor_pretensiones)
  );
  const honorarios_letras = numeroALetras(Number(casoDetail.honorarios));
  const valorRadicar_letras = numeroALetras(Number(casoDetail.valorRadicar));
  const honorariosLiquidacion_letras = numeroALetras(
    Number(casoDetail.honorariosLiquidacion)
  );

  const parseNumero = (numeroFormateado) => {
    if (typeof numeroFormateado === "number") return numeroFormateado;
    return Number(
      String(numeroFormateado)
        .replace(/[^0-9,-]+/g, "")
        .replace(",", ".")
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const { name } = e.target;
      setCasoDetail((prev) => ({
        ...prev,
        [name]: parseNumero(prev[name]),
      }));
      setEditingField(null);
    }
  };

  const handleFinalizar = () => {
    const fechaFin = new Date().toISOString().split("T")[0];
    dispatch(finCaso(id, fechaFin));
    navigate("/casos");
  };

  const handleDelete = () => {
    const isConfirmed = window.confirm(
      "¿Estás seguro de que deseas finalizar este caso?"
    );

    if (isConfirmed) {
      dispatch(deleteCaso(id));
      navigate("/casos");
    }
  };

  const handleUpdateCaso = (e) => {
    e.preventDefault();
    dispatch(modificarCaso(casoDetail));
    window.localStorage.setItem("caso", JSON.stringify(casoDetail));
  };

  const handlerGenerarDocumentos = () => {
    generarDocumentos(
      casoDetail,
      valor_pretensiones_letras,
      honorarios_letras,
      valorRadicar_letras,
      honorariosLiquidacion_letras
    );
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
    const { name, value } = e.target;

    if (name === "valor_pretensiones") {
      const valor = parseNumero(value);
      setCasoDetail((prev) => ({
        ...prev,
        [name]: value,
        honorarios: valor * 0.1 > 50000000 ? 50000000 : valor * 0.1,
      }));
    } else {
      setCasoDetail((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setEditingField(name);
  };

  const Cliente = casoDetail.Cliente || {};
  const Abogado = casoDetail.Abogado || {};
  const tipoDescripcion = casoDetail.TipoDeCaso?.descripcion || "";

  return (
    <div className="contenedordetailcaso">
      <Paper elevation={2} className="detailcaso" sx={{ padding: 2 }}>
        <Box className="encabezado" mb={2}>
          <Typography variant="h6" className="titulo">
            Detalles del caso
          </Typography>
        </Box>

        {user?.cedulaCliente ? (
          <Box className="menu-detail" mb={2}>
            <MuiButton
              component={Link}
              to="/casos"
              variant="outlined"
              size="small"
            >
              Volver
            </MuiButton>
          </Box>
        ) : (
          <Box
            className="menu-detail"
            mb={2}
            display="flex"
            gap={1}
            alignItems="center"
          >
            <label htmlFor="doc">
              <MuiButton variant="outlined" component="span" sx={{ mr: 1 }}>
                Seleccionar archivo
              </MuiButton>
            </label>
            <input id="doc" type="file" style={{ display: "none" }} />

            <MuiButton
              variant="contained"
              onClick={handlerGenerarDocumentos}
              color="primary"
              sx={{ mr: 1 }}
            >
              Generar documentos
            </MuiButton>
            <MuiButton variant="contained" onClick={handleUpdateCaso}>
              Actualizar
            </MuiButton>
            <MuiButton variant="outlined" color="error" onClick={handleDelete}>
              Eliminar
            </MuiButton>
            <MuiButton
              component={Link}
              to="/casos"
              variant="outlined"
              size="small"
            >
              Volver
            </MuiButton>
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2} className="infotodos">
          <Grid item xs={12} md={6} className="infocaso">
            <Box mb={1}>
              <TextField
                fullWidth
                label="Consecutivo de caso"
                name="idCaso"
                id="idCaso"
                value={casoDetail.idCaso}
                onChange={handleUpdateDetailCaso}
                disabled
                size="small"
              />
            </Box>

            {tipoDescripcion !== "Insolvencia" && (
              <Box mb={1}>
                <TextField
                  fullWidth
                  label="N° Radicado Juzgado"
                  name="radicado"
                  id="radicado"
                  value={casoDetail.radicado}
                  onChange={handleUpdateDetailCaso}
                  size="small"
                />
              </Box>
            )}

            <Box mb={1}>
              <TextField
                fullWidth
                label="Tipo de caso"
                name="tipoDeCasoFlat"
                id="tipoDeCasoFlat"
                value={tipoDescripcion}
                onChange={handleUpdateDetailCaso}
                size="small"
              />
            </Box>

            {tipoDescripcion === "Insolvencia" && (
              <Box className="botonescotizacion" display="flex" gap={1} mb={1}>
                <MuiButton variant="outlined" onClick={handlerSolicitud}>
                  Solicitud
                </MuiButton>
                <MuiButton variant="outlined" onClick={handlerCotizacion}>
                  Cotización
                </MuiButton>
              </Box>
            )}

            <Box mb={1}>
              <TextField
                fullWidth
                label="Etapa"
                name="etapa"
                id="etapa"
                value={casoDetail.etapa}
                onChange={handleUpdateDetailCaso}
                size="small"
              />
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Fecha"
                name="fecha"
                id="fecha"
                value={formatDate(casoDetail.fecha)}
                onChange={handleUpdateDetailCaso}
                size="small"
              />
            </Box>

            <Box mb={1}>
              {casoDetail.fechaFin ? (
                <TextField
                  fullWidth
                  label="Fecha de finalización"
                  name="fechaFin"
                  id="fechaFin"
                  value={formatDate(casoDetail.fechaFin)}
                  onChange={handleUpdateDetailCaso}
                  size="small"
                />
              ) : (
                <Box display="flex" alignItems="center">
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    Fecha de finalización:
                  </Typography>
                  <MuiButton variant="outlined" onClick={handleFinalizar}>
                    Finalizar
                  </MuiButton>
                </Box>
              )}
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Valor total deudas"
                name="valor_pretensiones"
                id="valor_pretensiones"
                value={casoDetail.valor_pretensiones || ""}
                onChange={handleUpdateDetailCaso}
                onKeyDown={handleKeyPress}
                size="small"
              />
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Valor honorarios"
                name="honorarios"
                id="honorarios"
                type="number"
                value={casoDetail.honorarios || ""}
                onChange={handleUpdateDetailCaso}
                onKeyDown={handleKeyPress}
                size="small"
              />
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Número de cuotas"
                name="cuotas"
                id="cuotas"
                value={casoDetail.cuotas || ""}
                onChange={handleUpdateDetailCaso}
                onKeyDown={handleKeyPress}
                size="small"
              />
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Cuota inicial"
                name="porcentajeInicial"
                id="porcentajeInicial"
                value={casoDetail.porcentajeInicial || ""}
                onChange={handleUpdateDetailCaso}
                onKeyDown={handleKeyPress}
                size="small"
              />
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Valor para radicar"
                name="valorRadicar"
                id="valorRadicar"
                value={casoDetail.valorRadicar || ""}
                onChange={handleUpdateDetailCaso}
                onKeyDown={handleKeyPress}
                size="small"
              />
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Mensualidad liquidación"
                name="honorariosLiquidacion"
                id="honorariosLiquidacion"
                value={casoDetail.honorariosLiquidacion || ""}
                onChange={handleUpdateDetailCaso}
                onKeyDown={handleKeyPress}
                size="small"
              />
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Aceptación de cotización"
                name="aceptacion_cotizacion"
                id="aceptacion_cotizacion"
                value={casoDetail.aceptacion_cotizacion}
                onChange={handleUpdateDetailCaso}
                size="small"
              />
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Tiene contrato?"
                name="tiene_contrato"
                id="tiene_contrato"
                value={casoDetail.tiene_contrato}
                onChange={handleUpdateDetailCaso}
                size="small"
              />
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Descripcion"
                name="descripcion"
                id="descripcion"
                value={casoDetail.descripcion}
                onChange={handleUpdateDetailCaso}
                multiline
                rows={3}
                size="small"
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6} className="infocliente">
            <Box className="encabezadoAbogado" mb={1}>
              <Typography variant="subtitle1" className="titulo">
                Cliente
              </Typography>
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Número de cédula"
                name="ClienteCedulaCliente"
                id="ClienteCedulaCliente"
                value={casoDetail.ClienteCedulaCliente}
                disabled
                size="small"
              />
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Nombre (s)"
                name="nombresCliente"
                id="nombresCliente"
                value={Cliente.nombres || ""}
                disabled
                size="small"
              />
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Apellido (s)"
                name="apellidosCliente"
                id="apellidosCliente"
                value={Cliente.apellidos || ""}
                disabled
                size="small"
              />
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Número de celular"
                name="celularCliente"
                id="celularCliente"
                value={Cliente.celular || ""}
                disabled
                size="small"
              />
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Correo electrónico"
                name="emailCliente"
                id="emailCliente"
                value={Cliente.email || ""}
                disabled
                size="small"
              />
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                label="Dirección"
                name="direccionCliente"
                id="direccionCliente"
                value={Cliente.direccion || ""}
                disabled
                size="small"
              />
            </Box>

            <Box className="encabezadoAbogado" mb={1}>
              <Typography variant="subtitle1" className="titulo">
                Abogado
              </Typography>
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Número de cédula"
                name="AbogadoCedulaAbogado"
                id="AbogadoCedulaAbogado"
                value={casoDetail.AbogadoCedulaAbogado}
                disabled
                size="small"
              />
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Nombre (s)"
                name="nombresAbogado"
                id="nombresAbogado"
                value={Abogado.nombres || ""}
                disabled
                size="small"
              />
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Apellido (s)"
                name="apellidosAbogado"
                id="apellidosAbogado"
                value={Abogado.apellidos || ""}
                disabled
                size="small"
              />
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Número de celular"
                name="celularAbogado"
                id="celularAbogado"
                value={Abogado.celular || ""}
                disabled
                size="small"
              />
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Correo electrónico"
                name="emailAbogado"
                id="emailAbogado"
                value={Abogado.email || ""}
                disabled
                size="small"
              />
            </Box>

            <Box mb={1}>
              <TextField
                fullWidth
                label="Dirección"
                name="direccionAbogado"
                id="direccionAbogado"
                value={Abogado.direccion || ""}
                disabled
                size="small"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default DetailCasos;
