import winston from 'winston'
import fs from 'fs'
import expressWinston from "express-winston";
const dir = "./logs"
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}
export {logger, expressLogger}
const expressLogger = expressWinston.logger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        })
    ]
});
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({filename: './logs/error.log', level: 'error'}),
        new winston.transports.File({filename: './logs/combined.log'})
    ]
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        colorize: true,
        json: true
    }));
}

