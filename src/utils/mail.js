import nodemailer from 'nodemailer'
import { config } from '../config'

const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
        user: config.EMAIL,
        pass: config.EMAIL_PWD
    },
    tls: {
        rejectUnauthorized: false
    }
})

export const sendVerificationMail = async (verifUrl) => {
    let mailInfo = {
        from: config.EMAIL,
        to: config.EMAIL,
        subject: "user verification testmail",
        text: verifUrl
    }

    // send the mail
    await mailTransport.sendMail(mailInfo)
}
