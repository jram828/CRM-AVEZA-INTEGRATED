import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  const Motivos = sequelize.define(
    "Motivos",
    {
      idMotivos: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [1, 3000],
        },
      },
    },
    { timestamps: false }
  );
  return Motivos;
};
