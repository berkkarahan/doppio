import mysql from 'mysql2/promise';
// Must import promise based driver for using then/await like syntax...
import dotenv from 'dotenv'
dotenv.config()

const cn = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: process.env.MYSQL_MAX_POOL
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
                    console.log(results['rows'])
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