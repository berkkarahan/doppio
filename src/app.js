import express from 'express'
import expressWinston from 'express-winston'
import winston from 'winston'
import cookieParser from 'cookie-parser'
import { makeCookiesObject } from './middlewares/cookies'
import { getIpInfoMiddleware } from './middlewares/ip'

const app = express()
// https://bitbucket.org/platformhermes/doppio/src/96faccb5a5f750cb279ea86794782682bc267d9a/src/app.js?at=refactor%2Farchitecture
app.set('trust proxy', 1)

const UserRouter = require('./routes/user')

// first use ip middleware. Adds IPAdress to request object.
app.use(getIpInfoMiddleware)

// cookie-parser, with custom json object which parses and adds to req header
// doppiojwt is the cookie name for jwt token
app.use(cookieParser())
app.use(makeCookiesObject)

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