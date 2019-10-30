import { Router } from 'express'
import { urlencoded, json } from 'body-parser'

import { createUser } from '../controllers/user'

const UserRouter = Router()

UserRouter.use(urlencoded({ extended: true }))
UserRouter.use(json())

UserRouter.post('/user', async (req, res, next) => {
    console.log('beep-boop')
    createUser(req, res, next)
})

export default UserRouter