import * as jwt from 'jsonwebtoken'
import crypto from 'crypto'

import User from '../serializers/user'
import { selectUserQuery, updateUserQuery } from '../queries/user'
import { executeQuery } from '../db'
import { config } from '../config'


// verification controllers(special case; these controllers do not break request-response cycle when called)
export const validateVerificationToken = async (req) => {

    let queryToken = req.query.token
    let queryUserName = req.query.username

    let user = new User({ username: queryUserName })

    let selectResult = await selectUserQuery(user)
    if (!selectResult.status) {
        return {
            status: 'failure-this user does not exist',
            data: {

            }
        }
    }

    let options = {
        expiresIn: config.JWT_EXPIRESIN,
        issuer: config.JWT_ISSUER
    }


    if (selectResult.status) {
        if (selectResult.rows.verificationtoken) {
            let vToken = selectResult.rows.verificationtoken
            try {
                let decoded = jwt.verify(vToken, config.JWT_SECRET, options)
                if (decoded.token === queryToken && decoded.username === queryUserName) {
                    let userUpdate = new User({
                        username: decoded.username,
                        email: decoded.email,
                        is_verified: 1
                    })
                    let updateResult = await updateUserQuery(userUpdate)
                    if (updateResult.status) {
                        return {
                            status: 'success',
                            data: {

                            }
                        }
                    } else {
                        return {
                            status: 'failure-error updating is_verified field',
                            data: {

                            }
                        }
                    }
                } else {
                    // throw new Error("Token in the query is different from token in database for user: " + decoded.username)
                    return {
                        status: 'failure-token in the query is different from token in database',
                        data: {

                        }
                    }
                }
            } catch (err) {

                let response = {
                    status: 'failure-jwt token verification error',
                    data: {

                    }
                }
                // in case of verification error delete current token in DB
                let removeQuery = `
                UPDATE users set verificationtoken = NULL where username = '${decoded.username}'
                `
                let removeResult = await executeQuery(removeQuery, 'void')
                if (removeResult.status !== true) {
                    response.status = response.status + '-token removal failed'
                }
                return response
            }
        } else {
            return {
                status: 'failure-user has no verification token',
                query: selectResult,
                data: {

                }
            }
        }
    }

}

export const createVerificationToken = async (req) => {
    // this route is responsible for creating the verification token and saving to respective user's column
    // hence it should be called after user creation
    let user = new User(req.body)
    let selectResult = await selectUserQuery(user)

    if (selectResult.status === true) {
        // user exists, create the token and send it
        let token = crypto.randomBytes(16).toString('hex')
        let payload = {
            token: token,
            username: user.values.username,
            email: user.values.email
        }
        let options = {
            expiresIn: config.VERIFICATION_JWT_EXPIRESIN,
            issuer: config.JWT_ISSUER
        }
        let secret = config.JWT_SECRET

        let vToken = jwt.sign(
            payload,
            secret,
            options
        )

        let userUpdate = new User({
            username: user.values.username,
            email: user.values.email,
            verificationtoken: vToken
        })

        let updateResult = await updateUserQuery(userUpdate)

        if (updateResult.status === true) {
            return {
                status: 'success',
                data: {
                    token: token,
                    username: user.values.username
                }
            }
        } else {
            return {
                status: 'failure-token update for user failed',
                data: {

                }
            }
        }

    } else {
        return {
            status: 'failure-verification token cant be created for non existing user',
            data: {

            }
        }
    }
}