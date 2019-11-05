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

const updateUserQuery = async (usr) => {
    let query = `UPDATE users SET `
    // save and remove key fields from usr to not re-set them again.
    let userKeys = {
        email: usr.values.email,
        username: usr.values.username
    }
    delete usr.values.email
    delete usr.values.username

    let r = Object.entries(usr.values)
        .map(([key, value]) => { return `${key}='${value}', ` })
        .forEach((kvPair) => {
            query = query + kvPair
        })

    // chop final comma from string
    query = query.substring(0, query.length - 2)
    // just like select, in update query prioritize email over username if both exists in User serializer
    if (userKeys.email) {
        query = query + ` WHERE email = '${userKeys.email}'`
    } else if (userKeys.username && query.length < 27) {
        query = query + ` WHERE username = '${userKeys.username}'`
    }
    console.log("Update query: " + query)
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
    Object.entries(result.rows[0])
        .forEach(([k, v]) => {
            if (v === null) {
                delete result.rows[0][k]
            }
        })
    return result
}

export default {
    createUserQuery,
    selectUserQuery,
    updateUserQuery
}