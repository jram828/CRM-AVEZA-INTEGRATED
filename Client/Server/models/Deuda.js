import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  const Deuda = sequelize.define(
    "Deuda",
    {
      idDeuda: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      tipoDeuda: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tipoGarantia: { type: DataTypes.STRING, allowNull: false },
      documentoSoporte: { type: DataTypes.STRING, allowNull: false },
      capital: { type: DataTypes.BIGINT, allowNull: false },
      intereses: {
        type: DataTypes.STRING,
        defaultValue: "Desconozco esta información",
      },
      cuantiaTotal: { type: DataTypes.BIGINT, allowNull: false },
      clasificacion: { type: DataTypes.STRING, allowNull: false },
      diasMora: {
        type: DataTypes.STRING,
        defaultValue: "Más de 90 días",
      },
    },
    { timestamps: false }
  );
  return Deuda;
};
