import bcrypt from 'bcrypt';
import moment from 'moment';

import { config } from '../config';
import User from '../serializers/user';
import { createUserQuery } from '../queries/user';
import { createVerificationToken } from './verification';
import { sendVerificationMail } from '../utils/mail';

export const createUser = async (req, res, next) => {
  // Creates a serialised User object for the controller, deleting restricted fields for user creation.
  const user = new User(req.body).create();

  // Set register date as timestamp -> 'YYYY-MM-DD hh:mm:ss' mysql datetime
  user.values.ts_register = moment().format('YYYY-MM-DD hh:mm:ss');

  // Set register IP from middleware
  user.values.register_ip = req.IPAdress;

  // Once user is created, it is active yet still should be verified
  user.values.is_active = 1;
  user.values.is_verified = 0;

  // Hash user password
  const hashedPassword = await bcrypt.hash(
    user.values.password,
    parseInt(config.PASSWORD_HASH_SALTINGROUNDS)
  );
  user.values.password = hashedPassword;

  // Execute the create query.
  const queryResult = await createUserQuery(user);

  // In case of any error; break request cycle & send response.
  if (!queryResult.status) {
    res.status(400).json({
      status: 'failure-query execution failure.',
      data: user
    });
  }

  // create verification token to be sent via email
  // let verificationTokenResult = await createVerificationToken(req)
  const { status, data } = await createVerificationToken(req);
  if (status === 'success') {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const verifUrl = `${baseUrl}/verify/validate?username=${data.username}&token=${data.token}`;

    // Send the verification mail
    await sendVerificationMail(verifUrl);

    const userValues = user.parseValues();

    res.status(201).json({
      status: 'success',
      verificationurl: verifUrl,
      data: {
        userValues
      }
    });
  } else {
    const userValues = user.parseValues();

    res.status(400).json({
      status: verificationTokenResult.status,
      data: {
        userValues
      }
    });
  }
};
