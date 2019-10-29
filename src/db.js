import bluebird from 'bluebird';
import mysql from 'mysql2';
import { MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_MAX_POOL } from "@env";


const cn = {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    connectionLimit: MYSQL_MAX_POOL,
    Promise: bluebird
}

const pool = new mysql.Pool(cn)

const executeQuery = async (query, pool) => {
    try {
        const conn = await pool.getConnection()
        let [rows, fields] = await conn.execute(query)
        return [rows, fields]
    } catch (err) {
        throw new Error(err)
    } finally {
        pool.releaseConnection(conn)
    }
}

export default {
    pool,
    executeQuery
}