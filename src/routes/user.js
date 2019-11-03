import { Router } from 'express'
import { urlencoded, json } from 'body-parser'

import { createUser, selectUser } from '../controllers/user'
import login, { loginController } from '../controllers/login';

const UserRouter = Router()

UserRouter.use(urlencoded({ extended: true }))
UserRouter.use(json())

// Login route here
UserRouter.post('/login', async (req, res, next) => {
    loginController(req, res, next)
})

UserRouter.post('/user', async (req, res, next) => {
    createUser(req, res, next)
})

UserRouter.get('/user', async (req, res, next) => {
    selectUser(req, res, next)
})

export default UserRouter