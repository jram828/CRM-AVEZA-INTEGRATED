 import {models} from '../../DB.js';
 const { Prospecto } = models
const getProspectoByName = async (nombre)=>{
    // console.log(name)
    const prospectoBd = await Prospecto.findAll({where: {
        activo: true,
        nombres: nombre.toUpperCase()}});
    if(!prospectoBd) throw Error("Prospecto no Registrado o no existe")
    return prospectoBd;
}
export {
    getProspectoByName
}