import bcrypt from "bcrypt";
import { config } from "dotenv";

config(); // Cargar variables de entorno desde el archivo .env

const { SALT_BCRYPT } = process.env;
 console.log('SALT_BCRYPT:', SALT_BCRYPT);
export const encryptPassword = async (password) => {
  const salt = bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (bodyPassword, userPassword) => {
  return await bcrypt.compare(bodyPassword, userPassword);
};
