import { models } from "../../DB.js";

const { Prospecto} = models;

export async function contarProspecto() {
  
    try {
      const totalProspecto = await Prospecto.count();
       

      return totalProspecto;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  
}
