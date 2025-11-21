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

server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Error';
  console.error('Error: ', err);
  res.status(status).json({ error: message });
});

const PORT = env.PORT || 3001;

// import './Server/jobs/gmailCron.js'; // Importar el cron para que se ejecute al iniciar el servidor

server.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT} in ${env.status}`);
});









