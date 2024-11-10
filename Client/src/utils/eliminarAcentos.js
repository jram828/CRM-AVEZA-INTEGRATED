// Función para eliminar acentos 

export const eliminarAcentos = (texto) => { return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); };


// eliminarAcentos(elemento).toLowerCase().includes(eliminarAcentos(texto).toLowerCase())