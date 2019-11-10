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
        let baseUrl = req.protocol + '://' + req.get('host')
        let verifUrl = baseUrl + `/verify/validate?username=${vrfResult.verification.username}&token=${vrfResult.verification.token}`
        response.verificationurl = verifUrl

        // send the verification mail
        await sendVerificationMail(verifUrl)

        res.status(200).json(response)

    } else {
        res.status(400).json(response)
    }
})

verificationRouter.get('/verify/validate', async (req, res, next) => {
    let response = await validateVerificationToken(req)
    res.json(response)
})

export default { verificationRouter }