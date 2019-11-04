/* eslint-disable prettier/prettier */
import request from 'supertest'


import User from '../serializers/user'
import { executeQuery } from '../db'
import app from '../app'

const testUser = {
    username: 'testcalibur',
    email: 'testmail@gmail.com',
    password: 'testpwd123123',
    firstname: 'John',
    lastname: 'Doe',
    phone: '+905329999999',
    address: 'johndoeville / turkey',
    gender: 'other',
    birthday: '99.99.9999',
    role: 'user'
}

request(app)
    .post('/user')
    .send(testUser)
    .expect(201)
    .then(res => {
        console.log(res.body)
    })
    .then(() => {
        request(app)
            .post('/user/login')
            .send(testUser)
            .expect(200)
            .then(res => {
                console.log(res.body.cookies)
            })
    })

// request(app)
//     .post('/user/login')
//     .send(testUser)
//     .expect(200)
//     .then(res => {
//         console.log(res.body.cookies)
//     })

// finally cleanup
const cleanup = function () {
    const query = "DELETE FROM users WHERE email='testmail@gmail.com'"
    executeQuery(query, 'void').then(res => {
        console.log(res.status)
    })
}
cleanup()