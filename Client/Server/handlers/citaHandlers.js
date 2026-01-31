import { calendar } from 'googleapis/build/src/apis/calendar/index.js'
import { getAllCita } from '../controllers/cita/getAllCita.js'
import { createCita } from '../controllers/cita/postAgregaCita.js'
import { createCitaCalendar } from '../controllers/cita/postAgregaCitaCalendar.js'
import { obtenerDisponibilidad } from '../controllers/cita/getAvailability.js'
import { getCitaById } from '../controllers/cita/getCitaById.js'
import { getAllCitaGoogle } from '../controllers/cita/getAllCitaGoogle.js'


const getCitaHandler = async (req, res)=>{
    try {
        const response = await getAllCita(req)
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const getCitaGoogleHandler = async (req, res)=>{
 const {calendarId, mes} = req.query;

 console.log("Calendar ID en el handler:", calendarId);
    try {
        const response = await getAllCitaGoogle(calendarId,mes)
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const getCitasByIdHandler = async (req, res)=>{

    const {idProspecto} = req.params;
    try {
        const response = await getCitaById(idProspecto)
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const getAvailabilityHandler = async (req, res)=>{
    const { fecha } = req.query;
         console.log("Fecha recibida en el handler de disponibilidad:", req.query);
    try {
        const response = await obtenerDisponibilidad(fecha)
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const postCreateCita = async (req, res) =>{


    
    const { titulo, descripcion, fechaCita, horaCita, idProspecto, calendarId } = req.body
     const email = req.body.calendarId|| "jram828@gmail.com" //process.env.EMAIL_NOTIFICACION;
    console.log("Datos recibidos en el handler de creación de cita:", req.body, email);
    try {
        const response = await createCita( titulo, descripcion, fechaCita, horaCita, idProspecto, email)
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const postCreateCitaGoogle = async (req, res) =>{
    const { idProspecto, titulo, fechaCita, horaCita, email, calendarId, nombres, apellidos } = req.body
    console.log("Datos recibidos en el handler de creación de cita Google:", req.body);
    try {
        const response = await createCitaCalendar( idProspecto, titulo, fechaCita, horaCita, email, calendarId, nombres, apellidos )
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}


export  {
    getCitaHandler,
    getCitaGoogleHandler,
    getCitasByIdHandler,
    getAvailabilityHandler,
    postCreateCita,
    postCreateCitaGoogle
}