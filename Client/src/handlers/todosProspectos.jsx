import axios from 'axios';


  export async function getProspectosCasos() {
    try {
      const response = await axios.get('/prospectos/prospectoscasos');
      return response.data
     
    } catch (error) {
      console.error('Error al obtener prospectos:', error.message);
      throw error;
    }
  }