import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  const Tarea = sequelize.define(
    "Tarea",
    {
      idTarea: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      asunto: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [0, 200],
        },
      },
      fechaVencimiento: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      recordatorio: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      tipoRecordatorio: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1, 60],
        },
      },
      repetir: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      frecuencia: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 60],
        },
      },
      repeticiones: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          len: [1, 60],
        },
      },
      completada: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    { timestamps: false }
  );
  return Tarea;
};
