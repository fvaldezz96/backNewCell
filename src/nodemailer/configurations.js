const { createTransport } = require('nodemailer')
const { NODEMAILER_USER, NODEMAILER_PASS } = process.env;
const transportator = {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: NODEMAILER_USER || "buddy73@ethereal.email",
        pass: NODEMAILER_PASS || "YpBTf6xwDyPEYjg1Cg"
    },
    tls: {
        rejectUnauthorized: false
    }
}
module.exports = createTransport(transportator)
