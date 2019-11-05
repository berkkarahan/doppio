import User from '../serializers/user'
import { createUserQuery, selectUserQuery, updateUserQuery } from '../queries/user'
import { createVerificationToken } from './verification'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()

export const activateUser = async (req, res, next) => {
    // we are not actually deleting user here, instead setting is_active to 1(true).
    // since this will be a protected call, it is safe to user decodedPayload resulting from jwt token validation.
    let user = new User(req.decodedPayload)
    user.is_active = 1

    await updateUserQuery(user)
        .then(queryResult => {
            let user = new User(queryResult.rows[0])
            let values = user.parseValues()
            if (queryResult.status === true) {
                return {
                    status: 'success',
                    data: {
                        values
                    }
                }
            } else {
                return {
                    status: 'failure-query execution failure.',
                    data: {
                        values
                    }
                }
            }
        })
        .then(responseJson => {
            if (responseJson.status === 'success') {
                res.status(201).json(responseJson)
            } else {
                res.status(400).json(responseJson)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({
                status: 'failure',
                data: {
                    error: err
                }
            })
        })
}

export const deactivateUser = async (req, res, next) => {
    // we are not actually deleting user here, instead setting is_active to 0(false).
    // since this will be a protected call, it is safe to user decodedPayload resulting from jwt token validation.
    let user = new User(req.decodedPayload)
    user.is_active = 0

    await updateUserQuery(user)
        .then(queryResult => {
            let user = new User(queryResult.rows[0])
            let values = user.parseValues()
            if (queryResult.status === true) {
                return {
                    status: 'success',
                    data: {
                        values
                    }
                }
            } else {
                return {
                    status: 'failure-query execution failure.',
                    data: {
                        values
                    }
                }
            }
        })
        .then(responseJson => {
            if (responseJson.status === 'success') {
                res.status(201).json(responseJson)
            } else {
                res.status(400).json(responseJson)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({
                status: 'failure',
                data: {
                    error: err
                }
            })
        })
}

export const updateUser = async (req, res, next) => {
    let user = new User(req.body)

    // remove fields that should not be directly updated
    delete user.values.ts_login
    delete user.values.last_login_ip
    delete user.values.ts_register
    delete user.values.register_ip
    delete user.values.is_active
    delete user.values.is_verified
    delete user.values.id

    await updateUserQuery(user)
        .then(queryResult => {
            let user = new User(queryResult.rows[0])
            let values = user.parseValues()
            if (queryResult.status === true) {
                return {
                    status: 'success',
                    data: {
                        values
                    }
                }
            } else {
                return {
                    status: 'failure-query execution failure.',
                    data: {
                        values
                    }
                }
            }
        })
        .then(responseJson => {
            if (responseJson.status === 'success') {
                res.status(201).json(responseJson)
            } else {
                res.status(400).json(responseJson)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({
                status: 'failure',
                data: {
                    error: err
                }
            })
        })
}

export const createUser = async (req, res, next) => {
    let user = new User(req.body)

    // set register date as timestamp -> 'YYYY-MM-DD hh:mm:ss' mysql datetime
    user.values.ts_register = new Date().toISOString().slice(0, 19).replace('T', ' ')

    // set register IP from middleware
    user.values.register_ip = req.IPAdress

    // set is_active & is_verified
    // user is active once created and should be verified
    user.values.is_active = 1
    user.values.is_verified = 0

    // finally remove any fields that should not be created with a createUser request: ts_login, last_login_ip
    delete user.values.id
    delete user.values.ts_login
    delete user.values.last_login_ip

    await bcrypt.hash(user.values.password, parseInt(process.env.PASSWORD_HASH_SALTINGROUNDS))
        .then(hashedPassword => {
            user.values.password = hashedPassword
            return user
        })
        .then(newUser => {
            return createUserQuery(newUser)
        })
        .then(queryResult => {
            if (queryResult.status === true) {
                return {
                    status: 'success',
                    data: {
                        user
                    }
                }
            } else {
                return {
                    status: 'failure-query execution failure.',
                    data: {
                        user
                    }
                }
            }
        })
        .then(responseJson => {
            // in case of any errors in the create route, fix here.
            if (responseJson.status === 'success') {
                createVerificationToken(req).then(vrfResult => {
                    if (vrfResult.status === 'success') {
                        responseJson.vToken = response.verification
                        res.status(201).json(responseJson)
                    } else {
                        responseJson.status = vrfResult.status
                        res.status(400).json(responseJson)
                    }
                })
            } else {
                res.status(400).json(responseJson)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({
                status: 'failure',
                data: {
                    error: err
                }
            })
        })
}

export const selectUser = async (req, res, next) => {
    let user = new User(req.body)
    await selectUserQuery(user)
        .then(queryResult => {
            let user = new User(queryResult.rows[0])
            let values = user.parseValues()
            if (queryResult.status === true) {
                return {
                    status: 'success',
                    data: {
                        values
                    }
                }
            } else {
                return {
                    status: 'failure-query execution failure.',
                    data: {
                        values
                    }
                }
            }
        })
        .then(responseJson => {
            if (responseJson.status === 'success') {
                res.status(201).json(responseJson)
            } else {
                res.status(400).json(responseJson)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({
                status: 'failure',
                data: {
                    error: err
                }
            })
        })
}