import bcrypt from "bcrypt";
import { config } from "dotenv";

config(); // Cargar variables de entorno desde el archivo .env

const { SALT_BCRYPT } = process.env;

export const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_BCRYPT);
  return await bcrypt.hash(password, salt);
};

export const verifyPassword = async (bodyPassword, userPassword) => {
  return await bcrypt.compare(bodyPassword, userPassword);
};
