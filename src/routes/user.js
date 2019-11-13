import { Router } from 'express'
import { urlencoded, json } from 'body-parser'

import { createUser } from '../controllers/user'

const userRouter = Router()

userRouter.use(urlencoded({ extended: true }))
userRouter.use(json())

userRouter.post('/user', async (req, res, next) => {
    createUser(req, res, next)
})

export default { userRouter }