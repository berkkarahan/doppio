import { pool, executeQuery } from './db'
//Create prod/test database
const createProdDB = `
CREATE DATABASE IF NOT EXISTS hermes
`


const createUserTable = ``

// very basic arguement parsing
const runtype = process.argv.slice(2)[0];
console.log(runtype);

(async () => {
    switch (runtype) {
        case 'createuser':
            await PostgresUser()
            break
        case 'deleteuser':
            await DeletePostgresUser()
            break
    }
})()
