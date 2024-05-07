import { Command } from "commander";
import dotenv from "dotenv"
const program = new Command();

program
  .option("-d","Variable para debug", false)
  .option("-p <port>","Puerto del servidor", 8080)
  .option("--mode <mode>","Modo de trabajo", "develop")

  // .requiredOption("-u <user>", "Usuario que va a utilizar la aplicacion", "No se ha declarado un usario");

program.parse();


console.log("Options", program.opts().mode);
const environment = program.opts().mode;

dotenv.config({
    path:environment==="production"?"./src/config/.env.production":"./src/config/.env.development"
});

export default{
  port: process.env.PORT,
  urlmongo: process.env.MONGO_URL,
  adminname: process.env.ADMIN_NAME,
  adminpassword: process.env.ADMIN_PASSWORD,
  mail: process.env.GMAIL_ACCOUNT,
  mailPassword: process.env.GMAIL_PASSWORD,
  Mode: process.env.MODE  
}

console.log("Remaining arguments", program.args);
