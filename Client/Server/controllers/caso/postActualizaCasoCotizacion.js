import { models } from "../../DB.js";

const { Caso} = models;

const actualizaCasoCotizacion = async (
  idCaso,
  totalDeudas,
  inicial,
  cuotasHonorarios,
  valorHonorarios,
  honorariosLiquidacion
) => {


  const [updateCount, updateCaso] = await Caso.update({
    idCaso,
    valor_pretensiones: totalDeudas,
    honorarios:valorHonorarios,
    honorariosLiquidacion,
    cuotas:cuotasHonorarios,
    porcentajeInicial:inicial
    },
    {
      where: {
        idCaso: idCaso,
      },
    }
  );
  
      const consulta = {
        where: {
          idCaso: idCaso,
      }};

      const nuevoCaso = await Caso.findOne(consulta);

  if (updateCount > 0) {

    return nuevoCaso;
  } else {
    return "";
  }

  // return await Abogado.create({nombre, duracion,dificultad, temporada}); //?ASI También puede ser
};
export { actualizaCasoCotizacion };
