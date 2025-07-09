import axios from 'axios';


  export async function getProspectoById(id) {
    try {
      const response = await axios.get(`/prospectos/${id}`);
      return response.data
     
    } catch (error) {
      console.error('Error al obtener prospecto:', error.message);
      throw error;
    }
  }