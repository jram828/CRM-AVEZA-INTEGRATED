import { models } from "../../DB.js";
import { codigoCiudades } from "../../utils/codigoCiudades.js";

const { Cliente, Ciudad, Pais, Departamento, Honorario, Deuda2, Bien, Cotizacion, PropuestaPago } = models;

const actualizaClienteFase = async (cedulaCliente, field, value) => {
  const clienteActualizar = await Cliente.findByPk(cedulaCliente);

  const [updateCount, updateClient] = await Cliente.update(
    {
      [field]: value,
    },
    {
      where: {
        cedulaCliente: cedulaCliente,
      },
    },
  );

  const consulta = {
    where: {
      cedulaCliente: cedulaCliente,
      activo: true,
    },
    include: [
      {
        model: Ciudad,
        attributes: ["nombre_ciudad", "codigo_ciudad"],
        through: { attributes: [] },
        include: [
          {
            model: Departamento,
            attributes: ["nombre_departamento"],
            through: { attributes: [] },
            include: [
              {
                model: Pais,
                attributes: ["nombre_pais"],
                through: { attributes: [] },
              },
            ],
          },
        ],
      },
      {
        model: Honorario,
        attributes: [
          "valorHonorarios",
          "valorRadicar",
          "inicial",
          "cuotasHonorarios",
          "honorariosLiquidacion",
          "totalDeudas",
          "honorarios_letras",
          "honorariosLiquidacion_letras",
        ],
        through: { attributes: [] },
      },
      {
        model: Deuda2,
        attributes: [
          "tipoDeuda",
          "tipoGarantia",
          "acreedor",
          "derechoVoto",
          "documentoSoporte",
          "capital",
          "intereses",
          "cuantiaTotal",
          "clasificacion",
          "diasMora",
        ],
        through: { attributes: [] },
      },
      {
        model: Bien,
        through: { attributes: [] },
      },
      {
        model: Cotizacion,
        through: { attributes: [] },
      },
      {
        model: PropuestaPago,
        through: { attributes: [] },
      },
    ],
  };

  const nuevoCliente = await Cliente.findOne(consulta);

  if (updateCount > 0) {
    return nuevoCliente;
  } else {
    return "";
  }
};
export { actualizaClienteFase };
