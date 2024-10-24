import bcrypt from "bcrypt";
import { config } from "dotenv";

config(); // Cargar variables de entorno desde el archivo .env


export const encryptPassword = async (password) => {
  const { SALT_BCRYPT } = process.env;
 console.log('SALT_BCRYPT:', SALT_BCRYPT);
  let newSalt = parseInt(SALT_BCRYPT);
  const salt = await bcrypt.genSalt(newSalt);
  return await bcrypt.hash(password, salt);
};

export const verifyPassword = async (bodyPassword, userPassword) => {
  return await bcrypt.compare(bodyPassword, userPassword);
};
