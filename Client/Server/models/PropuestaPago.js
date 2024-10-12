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
      clase: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      interes: { type: DataTypes.BIGINT, allowNull: false },
      valor: { type: DataTypes.BIGINT, allowNull: false },
      plazo: { type: DataTypes.BIGINT, allowNull: false },
    },
    { timestamps: false }
  );
  return PropuestaPago;
};
