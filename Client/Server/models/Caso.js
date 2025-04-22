import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Caso = sequelize.define(
    "Caso",
    {
      idCaso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      radicado: {
        type: DataTypes.STRING,
        defaultValue: "No aplica",
        allowNull: true,
      },
      juzgado: {
        type: DataTypes.STRING,
        defaultValue: "No aplica",
        allowNull: true,
      },
      fecha: {
        type: DataTypes.DATE,
        allowNull: true,
        // defaultValue: DataTypes.NOW,
      },
      fechaFin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [1, 3000],
        },
      },
      valor_pretensiones: { type: DataTypes.BIGINT, allowNull: true},
      aceptacion_cotizacion: {
        type: DataTypes.STRING,
        defaultValue: "No",
      },
      honorarios: { type: DataTypes.BIGINT, allowNull: true},
      honorariosLiquidacion: { type: DataTypes.BIGINT, allowNull: true},
      cuotas: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },
      porcentajeInicial: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      forma_de_pago: { type: DataTypes.STRING, allowNull: true,
        defaultValue: "Contado" },
      etapa: {
        type: DataTypes.STRING,
        defaultValue: "prospecto",
        // allowNull: false,
        validate: {
          len: [1, 100],
        },
      },
      tiene_contrato: {
        type: DataTypes.STRING,
        defaultValue: "No",
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    { timestamps: false }
  );
  return Caso;
};