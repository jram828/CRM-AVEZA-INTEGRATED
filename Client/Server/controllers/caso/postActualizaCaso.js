import { models } from "../../DB.js";

const { Caso} = models;

const actualizaCaso = async (
  etapa,
  idCaso,
  valor_pretensiones,
  honorarios,
  honorariosLiquidacion,
  aceptacion_cotizacion,
  tiene_contrato,
  forma_de_pago,
  descripcion,
  radicado,
  juzgado,
  cuotas,
  porcentajeInicial
) => {


  const [updateCount, updateCaso] = await Caso.update({
    etapa,
    idCaso,
    valor_pretensiones,
    honorarios,
    honorariosLiquidacion,
    aceptacion_cotizacion,
    tiene_contrato,
    forma_de_pago,
    descripcion,
    radicado,
    juzgado,
    cuotas,
    porcentajeInicial
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
export { actualizaCaso };
