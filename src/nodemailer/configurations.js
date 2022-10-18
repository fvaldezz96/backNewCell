const { createTransport } = require('nodemailer')
const { NODEMAILER_USER, NODEMAILER_PASS } = process.env;
const transportator = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: NODEMAILER_USER,
        pass: NODEMAILER_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
}
module.exports = createTransport(transportator)
