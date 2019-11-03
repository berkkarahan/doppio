import mysql from 'mysql'
require('dotenv').config();

const cn = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
};

const connection = mysql.createConnection(cn);

const executeQuery = async (query) => {
    return new Promise((resolve, reject) => {
        connection.query(query, (err, data) => {
            connection.end();
            return err ? reject(err) : resolve(data);
        });
    });
};

export default {
    executeQuery
}
