import { Router } from 'express';
import { urlencoded, json } from 'body-parser';

import verification from '../controllers/verification';
import mail from '../utils/mail';
import { verificationCheck } from '../utils/verifcheck';

const verificationRouter = Router();

verificationRouter.use(urlencoded({ extended: true }));
verificationRouter.use(json());

verificationRouter.post('/verify', async (req, res, next) => {
  const { status, data } = await verification.create(req);
  if (status === 'success') {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const verifUrl = `${baseUrl}/verify/validate?username=${data.username}&token=${data.token}`;

    await mail.verification(verifUrl);

    res.status(200).json({ status: 'success', verification: verifUrl });
  } else {
    res.status(400).json({ status: 'failure' });
  }
});

verificationRouter.get('/verify/validate', async (req, res, next) => {
  req.body.token = req.query.token;
  req.body.username = req.query.username;
  const checkResult = await verificationCheck(req);

  if (!checkResult) {
    const response = await verification.validate(req);
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
