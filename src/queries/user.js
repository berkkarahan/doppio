import { executeQuery } from '../db'

const createUserQuery = async (usr) => {
    let keys = Object.keys(usr.values)
        .join(", ")
    let values = Object.values(usr.values)
        .map((val) => {
            return "'" + val + "'"
        })
        .join(", ")

    let query = `INSERT INTO users ( ${keys} ) VALUES ( ${values} )`
    return await executeQuery(query, 'void')
}

const selectUserQuery = async (usr) => {
    let query = `SELECT * from users WHERE `

    if (usr.values.email) {
        query += `email = '${usr.values.email}'`
    } else if (usr.values.username && query.length < 27) {
        query += `username = '${usr.values.username}'`
    }

    let result = await executeQuery(query, 'select')

    // null values should be deleted before retrieval
    Object.keys(result.rows)
        .forEach(k => {
            if (result.rows[k] === null) {
                delete result.rows[k]
            }
        })

    return result
}

const updateUserQuery = async (usr) => {
    let query = `UPDATE users SET `
    const kvPairs = Object.entries(usr.values).map(([key, value]) => { return `${key}='${value}'` })

    query += kvPairs.join(', ')

    if (usr.values.email) {
        query += ` WHERE email = '${usr.values.email}'`
    } else if (usr.values.username && query.length < 27) {
        query += ` WHERE username = '${usr.values.username}'`
    }
    return await executeQuery(query, 'void')
}

export default {
    createUserQuery,
    selectUserQuery,
    updateUserQuery
}