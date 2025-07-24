import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  const Prospecto = sequelize.define(
    "Prospecto",
    {
      idProspecto:{
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
      impuestoLaboral: { type: DataTypes.STRING, allowNull: false },
      vehiculoCooperativas: { type: DataTypes.STRING, allowNull: false },
      hipotecario: { type: DataTypes.STRING, allowNull: false },
      proveedores: { type: DataTypes.STRING, allowNull: false },
      bancoPersonas: { type: DataTypes.STRING, allowNull: false },
      familiares: { type: DataTypes.STRING, allowNull: false },
      tieneBienes: { type: DataTypes.STRING, allowNull: false },
      bienes: { type: DataTypes.STRING, allowNull: false },
      totalBienes: { type: DataTypes.STRING, allowNull: false },
      totalDeudas: { type: DataTypes.STRING, allowNull: false },
      modoContacto: { type: DataTypes.STRING, allowNull: false },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    { timestamps: true, createdAt: "fechaCreacion", updatedAt: "fechaActualizacion" }
  );
  return Prospecto;
};
