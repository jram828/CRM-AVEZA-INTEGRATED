import { models } from "../../DB.js";

const { Campaign, Prospecto } = models;

const createCampaignBd = async (
nombre,
descripcion,
) => {
  
  console.log("Datos campaign:", {
nombre,
descripcion,
  });

  try {
    const newCampaign = await Campaign.create({
      nombre,
      descripcion,
    });
    
    return newCampaign;
  } catch (error) {
    console.log(error);
  }
};

export { createCampaignBd };
