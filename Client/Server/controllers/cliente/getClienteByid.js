import {models} from '../../DB.js'

 const { Cliente, Ciudad, Departamento, Pais, Deuda2, Honorario } = models;
const getClienteById = async (cedulaCliente)=>{

    const consulta = {
      where: {
        cedulaCliente: parseInt(cedulaCliente),
        activo: true,
      },
      include: [
        {
          model: Ciudad,
          attributes: ["nombre_ciudad","codigo_ciudad"],
          through: { attributes: [] },
          include: [
            {
              model: Departamento,
              attributes: ["nombre_departamento"],
              through: { attributes: [] },
              include: [
                {
                  model: Pais,
                  attributes: ["nombre_pais"],
                  through: { attributes: [] },
                },
              ],
            },
          ],
        },
        {
          model: Honorario,
          attributes: ["valorHonorarios", "valorRadicar", "inicial", "cuotasHonorarios", "honorariosLiquidacion", "totalDeudas"],
          through: { attributes: [] },  
        },
        {
          model:Deuda2,
          attributes: ["tipoDeuda", "tipoGarantia", "acreedor", "derechoVoto", "documentoSoporte", "capital", "intereses", "cuantiaTotal", "clasificacion", "diasMora"],
          through: { attributes: [] },
        }
      ],
    };
    
   const cliente = await Cliente.findOne(consulta);
    if(!cliente) throw Error("Cliente no Registrado o no existe")
    return cliente;
}

export {
    getClienteById,
}