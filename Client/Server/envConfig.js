import dotenv from 'dotenv'

const configEnv = {
    development: '.env.development',
    preview: '.env.development',
    production: '.env'
  };
  
const envFile = configEnv[process.env.NODE_ENV] || '.env';

dotenv.config({path:envFile})

const status = process.env.NODE_ENV==='development'? 'development' : process.env.NODE_ENV==='preview'? 'preview' : 'production'

const {PORT, URL}= process.env;

export default {
  PORT : PORT,
  URL : URL,
  status:status,
}