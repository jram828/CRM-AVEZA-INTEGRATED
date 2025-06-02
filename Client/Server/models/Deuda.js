import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  const Deuda2 = sequelize.define(
    "Deuda2",
    {
      idDeuda: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      tipoDeuda: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tipoGarantia: { type: DataTypes.STRING, allowNull: true },
      acreedor: { type: DataTypes.STRING, allowNull: false },
      derechoVoto: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
        validate: {
          min: 0.0,
          max: 100.0,
        },
        allowNull: false,
      },
      documentoSoporte: { type: DataTypes.STRING, allowNull: true },
      capital: { type: DataTypes.BIGINT, allowNull: false },
      intereses: {
        type: DataTypes.STRING,
        defaultValue: "Desconozco esta información",
      },
      cuantiaTotal: { type: DataTypes.BIGINT, allowNull: true },
      clasificacion: { type: DataTypes.STRING, allowNull: false },
      diasMora: {
        type: DataTypes.STRING,
        defaultValue: "Más de 90 días",
      },
    },
    { timestamps: false }
  );
  return Deuda2;
};
