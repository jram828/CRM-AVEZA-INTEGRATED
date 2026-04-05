import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Cliente = sequelize.define(
    "Cliente",
    {
      cedulaCliente: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nombres: { type: DataTypes.STRING, allowNull: false },
      apellidos: { type: DataTypes.STRING, allowNull: false },
      direccion: { type: DataTypes.STRING, allowNull: false },
      celular: { type: DataTypes.BIGINT, allowNull: false },
      comentarios: { type: DataTypes.TEXT, allowNull: true },
      modoContacto: { type: DataTypes.STRING, allowNull: true },
      servicio: { type: DataTypes.STRING, allowNull: true },
      genero: { type: DataTypes.STRING, allowNull: true },
      totalDeudas: { type: DataTypes.STRING, allowNull: true },
      tiempoMora: { type: DataTypes.STRING, allowNull: true },
      numeroEntidades: { type: DataTypes.INTEGER, allowNull: true },
      totalBienes: { type: DataTypes.STRING, allowNull: true },
      fechaCierre: { type: DataTypes.STRING, allowNull: true },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "cotizacionenevaluacion",
      },
      fase: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "necesitaanalisis",
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
      tieneProcesos: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "No",
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
  return Cliente;
};