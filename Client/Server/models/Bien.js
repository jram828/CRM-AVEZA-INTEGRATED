import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  const Bien = sequelize.define(
    "Bien",
    {
      idBien: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      tipoBien: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      valor: { type: DataTypes.BIGINT, allowNull: false },
      tipoAfectacion: { type: DataTypes.STRING, defaultValue: "Ninguna" },
      descripcionBien: { type: DataTypes.STRING, allowNull: false },
    },
    { timestamps: false }
  );
  return Bien;
};
