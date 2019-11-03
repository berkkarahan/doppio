import * as jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const validateToken = async (req, res, next) => {

    let result
    if (req.cookiesObject.doppiojwt) {
        try {
            let token = req.cookiesObject.doppiojwt
            let options = {
                expiresIn: process.env.JWT_EXPIRESIN,
                issuer: process.env.JWT_ISSUER
            }
            // decode token as {user:username, role:userrole}
            result = jwt.verify(token, process.env.JWT_SECRET, options)
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