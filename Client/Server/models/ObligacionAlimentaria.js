import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  const ObligacionAlimentaria = sequelize.define(
    "ObligacionAlimentaria",
    {
      idObligacionAlimentaria: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      nombresHijo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      idHijo: { type: DataTypes.BIGINT, allowNull: false },
    },
    { timestamps: false }
  );
  return ObligacionAlimentaria;
};
