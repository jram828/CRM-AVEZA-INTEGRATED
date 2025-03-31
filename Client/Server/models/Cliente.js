import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Cliente = sequelize.define(
    "Cliente",
    {
      cedulaCliente: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nombres: { type: DataTypes.STRING, allowNull: false },
      apellidos: { type: DataTypes.STRING, allowNull: false },
      direccion: { type: DataTypes.STRING, allowNull: false },
      celular: { type: DataTypes.BIGINT, allowNull: false },
      comentarios: { type: DataTypes.TEXT, allowNull: true },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    { timestamps: false }
  );
  return Cliente;
};
