import  { models }  from "../../DB.js";

const Campaign=models.Campaign

const deleteCampaign = async (idCampaign) => {
  await Campaign.update(
    {
      activo: false,
    },
    {
      where: {
        idCampaign: idCampaign,
      },
    },
  );
  return "Delete complete";
};

export  {
  deleteCampaign,
};
