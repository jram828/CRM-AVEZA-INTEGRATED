import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  const Honorario = sequelize.define(
    "Honorario",
    {
      idHonorario: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      valorHonorarios: { type: DataTypes.BIGINT, allowNull: false },
      valorRadicar: { type: DataTypes.BIGINT, allowNull: false },
          inicial: { type: DataTypes.BIGINT, allowNull: false },
    cuotasHonorarios:{ type: DataTypes.INTEGER, allowNull: false } ,
    honorariosLiquidacion:{ type: DataTypes.BIGINT, allowNull: true },
    totalDeudas: { type: DataTypes.BIGINT, allowNull: false },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["idHonorario"],
        },
      ],
    },
    { timestamps: false }
  );
  return Honorario;
};
