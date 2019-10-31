import { Router } from 'express'
import { urlencoded, json } from 'body-parser'

import { createUser } from '../controllers/user'

const UserRouter = Router()

UserRouter.use(urlencoded({ extended: true }))
UserRouter.use(json())

UserRouter.post('/user', async (req, res, next) => {
    createUser(req, res, next)
})

export default UserRouter