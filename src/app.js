import express from 'express'
import expressWinston from 'express-winston'
import winston from 'winston'
import { getIpInfoMiddleware } from './middlewares/ip'

const app = express()

const UserRouter = require('./routes/user')

// first use ip middleware. Adds IPAdress to request object.
app.use(getIpInfoMiddleware)

// express - winston logger before the router
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
        winston.format.prettyPrint({
            colorize: true
        })
    )
}))

// use routers here
app.use('/', UserRouter)

// express - winston errorLogger makes sense AFTER the router.
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}))

export default app