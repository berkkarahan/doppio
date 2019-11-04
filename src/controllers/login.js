import User from '../serializers/user'
import { selectUserQuery, updateUserQuery } from '../queries/user'
import bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

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
        user = queryResult.data.values
        await bcrypt.compare(password, user.values.password)
            .then(isMatch => {
                if (isMatch) {
                    let payload = {
                        username: user.values.username,
                        email: user.values.email,
                        role: user.values.role
                    }
                    let options = {
                        expiresIn: process.env.JWT_EXPIRESIN,
                        issuer: process.env.JWT_ISSUER
                    }
                    let secret = process.env.JWT_SECRET
                    let token = jwt.sign(
                        payload,
                        secret,
                        options
                    )
                    // last login ip & timestamp update
                    let user_ = new User()

                    // set key for updatequery
                    user_.values.email = email

                    // set register date as timestamp -> 'YYYY-MM-DD hh:mm:ss' mysql datetime
                    user_.values.ts_login = new Date().toISOString().slice(0, 19).replace('T', ' ')

                    // set register IP from middleware
                    user_.values.last_login_ip = req.IPAdress

                    // call update for login & timestamp
                    let updateResult = updateUserQuery(user_)
                    if (updateResult !== true) {
                        res.status(401).json({
                            status: 'failure-timestamd and ip update for login failed',
                            data: {

                            }
                        })
                    }


                    response.data = token
                    response.status = 'success'
                } else {
                    response.status = 'failure-couldnt match provided passwords'
                }
                return response
            })
            .then(responseJson => {
                if (responseJson.status === 'success') {

                    res.cookie('doppiojwt', response.token, { maxAge: 1800000 }) // 1800000 = 30min

                    // writing token as cookie, no need to seng again in response
                    delete responseJson.data

                    res.status(200).json(responseJson)
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