 import { models } from "../../DB.js";
 const {
  Caso,
  Cliente,
  Abogado,
  TipoDeCaso,
  PagosCliente,
  Ciudad
} = models
const getCasoId = async (id) => {
  console.log(id)
  const caso = await Caso.findByPk(id, {
    include: [
      {
        model: Cliente,
        attributes: ["apellidos", "nombres", "direccion", "celular","email"],
        include: [
          {
            model: Ciudad,
            attributes: ["nombre_ciudad","codigo_ciudad"]}
          ]
      },
      {
        model: Abogado,
        attributes: ["apellidos", "nombres", "direccion", "celular", "email", "tarjetaProf"],
        
      },
      {
        model: TipoDeCaso,
        attributes: ["descripcion"],
      },
    ],
  });
  if (!caso) throw Error("Caso no Registrado o no existe");
  return caso;
};
// intento subir

export  {
  getCasoId,
};


