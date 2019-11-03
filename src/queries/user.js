import { Pool, executeQuery } from '../db'
import User from '../serializers/user'

const createUserQuery = async (usr) => {
    let keys = Object.keys(usr)
        .join(", ")
    let values = Object.values(usr)
        .map((val) => {
            return "'" + val + "'"
        })
        .join(", ")

    let query = `INSERT INTO users ( ${keys} ) VALUES ( ${values} )`
    let result = await executeQuery(query, Pool, 'void')
    return result
}

const selectUserQuery = async (usr) => {
    let query = `SELECT * from users WHERE `
    // select query prioritizes email over username if both exists in User serializer
    if (usr.email) {
        query = query + `email = '${usr.email}'`
    } else if (usr.username && query.length < 27) {
        query = query + `username = '${usr.username}'`
    }
    console.log(query)
    let result = await executeQuery(query, Pool, 'select')
    return result
}

export default {
    createUserQuery,
    selectUserQuery
}