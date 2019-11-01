import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import db from './db';

// Winston logger kurulacak.

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
// use routers here
// app.use('/', UserRouter)

export default app