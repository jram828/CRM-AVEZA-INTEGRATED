 import { models } from "../../DB.js";
 
 const { Prospecto }=models
const eliminaProspecto = async (idProspecto) => {
    // console.log('imagen',imagen)

    const [updateCount, updateClient] = await Prospecto.update({activo:false},{
        where: {
            idProspecto: idProspecto
        }
    }
);

if (updateCount > 0) {
    return 'Eliminado'
  } else {
    return ''
  }
   
    
    // return await Abogado.create({nombre, duracion,dificultad, temporada}); //?ASI También puede ser
     
};


export {eliminaProspecto};