import winston, { format } from "winston"
import config from "../Config/config.js";

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    http: 3,
    info: 4,
    debug: 5
  },
  colors: {
    fatal: 'red',
    error: 'orange',
    warning: 'yellow',
    http: 'red',
    info: 'blue',
    debug: 'white'
  }
};


const prodLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  format: format.combine(
    format.colorize(),
    format.printf((info)=>`${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console({level: "info"}),
    new winston.transports.File({filename: './errors.log', level: 'info',})
  ]
})

const devLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  format: format.combine(
    format.colorize(),
    format.printf((info)=>`${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console({ level: "debug" }),
    new winston.transports.File({ filename: './errors.log', level: 'debug' })
  ]
})

export const addLogger = (req, res, next) => {
  if (config.Mode === 'Development') {
    req.logger = prodLogger

    req.logger.info(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    req.logger.warning(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    req.logger.error(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    
  } else {
    req.logger = devLogger

    req.logger.debug(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    req.logger.http(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    req.logger.info(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    req.logger.warning(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    req.logger.error(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
  }
  next();
}
