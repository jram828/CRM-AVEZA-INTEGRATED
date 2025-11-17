import { calendar } from 'googleapis/build/src/apis/calendar/index.js'
import { getAllCita } from '../controllers/cita/getAllCita.js'
import { createCita } from '../controllers/cita/postAgregaCita.js'
import { createCitaCalendar } from '../controllers/cita/postAgregaCitaCalendar.js'
import { obtenerDisponibilidad } from '../controllers/cita/getAvailability.js'


const getCitaHandler = async (req, res)=>{
    try {
        const response = await getAllCita(req)
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const getAvailabilityHandler = async (req, res)=>{
    try {
        const response = await obtenerDisponibilidad(req)
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const postCreateCita = async (req, res) =>{
    const { titulo, descripcion, fechaCita, horaCita, idCaso, email, calendarId, nombres  } = req.body
    console.log("Datos recibidos en el handler de creación de cita:", req.body, email);
    if(!email){ email = "comercial@aveza.co" }
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