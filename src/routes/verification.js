import { Router } from 'express'
import { urlencoded, json } from 'body-parser'

import { createVerificationToken } from '../controllers/verification'

import { validateToken } from '../middlewares/token'
import { authorizeRoute } from '../utils/authorization'

const verificationRouter = Router()

verificationRouter.use(urlencoded({ extended: true }))
verificationRouter.use(json())

verificationRouter.post('/verify/create', async (req, res, next) => {
    res.send('NYI')
})

verificationRouter.get('/verify/validate', async (req, res, next) => {
    res.json(req.query)
})