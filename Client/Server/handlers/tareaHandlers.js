
import { getAllTarea} from '../controllers/tarea/getAllTarea.js'
import { createTarea } from '../controllers/tarea/postAgregaTarea.js'


const getTareaHandler = async (req, res)=>{
    try {
        const response = await getAllTarea(req)
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const tareasByIdHandler = async (req, res)=>{
    try {
        const response = await getTareaById(req)
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}



const postCreateCita = async (req, res) =>{

    const {EMAIL_NOTIFICACION } = process.env;
    
    const { titulo, descripcion, fechaCita, horaCita, idCaso, email, calendarId, nombres  } = req.body
    console.log("Datos recibidos en el handler de creación de cita:", req.body, email);
    if(!email){ email = EMAIL_NOTIFICACION }
    try {
        const response = await createCita( titulo, descripcion, fechaCita, horaCita, idCaso, email, calendarId, nombres )
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const postCreateCitaGoogle = async (req, res) =>{
    const { titulo, fechaCita, horaCita, email, calendarId, nombres, apellidos } = req.body
    console.log("Datos recibidos en el handler de creación de cita:", req.body);
    try {
        const response = await createCitaCalendar( titulo, fechaCita, horaCita, email, calendarId, nombres, apellidos )
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}


export  {
    getCitaHandler,
    getAvailabilityHandler,
    postCreateCita,
    postCreateCitaGoogle
}