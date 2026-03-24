import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  const Cotizacion = sequelize.define("Cotizacion", {
    idCotizacion: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    ingresos: { type: DataTypes.BIGINT, allowNull: true },
    gastos: { type: DataTypes.BIGINT, allowNull: true },
    posibleCuota: { type: DataTypes.BIGINT, allowNull: true },
    totalBienes: { type: DataTypes.BIGINT, allowNull: true },
    totalDeudas: { type: DataTypes.BIGINT, allowNull: true },
    totalDeudas_letras: { type: DataTypes.STRING, allowNull: true },
    totalBienes_letras: { type: DataTypes.STRING, allowNull: true },
    valorRadicar_letras: { type: DataTypes.STRING, allowNull: true },
  });
  return Cotizacion;
};
