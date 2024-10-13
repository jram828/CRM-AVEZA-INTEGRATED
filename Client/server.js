import express from "express";
import morgan from "morgan";
import cors from "cors";
import {fileURLToPath} from 'url'
import path from 'path'
import { models } from "./Server/DB.js";
import router from "./Server/routes/index.js";
import env from './Server/envConfig.js'

const { conn } = models;

conn
  .sync({ alter: true })
  .then(() => {})
  .catch((error) => console.error(error));

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const server = express();

server.use(morgan("dev"));
server.use(express.json());
server.use(cors());

server.use("/crmAveza", router); //Manejador de rutas 'REST'

server.use(express.static(path.join(dirname, 'dist')))

server.get('/', (req, res)=>{
    res.sendFile(path.join(dirname, 'dist, index.html'))
})

server.use((err, req, res)=>{          //Manejador de errores
    const status = err.status ||500
    const message = err.message || 'Error'
    console.error('Error: ', err)
    res.status(status).json(message)
})

const PORT = env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} in ${env.status}`);
});









