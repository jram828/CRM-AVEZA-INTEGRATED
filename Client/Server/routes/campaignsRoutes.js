import { Router } from "express";
import {
  getCampaignsHandler,
  postCampaignsHandler,
  getCampaignDetailHandler,
  deleteCampaignHandler,
  postActualizaCampaign,
} from "../handlers/campaignHandlers.js";

const campaignsRouter = Router();

campaignsRouter.get("/", getCampaignsHandler);

campaignsRouter.get("/:idCampaign", getCampaignDetailHandler);

campaignsRouter.post("/", postCampaignsHandler);

campaignsRouter.post("/delete", deleteCampaignHandler);

campaignsRouter.put("/actualiza", postActualizaCampaign);

export default campaignsRouter;
