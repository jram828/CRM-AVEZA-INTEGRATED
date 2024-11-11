import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  const Solicitud = sequelize.define(
    "Solicitud",
    {
      idSolicitud: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
    },
    { timestamps: false }
  );
  return Solicitud;
};
