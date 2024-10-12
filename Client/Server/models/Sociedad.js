import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  const Sociedad = sequelize.define(
    "Sociedad",
    {
      idSociedad: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      nombresApellidos: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cedulaConyuge: { type: DataTypes.BIGINT, allowNull: false },
    },
    { timestamps: false }
  );
  return Sociedad;
};
