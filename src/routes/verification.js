import { Router } from 'express';
import { urlencoded, json } from 'body-parser';

import {
  createVerificationToken,
  validateVerificationToken
} from '../controllers/verification';
import { verificationCheck } from '../utils/verifcheck';

const verificationRouter = Router();

verificationRouter.use(urlencoded({ extended: true }));
verificationRouter.use(json());

verificationRouter.post('/verify', async (req, res, next) => {
  const response = await createVerificationToken(req);
  if (response.status === 'success') {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const verifUrl = `${baseUrl}/verify/validate?username=${vrfResult.verification.username}&token=${vrfResult.verification.token}`;
    response.verificationurl = verifUrl;

    await sendVerificationMail(verifUrl);

    res.status(200).json(response);
  } else {
    res.status(400).json(response);
  }
});

verificationRouter.get('/verify/validate', async (req, res, next) => {
  req.body.token = req.query.token;
  req.body.username = req.query.username;
  const checkResult = await verificationCheck(req);

  if (!checkResult) {
    const response = await validateVerificationToken(req);
    res.json(response);
  } else {
    res.status(400).json({
      status: 'failure-user is already verified for this username',
      username: req.body.username,
      token: req.body.token
    });
  }
});

export default { verificationRouter };
