import nodemailer from 'nodemailer';

import config from '../config';

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
});

const sendVerificationMail = async verifUrl => {
  const mailInfo = {
    from: config.EMAIL,
    to: config.EMAIL,
    cc: 'berkkarahan00@gmail.com', // CC my email for now...
    subject: 'user verification testmail',
    text: verifUrl
  };

  // send the mail
  await mailTransport.sendMail(mailInfo);
};

const mail = {
  verification: sendVerificationMail
};

export default mail;
