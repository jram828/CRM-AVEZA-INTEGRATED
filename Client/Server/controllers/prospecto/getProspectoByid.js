import {models} from '../../DB.js'

 const { Prospecto, Ciudad, Departamento, Pais} = models;
const getProspectoById = async (cedulaProspecto)=>{

    const consulta = {
      where: {
        cedulaProspecto: parseInt(cedulaProspecto),
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
      ],
    };
    
    const prospecto = await Prospecto.findOne(consulta);
    if(!prospecto) throw Error("Prospecto no Registrado o no existe")
    return prospecto;
}

export {
    getProspectoById,
}