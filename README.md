# doppio

Account microservice

![Logo](https://images.squarespace-cdn.com/content/v1/53a23e7de4b0992c68a63839/1420498109105-9Z3R12XOB3XD21BMLICX/ke17ZwdGBToddI8pDm48kMh3mVmBaCAeGwqCLG3iONRZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIarJWwnumkapRz_nmTYj1dpaH2rx--_BA62nv3IYPJxMKMshLAGzx4R3EDFOm1kBS/_MG_1907-Edit_HR.jpg)

## Serializer

### User

User serializer is a utility for creating new User objects either from requests or database calls. Checks for default inputs and validators.

All fields

- id(auto generated)
- username
- email
- password
- firstname
- lastname
- phone
- address
- gender
- birthday
- role
- register_ip
- last_login_ip
- ts_login
- ts_register
- is_active
- is_verified

#### Default input values for fields

| Field       | Value                     |
| ----------- | ------------------------- |
| gender      | 'female', 'male', 'other' |
| role        | 'user', 'owner'           |
| is_active   | 1, 0                      |
| is_verified | 1, 0                      |

## Routes

To be written later
