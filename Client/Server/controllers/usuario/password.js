import { models } from "../../DB.js";
import { sendEmailPassword } from "../../utils/emailNotifier.js";

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
    sendEmailPassword(user.nombres, user.email,user.password, user.cedula);
    return user

};

const cambiarPassword = async (password,cedula) => {
  console.log('Email get password: ',email)
  const [updateCount, updateClient] = await Usuario.update(
    {
      password: password,
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
    return "";
  }
};

export { getPassword, cambiarPassword };
