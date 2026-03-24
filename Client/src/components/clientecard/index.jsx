import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Note as NoteIcon,
  CalendarToday as CalendarTodayIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const ClienteCard = React.memo(
  ({
    cliente,
    notaReciente,
    IconComp,
    color,
    tooltip,
    onClickDetail,
    handleStatusChange,
    handleFaseChange,
    handleOpenOverlay,
  }) => {
    return (
      <Card sx={{ mb: 2, bgcolor: "#f9f9f9", position: "relative" }}>
        <CardContent sx={{ pt: 4 }}>
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: 1,
            }}
          >
            {notaReciente ? (
              <Tooltip title={notaReciente.descripcion}>
                <IconButton size="small">
                  <NoteIcon fontSize="small" sx={{ color: "#6c63ff" }} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Sin notas">
                <IconButton size="small" disabled>
                  <NoteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {IconComp ? (
              <Tooltip title={tooltip}>
                <IconButton size="small">
                  <IconComp sx={{ color }} fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Sin actividad">
                <IconButton size="small" disabled>
                  <CalendarTodayIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            <Divider orientation="vertical" flexItem />

            <Tooltip title="Crear actividad">
              <IconButton
                size="small"
                onClick={(e) => handleOpenOverlay(e, cliente)}
              >
                <AddCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Link
            to="/detail"
            onClick={() => onClickDetail(cliente)}
            className="link"
          >
            <Typography variant="subtitle1">
              {cliente.nombres} {cliente.apellidos}
            </Typography>
          </Link>

          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={cliente.status}
              label="Status"
              onChange={(e) =>
                handleStatusChange(cliente.cedulaCliente, e.target.value)
              }
            >
              <MenuItem value="cotizacionenevaluacion">
                💰 5. Cotización en evaluación
              </MenuItem>
              <MenuItem value="cotizacionrechazada">
                ⚠️ 5. Cotización rechazada
              </MenuItem>
              <MenuItem value="documentacion">📄 6. Documentación</MenuItem>
              <MenuItem value="contratoenevaluacion">
                📑 7. Contrato en evaluación
              </MenuItem>
              <MenuItem value="clienteactivo">🟢 8. Cliente activo</MenuItem>
              <MenuItem value="remarketing">📢 8. Remarketing</MenuItem>
              <MenuItem value="clienteprocesoactivo">
                ⚙️ 8. Cliente con Proceso Activo
              </MenuItem>
              <MenuItem value="fidelizacion">🤝 9. Fidelización</MenuItem>
              <MenuItem value="descartado">🚫 10. Descartado</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <InputLabel>Fase</InputLabel>
            <Select
              value={cliente.fase}
              label="Fase"
              onChange={(e) =>
                handleFaseChange(cliente.cedulaCliente, e.target.value)
              }
            >
              <MenuItem value="necesitaanalisis">
                💰 1. Necesita análisis
              </MenuItem>
              <MenuItem value="propuestavalor">
                ⚠️ 2. Propuesta de valor
              </MenuItem>
              <MenuItem value="identificarresponsables">
                📄 3. Identificar responsables
              </MenuItem>
              <MenuItem value="cotizacion">
                📑 4. Cotización de propuesta / precio
              </MenuItem>
              <MenuItem value="negociacion">
                🔄 5. Negociación / revisión
              </MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>
    );
  },
);

ClienteCard.displayName = "ClienteCard";

ClienteCard.propTypes = {
  cliente: PropTypes.shape({
    nombres: PropTypes.string.isRequired,
    apellidos: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    fase: PropTypes.string.isRequired,
    cedulaCliente: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,
  notaReciente: PropTypes.shape({
    descripcion: PropTypes.string.isRequired,
  }),
  IconComp: PropTypes.elementType,
  color: PropTypes.string,
  tooltip: PropTypes.string,
  onClickDetail: PropTypes.func.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
  handleFaseChange: PropTypes.func.isRequired,
  handleOpenOverlay: PropTypes.func.isRequired,
};

export default ClienteCard;
