import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';

import User from '../serializers/user';
import userQueries from '../queries/user';
import executeQuery from '../db';
import config from '../config';

// verification controllers(special case; these controllers do not break request-response cycle when called)
const validateVerificationToken = async req => {
  const queryToken = req.query.token;
  const queryUserName = req.query.username;

  const user = new User({ username: queryUserName });

  const selectResult = await userQueries.select(user);

  if (!selectResult.status) {
    return {
      status: 'failure-this user does not exist',
      data: {}
    };
  }

  if (!selectResult.rows.verificationtoken) {
    return {
      status: 'failure-user has no verification token',
      query: selectResult,
      data: {}
    };
  }

  const options = {
    expiresIn: config.JWT_EXPIRESIN,
    issuer: config.JWT_ISSUER
  };

  const vToken = selectResult.rows.verificationtoken;

  try {
    const { token, username, email } = jwt.verify(
      vToken,
      config.JWT_SECRET,
      options
    );
    if (token !== queryToken || username !== queryUserName) {
      return {
        status:
          'failure-token in the query is different from token in database',
        data: {}
      };
    }

    const userUpdate = new User({ username, email, is_verified: 1 });
    const { status } = await userQueries.update(userUpdate);

    return {
      status: status ? 'success' : 'failure-error updating is_verified field',
      data: {}
    };
  } catch (err) {
    const removeQuery = `UPDATE users set verificationtoken = NULL where username = '${user.username}'`;
    const { status: removeQueryStatus } = await executeQuery(
      removeQuery,
      'void'
    );

    return {
      status: removeQueryStatus
        ? 'failure-jwt token verification error'
        : `${removeQueryStatus}-token removal failed`,
      data: {}
    };
  }
};

const createVerificationToken = async req => {
  // this route is responsible for creating the verification token and saving to respective user's column
  // hence it should be called after user creation
  const user = new User(req.body);
  const selectResult = await userQueries.select(user);

  if (!selectResult.status) {
    return {
      status:
        'failure-verification token cant be created for non existing user',
      data: {}
    };
  }

  const token = crypto.randomBytes(16).toString('hex');
  const payload = {
    token: token,
    username: user.values.username,
    email: user.values.email
  };
  const options = {
    expiresIn: config.VERIFICATION_JWT_EXPIRESIN,
    issuer: config.JWT_ISSUER
  };
  const secret = config.JWT_SECRET;

  const vToken = jwt.sign(payload, secret, options);

  const userUpdate = new User({
    username: user.values.username,
    email: user.values.email,
    verificationtoken: vToken
  });

  const { status } = await userQueries.update(userUpdate);

  return {
    status: status ? 'success' : 'failure-token update for user failed',
    data: status ? { username: user.values.username, token: token } : {}
  };
};

const verification = {
  create: createVerificationToken,
  validate: validateVerificationToken
};

export default verification;
