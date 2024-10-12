import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  const Proceso = sequelize.define(
    "Proceso",
    {
      idProceso: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      juzgado: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      demandante: { type: DataTypes.STRING, allowNull: false },
      radicado: { type: DataTypes.STRING, allowNull: false },
      tipoProceso: { type: DataTypes.STRING, allowNull: false },
    },
    { timestamps: false }
  );
  return Proceso;
};
