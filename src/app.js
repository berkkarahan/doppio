import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import db from './db';

let app = express();
app.set('trust proxy', 1);

app.get('/', (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip === '::1' || ip === 'localhost') {
        ip = '127.0.0.1';
    }
    db.connect();
    db.query('SELECT * FROM test', (err, results, fields) => {
        results.forEach(result => {
            console.log(result.id);
        });
        db.end();
    })
    res.sendStatus(200);
});

// const UserRouter = require('./routes/user')

// // first use ip middleware. Adds IPAdress to request object.
// app.use(getIpInfoMiddleware)

// // express - winston logger before the router
// app.use(expressWinston.logger({
//     transports: [
//         new winston.transports.Console()
//     ],
//     format: winston.format.combine(
//         winston.format.colorize(),
//         winston.format.json(),
//         winston.format.prettyPrint({
//             colorize: true
//         })
//     )
// }))

// // use routers here
// app.use('/', UserRouter)

// // express - winston errorLogger makes sense AFTER the router.
// app.use(expressWinston.errorLogger({
//     transports: [
//         new winston.transports.Console()
//     ],
//     format: winston.format.combine(
//         winston.format.colorize(),
//         winston.format.json()
//     )
// }))

export default app