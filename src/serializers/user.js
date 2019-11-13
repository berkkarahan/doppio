import validator from 'validator'

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
        role: ['user', 'owner'], // admin role should be created directly using 3rd party database administration
        register_ip: null,
        last_login_ip: null,
        ts_login: null,
        ts_register: null,
        is_active: [0, 1],
        is_verified: [0, 1],
        verificationtoken: null
    }
    fieldValidators = {
        email: validator.isEmail,
        phone: validator.isMobilePhone
    }
    restrictedFields = {
        create: [
            'id',
            'ts_login',
            'last_login_ip'
        ]
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
                        // validators for fields
                        if (this.fieldValidators[key]) {
                            let validatorFunc = this.fieldValidators[key]
                            if (validatorFunc(value)) {
                                this.values[key] = value
                            } else {
                                throw new Error("Validator for: " + key + " is not satisfied for value: " + value)
                            }
                        } else {
                            this.values[key] = value
                        }
                    } else {
                        if (this.tableFields[key].indexOf(value) > -1) {
                            // validators for fields
                            if (this.fieldValidators[key]) {
                                let validatorFunc = this.fieldValidators[key]
                                if (validatorFunc(value)) {
                                    this.values[key] = value
                                } else {
                                    throw new Error("Validator for: " + key + " is not satisfied for value: " + value)
                                }
                            } else {
                                this.values[key] = value
                            }
                        } else { // hotpatch role for admin so that no error is thrown
                            if (key === 'role' && value === 'admin') {
                                this.values[key] = value
                            } else {
                                throw new Error("Value for key: " + key + " is not in default values.")
                            }
                        }
                    }
                } else {
                    // We should not throw an error here, since we are simply not adding any keys not in our default field list.
                    console.log("Key: " + key + " is not in users table.")
                }
            })
    }
    parseValues() {
        return this.values
    }
    create() {
        this.restrictedFields.create.forEach((k) => {
            delete this.values[k]
        })
        return this
    }
}

export default User
