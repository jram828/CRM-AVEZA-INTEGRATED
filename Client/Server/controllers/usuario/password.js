import { models } from "../../DB.js";
import { sendEmailPassword } from "../../utils/emailNotifier.js";
import { encryptPassword } from "../../utils/encryptPassword.js";

const {Usuario } = models;

const getPassword = async (email) => {
  console.log('Email get password: ',email)
  const user = await Usuario.findOne({
    where: {
      email: email,
    },
  });
  console.log("Password usuario: ", user.password);

    if (!user) throw new Error("Usuario no encontrado");
    sendEmailPassword(user.nombres, user.email,user.cedula);
    return user

};

const cambiarPassword = async (cedula, password) => {
  console.log('Cedula get password: ',password, cedula)

  const encryptedPassword = await encryptPassword(password);

  const [updateCount, updateClient] = await Usuario.update(
    {
      password: encryptedPassword,
    },
    {
      where: {
        cedula: cedula,
      },
    },
  );

  if (updateCount > 0) {
    return "Password Actualizado";
  } else {
    return "Usuario no encontrado";
  }
};

export { getPassword, cambiarPassword };
