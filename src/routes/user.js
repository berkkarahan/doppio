import { Router } from 'express'
import { urlencoded, json } from 'body-parser'

import { createUser, selectUser, updateUser, activateUser, deactivateUser } from '../controllers/user'
import { loginController } from '../controllers/login';

import { validateToken } from '../middlewares/token'
import { authorizeRoute } from '../utils/authorization'

const userRouter = Router()

userRouter.use(urlencoded({ extended: true }))
userRouter.use(json())

// routes only for debugging
userRouter.get('/d/user', async (req, res, next) => {
    selectUser(req, res, next)
})


// Actual routes start;
// Login route here
userRouter.post('/user/login', async (req, res, next) => {
    loginController(req, res, next)
})

// create user
userRouter.post('/user', async (req, res, next) => {
    createUser(req, res, next)
})

// get user
userRouter.get('/user', validateToken, async (req, res, next) => {
    if (authorizeRoute(req)) {
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
userRouter.patch('/user', validateToken, async (req, res, next) => {
    if (authorizeRoute(req)) {
        updateUser(req, res, next)
    } else {
        res.status(401).json({
            status: 'failure-user not authorized for this call',
            data: {

            }
        })
    }
})

// no hard deletes, just update with is_active = 0
userRouter.delete('/user/deactivate', validateToken, async (req, res, next) => {
    if (authorizeRoute(req)) {
        deactivateUser(req, res, next)
    } else {
        res.status(401).json({
            status: 'failure-user not authorized for this call',
            data: {

            }
        })
    }
})

// how to activate user once he has deactivated ??
userRouter.patch('/user/activate', validateToken, async (req, res, next) => {
    if (authorizeRoute(req)) {
        deactivateUser(req, res, next)
    } else {
        res.status(401).json({
            status: 'failure-user not authorized for this call',
            data: {

            }
        })
    }
})

export default userRouter