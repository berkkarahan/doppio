import { Router } from 'express'
import { urlencoded, json } from 'body-parser'

import { createUser, selectUser, updateUser } from '../controllers/user'
import { loginController } from '../controllers/login';

import { validateToken } from '../middlewares/token'

const UserRouter = Router()

UserRouter.use(urlencoded({ extended: true }))
UserRouter.use(json())

// Login route here
UserRouter.post('/login', async (req, res, next) => {
    loginController(req, res, next)
})

// create user
UserRouter.post('/user', async (req, res, next) => {
    createUser(req, res, next)
})

// get user
UserRouter.get('/user', validateToken, async (req, res, next) => {
    if (req.decodedPayload.role === 'admin' || ((req.decodedPayload.username === req.body.username) || (req.decodedPayload.email === req.body.email))) {
        selectUser(req, res, next)
    } else {
        res.status(401).json({
            status: 'failure-user not authorized for this call',
            data: {

            }
        })
    }
})

// update user
UserRouter.patch('/user', validateToken, async (req, res, next) => {
    if (req.decodedPayload.role === 'admin' || ((req.decodedPayload.username === req.body.username) || (req.decodedPayload.email === req.body.email))) {
        updateUser(req, res, next)
    } else {
        res.status(401).json({
            status: 'failure-user not authorized for this call',
            data: {

            }
        })
    }
})

export default UserRouter