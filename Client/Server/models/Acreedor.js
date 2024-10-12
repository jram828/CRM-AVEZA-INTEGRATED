import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  const Acreedor = sequelize.define(
    "Acreedor",
    {      idAcreedor: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
      NIT: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nombre: { type: DataTypes.STRING, allowNull: true, primaryKey: true },
      direccion: { type: DataTypes.STRING, allowNull: true },
      ciudad: { type: DataTypes.STRING, allowNull: true },
      telefono: { type: DataTypes.STRING, allowNull: true },
    },
    { timestamps: false }
  );
  return Acreedor;
};
