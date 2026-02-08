import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  const Campaign = sequelize.define(
    "Campaign",
    {
      idCampaign: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [0, 200],
        },
      },
      descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [0, 200],
        },
      },
    },
    { timestamps: true },
  );
  return Campaign;
};
