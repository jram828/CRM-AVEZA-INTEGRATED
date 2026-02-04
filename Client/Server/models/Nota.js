import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  const Nota = sequelize.define(
    "Nota",
    {
      idNota: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [0, 200],
        },
      }
    },
    { timestamps: true }
  );
  return Nota;
};
