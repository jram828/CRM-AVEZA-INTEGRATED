import { models } from "../../DB.js";
import { sendEmailPassword } from "../../utils/emailNotifier.js";

const { Cliente, Abogado, Usuario } = models;

const getPassword = async (email) => {
  console.log('Email get password: ',email)
  const user = await Usuario.findOne({
    where: {
      email: email,
    },
  });
  console.log("Password usuario: ", user.password);

    if (!user) throw new Error("Usuario no encontrado");
    sendEmailPassword(user.nombres, user.email,user.password);
    return user

};

export { getPassword };
