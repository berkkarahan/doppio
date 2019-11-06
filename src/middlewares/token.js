import * as jwt from 'jsonwebtoken'
import { config } from '../config'

const validateToken = async (req, res, next) => {

    let result
    if (req.cookies.doppiojwt) {
        try {
            let token = req.cookies.doppiojwt
            let options = {
                expiresIn: config.JWT_EXPIRESIN,
                issuer: config.JWT_ISSUER
            }
            // decode token as {username:username, email:email, role:role}
            result = jwt.verify(token, config.JWT_SECRET, options)
            // pass decoded payload back to request
            req.decodedPayload = result
            // call next
            next()
        } catch (err) {
            throw new Error(err)
        }
    } else {
        let errorResponse = {
            status: 'failure-no auth header',
            data: {

            }
        }
        res.status(401).json(errorResponse)
    }
}

export default {
    validateToken
}