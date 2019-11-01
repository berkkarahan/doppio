import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

const connection = mysql.createConnection({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT,
  database : process.env.RDS_DATABASE
});

// const connection = mysql.createConnection({
//     host: 'hermesdb.cacxa7dk4nav.eu-west-1.rds.amazonaws.com',
//     port: '3306',
//     username : 'root',
//     password: '2FLtXUVTTdfvr3eC',
//     database: 'hermes',
//     ssl: true
// })

export default connection;

// import mysql from 'mysql2/promise';
// // Must import promise based driver for using then/await like syntax...
// import { MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_MAX_POOL } from "@env";


// const cn = {
//     host: MYSQL_HOST,
//     port: MYSQL_PORT,
//     user: MYSQL_USER,
//     password: MYSQL_PASSWORD,
//     database: MYSQL_DATABASE,
//     connectionLimit: MYSQL_MAX_POOL
// }

// const Pool = new mysql.createPool(cn)

// const _execute = async (query, pool) => {
//     const [rows, fields] = pool.execute(query)
//     return [rows, fields]
// }

// const executeQuery = async (query, pool, queryType) => {
//     try {
//         if (queryType === 'void') {
//             return await _execute(query, pool)
//                 .then(results => {
//                     return {
//                         status: true,
//                         rows: []
//                     }
//                 })
//         } else if (queryType = 'select') {
//             return await _execute(query, pool)
//                 .then(results => {
//                     return {
//                         status: true,
//                         rows: results[0]
//                     }
//                 })
//         } else {
//             return {
//                 status: false,
//                 rows: []
//             }
//         }
//     } catch (err) {
//         throw new Error(err)
//     }
// }

// export default {
//     Pool,
//     executeQuery
// }