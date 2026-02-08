import { models } from "../../DB.js";

const { Campaign, Prospecto } = models;

const actualizaCampaign = async (
  idCampaign,
  nombre,
  descripcion
) => {
    console.log("Datos controller actualiza campaign:", {
    idCampaign,
    nombre,
    descripcion,
  });

  const CampaignActualizar = await Campaign.findByPk(idCampaign);

  const [updateCount, updateCampaign] = await Campaign.update(
    {
      nombre: nombre,
      descripcion: descripcion,
    },
    {
      where: {
        idCampaign: idCampaign,
      },
    }
  );

  const consulta = {
    where: {
      idCampaign: parseInt(idCampaign),
      activo: true,
    },
    include: [
      {
        model: Prospecto,
        through: { attributes: [] },
        // include: [
        //   {
        //     model: Departamento,
        //     attributes: ["nombre_departamento"],
        //     through: { attributes: [] },
        //     include: [
        //       {
        //         model: Pais,
        //         attributes: ["nombre_pais"],
        //         through: { attributes: [] },
        //       },
        //     ],
        //   },
        // ],
      },
    ],
  };

  const nuevoCampaign = await Campaign.findOne(consulta);
  // nuevoCampaign.addCiudad(codigo_ciudad);

  if (updateCount > 0) {
    return nuevoCampaign;
  } else {
    return "No se actualizo el campaign";
  }
};
export { actualizaCampaign };