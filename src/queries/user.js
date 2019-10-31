import { Pool, executeQuery } from '../db'

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

export default {
    createUserQuery
}