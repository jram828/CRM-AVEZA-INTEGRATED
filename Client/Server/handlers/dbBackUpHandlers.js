import { dbBackUp } from "../controllers/DB/dbBackUp.js";

export const dbBackUpHandler = async (req, res, next) => {

  try {
    const response = await dbBackUp(req.query);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

