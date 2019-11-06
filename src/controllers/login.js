import User from '../serializers/user'
import { selectUserQuery, updateUserQuery } from '../queries/user'
import bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { config } from '../config'

const loginController = async (req, res, next) => {
    // who is trying to log in
    let user = new User(req.body)
    // explicitly store username / password / email / role
    let { username, password, email, role } = user.values
    // declare response here and fill out rest wrt events
    let response = {
        status: 'NA',
        data: {

        }
    }
    let queryResult = await selectUserQuery(user)
    if (queryResult.status === true) {
        // initialize mutable token variable
        var token = 0
        user = new User(queryResult.rows[0])
        await bcrypt.compare(password, user.values.password)
            .then(isMatch => {
                if (isMatch) {
                    console.log("Ismatch: " + isMatch)
                    let payload = {
                        username: user.values.username,
                        email: user.values.email,
                        role: user.values.role
                    }
                    let options = {
                        expiresIn: config.JWT_EXPIRESIN,
                        issuer: config.JWT_ISSUER
                    }
                    let secret = config.JWT_SECRET
                    // assign jwt to token variable defined at top scope
                    token = jwt.sign(
                        payload,
                        secret,
                        options
                    )
                    // last login ip & timestamp update
                    let user_ = new User({})

                    //set key for updatequery
                    user_.values.email = email

                    // set register date as timestamp -> 'YYYY-MM-DD hh:mm:ss' mysql datetime
                    user_.values.ts_login = new Date().toISOString().slice(0, 19).replace('T', ' ')

                    // set register IP from middleware
                    user_.values.last_login_ip = req.IPAdress

                    // call update for login & timestamp
                    updateUserQuery(user_)
                        .then(updateResult => {
                            if (updateResult.status !== true) {
                                res.status(401).json({
                                    status: 'failure-timestamp and ip update for login failed',
                                    data: {

                                    }
                                })
                            }
                        })

                    response.status = 'success'
                } else {
                    response.status = 'failure-couldnt match provided passwords'
                }
                return response
            })
            .then(responseJson => {
                if (responseJson.status === 'success') {

                    let options = {
                        maxAge: 1000 * 60 * 30, // would expire after 30 minutes
                        httpOnly: true, // The cookie only accessible by the web server
                        signed: true // Indicates if the cookie should be signed
                    }

                    res.status(200).cookie('doppiojwt', token, options).json(responseJson)

                } else {
                    res.status(401).json(responseJson)
                }
            })
    } else {
        response.status = 'failure-user is not found'
        res.status(404).json(response)
    }
}

export default {
    loginController
}