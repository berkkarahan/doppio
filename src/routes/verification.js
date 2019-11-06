import { Router } from 'express'
import { urlencoded, json } from 'body-parser'

import {
    createVerificationToken,
    validateVerificationToken
} from '../controllers/verification'

const verificationRouter = Router()

verificationRouter.use(urlencoded({ extended: true }))
verificationRouter.use(json())

verificationRouter.post('/verify', async (req, res, next) => {
    let response = await createVerificationToken(req)
    if (response.status === 'success') {
        // implement email sending logic here
        // placeholder
        // placeholder
        // placeholder
    } else {
        res.status(400).json(response)
    }
})

verificationRouter.get('/verify/validate', async (req, res, next) => {
    let response = await validateVerificationToken(req)
})

export default { verificationRouter }