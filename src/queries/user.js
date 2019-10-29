// Volkan Gul - feedback: https://repl.it/@birkasecorba/UpdateUserQuery?language=nodejs

export const updateUserQueryOld = async (usr) => {
    let query = `UPDATE koffee_user SET`
    for (let value of Object.entries(usr)) {
        if ((value[0] !== 'key') && value[0] !== 'keyfield') {
            query = query + ` ${value[0]}='${value[1]}' `
        }
    }
    query = query + `WHERE ${usr.keyfield}='${usr.key}'`
    const results = await executeQuery(query, pool)
    return results
}

// ------------------------------

const mapFieldKeys = (fields) => Object.entries(fields)
    .map(([key, value]) => `${key}=${value}`)
    .join(' ');

export const updateQuery =
    (tableName) =>
        ({
            updateFields,
            whereFields
        }) => {
            let query = `UPDATE ${tableName} `;

            if (!updateFields.length) {
                throw new Error('Not updating any fields');
            }

            query += `SET ${mapFieldKeys(updateFields)} `

            if (whereFields.length) {
                query += `WHERE ${mapFieldKeys(whereFields)} `;
            }

            return executeQuery(query.trim(), pool)
        }


const updateUserQuery = updateQuery('koffee_user');
await updateUserQuery({
    updateFields: {},
    whereFields: {},
})