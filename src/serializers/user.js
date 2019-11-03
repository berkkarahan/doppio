class User {
    tableFields = {
        id: null,
        username: null,
        email: null,
        password: null,
        firstname: null,
        lastname: null,
        phone: null,
        address: null,
        gender: ['male', 'female', 'other'],
        birthday: null,
        role: ['user', 'owner', 'admin'],
        register_ip: null,
        last_login_ip: null,
        ts_login: null,
        ts_register: null,
        is_active: [0, 1],
        is_verified: [0, 1]
    }
    values = {
    }
    constructor(row) {
        Object.entries(row)
            .forEach((keyValueTuple) => {
                const key = keyValueTuple[0]
                const value = keyValueTuple[1]
                if (key in this.tableFields) {
                    if (this.tableFields[key] === null) {
                        this.values[key] = value
                    } else {
                        if (this.tableFields[key].indexOf(value) > -1) {
                            this.values[key] = value
                        } else {
                            throw new Error("Value for key: " + key + " is not in default values.")
                        }
                    }
                } else {
                    throw new Error("Key: " + key + " is not in users table.")
                }
            })
    }
    parseValues() {
        return this.values
    }
}

export default User
