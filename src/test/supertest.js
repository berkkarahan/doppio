/* eslint-disable prettier/prettier */
const request = require('supertest')
const app = require('../../dist/app')

request(app)
    .post('/user')
    .send({
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
    })
    .expect(201)
    .then(res => { console.log(res) })
