import { selectUserQuery } from '../queries/user';
import User from '../serializers/user';

export const verificationCheck = async req => {
  const user = new User(req.body);
  const selectResult = await selectUserQuery(user);
  if (selectResult.status) {
    console.log(selectResult);
    const selectedUser = new User(selectResult.rows);
    if (selectedUser.values.is_verified === 1) {
      return true;
    }
    return false;
  }
};
