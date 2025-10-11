import {models} from '../../DB.js'

 const { Prospecto, Ciudad, Departamento, Pais, Acreedor} = models;
const getProspectoById = async (cedulaProspecto)=>{
 console.log("Cédula Prospecto en getProspectoById:", cedulaProspecto);
    const consulta = {
      where: {
      cedulaProspecto: BigInt(cedulaProspecto),
      activo: true,
      },
      include: [
      {
        model: Ciudad,
        attributes: ["nombre_ciudad", "codigo_ciudad"],
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
        model: Acreedor,
        attributes: ["idAcreedor", "NIT", "nombre", "email", "telefono", "direccion", "ciudad" ], // ajusta los atributos según tu modelo
        through: { attributes: [] },
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
