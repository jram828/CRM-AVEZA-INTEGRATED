
 import {models} from '../../DB.js'
import { encryptPassword } from '../../utils/encryptPassword.js';
 const { Usuario } = models;


const crearUsuario = async (correo, password, imagen,rol) => {

  const encryptedPassword = await encryptPassword(password);

  const newUsuario = await Usuario.create({
    correo,
    encryptedPassword,
    imagen,
    rol
  });
  console.log(newUsuario);
  return {
    ...newUsuario.toJSON(),
  };
};

export {
  crearUsuario,
};
