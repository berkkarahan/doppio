import express from 'express'
import expressWinston from 'express-winston'
import winston from 'winston'

import { userRouter } from './routes/user'
import { verificationRouter } from './routes/verification'
import { getIpInfoMiddleware } from './middlewares/ip'

const app = express()

app.set('trust proxy', 1)

// IP middleware
app.use(getIpInfoMiddleware)

// Set-up logger for the app.
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

// Routers
app.use('/', userRouter)
app.use('/', verificationRouter)

// Set-up error logger for the app.
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