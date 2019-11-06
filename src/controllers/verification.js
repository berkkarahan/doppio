import User from '../serializers/user'
import { selectUserQuery, updateUserQuery } from '../queries/user'
import { executeQuery } from '../db'
import * as jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { config } from '../config'

// verification controllers(special case; these controllers do not break request-response cycle when called)

export const validateVerificationToken = async (req) => {
    // this route is responsible for verifying the verification jwt token
    // if it is valid, user will be updated as verified. if it is invalid due to expiration the token will be deleted
    // query params will be used for this route, not the body
    // token variable will come from query params

    // declare response here and fill out rest wrt events
    let response = {
        status: 'NA',
        data: {

        }
    }

    let queryToken = req.query.token
    let queryUserName = req.query.username

    let user = new User({ username: queryUserName })

    let selectResult = await selectUserQuery(user)
    if (selectResult.status === false) {
        response.status = 'failure-this user does not exist'
        return response
    }

    let options = {
        expiresIn: config.JWT_EXPIRESIN,
        issuer: config.JWT_ISSUER
    }



    if (selectResult.status === true) {
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
                    if (updateResult.status === true) {
                        response.status = 'success'
                        return response
                    } else {
                        response.status = 'failure-error updating is_verified field'
                        return response
                    }
                } else {
                    // throw new Error("Token in the query is different from token in database for user: " + decoded.username)
                    response.status = 'failure-token in the query is different from token in database'
                    return response
                }
            } catch (err) {
                // throw new Error(err)
                response.status = 'failure-jwt token verification error'
                // in case of verification error delete current token in DB, to be implemented later.
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
            // throw new Error("This user has no verification token.")
            response.status = 'failure-user has no verification token'
            return response
        }
    }

}

export const createVerificationToken = async (req) => {
    // this route is responsible for creating the verification token and saving to respective user's column
    // hence it should be called after user creation
    let user = new User(req.body)
    // var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
    let selectResult = await selectUserQuery(user)

    // declare response here and fill out rest wrt events
    let response = {
        status: 'NA',
        data: {

        }
    }

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
        // assign jwt to token variable defined at top scope
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
            response.status = 'success'

            // we will send the token and username together as an url via an email in the future
            // currently using response for debugging
            response.verification = {
                token: token,
                username: user.values.username
            }

            // res.status(200).json(response)
            return response
        } else {
            // token update for user failed
            response.status = 'failure-token update for user failed.'
            // res.status(401).json(response)
            return response
        }

    } else {
        // user doesn't exist
        response.status = 'failure-verification token cant be created for non existing user.'
        // res.status(401).json(response)
        return response
    }
}