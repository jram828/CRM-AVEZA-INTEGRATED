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

const ProspectoCard = React.memo(
  ({
    prospecto,
    notaReciente,
    IconComp,
    color,
    tooltip,
    onClickDetail,
    handleStatusChange,
    handleCalificacionChange,
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
                onClick={(e) => handleOpenOverlay(e, prospecto)}
              >
                <AddCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Link
            to="/detail"
            onClick={() => onClickDetail(prospecto)}
            className="link"
          >
            <Typography variant="subtitle1">
              {prospecto.nombres} {prospecto.apellidos}
            </Typography>
          </Link>
          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <InputLabel>Calificación</InputLabel>
            <Select
              value={prospecto.calificacion}
              label="Calificacion"
              onChange={(e) =>
                handleCalificacionChange(prospecto.idProspecto, e.target.value)
              }
            >
              <MenuItem value="sincontacto">
                ❌ 1. Registrado sin contacto
              </MenuItem>
              <MenuItem value="contactoefectivo">
                📞 2. Contacto efectivo
              </MenuItem>
              <MenuItem value="contactonoefectivo">
                🟠 2. Contacto NO efectivo
              </MenuItem>
              <MenuItem value="leadcalificado">✅ 3. Lead calificado</MenuItem>
              <MenuItem value="leadnocalificado">
                🔄 3. Lead no calificado - Remarketing
              </MenuItem>
              <MenuItem value="nocaldescartado">
                🗑️ 4. No calificado - Descartado
              </MenuItem>
              <MenuItem value="cotizacionenevaluacion">
                💰 5. Cotización en evaluación
              </MenuItem>
              <MenuItem value="cotizacionrechazada">
                ⚠️ 5. Cotización rechazada
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={prospecto.status}
              label="Status"
              onChange={(e) =>
                handleStatusChange(prospecto.idProspecto, e.target.value)
              }
            >
              <MenuItem value="lead">👤 1. Lead</MenuItem>
              <MenuItem value="agendado">📅 2. Agendado</MenuItem>
              <MenuItem value="asesorado">📞 3. Asesorado</MenuItem>
              <MenuItem value="cotizado">✅ 4. Cotizado</MenuItem>
              <MenuItem value="esperadocumentos">
                📄 5. Espera de documentos
              </MenuItem>
              <MenuItem value="contratoenviado">
                📤 5. Contrato enviado
              </MenuItem>
              <MenuItem value="remarketing">🔄 6. Remarketing</MenuItem>
              <MenuItem value="descartado">🗑️ 7. Descartado</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>
    );
  },
);

ProspectoCard.displayName = "ProspectoCard";

ProspectoCard.propTypes = {
  prospecto: PropTypes.shape({
    nombres: PropTypes.string.isRequired,
    apellidos: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    calificacion: PropTypes.string,
    idProspecto: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
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
  handleCalificacionChange: PropTypes.func.isRequired,
  handleOpenOverlay: PropTypes.func.isRequired,
};

export default ProspectoCard;
