import { models } from "../../DB.js";
import { codigoCiudades } from "../../utils/codigoCiudades.js";

const { Cliente, Ciudad, Pais, Departamento } = models;

const actualizaClienteStatus = async (cedulaCliente, field, value) => {
  
  const clienteActualizar = await Cliente.findByPk(cedulaCliente);



  const [updateCount, updateClient] = await Cliente.update(
    {
      [field]: value,
    },
    {
      where: {
        cedulaCliente: cedulaCliente,
      },
    }
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
    ],
  };

  const nuevoCliente = await Cliente.findOne(consulta);

  if (updateCount > 0) {
    return nuevoCliente;
  } else {
    return "";
  }

};
export { actualizaClienteStatus };
