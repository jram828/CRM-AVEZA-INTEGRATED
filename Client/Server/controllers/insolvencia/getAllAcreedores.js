import { models } from "../../DB.js";

const { Acreedor } = models;

const getAllAcreedores = async () => {
  const allAcreedor = await Acreedor.findAll();
  return allAcreedor;
};

export { getAllAcreedores };
