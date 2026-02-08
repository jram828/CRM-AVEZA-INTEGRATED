import { deleteCampaign } from "../controllers/campaign/deleteCampaign.js";
import { getCampaignById } from "../controllers/campaign/getCampaignById.js";
import { getAllCampaigns } from "../controllers/campaign/getAllCampaigns.js";
import { createCampaignBd } from "../controllers/campaign/postCampaignsController.js";
import { actualizaCampaign } from "../controllers/campaign/postActualizaCampaign.js";

const getCampaignsHandler = async (req, res) => {
  let response;

  try {
    response = await getAllCampaigns(req.query);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

// Creando Campaigns
const postCampaignsHandler = async (req, res) => {
  const { nombre, descripcion } = req.body;

  console.log("body crear campaign:", {
    nombre,
    descripcion,
  });

  try {
    const response = await createCampaignBd(nombre, descripcion);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  // res.status(200).send(`creando actividades`);
};

const getCampaignDetailHandler = async (req, res) => {
  const { idCampaign } = req.params;
  try {
    console.log("Id campaign handler:", idCampaign);
    const response = await getCampaignById(idCampaign);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json((error = error.message));
  }
};

const deleteCampaignHandler = async (req, res) => {
  const { idCampaign } = req.body;
  try {
    const response = await deleteCampaign(idCampaign);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postActualizaCampaign = async (req, res) => {
  console.log("Body actualiza campaign: ", req.body);
  const { idCampaign, nombre, descripcion } = req.body;

  try {
    const response = await actualizaCampaign(idCampaign, nombre, descripcion);
    if (response) res.status(200).json(response);
    else res.status(204).json("No se actualizo el campaign");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
  getCampaignsHandler,
  getCampaignDetailHandler,
  postCampaignsHandler,
  deleteCampaignHandler,
  postActualizaCampaign,
};
