import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  const PropuestaPago = sequelize.define(
    "PropuestaPago",
    {
      idPropuesta: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      Clasificacion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tasaIntereses: { type: DataTypes.FLOAT, allowNull: false },
      valorCuota: { type: DataTypes.BIGINT, allowNull: false },
      numeroCuotas: { type: DataTypes.BIGINT, allowNull: false },
    },
    { timestamps: false }
  );
  return PropuestaPago;
};
