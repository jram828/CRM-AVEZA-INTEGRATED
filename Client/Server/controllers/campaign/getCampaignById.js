import { models } from "../../DB.js";

const { Campaign, Prospecto } = models;
const getCampaignById = async (idCampaign) => {
  // console.log("Id campaign controller:", idCampaign);
  const consulta = {
    where: {
      idCampaign: parseInt(idCampaign),
      // activo: true,
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

  const campaign = await Campaign.findOne(consulta);

  // console.log('Campaign encontrado:', campaign)
  if (!campaign) throw Error("Campaign no existe");
  return campaign;
};

export { getCampaignById };