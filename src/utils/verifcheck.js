import { selectUserQuery } from '../queries/user'
import User from '../serializers/user'

export const verificationCheck = async (req) => {
    let user = new User(req.body)
    let selectResult = await selectUserQuery(user)
    if (selectResult.status) {
        console.log(selectResult)
        let selectedUser = new User(selectResult.rows)
        if (selectedUser.values.is_verified === 1) {
            return true
        } else {
            return false
        }
    }
}