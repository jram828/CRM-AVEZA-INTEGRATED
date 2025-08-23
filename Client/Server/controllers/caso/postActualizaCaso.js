import { models } from "../../DB.js";

const { Caso, Honorario} = models;

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
  porcentajeInicial,
  Honorarios,
  valorRadicar
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
  

    const [updateCountHon, updateHonorario] = await Honorario.update({
    valorHonorarios: honorarios,
    honorariosLiquidacion,
    totalDeudas: valor_pretensiones,
    cuotasHonorarios: cuotas,
    inicial: porcentajeInicial,
    valorRadicar
    },
    {
      where: {
        idHonorario: Honorarios[0].Cliente_Honorario.HonorarioIdHonorario,
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
