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
    let result = await executeQuery(query, 'void')
    return result
}

const selectUserQuery = async (usr) => {
    let query = `SELECT * from users WHERE `
    // select query prioritizes email over username if both exists in User serializer
    if (usr.values.email) {
        query = query + `email = '${usr.values.email}'`
    } else if (usr.values.username && query.length < 27) {
        query = query + `username = '${usr.values.username}'`
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
    Object.entries(usr.values)
        .map(([key, value]) => { return `${key}='${value}', ` })
        .forEach((kvPair) => {
            query = query + kvPair
        })

    // chop final comma from string
    query = query.substring(0, query.length - 2)
    // just like select, in update query prioritize email over username if both exists in User serializer
    if (usr.values.email) {
        query = query + ` WHERE email = '${usr.values.email}'`
    } else if (usr.values.username && query.length < 27) {
        query = query + ` WHERE username = '${usr.values.username}'`
    }
    console.log("Update query: " + query)
    let result = await executeQuery(query, 'void')
    return result
}

export default {
    createUserQuery,
    selectUserQuery,
    updateUserQuery
}