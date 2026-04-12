import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  const Prospecto = sequelize.define(
    "Prospecto",
    {
      idProspecto: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      cedulaProspecto: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nombres: { type: DataTypes.STRING, allowNull: false },
      apellidos: { type: DataTypes.STRING, allowNull: false },
      direccion: { type: DataTypes.STRING, allowNull: true },
      celular: { type: DataTypes.BIGINT, allowNull: false },
      comentarios: { type: DataTypes.TEXT, allowNull: true },
      impuestoLaboral: { type: DataTypes.STRING, allowNull: true },
      vehiculoCooperativas: { type: DataTypes.STRING, allowNull: true },
      hipotecario: { type: DataTypes.STRING, allowNull: true },
      proveedores: { type: DataTypes.STRING, allowNull: true },
      bancoPersonas: { type: DataTypes.STRING, allowNull: true },
      familiares: { type: DataTypes.STRING, allowNull: true },
      tieneBienes: { type: DataTypes.STRING, allowNull: true },
      bienes: { type: DataTypes.STRING, allowNull: true },
      servicio: { type: DataTypes.STRING, allowNull: true },
      genero: { type: DataTypes.STRING, allowNull: true },
      totalBienes: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "No se ha registrado",
      },
      numeroEntidades: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      tiempoMora: {
        type: DataTypes.STRING,
        allowNull: true,
        // defaultValue: "Más de 90 días",
      },
      totalDeudas: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "No se ha registrado",
      },
      modoContacto: { type: DataTypes.STRING, allowNull: true },
      contactado: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "No",
      },
      tieneCotizacion: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "No",
      },
      tieneProcesos: {
        type: DataTypes.STRING,
        allowNull: true,
        // defaultValue: "No",
      },
      cotizacionAprobada: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "No",
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "lead",
      },
      calificacion: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "sincontacto",
      },
      responsable: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "mercadeo",
      },
      fuente: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "noseleccionado",
      },
      fechaCierre: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
      createdAt: "fechaCreacion",
      updatedAt: "fechaActualizacion",
    },
  );
  return Prospecto;
};
