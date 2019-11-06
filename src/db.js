import mysql from 'mysql2/promise';
// Must import promise based driver for using then/await like syntax...
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
        if (queryType === 'void') {
            return await _execute(query, pool)
                .then(results => {
                    return {
                        status: true,
                        rows: []
                    }
                })
        } else if (queryType = 'select') {
            return await _execute(query, pool)
                .then(results => {
                    let returnResult = {
                        status: null,
                        rows: results['rows']
                    }
                    if (returnResult.rows[0] === undefined) {
                        returnResult.status = false
                        return returnResult
                    } else {
                        returnResult.status = true
                        return returnResult
                    }
                })
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