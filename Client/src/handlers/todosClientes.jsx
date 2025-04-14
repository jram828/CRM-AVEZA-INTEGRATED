import axios from 'axios';


  export async function getClientesCasos() {
    try {
      const response = await axios.get('/clientes/clientescasos');
      return response.data
     
    } catch (error) {
      console.error('Error al obtener clientes:', error.message);
      throw error;
    }
  }