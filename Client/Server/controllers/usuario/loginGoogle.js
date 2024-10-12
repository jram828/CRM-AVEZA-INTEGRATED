 import {models} from '../../DB.js'
const { Cliente, Abogado, Usuario } = models
 
const getLoginGoogle = async (email,rol) => {
    const login = await Usuario.findOne({
      where: {
        email: email,
      },
    });
    if (login) {
      console.log("Usuario encontrado:", login);
      const user = await Cliente.findOne({
        where: {
          email: login.email,
        },
      });
      console.log("Email cliente:", user);
      if (!user) {
        const user = await Abogado.findOne({
          where: {
            email: login.email,
          },
        });
        console.log("Cedula abogado:", user);
        if (!user) throw new Error("Aún no tiene autorización para ingresar");
        return {
          access: true,
            usuario: user,
          rol: "abogado",
        };
      }
      return {
        access: true,
        usuario: user,
        rol: "cliente",
      };
    } else {
      return {
        access: false,
      };
    }
}

export {
    getLoginGoogle
}