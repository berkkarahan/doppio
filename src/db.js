import mysql from 'mysql2/promise';
// Must import promise based driver for using then/await like syntax...

const cn = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: process.env.MYSQL_MAX_POOL
}

const Pool = new mysql.createPool(cn)

const _execute = async (query, pool) => {
    const [rows, fields] = pool.execute(query)
    return [rows, fields]
}

const executeQuery = async (query, pool, queryType) => {
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
                    return {
                        status: true,
                        rows: results[0]
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
    Pool,
    executeQuery
}