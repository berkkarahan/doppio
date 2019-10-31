import { Router } from 'express'
import { urlencoded, json } from 'body-parser'

import { createUser, selectUser } from '../controllers/user'

const UserRouter = Router()

UserRouter.use(urlencoded({ extended: true }))
UserRouter.use(json())

UserRouter.post('/user', async (req, res, next) => {
    createUser(req, res, next)
})

UserRouter.get('/user', async (req, res, next) => {
    selectUser(req, res, next)
})

export default UserRouter