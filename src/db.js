import mysql from 'mysql2/promise';

import { config } from './config'

const cn = {
    host: config.MYSQL_HOST,
    port: config.MYSQL_PORT,
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    database: config.MYSQL_DATABASE,
    connectionLimit: config.MYSQL_MAX_POOL
}


const pool = new mysql.createPool(cn)

const _execute = async (query) => {
    console.log("Query in execution: " + query)
    let queryResult = await pool.execute(query)
    let result = {
        rows: queryResult[0],
        fields: queryResult[1]
    }
    return result
}

const executeQuery = async (query, queryType) => {
    try {
        // execute query regardless of its type in the beginning.
        let results = await _execute(query, pool)
        if (queryType === 'void') {
            return {
                status: true,
                rows: []
            }
        } else if (queryType === 'select') {
            let returnResult = {
                status: null,
                rows: results['rows'][0]
            }
            if (returnResult.rows === undefined) {
                returnResult.status = false
                return returnResult
            } else {
                returnResult.status = true
                return returnResult
            }
        } else {
            return {
                status: false,
                rows: []
            }
        }
    } catch (err) {
        throw new Error(err)
    }
}

export default {
    executeQuery
}