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
    return result
}

export default {
    createUserQuery,
    selectUserQuery
}