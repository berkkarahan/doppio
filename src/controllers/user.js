// npm packages
import bcrypt from 'bcrypt'

// custom imports
import { config } from '../config'
import User from '../serializers/user';
import { createUserQuery } from '../queries/user'
import { createVerificationToken } from './verification'
import { sendVerificationMail } from '../utils/mail'


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

    // has user pwd
    let hashedPassword = await bcrypt.hash(user.values.password, parseInt(config.PASSWORD_HASH_SALTINGROUNDS))
    user.values.password = hashedPassword

    // init finalResponse to be filled
    let finalResponse = {
        status: null,
        data: null
    }

    // save user to db
    let queryResult = await createUserQuery(user)

    // check if any errors in query, in case of any error; break request cycle send response.
    if (queryResult.status !== true) {
        finalResponse.status = 'failure-query execution failure.'
        finalResponse.data = user
        res.status(400).json(finalResponse)
    } else {
        finalResponse.status = 'success'
        finalResponse.data = user
    }

    // create verification token to be sent via email
    let verificationTokenResult = await createVerificationToken(req)
    if (verificationTokenResult.status === 'success') {
        let baseUrl = req.protocol + '://' + req.get('host')
        let verifUrl = baseUrl + `/verify/validate?username=${vrfResult.verification.username}&token=${vrfResult.verification.token}`
        finalResponse.verificationurl = verifUrl

        // send the verification mail
        await sendVerificationMail(verifUrl)

        // return final response
        res.status(201).json(finalResponse)

    } else {
        finalResponse.status = verificationTokenResult.status
        res.status(400).json(finalResponse)
    }
}