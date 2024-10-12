import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  const Ingreso = sequelize.define(
    "Ingreso",
    {
      idIngreso: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      concepto: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      valor: { type: DataTypes.BIGINT, allowNull: false },
    },
    { timestamps: false }
  );
  return Ingreso;
};
