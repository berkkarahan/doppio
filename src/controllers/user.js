import User from '../serializers/user'
import { createUserQuery } from '../queries/user'
import bcrypt from 'bcrypt'
import { PASSWORD_HASH_SALTINGROUNDS } from "@env"

export const createUser = async (req, res, next) => {
    let user = new User(req.body)

    // set register date as timestamp -> 'YYYY-MM-DD hh:mm:ss' mysql datetime
    user.ts_register = new Date().toISOString().slice(0, 19).replace('T', ' ')

    // set register IP from middleware
    user.register_ip = req.IPAdress

    // set is_active & is_verified
    // user is active once created and should be verified
    user.is_active = 1
    user.is_verified = 0

    await bcrypt.hash(user.password, parseInt(PASSWORD_HASH_SALTINGROUNDS))
        .then(hashedPassword => {
            user.password = hashedPassword
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